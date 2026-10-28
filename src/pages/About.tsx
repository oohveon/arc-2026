import Layout from '../components/Layout'
import { EXHIBITION, TEAM, type TeamGroup as TeamGroupData } from '../data/exhibition'

function SectionHead({ title, no }: { title: string; no: string }) {
  return (
    <header className="about-head">
      <h2>{title}</h2>
      <span>{no}</span>
    </header>
  )
}

function TeamGroup({ group }: { group: TeamGroupData }) {
  return (
    <div className="team-group">
      <h3>{group.name}</h3>
      <ul>
        {group.members.map((m) => (
          <li key={m.photo}>
            <a href={`https://www.instagram.com/${m.handle}/`} target="_blank" rel="noreferrer">
              <img src={`/assets/team/${m.photo}.png`} alt={`@${m.handle}`} loading="lazy" />
              <span>@{m.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const byName = Object.fromEntries(TEAM.map((g) => [g.name, g]))

export default function About() {
  return (
    <Layout className="page-about">
      <div className="about">
        {/* 디자인의 계단식 흰 배경 블록 */}
        <div className="about-blocks" aria-hidden="true">
          {[
            [410, 98, 1137, 700],
            [746, 354, 986, 646],
            [477, 985, 1343, 161],
            [437, 1137, 1118, 491],
            [471, 1628, 1343, 331],
            [601, 1955, 1319, 163],
            [464, 2111, 1243, 209],
            [402, 2318, 1245, 591],
            [504, 2909, 1295, 167],
            [625, 3064, 1295, 83],
            [1134, 3147, 786, 98],
            [557, -3, 1136, 114],
          ].map(([x, y, w, h], i) => (
            <span key={i} style={{ '--x': x, '--y': y, '--w': w, '--h': h }} />
          ))}
        </div>

        <section className="about-exhibition">
          <SectionHead title="Exhibition" no="01" />
          <div className="about-exhibition-body">
            <dl>
              <dt>DATE</dt>
              <dd>{EXHIBITION.date}</dd>
              <dt>PLACE</dt>
              <dd>
                {EXHIBITION.venue}
                <br />
                {EXHIBITION.address}
                <br />
                {EXHIBITION.date}
              </dd>
            </dl>
            <img src="/assets/about-map.png" alt="전시장 위치 지도" />
          </div>
        </section>

        <section className="about-overview">
          <SectionHead title="Overview" no="02" />
          <div className="about-overview-body">
            <figure>
              <img src="/assets/about-poster.png" alt="36.5℃ DEGREES EXHIBITION 메인 포스터" />
              <figcaption>&lt;2027 Main Poster&gt;</figcaption>
            </figure>
            <div className="about-overview-text">
              <h3>
                We All Live At
                <br />
                Our Own Temperature℃
              </h3>
              <div>
                <p className="vol">ARC VOL / (02)</p>
                <p className="desc">
                  〈36.5℃〉는 서로 다른 우리가 하나의 공간에 머무르며 각자의 온도를 나누고, 서로의 온도로 전시를
                  채워가는 과정을 이야기 하는 전시입니다. 36.5℃라는 하나의 이름 아래, 우리는 각자의 온도를 함께
                  채워나갑니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-team">
          <SectionHead title="ARC Team" no="03" />
          <div className="team-ops">
            <span className="paren" aria-hidden="true">(</span>
            <TeamGroup group={byName.OPERATIONS} />
            <span className="paren" aria-hidden="true">)</span>
            <span className="ring" aria-hidden="true" />
          </div>
          <div className="team-grid">
            <span className="paren paren-open" aria-hidden="true">(</span>
            {['DESIGN', 'PLANNING', 'SPACE', 'OFFICE', 'WEB DESIGN', 'WEB'].map((n) => (
              <TeamGroup key={n} group={byName[n]} />
            ))}
            <span className="paren paren-close" aria-hidden="true">)</span>
            <span className="ring ring-end" aria-hidden="true" />
          </div>
        </section>
      </div>
    </Layout>
  )
}
