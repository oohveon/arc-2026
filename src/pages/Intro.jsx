import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Layout.jsx'

const SCALE = ['#fbfee1', '#f5fdb3', '#eefb81', '#e7fa53', '#5ec2cb', '#f99c39', '#fbb86f', '#d65051', '#fa4796', '#f9378d', '#482be4']
const SCALE_LABELS = [
  { label: '38℃', y: 242 },
  { label: '37.5℃', y: 347 },
  { label: '37℃', y: 452 },
  { label: '(36.5)℃', y: 558 },
  { label: '36℃', y: 664 },
]
const CALLOUTS = [
  { label: '38.5℃', x: 820, y: 267, w: 66, h: 85, mark: 'cross' },
  { label: '40℃', x: 1032, y: 456, w: 66, h: 40, mark: 'cross' },
  { label: '34℃', x: 857, y: 715, w: 66, h: 60, mark: 'dot' },
  { label: '35℃', x: 509, y: 788, w: 59, h: 60, labelX: 534 },
  { x: 592, y: 99, w: 70, h: 74, mark: 'dot' },
]

const AUTO_ENTER_MS = 6000

export default function Intro() {
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => navigate('/home'), 600)
  }

  useEffect(() => {
    const t = setTimeout(enter, AUTO_ENTER_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`intro ${leaving ? 'is-leaving' : ''}`} onClick={enter}>
      <Logo className="logo-fixed" />
      <div className="stage intro-stage">
        <img className="intro-walkers" src="/assets/intro-walkers.png" alt="" />

        <div className="intro-figure">
          <img src="/assets/intro-body.png" alt="열화상 픽셀로 표현된 사람의 실루엣" />
          <span className="scan" />
        </div>
        {['tl', 'tr', 'bl', 'br'].map((c) => (
          <span key={c} className={`intro-corner ${c}`} />
        ))}

        {CALLOUTS.map((c, i) => (
          <div key={i} className="intro-callout" style={{ '--x': c.x, '--y': c.y, '--w': c.w, '--h': c.h, '--i': i }}>
            {c.label && (
              <span className="intro-callout-label" style={{ '--lx': (c.labelX ?? c.x) - c.x }}>
                {c.label}
              </span>
            )}
            <span className={`intro-callout-box mark-${c.mark ?? 'none'}`} />
          </div>
        ))}

        <ul className="intro-scale" aria-hidden="true">
          {SCALE.map((c, i) => (
            <li key={c} style={{ background: c, '--i': i }} />
          ))}
        </ul>
        {SCALE_LABELS.map((s) => (
          <span key={s.label} className="intro-scale-label" style={{ '--y': s.y }}>
            {s.label}
          </span>
        ))}

        <div className="intro-squares" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} />
          ))}
        </div>

        <img className="intro-bars" src="/assets/intro-bars.svg" alt="" />

        <div className="intro-copy">
          <h1>
            We All Have Our Own
            <br />
            Temperature.
          </h1>
          <p>Temperatures Gathered Under 36.5℃</p>
        </div>
      </div>
      <p className="intro-hint">Click to enter</p>
    </div>
  )
}
