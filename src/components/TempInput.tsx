import { useEffect, useRef, useState } from 'react'

// 빈칸에 번갈아 떠오르는 온도 (홈 러너 그래프 값)
const ROLL = ['36.5', '37.8', '35.9', '38.6', '34.7', '36.7', '35.4']
const ROLL_MS = 2400
const SCRAMBLE_MS = 600
const MIN = 0
const MAX = 99

// 차가울수록 파랑, 뜨거울수록 빨강 (인트로 컬러바에서 글자로 읽히는 색만 골라 약간 진하게)
const STOPS: [number, [number, number, number]][] = [
  [34, [72, 43, 228]],
  [35.5, [47, 163, 173]],
  [36.5, [232, 130, 28]],
  [37.5, [214, 80, 81]],
  [39, [249, 55, 141]],
]

// 색 범위(34~39℃)를 벗어나면 회색
const OUT_OF_RANGE = '#8a8a8a'

export const tempColor = (t: number) => {
  if (t < STOPS[0][0] || t > STOPS[STOPS.length - 1][0]) return OUT_OF_RANGE
  const i = STOPS.findIndex(([s]) => t < s)
  if (i === -1) return `rgb(${STOPS[STOPS.length - 1][1]})`
  const [t0, c0] = STOPS[i - 1]
  const [t1, c1] = STOPS[i]
  const p = (t - t0) / (t1 - t0)
  return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * p))})`
}

// 34℃ 이하 0 ~ 39℃ 이상 1
export const tempHeat = (t: number) => Math.min(1, Math.max(0, (t - 34) / 5))

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

interface TempInputProps {
  onChange?: (temp: number) => void
}

// ( °C) 빈칸: 평소엔 온도가 룰렛처럼 돌고, 누르면 내 온도를 직접 넣을 수 있다
export default function TempInput({ onChange }: TempInputProps) {
  const [value, setValue] = useState(ROLL[0])
  const [text, setText] = useState(ROLL[0])
  const [mine, setMine] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const cancelled = useRef(false)

  // 직접 입력하기 전까지 다음 온도로 넘어간다
  useEffect(() => {
    if (mine || editing || prefersReducedMotion()) return
    const id = setInterval(() => {
      setValue((v) => ROLL[(ROLL.indexOf(v) + 1) % ROLL.length] ?? ROLL[0])
    }, ROLL_MS)
    return () => clearInterval(id)
  }, [mine, editing])

  // 값이 바뀌면 숫자가 섞이다가 왼쪽 자리부터 차례로 확정된다
  useEffect(() => {
    onChange?.(parseFloat(value))
    if (prefersReducedMotion()) {
      setText(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const p = (now - start) / SCRAMBLE_MS
      if (p >= 1) {
        setText(value)
        return
      }
      const settled = Math.floor(p * value.length)
      const frame = Math.floor(now / 50)
      setText(
        [...value].map((ch, i) => (ch === '.' || i < settled ? ch : String((frame * 7 + i * 3) % 10))).join(''),
      )
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [value, onChange])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const startEdit = () => {
    setDraft(mine ? value : '')
    setEditing(true)
  }

  const commit = () => {
    setEditing(false)
    if (cancelled.current) {
      cancelled.current = false
      return
    }
    const n = parseFloat(draft)
    if (Number.isNaN(n)) {
      // 비워 두면 다시 룰렛으로
      if (!draft) setMine(false)
      return
    }
    setValue(Math.min(MAX, Math.max(MIN, n)).toFixed(1))
    setMine(true)
  }

  return (
    <span
      className={`temp-input${mine ? ' is-mine' : ''}`}
      style={{ '--temp-color': tempColor(parseFloat(value)) }}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          placeholder={value}
          inputMode="decimal"
          aria-label="내 온도 입력 (℃)"
          onChange={(e) => setDraft(e.target.value.replace(/[^\d.]/g, '').slice(0, 4))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') {
              cancelled.current = true
              e.currentTarget.blur()
            }
          }}
        />
      ) : (
        <button type="button" onClick={startEdit} aria-label={`${value}℃, 눌러서 내 온도 입력하기`}>
          {text}
        </button>
      )}
    </span>
  )
}
