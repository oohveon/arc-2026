import { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import Modal from '../components/Modal.jsx'
import { CATEGORIES, PROJECTS } from '../data/projects.js'

function Thumb({ project }) {
  if (project.image) return <img src={project.image} alt={project.title} loading="lazy" />
  return <span className="thumb-placeholder">작품 썸네일</span>
}

export default function Project() {
  const [category, setCategory] = useState('All')
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(null)
  const refs = useRef([])

  const list = useMemo(
    () => (category === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === category)),
    [category],
  )

  // 화면 중앙에 가장 가까운 카드를 크게 보여준다
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      refs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [list])

  const sub = CATEGORIES.map((c) => ({ key: c, label: c }))

  return (
    <Layout
      className="page-project"
      sub={sub}
      subActive={category}
      onSub={(c) => {
        setCategory(c)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
    >
      <ul className="project-list">
        {list.map((p, i) => (
          <li key={p.id} ref={(el) => (refs.current[i] = el)} className={i === active ? 'is-active' : ''}>
            <button className="project-card" onClick={() => setSelected(p)}>
              <Thumb project={p} />
              <span className="project-card-title">{p.title}</span>
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="project-empty">준비 중입니다.</li>}
      </ul>

      {selected && (
        <Modal title={selected.category} onClose={() => setSelected(null)}>
          <div className="project-modal">
            <div className="project-modal-image">
              <Thumb project={selected} />
            </div>
            <div className="project-modal-info">
              <div>
                <h3 className="degree">{selected.title}</h3>
                <h4>{selected.team}</h4>
                <p>{selected.members}</p>
                {selected.contacts.length > 0 && (
                  <>
                    <h4>Contact</h4>
                    <p className="contacts">
                      {selected.contacts.map((c) => (
                        <a key={c} href={`https://www.instagram.com/${c}/`} target="_blank" rel="noreferrer">
                          @{c}
                        </a>
                      ))}
                    </p>
                  </>
                )}
              </div>
              <div>
                <h4>작품 설명</h4>
                <p className="desc">{selected.description}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
