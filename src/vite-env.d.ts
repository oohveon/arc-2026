/// <reference types="vite/client" />

import 'react'

// style={{ '--x': 10 }} 처럼 CSS 변수를 인라인으로 넘길 수 있게 한다
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
