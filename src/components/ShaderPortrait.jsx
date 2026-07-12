import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Section accents (matches the ink/flame checkerboard):
 *   ink field   → warm flame ripple  (#ff6a00)
 *   flame field → ink-toned ripple    (#0c0a09)
 */
const ACCENTS = {
  ink: new THREE.Color('#ff6a00'),
  flame: new THREE.Color('#0c0a09'),
}

/**
 * ShaderPortrait — Phase 4 (R3F). A player's photo becomes a texture on a
 * full-frame plane with a hover-driven ripple + chromatic-aberration shader
 * centered on the cursor, tinted toward the section accent.
 *
 * Only ever imported through FeaturedPortrait's React.lazy (so `three` lives
 * in its own chunk and never loads under reduced motion / without WebGL) and
 * mounted only while near the viewport, so at most a couple of canvases exist
 * at once. The cover-fit + per-player focal point (focusX/focusY/zoom) mirror
 * PlaceholderPortrait exactly, so the swap between static and shader is
 * seamless. NOTE the texture is flipY (uv.y=1 = image top), which the vertical
 * cover offset accounts for.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uUvScale;
  uniform vec2 uUvOffset;
  uniform vec2 uFocus;
  uniform float uZoom;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    // zoom in frame space around the focal point, then cover-map to texture
    vec2 zUv = (vUv - uFocus) / uZoom + uFocus;
    vec2 baseUv = zUv * uUvScale + uUvOffset;
    float d = distance(vUv, uMouse);
    float falloff = smoothstep(0.55, 0.0, d);

    // ripple pushing outward from the cursor, only while hovered
    float wave = sin(d * 26.0 - uTime * 3.5);
    float ripple = wave * 0.010 * uHover * falloff;
    vec2 dir = normalize(vUv - uMouse + 1e-5);
    vec2 uv = baseUv + dir * ripple;

    // chromatic aberration grows with hover + proximity
    float ca = (0.0025 + 0.012 * uHover) * falloff;
    float r = texture2D(uTexture, uv + vec2(ca, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(ca, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // tint toward the section accent (themed: flame on ink, ink on flame)
    col = mix(col, uAccent, falloff * uHover * 0.28);
    // theme-agnostic shimmer band riding the ripple crest
    col += vec3(0.06) * uHover * falloff * wave;
    gl_FragColor = vec4(col, 1.0);
  }
`

function CoverPlane({ src, hoverRef, accent, focusX, focusY, zoom }) {
  const mat = useRef()
  const texture = useLoader(THREE.TextureLoader, src)
  const { viewport, invalidate } = useThree()

  // expose invalidate so the figure's pointer handlers can kick a render
  // (frameloop is "demand": idle canvases never touch the GPU)
  useEffect(() => {
    hoverRef.current.invalidate = invalidate
  }, [invalidate, hoverRef])

  // cover-fit UV mapping with a per-player focal point (mirrors the CSS
  // object-position + transform on the static portrait).
  const cover = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    const iw = texture.image.width
    const ih = texture.image.height
    const planeAspect = 4 / 5
    const imgAspect = iw / ih
    const fx = focusX / 100
    const fy = focusY / 100
    let sx = 1, sy = 1, ox = 0, oy = 0
    if (imgAspect > planeAspect) {
      // wider than frame → crop sides; fx picks the horizontal slice
      sx = planeAspect / imgAspect
      ox = (1 - sx) * fx
    } else {
      // taller → crop top/bottom. Texture is flipY (uv.y=1 = image top), so a
      // top-biased focus (small fy) must map to a HIGH offset — hence (1 - fy).
      sy = imgAspect / planeAspect
      oy = (1 - sy) * (1 - fy)
    }
    return {
      scale: new THREE.Vector2(sx, sy),
      offset: new THREE.Vector2(ox, oy),
      focus: new THREE.Vector2(fx, 1 - fy), // focal point in vUv space (y up)
    }
  }, [texture, focusX, focusY])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.55) },
      uUvScale: { value: cover.scale },
      uUvOffset: { value: cover.offset },
      uFocus: { value: cover.focus },
      uZoom: { value: zoom },
      uAccent: { value: (ACCENTS[accent] || ACCENTS.ink).clone() },
    }),
    [texture, cover, accent, zoom]
  )

  useFrame((_, dt) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value += dt
    const target = hoverRef.current.active ? 1 : 0
    u.uHover.value += (target - u.uHover.value) * Math.min(1, dt * 6)
    u.uMouse.value.lerp(hoverRef.current.mouse, Math.min(1, dt * 8))
    // keep rendering while interacting or the hover value is still settling,
    // then let the demand loop go idle
    if (hoverRef.current.active || u.uHover.value > 0.001) invalidate()
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function ShaderPortrait({ player, theme = 'ink', eager = false }) {
  const hoverRef = useRef({
    active: false,
    mouse: new THREE.Vector2(0.5, 0.55),
    invalidate: null,
  })

  // Base <img> beneath the canvas: the real photo shows instantly (from cache,
  // since the static portrait already fetched it) so there's never a blank
  // frame while `three` decodes the texture and paints its first demand frame.
  const focusX = player.portrait?.focusX ?? 50
  const focusY = player.portrait?.focusY ?? 18
  const zoom = player.portrait?.zoom ?? 1
  const objectPosition = `${focusX}% ${focusY}%`

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    hoverRef.current.mouse.set(
      (e.clientX - r.left) / r.width,
      1 - (e.clientY - r.top) / r.height
    )
    hoverRef.current.invalidate?.()
  }
  const onEnter = () => {
    hoverRef.current.active = true
    hoverRef.current.invalidate?.()
  }
  const onLeave = () => {
    hoverRef.current.active = false
    hoverRef.current.invalidate?.()
  }

  return (
    <figure
      className="portrait"
      data-tone={player.portrait?.tone || 'warm'}
      data-photo="true"
      data-shader="true"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerMove={onMove}
    >
      <div className="portrait__frame">
        <img
          className="portrait__photo"
          src={player.portrait.src}
          alt={`${player.fullName} — ${player.team}, ${player.position}`}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : 'auto'}
          decoding="async"
          draggable={false}
          style={{
            objectPosition,
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: objectPosition,
          }}
        />
        <div className="portrait__canvas">
          <Canvas
            frameloop="demand"
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 1], fov: 50 }}
          >
            <Suspense fallback={null}>
              <CoverPlane
                src={player.portrait.src}
                hoverRef={hoverRef}
                accent={theme}
                focusX={player.portrait?.focusX ?? 50}
                focusY={player.portrait?.focusY ?? 18}
                zoom={player.portrait?.zoom ?? 1}
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="portrait__scrim" aria-hidden="true" />
        <div className="portrait__meta">
          <span className="portrait__team">{player.teamAbbr}</span>
          <span className="portrait__pos">{player.position}</span>
        </div>
      </div>
      <span className="portrait__corner portrait__corner--tl" aria-hidden="true" />
      <span className="portrait__corner portrait__corner--br" aria-hidden="true" />
    </figure>
  )
}
