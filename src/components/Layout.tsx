import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { EXHIBITION } from '../data/exhibition'

const MENU = [
  { to: '/about', label: 'ABOUT' },
  { to: '/project', label: 'PROJECT' },
  { to: '/map', label: 'MAP' },
  { to: '/behind', label: 'BEHIND' },
]

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/home" className={`logo ${className}`} aria-label="ARC 홈">
      <img src="/assets/logo.svg" alt="ARC" />
    </Link>
  )
}

export interface SubItem<K extends string = string> {
  key: K
  label: string
}

// sub: 현재 메뉴 아래에 펼쳐지는 하위 항목
interface NavProps<K extends string = string> {
  sub?: SubItem<K>[]
  subActive?: K
  onSub?: (key: K) => void
}

function Nav<K extends string>({ sub, subActive, onSub }: NavProps<K>) {
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
                      <button className={subActive === s.key ? 'is-active' : ''} onClick={() => onSub?.(s.key)}>
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

interface LayoutProps<K extends string> extends NavProps<K> {
  children: ReactNode
  className?: string
  footer?: boolean
}

export default function Layout<K extends string = string>({
  children,
  className = '',
  footer = true,
  ...navProps
}: LayoutProps<K>) {
  return (
    <div className={`page ${className}`}>
      <Nav {...navProps} />
      <Logo className="logo-fixed" />
      <main className="page-main">{children}</main>
      {footer && <Footer />}
    </div>
  )
}
