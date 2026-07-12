/**
 * THE W — Player roster (2026 season)
 * ---------------------------------------------------------------------------
 * Single source of truth for all player content. Do NOT scatter copy across
 * components — edit it here.
 *
 * Content rules honored from the brief:
 *  - All stats / achievements are taken verbatim from the source material.
 *    Nothing here is fabricated. Where a player's line is qualitative (e.g.
 *    "rebounding force") no invented numbers are attached.
 *  - `jersey` holds the player's real, publicly documented jersey number and
 *    drives the giant graphic number on each portrait. Olivia Miles' is her
 *    established college number (no WNBA jersey yet) — verify before deploy.
 *  - `portrait.src` is the supplied player photo (owner-provided, July 2026).
 *    When `src` is absent the styled typographic placeholder renders instead
 *    (currently only Angel Reese: /* replace with licensed photo *\/).
 *    Licensing/clearance of supplied photos remains the owner's responsibility.
 *  - `highlights` powers the Phase 3 "Season Highlights" carousel. Every card
 *    restates a fact already in the brief — the only dated game moment is
 *    Cunningham's 24 vs. Toronto Tempo (Jun 16), which the brief supplies.
 *    Card art reuses the player photo where supplied, placeholder otherwise.
 */

// A'ja Wilson (the anchor) is served from /public at a stable URL and preloaded
// in index.html so the first portrait loads immediately on a cold visit — its
// src below must match that preload href exactly. The rest use hashed imports.
const ajaWilsonPhoto = '/players/aja-wilson.jpeg'
import caitlinClarkPhoto from '../assets/players/caitlin-clark.jpeg'
import paigeBueckersPhoto from '../assets/players/paige-bueckers.jpeg'
import breannaStewartPhoto from '../assets/players/breanna-stewart.jpeg'
import napheesaCollierPhoto from '../assets/players/napheesa-collier.jpeg'
import angelReesePhoto from '../assets/players/angel-reese.jpeg'
import oliviaMilesPhoto from '../assets/players/olivia-miles.jpeg'
import sophieCunninghamPhoto from '../assets/players/sophie-cunningham.jpeg'

export const players = [
  {
    id: 'aja-wilson',
    index: 1,
    firstName: 'A’JA',
    lastName: 'WILSON',
    fullName: 'A’ja Wilson',
    team: 'Las Vegas Aces',
    teamAbbr: 'LVA',
    conference: 'Western',
    position: 'Forward / Center',
    jersey: 22,
    accentRole: 'The Anchor',
    stats: [
      { value: '4×', label: 'League MVP' },
      { value: '2025', label: 'Reigning MVP' },
    ],
    note: 'Supermax contract — highest-paid player in the league',
    bio:
      'The most decorated player of her era, Wilson anchors the Las Vegas Aces as a four-time MVP and the reigning 2025 winner. Now on a supermax deal that makes her the highest-paid player in the league, she remains the sport’s defining two-way force.',
    whyMatters:
      'The gravitational center of the modern WNBA — the standard every contender measures itself against.',
    highlights: [
      { tag: 'Honors', stat: '4×', title: 'League MVP', detail: 'The most decorated player of her era.' },
      { tag: 'Season', stat: '2025', title: 'Reigning MVP', detail: 'Enters 2026 holding the league’s top individual honor.' },
      { tag: 'Contract', stat: 'MAX', title: 'Supermax deal', detail: 'The highest-paid player in the league.' },
      { tag: 'Role', stat: 'LVA', title: 'The anchor', detail: 'The sport’s defining two-way force.' },
    ],
    portrait: { tone: 'warm', src: ajaWilsonPhoto, focusX: 55, focusY: 22, zoom: 1.02 },
  },
  {
    id: 'caitlin-clark',
    index: 2,
    firstName: 'CAITLIN',
    lastName: 'CLARK',
    fullName: 'Caitlin Clark',
    team: 'Indiana Fever',
    teamAbbr: 'IND',
    conference: 'Eastern',
    position: 'Guard',
    jersey: 22,
    accentRole: 'The Draw',
    stats: [
      { value: '21.2', label: 'PPG · career high' },
      { value: '8.2', label: 'APG' },
    ],
    note: '3× All-Star starter',
    bio:
      'Clark is posting career highs of 21.2 points and 8.2 assists a game while starting her third straight All-Star Game. Her range and vision have made the Fever appointment viewing and turned her into a cultural flashpoint for the league’s explosive growth.',
    whyMatters:
      'The biggest on-ramp to women’s basketball in a generation — ratings, attendance, and attention follow her.',
    highlights: [
      { tag: 'Scoring', stat: '21.2', title: 'PPG · career high', detail: 'Her best scoring season yet.' },
      { tag: 'Playmaking', stat: '8.2', title: 'Assists per game', detail: 'Vision that makes the Fever appointment viewing.' },
      { tag: 'Honors', stat: '3×', title: 'All-Star starter', detail: 'Starting her third straight All-Star Game.' },
      { tag: 'Impact', stat: 'ERA', title: 'Growth flashpoint', detail: 'Ratings, attendance, and attention follow her.' },
    ],
    portrait: { tone: 'cool', src: caitlinClarkPhoto, focusX: 49, focusY: 10, zoom: 1.5 },
  },
  {
    id: 'paige-bueckers',
    index: 3,
    firstName: 'PAIGE',
    lastName: 'BUECKERS',
    fullName: 'Paige Bueckers',
    team: 'Dallas Wings',
    teamAbbr: 'DAL',
    conference: 'Western',
    position: 'Guard',
    jersey: 5,
    accentRole: 'The Prodigy',
    stats: [
      { value: '2025', label: 'Rookie of the Year' },
      { value: 'No. 1', label: '2026 ASG fan vote' },
    ],
    note: 'Top-10 in points, assists & steals as a rookie',
    bio:
      'The 2025 Rookie of the Year wasted no time becoming a franchise cornerstone in Dallas, finishing top-10 in points, assists, and steals in her debut campaign. She led all players in fan voting for the 2026 All-Star Game — a rookie-to-star leap few make so fast.',
    whyMatters:
      'Proof the league’s young-talent pipeline is deeper than ever — already a franchise face.',
    highlights: [
      { tag: 'Honors', stat: 'ROY', title: '2025 Rookie of the Year', detail: 'A franchise cornerstone from day one in Dallas.' },
      { tag: 'Voting', stat: 'No.1', title: '2026 ASG fan vote', detail: 'Led all players in All-Star fan voting.' },
      { tag: 'Rookie year', stat: 'T-10', title: 'Points · assists · steals', detail: 'Top-10 in all three as a rookie.' },
    ],
    portrait: { tone: 'warm', src: paigeBueckersPhoto, focusX: 44, focusY: 16, zoom: 1.1 },
  },
  {
    id: 'breanna-stewart',
    index: 4,
    firstName: 'BREANNA',
    lastName: 'STEWART',
    fullName: 'Breanna Stewart',
    team: 'New York Liberty',
    teamAbbr: 'NYL',
    conference: 'Eastern',
    position: 'Forward',
    jersey: 30,
    accentRole: 'The Champion',
    stats: [
      { value: '2×', label: 'League MVP' },
      { value: '2×', label: 'Finals MVP' },
    ],
    note: 'Engine of the Liberty championship core',
    bio:
      'A two-time MVP and two-time Finals MVP, Stewart is the engine of the New York Liberty’s championship core. Her positional size and scoring versatility make her one of the most complete forwards the game has produced.',
    whyMatters:
      'The championship pedigree that legitimizes New York as a destination franchise.',
    highlights: [
      { tag: 'Honors', stat: '2×', title: 'League MVP', detail: 'One of the most complete forwards the game has produced.' },
      { tag: 'Honors', stat: '2×', title: 'Finals MVP', detail: 'Championship pedigree, twice proven.' },
      { tag: 'Role', stat: 'NYL', title: 'The engine', detail: 'Drives the Liberty’s championship core.' },
    ],
    portrait: { tone: 'cool', src: breannaStewartPhoto, focusX: 50, focusY: 8, zoom: 1.5 },
  },
  {
    id: 'napheesa-collier',
    index: 5,
    firstName: 'NAPHEESA',
    lastName: 'COLLIER',
    fullName: 'Napheesa Collier',
    team: 'Minnesota Lynx',
    teamAbbr: 'MIN',
    conference: 'Western',
    position: 'Forward',
    jersey: 24,
    accentRole: 'The Two-Way',
    stats: [
      { value: '2025', label: 'MVP runner-up' },
      { value: '2-Way', label: 'Elite wing' },
    ],
    note: 'Carries Minnesota on both ends of the floor',
    bio:
      'Collier finished as the 2025 MVP runner-up on the strength of elite two-way play, carrying Minnesota on both ends of the floor. She defends the best perimeter and post threats while shouldering a heavy offensive load.',
    whyMatters:
      'The blueprint for the modern two-way forward — MVP-level impact on both ends.',
    highlights: [
      { tag: 'Season', stat: '2nd', title: '2025 MVP voting', detail: 'Runner-up on the strength of elite two-way play.' },
      { tag: 'Defense', stat: '2-Way', title: 'Elite wing', detail: 'Defends the best perimeter and post threats.' },
      { tag: 'Load', stat: 'MIN', title: 'Carries the Lynx', detail: 'A heavy offensive load on both ends of the floor.' },
    ],
    portrait: { tone: 'warm', src: napheesaCollierPhoto, focusX: 50, focusY: 8, zoom: 1.5 },
  },
  {
    id: 'angel-reese',
    index: 6,
    firstName: 'ANGEL',
    lastName: 'REESE',
    fullName: 'Angel Reese',
    team: 'Atlanta Dream',
    teamAbbr: 'ATL',
    conference: 'Eastern',
    position: 'Forward',
    jersey: 5,
    accentRole: 'The Culture',
    stats: [
      { value: 'Elite', label: 'Rebounding force' },
      { value: 'Draw', label: 'Cultural crossover' },
    ],
    note: 'One of the league’s biggest cultural draws',
    bio:
      'A relentless rebounding force, Reese controls the glass and the tempo for the Atlanta Dream. Off the floor she’s one of the biggest cultural draws in the sport, expanding the league’s audience with every appearance.',
    whyMatters:
      'Where basketball meets culture — a crossover star widening the league’s reach.',
    highlights: [
      { tag: 'Glass', stat: 'REB', title: 'Rebounding force', detail: 'A relentless presence on the boards.' },
      { tag: 'Tempo', stat: 'PACE', title: 'Sets the rhythm', detail: 'Controls the glass and the tempo for the Dream.' },
      { tag: 'Culture', stat: 'ATL', title: 'Crossover star', detail: 'One of the league’s biggest cultural draws.' },
    ],
    portrait: { tone: 'cool', src: angelReesePhoto, focusX: 50, focusY: 13, zoom: 1.2 },
  },
  {
    id: 'olivia-miles',
    index: 7,
    firstName: 'OLIVIA',
    lastName: 'MILES',
    fullName: 'Olivia Miles',
    team: 'Minnesota Lynx',
    teamAbbr: 'MIN',
    conference: 'Western',
    position: 'Guard',
    jersey: 5, // college number — no WNBA jersey on record yet; VERIFY before deploy
    accentRole: 'The Next',
    stats: [
      { value: 'No. 2', label: '2026 draft pick' },
      { value: 'ROY', label: 'Frontrunner' },
    ],
    note: 'Pacing all rookies in scoring and assists',
    bio:
      'The No. 2 overall pick in 2026, Miles has stepped into Minnesota’s backcourt and immediately paced all rookies in scoring and assists. She’s the clear frontrunner for Rookie of the Year in a loaded class.',
    whyMatters:
      'The next wave arriving on time — Minnesota’s future backcourt is already here.',
    highlights: [
      { tag: 'Draft', stat: 'No.2', title: '2026 overall pick', detail: 'Stepped straight into Minnesota’s backcourt.' },
      { tag: 'Rookies', stat: '1st', title: 'Rookie scoring', detail: 'Pacing all rookies in points.' },
      { tag: 'Rookies', stat: '1st', title: 'Rookie assists', detail: 'Pacing all rookies in assists.' },
      { tag: 'Award', stat: 'ROY', title: 'Frontrunner', detail: 'The clear favorite in a loaded rookie class.' },
    ],
    portrait: { tone: 'warm', src: oliviaMilesPhoto, focusX: 54, focusY: 12, zoom: 1.25 },
  },
  {
    id: 'sophie-cunningham',
    index: 8,
    firstName: 'SOPHIE',
    lastName: 'CUNNINGHAM',
    fullName: 'Sophie Cunningham',
    team: 'Indiana Fever',
    teamAbbr: 'IND',
    conference: 'Eastern',
    position: 'Guard',
    jersey: 8,
    accentRole: 'The Spark',
    stats: [
      { value: '9.5', label: 'PPG · 19 games' },
      { value: '42.9%', label: '3PT · 49.1% FG' },
    ],
    note: 'Sixth Player of the Year contender · season-high 24 vs. Toronto Tempo (Jun 16)',
    bio:
      'A veteran spark off the bench, Cunningham is averaging 9.5 points on 49.1% shooting and a scorching 42.9% from three through 19 games. Her season-high 24 points against the Toronto Tempo on June 16 underlined why she’s a leading Sixth Player of the Year contender.',
    whyMatters:
      'The connective tissue of a contender — elite shooting and edge from the second unit.',
    highlights: [
      { tag: 'Moment', stat: '24', title: 'vs. Toronto Tempo · Jun 16', detail: 'Season-high scoring night.' },
      { tag: 'Shooting', stat: '42.9%', title: 'From three', detail: 'On 49.1% from the field through 19 games.' },
      { tag: 'Scoring', stat: '9.5', title: 'Points per game', detail: 'Veteran spark off the Indiana bench.' },
      { tag: 'Award', stat: '6th', title: 'Player of the Year race', detail: 'A leading Sixth Player of the Year contender.' },
    ],
    portrait: { tone: 'cool', src: sophieCunninghamPhoto, focusX: 50, focusY: 9, zoom: 1.55 },
  },
]

// Marquee / ticker source — league-wide, factual, derived from roster copy.
export const tickerItems = [
  '2026 SEASON',
  'A’JA WILSON · 4× MVP',
  'CAITLIN CLARK · 21.2 PPG',
  'PAIGE BUECKERS · 2025 ROY',
  'BREANNA STEWART · 2× FINALS MVP',
  'NAPHEESA COLLIER · MVP RUNNER-UP',
  'ANGEL REESE · GLASS CLEANER',
  'OLIVIA MILES · No.2 PICK',
  'SOPHIE CUNNINGHAM · 42.9% 3PT',
  'EIGHT PLAYERS · ONE LEAGUE',
]

export default players
