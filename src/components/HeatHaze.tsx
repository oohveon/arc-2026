import { useEffect, useId, useRef } from 'react'

interface HeatHazeProps {
  src: string
  alt: string
  /** 이미지 원본 크기 (viewBox) */
  width: number
  height: number
  className?: string
}

// 일렁임 세기 (viewBox 단위)
const START = 60
const REST = 8
const HOT = 24

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// 아지랑이처럼 일렁이는 이미지: 처음엔 크게 일렁이다 또렷해지고, 마우스를 올리면 다시 뜨거워진다
export default function HeatHaze({ src, alt, width, height, className = '' }: HeatHazeProps) {
  const filterId = `heat-haze-${useId().replace(/:/g, '')}`
  const dispRef = useRef<SVGFEDisplacementMapElement>(null)
  const target = useRef(REST)

  useEffect(() => {
    const disp = dispRef.current
    if (!disp) return
    if (prefersReducedMotion()) {
      disp.setAttribute('scale', '0')
      return
    }
    let scale = START
    let raf = 0
    const loop = () => {
      scale += (target.current - scale) * 0.035
      disp.setAttribute('scale', scale.toFixed(2))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className={`heat-haze ${className}`}
      onMouseEnter={() => (target.current = HOT)}
      onMouseLeave={() => (target.current = REST)}
    >
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={alt}>
        <defs>
          <filter id={filterId} x="-5%" y="-15%" width="110%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.045" numOctaves="2" seed="3" result="noise">
              <animate
                attributeName="baseFrequency"
                dur="7s"
                values="0.008 0.045; 0.011 0.06; 0.007 0.04; 0.008 0.045"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale={START}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <image href={src} width={width} height={height} filter={`url(#${filterId})`} />
      </svg>
    </div>
  )
}
