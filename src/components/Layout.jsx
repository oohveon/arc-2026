import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { EXHIBITION } from '../data/exhibition.js'

const MENU = [
  { to: '/about', label: 'ABOUT' },
  { to: '/project', label: 'PROJECT' },
  { to: '/map', label: 'MAP' },
  { to: '/behind', label: 'BEHIND' },
]

export function Logo({ className = '' }) {
  return (
    <Link to="/home" className={`logo ${className}`} aria-label="ARC 홈">
      <img src="/assets/logo.svg" alt="ARC" />
    </Link>
  )
}

// sub: 현재 메뉴 아래에 펼쳐지는 하위 항목 [{ key, label }]
function Nav({ sub, subActive, onSub }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <button
        className={`nav-toggle ${open ? 'is-open' : ''}`}
        aria-label="메뉴"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>
      <nav className={`nav ${open ? 'is-open' : ''}`}>
        <NavLink to="/home" className="nav-item nav-home">
          HOME
        </NavLink>
        <ul className="nav-list">
          {MENU.map((m) => (
            <li key={m.to}>
              <NavLink to={m.to} className="nav-item">
                {m.label}
              </NavLink>
              {sub && pathname === m.to && (
                <ul className="nav-sub">
                  {sub.map((s) => (
                    <li key={s.key}>
                      <button className={subActive === s.key ? 'is-active' : ''} onClick={() => onSub(s.key)}>
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <img src="/assets/logo.svg" alt="ARC" className="footer-logo" />
      <p>
        ART &amp; DESIGN EXHIBITION
        <br />
        {EXHIBITION.address}
        <br />© 2026. ARC All rights reserved.
      </p>
      <a href={`https://www.instagram.com/${EXHIBITION.instagram}/`} target="_blank" rel="noreferrer">
        @{EXHIBITION.instagram}
      </a>
    </footer>
  )
}

export default function Layout({ children, className = '', footer = true, ...navProps }) {
  return (
    <div className={`page ${className}`}>
      <Nav {...navProps} />
      <Logo className="logo-fixed" />
      <main className="page-main">{children}</main>
      {footer && <Footer />}
    </div>
  )
}
