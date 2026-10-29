import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { site } from "../../content/site";
import { useMagnetic } from "../../lib/interactions";
import { setScrollLocked } from "../../lib/scroll";
import { useActiveSection } from "../../lib/useActiveSection";
import Icon from "../ui/Icon";
import ScrambleText from "../ui/ScrambleText";
import SectionLink from "../ui/SectionLink";
import styles from "./Header.module.css";

type NavItem = { index: string; label: string; hash: string };

const NAV: NavItem[] = [
  { index: "01", label: "About", hash: "#about" },
  { index: "02", label: "Projects", hash: "#projects" },
  { index: "03", label: "Lab", hash: "#lab" },
  { index: "04", label: "Contact", hash: "#contact" },
];

const SECTION_IDS = ["top", "about", "projects", "lab", "contact"];

export default function Header() {
  const { pathname } = useLocation();
  const active = useActiveSection(SECTION_IDS, pathname === "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const magnetic = useMagnetic(0.4);

  useEffect(() => {
    if (!menuOpen) return;
    setScrollLocked(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const renderLink = (item: NavItem, className: string, scramble = false) => (
    <SectionLink
      to={item.hash}
      className={className}
      aria-current={active === item.hash.slice(1) ? "true" : undefined}
      onNavigate={closeMenu}
    >
      <span className={styles.num}>{item.index}</span>
      {scramble ? (
        <ScrambleText text={item.label} />
      ) : (
        <span>{item.label}</span>
      )}
    </SectionLink>
  );

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <SectionLink
          to="#top"
          className={styles.brand}
          onNavigate={closeMenu}
          aria-label={`${site.shortName} — home`}
        >
          <ScrambleText text="Prajwal.R.P" highlight="." />
        </SectionLink>
        <ul className={styles.list}>
          {NAV.slice(0, 2).map((item) => (
            <li key={item.hash}>{renderLink(item, styles.link, true)}</li>
          ))}
        </ul>
        <SectionLink
          ref={magnetic}
          to="#top"
          className={styles.mark}
          onNavigate={closeMenu}
          aria-label={`${site.monogram} — home`}
        >
          {site.monogram}
        </SectionLink>
        <ul className={styles.list}>
          {NAV.slice(2).map((item) => (
            <li key={item.hash}>{renderLink(item, styles.link, true)}</li>
          ))}
        </ul>
        <Link
          to="/resume"
          className={styles.resume}
          aria-current={pathname === "/resume" ? "page" : undefined}
        >
          <ScrambleText text="Resume" /> <Icon name="arrow-up-right" />
        </Link>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </nav>

      {menuOpen ? (
        <div id="site-menu" className={styles.menu}>
          <ul className={styles.menuList}>
            {NAV.map((item) => (
              <li key={item.hash}>{renderLink(item, styles.menuLink)}</li>
            ))}
            <li>
              <Link
                to="/resume"
                className={styles.menuLink}
                onClick={closeMenu}
              >
                <span className={styles.num}>05</span>
                <span>Resume</span>
              </Link>
            </li>
          </ul>
          <div className={styles.menuFoot}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>
              {site.location.short} · {site.location.coords}
            </span>
          </div>
        </div>
      ) : null}
    </header>
  );
}
