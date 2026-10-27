import { useCallback, useState } from 'react'
import Layout from '../components/Layout.jsx'
import Modal from '../components/Modal.jsx'
import { BEHIND } from '../data/projects.js'

// 카드 좌표(1920 기준)와 번호 위치: 계단식 배치
const POS = [
  { x: 390, y: 379, label: 'top' },
  { x: 597, y: 638, label: 'bottom' },
  { x: 804, y: 897, label: 'bottom' },
  { x: 1011, y: 638, label: 'top' },
  { x: 1218, y: 897, label: 'top-end' },
  { x: 1425, y: 1156, label: 'bottom' },
  { x: 1632, y: 897, label: 'top-end' },
]

export default function Behind() {
  const [index, setIndex] = useState(null)
  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(() => setIndex((i) => (i - 1 + BEHIND.length) % BEHIND.length), [])
  const next = useCallback(() => setIndex((i) => (i + 1) % BEHIND.length), [])

  return (
    <Layout className="page-behind">
      <section className="stage behind-stage">
        <h1 className="behind-word w-the">The</h1>
        <p className="behind-word w-history">History</p>
        <p className="behind-word w-archive">Archive</p>

        {BEHIND.map((b, i) => (
          <button
            key={b.no}
            className={`behind-card label-${POS[i].label}`}
            style={{ '--x': POS[i].x, '--y': POS[i].y, '--i': i }}
            onClick={() => setIndex(i)}
            aria-label={`${b.no}. ${b.title}`}
          >
            <img src={b.image} alt="" loading="lazy" />
            <span className="behind-no">{b.no}</span>
          </button>
        ))}
      </section>

      {index !== null && (
        <Modal title="36.5 Lap" onClose={close} onPrev={prev} onNext={next}>
          <div className="behind-modal">
            <button className="behind-arrow" onClick={prev} aria-label="이전">
              ‹
            </button>
            <img src={BEHIND[index].image} alt={BEHIND[index].title} />
            <button className="behind-arrow" onClick={next} aria-label="다음">
              ›
            </button>
          </div>
          <p className="behind-modal-caption">
            {BEHIND[index].no} / {BEHIND.length} · {BEHIND[index].title}
          </p>
        </Modal>
      )}
    </Layout>
  )
}
