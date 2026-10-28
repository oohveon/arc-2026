import { useEffect, useRef, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Layout'
import bodyJson from '../data/introBody.json'

type RGB = [number, number, number]

// [x, y, 흑백 값, 최종 색(hex), 색이 바뀌기 시작하는 시점, 페이드가 끝나는 시점(0이면 즉시)]
type BodyCell = [number, number, number, string, number, number]
interface BodyData {
  w: number
  h: number
  size: number
  cells: BodyCell[]
}
const BODY = bodyJson as unknown as BodyData

// 모션 타이밍은 '웹 인트로 모션그래픽' 영상(5초)에서 측정한 값
const DURATION = 5
const AUTO_ENTER_MS = 6500

const SCALE = ['#fbfee1', '#f5fdb3', '#eefb81', '#e7fa53', '#5ec2cb', '#f99c39', '#fbb86f', '#d65051', '#fa4796', '#f9378d', '#482be4']
const SCALE_GRAY = ['#ececec', '#dfe0df', '#cecece', '#b5b6b5', '#a6a7a6', '#9c9c9c', '#888888', '#7c7d7c', '#747574', '#636363', '#4a4b4a']
// 맨 아래 칸부터 0.167초 간격으로 색이 찬다
const scaleTime = (i: number) => 0.97 + (SCALE.length - 1 - i) * 0.167
const SCALE_LABELS = [
  { label: '38℃', y: 242, cell: 1 },
  { label: '37.5℃', y: 347, cell: 3 },
  { label: '37℃', y: 452, cell: 5 },
  { label: '(36.5)℃', y: 558, cell: 7 },
  { label: '36℃', y: 664, cell: 9 },
]
interface ScrambleProps {
  value: string
  start: number
  end: number
}
interface Callout {
  label?: ScrambleProps
  x: number
  y: number
  w: number
  h: number
  mark?: 'cross' | 'dot'
  labelX?: number
}
const CALLOUTS: Callout[] = [
  { label: { value: '37.8', start: 0.17, end: 1.17 }, x: 820, y: 267, w: 66, h: 85, mark: 'cross' },
  { label: { value: '36.5', start: 0.67, end: 1.75 }, x: 1032, y: 456, w: 66, h: 40, mark: 'cross' },
  { label: { value: '35.9', start: 1.17, end: 2.25 }, x: 857, y: 715, w: 66, h: 60, mark: 'dot' },
  { label: { value: '34.7', start: 1.5, end: 2.6 }, x: 509, y: 788, w: 59, h: 60, labelX: 534 },
  { x: 592, y: 99, w: 70, h: 74, mark: 'dot' },
]
// 걷는 사람: 박스와 옷 색이 순서대로 나타난다 (좌표는 그룹 기준)
const WALKER_BOXES = [
  { x: 5, y: 83 },
  { x: 64, y: 107 },
  { x: 113, y: 92 },
  { x: 153, y: 76 },
  { x: 203, y: 97 },
].map((b, i) => ({ ...b, t: 0.27 + i * 0.53 }))
const BARS = [109, 150, 126, 111, 95, 95, 82]
const HEADLINE = ['We All Have Our Own', 'Temperature.']
const SUBTITLE = 'Temperatures Gathered Under 36.5℃'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function useTimeline() {
  const [time, setTime] = useState(() => (prefersReducedMotion() ? DURATION : 0))
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000
      setTime(t)
      if (t < DURATION + 0.5) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return time
}

const hexToRgb = (h: string): RGB => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
interface Cell {
  x: number
  y: number
  gray: number
  rgb: RGB
  t: number
  settle: number
}
const CELLS: Cell[] = BODY.cells.map(([x, y, gray, color, t, settle]) => ({ x, y, gray, rgb: hexToRgb(color), t, settle }))

// 흑백 픽셀이 칸마다 다른 시점에 열화상 색으로 물드는 인체
function ThermalBody({ time }: { time: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / BODY.w))
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !scale) return
    const dpr = window.devicePixelRatio || 1
    const k = scale * dpr
    const w = Math.round(BODY.w * k)
    const h = Math.round(BODY.h * k)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, w, h)
    const half = BODY.size / 2
    for (const c of CELLS) {
      let r: number, g: number, b: number
      if (time < c.t) {
        r = g = b = c.gray
      } else if (!c.settle || time >= c.settle) {
        ;[r, g, b] = c.rgb
      } else {
        const p = (time - c.t) / (c.settle - c.t)
        r = c.gray + (c.rgb[0] - c.gray) * p
        g = c.gray + (c.rgb[1] - c.gray) * p
        b = c.gray + (c.rgb[2] - c.gray) * p
      }
      ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`
      ctx.fillRect((c.x - half) * k, (c.y - half) * k, BODY.size * k, BODY.size * k)
    }
  }, [time, scale])

  return <canvas ref={canvasRef} role="img" aria-label="열화상 픽셀로 표현된 사람의 실루엣" />
}

// 숫자가 굴러가다가 최종 값에 멈추는 라벨
function ScrambleLabel({ value, start, end, time }: ScrambleProps & { time: number }) {
  if (time < start) return null
  if (time >= end) return <>{value}℃</>
  const frame = Math.floor(time * 20)
  // 왼쪽 자리부터 차례로 확정된다
  const settled = Math.floor(((time - start) / (end - start)) * value.length)
  const text = [...value]
    .map((ch, i) => (ch === '.' || i < settled ? ch : String((frame * 7 + i * 3) % 10)))
    .join('')
  return <span className="scramble">{text}</span>
}

// 글자 수만큼만 보이게 하되, 자리를 미리 잡아 줄바꿈이 흔들리지 않게 한다
function Typed({ text, count }: { text: string; count: number }) {
  return (
    <>
      <span>{text.slice(0, count)}</span>
      <span className="typed-rest">{text.slice(count)}</span>
    </>
  )
}

// 컬러바 i번째 칸의 대표 온도 (38℃ 눈금이 0|1 칸 경계, 칸당 0.25℃)
const scaleTemp = (i: number) => 38 - (i - 0.5) * 0.25
const SCALE_RGB = SCALE.map((c) => hexToRgb(c.slice(1)))
const cellTemp = (rgb: RGB) => {
  let best = 0
  let bestD = Infinity
  SCALE_RGB.forEach((s, i) => {
    const d = (s[0] - rgb[0]) ** 2 + (s[1] - rgb[1]) ** 2 + (s[2] - rgb[2]) ** 2
    if (d < bestD) {
      bestD = d
      best = i
    }
  })
  return scaleTemp(best)
}

const canHover = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

// PC에서 커서를 따라다니며 커서 아래 픽셀의 체온을 보여주는 박스
function CursorProbe({ figureRef }: { figureRef: RefObject<HTMLDivElement> }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [temp, setTemp] = useState<number | null>(null)

  useEffect(() => {
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { ...target }
    let raf = 0
    let lastCell: Cell | null | undefined

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      const rect = figureRef.current?.getBoundingClientRect()
      if (!rect) return
      const k = rect.width / BODY.w
      const bx = (e.clientX - rect.left) / k
      const by = (e.clientY - rect.top) / k
      let hit: Cell | null = null
      let hitD = (BODY.size * 0.75) ** 2
      for (const c of CELLS) {
        const d = (c.x - bx) ** 2 + (c.y - by) ** 2
        if (d < hitD) {
          hitD = d
          hit = c
        }
      }
      if (hit !== lastCell) {
        lastCell = hit
        setTemp(hit ? cellTemp(hit.rgb) : null)
      }
    }
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      if (boxRef.current) boxRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [figureRef])

  return (
    <div ref={boxRef} className="cursor-probe" aria-hidden="true">
      <span className="intro-callout-label">{temp === null ? '--.-' : temp.toFixed(1)}℃</span>
      <span className="intro-callout-box mark-cross" />
    </div>
  )
}

const typedCount = (time: number, start: number, perChar: number, length: number) => Math.max(0, Math.min(length, Math.floor((time - start) / perChar)))

function barHeight(base: number, i: number, time: number) {
  if (time >= DURATION) return base
  // 마지막 0.4초 동안 원래 높이로 돌아온다
  const settle = Math.min(1, Math.max(0, (DURATION - time) / 0.4))
  const wave = 0.28 * Math.sin(time * 2.6 + i * 1.7) + 0.14 * Math.sin(time * 5.4 + i * 2.9)
  return Math.max(30, Math.min(160, base * (1 + wave * settle)))
}

export default function Intro() {
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const [hoverable] = useState(canHover)
  const figureRef = useRef<HTMLDivElement>(null)
  const time = useTimeline()

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => navigate('/home'), 600)
  }

  // 마우스를 움직이면 자동 이동을 멈추고 클릭으로 들어가게 한다
  useEffect(() => {
    const t = setTimeout(enter, AUTO_ENTER_MS)
    const stop = () => clearTimeout(t)
    if (hoverable) window.addEventListener('mousemove', stop, { once: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('mousemove', stop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const probing = hoverable && time >= DURATION
  const headlineLen = HEADLINE[0].length + HEADLINE[1].length
  const headCount = typedCount(time, 0.1, 0.078, headlineLen)
  const subCount = typedCount(time, 1.6, 0.06, SUBTITLE.length)

  return (
    <div className={`intro ${leaving ? 'is-leaving' : ''} ${probing ? 'is-probing' : ''}`} onClick={enter}>
      <Logo className="logo-fixed" />
      {probing && <CursorProbe figureRef={figureRef} />}
      <div className="stage intro-stage">
        <div className="intro-walkers">
          <img src="/assets/intro/walkers-base.png" alt="" />
          {WALKER_BOXES.map((b, i) => (
            <div
              key={i}
              className={`walker-box ${time >= b.t ? 'is-on' : ''}`}
              style={{ '--x': b.x, '--y': b.y }}
            >
              <img src={`/assets/intro/walkers-c${i + 1}.png`} alt="" />
            </div>
          ))}
        </div>

        <div className="intro-figure" ref={figureRef}>
          <ThermalBody time={time} />
        </div>
        {['tl', 'tr', 'bl', 'br'].map((c) => (
          <span key={c} className={`intro-corner ${c}`} />
        ))}

        {CALLOUTS.map((c, i) => (
          <div key={i} className="intro-callout" style={{ '--x': c.x, '--y': c.y, '--w': c.w, '--h': c.h }}>
            {c.label && (
              <span className="intro-callout-label" style={{ '--lx': (c.labelX ?? c.x) - c.x }}>
                <ScrambleLabel {...c.label} time={time} />
              </span>
            )}
            <span className={`intro-callout-box mark-${c.mark ?? 'none'}`} />
          </div>
        ))}

        <ul className="intro-scale" aria-hidden="true">
          {SCALE.map((c, i) => (
            <li key={c} style={{ background: time >= scaleTime(i) ? c : SCALE_GRAY[i] }} />
          ))}
        </ul>
        {SCALE_LABELS.map((s) => (
          <span
            key={s.label}
            className={`intro-scale-label ${time >= scaleTime(s.cell) ? 'is-on' : ''}`}
            style={{ '--y': s.y }}
          >
            {s.label}
          </span>
        ))}

        <div className="intro-squares" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} />
          ))}
        </div>

        <div className="intro-bars" aria-hidden="true">
          {BARS.map((h, i) => (
            <span key={i} style={{ height: `calc(var(--u) * ${barHeight(h, i, time)})` }} />
          ))}
        </div>

        <div className="intro-copy">
          <h1 aria-label={HEADLINE.join(' ')}>
            <Typed text={HEADLINE[0]} count={headCount} />
            <br />
            <Typed text={HEADLINE[1]} count={Math.max(0, headCount - HEADLINE[0].length)} />
          </h1>
          <p aria-label={SUBTITLE}>
            <Typed text={SUBTITLE} count={subCount} />
          </p>
        </div>
      </div>
      <p className={`intro-hint ${time >= DURATION ? 'is-on' : ''}`}>Click to enter</p>
    </div>
  )
}
