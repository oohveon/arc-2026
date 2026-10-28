import { useState } from 'react'
import Layout from '../components/Layout'
import { FLOORS, MAP_WORKS, type FloorKey } from '../data/projects'

export default function MapPage() {
  const [floor, setFloor] = useState<FloorKey>('2F')
  const data = MAP_WORKS[floor]

  return (
    <Layout
      className="page-map"
      sub={FLOORS.map((f) => ({ key: f, label: f }))}
      subActive={floor}
      onSub={setFloor}
    >
      <div className="map-floor-tabs">
        {FLOORS.map((f) => (
          <button key={f} className={f === floor ? 'is-active' : ''} onClick={() => setFloor(f)}>
            {f}
          </button>
        ))}
      </div>
      <img key={floor} className="map-image" src={data.image} alt={`${data.label} 평면도`} />
      <ol className="map-works">
        {data.works.map((w) => (
          <li key={w.no}>
            <strong>
              <em>{w.no}.</em>
              {w.title}
            </strong>
            <span>{w.artists}</span>
          </li>
        ))}
      </ol>
    </Layout>
  )
}
