import { useRef } from "react";
import { Link } from "react-router";
import { projects } from "../../content/projects";
import { footer, site } from "../../content/site";
import { FLAG_IDS, useFlags } from "../../lib/flags";
import { gsap, MOTION_OK, useGSAP } from "../../lib/gsap";
import { scrollToTarget } from "../../lib/scroll";
import { openTerminal } from "../../lib/terminal";
import Icon from "../ui/Icon";
import MagnifyText from "../ui/MagnifyText";
import Ridges from "../visuals/Ridges";
import styles from "./Footer.module.css";

const YEAR = new Date().getFullYear();

export default function Footer() {
  const flags = useFlags();
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = stage.current;
      if (!element) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(element.querySelectorAll("[data-char]"), {
          yPercent: 110,
          duration: 1.3,
          ease: "power4.out",
          stagger: 0.045,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            once: true,
            // The footer outlives page changes, so refresh it after each page's own pins.
            refreshPriority: -1,
          },
        });
      });
    },
    { scope: stage },
  );

  return (
    <footer className={styles.footer}>
      <div ref={stage} className={styles.stage}>
        <Ridges variant="footer" className={styles.ridges} />
        <p className={styles.giant} aria-hidden="true">
          <MagnifyText
            text={site.shortName}
            decorative
            strength={0.18}
            reach={0.7}
          />
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.brand}>
          <span className={styles.mark}>{site.monogram}</span>
          <p className={styles.line}>{footer.line}</p>
          <p className={styles.text}>{footer.text}</p>
        </div>

        <nav className={styles.column} aria-label="Projects">
          <p className={styles.index}>01</p>
          <h3 className={styles.heading}>Projects</h3>
          <ul>
            {projects.map((project) => (
              <li key={project.slug}>
                <Link to={`/projects/${project.slug}`}>{project.short}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.column} aria-label="Social">
          <p className={styles.index}>02</p>
          <h3 className={styles.heading}>Social</h3>
          <ul>
            <li>
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>Email ↗</a>
            </li>
          </ul>
        </nav>

        <nav className={styles.column} aria-label="Resume">
          <p className={styles.index}>03</p>
          <h3 className={styles.heading}>Resume</h3>
          <ul>
            <li>
              <Link to="/resume">View resume</Link>
            </li>
            <li>
              <Link to="/projects">All projects</Link>
            </li>
            <li>
              <button type="button" onClick={() => openTerminal("help")}>
                Open terminal
              </button>
            </li>
          </ul>
        </nav>

        <div className={styles.column}>
          <p className={styles.index}>04</p>
          <h3 className={styles.heading}>{site.location.city}</h3>
          <p>{site.location.region}</p>
          <p className={styles.coords}>{site.location.coords}</p>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={styles.legal}>
          <p>
            © {YEAR} {site.name}. All rights reserved
          </p>
          <p>
            Design &amp; code — {site.shortName} · Big Shoulders Display, Geist
            · React, GSAP, WebGL
          </p>
        </div>
        <p className={styles.flags}>
          <Icon name="flag" /> {flags.length} / {FLAG_IDS.length} flags captured
        </p>
        <p className={styles.privacy}>No cookies · No trackers</p>
        <button
          type="button"
          className={styles.top}
          onClick={() => scrollToTarget(0)}
        >
          Back to top <Icon name="arrow-up" />
        </button>
      </div>
    </footer>
  );
}
