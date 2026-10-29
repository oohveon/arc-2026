import { useState } from 'react'
import HeatHaze from '../components/HeatHaze'
import Layout from '../components/Layout'
import TempInput, { tempHeat } from '../components/TempInput'
import { EXHIBITION } from '../data/exhibition'

export default function Home() {
  const [temp, setTemp] = useState(36.5)

  return (
    <Layout className="page-home" footer={false}>
      <section className="stage home-stage">
        <HeatHaze
          className="home-temp"
          src="/assets/home-temp.png"
          alt="36.5°C"
          width={934}
          height={314}
          intensity={tempHeat(temp)}
        />
        <h1 className="home-question">
          If your life had a temperature,
          <br />
          what would it be?
          <span className="home-answer">
            (<TempInput onChange={setTemp} />
            )°C
          </span>
        </h1>
        <img
          className="home-runners"
          src="/assets/home-runners.png"
          alt="걷다가 달리는 사람들의 실루엣과 체온 그래프 (38.6, 35.8, 37.8, 35.4, 36.7)"
        />
        <p className="home-info">
          {EXHIBITION.venue}
          <br />
          {EXHIBITION.address} {EXHIBITION.date}
        </p>
        <p className="home-vol">
          ARC
          <br />
          EXHIBITION VOL. 2
        </p>
      </section>
    </Layout>
  )
}
