import Layout from '../components/Layout.jsx'
import { EXHIBITION } from '../data/exhibition.js'

export default function Home() {
  return (
    <Layout className="page-home" footer={false}>
      <section className="stage home-stage">
        <img className="home-temp" src="/assets/home-temp.png" alt="36.5°C" />
        <h1 className="home-question">
          What temperature do you personally live your life (<span className="blank" />
          °C)?
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
