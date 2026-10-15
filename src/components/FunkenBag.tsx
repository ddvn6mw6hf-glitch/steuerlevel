import { useEffect, useId, useRef, useState } from 'react'

type Props = { points: number; golden?: boolean }

function FunkenBag({ points, golden = false }: Props) {
  const previousPoints = useRef(points)
  const [spark, setSpark] = useState(false)
  const svgId = useId().replaceAll(':', '')

  useEffect(() => {
    if (points <= previousPoints.current) {
      previousPoints.current = points
      return
    }

    previousPoints.current = points
    setSpark(true)
    const timeout = window.setTimeout(() => setSpark(false), 800)
    return () => window.clearTimeout(timeout)
  }, [points])

  const fillHeight = Math.min(1, points / 100)
  const fillTop = 59 - fillHeight * 28

  return (
    <span className={`funken-bag${spark ? ' funken-bag-award' : ''}${golden ? ' funken-bag-golden' : ''}`} role="img" aria-label={`${golden ? 'Goldener ' : ''}Funkenbeutel mit ${points} Steuerfunken`}>
      <svg aria-hidden="true" viewBox="0 0 72 72">
        <defs>
          <linearGradient id={`${svgId}-gold-gradient`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff1a8" />
            <stop offset=".5" stopColor="#f6c542" />
            <stop offset="1" stopColor="#c7861f" />
          </linearGradient>
          <clipPath id={`${svgId}-bag-shape`}>
            <path d="M21 24c-4 7-8 17-8 27 0 10 9 16 23 16s23-6 23-16c0-10-4-20-8-27l-9 5H30z" />
          </clipPath>
        </defs>
        <path className="bag-cord" d="M25 17c4 4 18 4 22 0M29 17l-4 7m19-7 4 7" />
        <path className="bag-cloth" d="M24 14c2-7 7-10 12-10s10 3 12 10l-4 7H28z" />
        <path className="bag-fill" style={golden ? { fill: `url(#${svgId}-gold-gradient)` } : undefined} clipPath={`url(#${svgId}-bag-shape)`} d={`M12 ${fillTop}q12-5 24 0t24 0v42H12z`} />
        <path className="bag-outline" d="M21 24c-4 7-8 17-8 27 0 10 9 16 23 16s23-6 23-16c0-10-4-20-8-27l-9 5H30z" />
        <path className="bag-knot" d="M31 20l5 5 5-5m-5 5v5" />
        <path className="bag-spark" d="m36 37 2.4 5.4 5.8.6-4.4 3.8 1.3 5.7-5.1-3-5.1 3 1.3-5.7-4.4-3.8 5.8-.6z" />
        <path className="bag-glint" d="M18 43h3m30 9h3M26 58l2 2m18-2-2 2" />
        {golden && <path className="bag-gold-star" d="m54 12 1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" />}
      </svg>
      {spark && <span className="bag-flying-spark" aria-hidden="true">✦</span>}
    </span>
  )
}

export default FunkenBag
