import AnimatedNumber from './AnimatedNumber.jsx'

/**
 * StatBlock — the "scoreboard" readout of a player's headline stats.
 * The `value` is the big graphic figure (counts up on entry via AnimatedNumber
 * where it's a genuine metric); the `label` is the mono descriptor.
 */
export default function StatBlock({ stats }) {
  return (
    <dl className="statblock">
      {stats.map((stat, i) => (
        <div className="statblock__cell" key={i}>
          <dt className="statblock__value">
            <AnimatedNumber value={stat.value} />
          </dt>
          <dd className="statblock__label">{stat.label}</dd>
        </div>
      ))}
    </dl>
  )
}
