import { useRef } from "react";
import { hero, site } from "../content/site";
import { useBootPhase } from "../lib/boot";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import { useLocalTime } from "../lib/time";
import Button from "../components/ui/Button";
import FlagButton from "../components/ui/FlagButton";
import Icon from "../components/ui/Icon";
import MagnifyText from "../components/ui/MagnifyText";
import ScrambleText from "../components/ui/ScrambleText";
import SectionLink from "../components/ui/SectionLink";
import SplitText from "../components/ui/SplitText";
import DitherCanvas from "../components/visuals/DitherCanvas";
import styles from "./Hero.module.css";

const INDEX = [
  { index: "01", label: "About", hash: "#about" },
  { index: "02", label: "Projects", hash: "#projects" },
  { index: "03", label: "Contact", hash: "#contact" },
];

export default function Hero() {
  const play = useBootPhase() !== "booting";
  const time = useLocalTime();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!play) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-hero-fade]", {
          autoAlpha: 0,
          y: 18,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.35,
        });
        gsap.from("[data-hero-visual]", {
          autoAlpha: 0,
          scale: 0.94,
          duration: 1.6,
          ease: "power3.out",
        });

        const scrub = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };
        gsap.to("[data-hero-depth]", {
          yPercent: 16,
          scale: 0.88,
          ease: "none",
          scrollTrigger: { ...scrub },
        });
        gsap.to("[data-hero-copy]", {
          y: -70,
          ease: "none",
          scrollTrigger: { ...scrub },
        });
        gsap.to("[data-hero-wordmark]", {
          y: -120,
          ease: "none",
          scrollTrigger: { ...scrub },
        });
      });
    },
    { scope: root, dependencies: [play] },
  );

  return (
    <section
      id="top"
      ref={root}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.dots} aria-hidden="true" />

      <SectionLink to="#contact" className={styles.status} data-hero-fade="">
        <span className={styles.statusMark}>{site.monogram}</span>
        <span className={styles.statusText}>{hero.status}</span>
        <span className={styles.statusCta}>
          Write <Icon name="arrow-right" />
        </span>
      </SectionLink>

      <dl className={styles.info} data-hero-fade="">
        <div>
          <dt className="sr-only">Name</dt>
          <dd>
            <ScrambleText text="Prajwal R" trigger="play" play={play} />
          </dd>
          <dd>
            <ScrambleText text="Pattanshetti" trigger="play" play={play} />
          </dd>
        </div>
        <div>
          <dt className="sr-only">Location</dt>
          <dd>
            <ScrambleText
              text={site.location.city}
              trigger="play"
              play={play}
            />
          </dd>
          <dd>
            <ScrambleText
              text={site.location.region}
              trigger="play"
              play={play}
            />
          </dd>
        </div>
        <div>
          <dt className="sr-only">Role</dt>
          <dd>
            <ScrambleText text={hero.role[0]} trigger="play" play={play} />
          </dd>
          <dd>
            <ScrambleText text={hero.role[1]} trigger="play" play={play} />
          </dd>
        </div>
        <div className={styles.clock}>
          <dt>Local time</dt>
          <dd>
            {time} <span>{site.location.tzLabel}</span>
            <FlagButton id="hero" className={styles.flag} />
          </dd>
        </div>
      </dl>

      <div className={styles.visual} data-hero-visual="">
        <div className={styles.depth} data-hero-depth="">
          <DitherCanvas shape="padlock" cell={4} interactive />
        </div>
      </div>

      <div className={styles.copy} data-hero-copy="">
        <p className={styles.kicker} data-hero-fade="">
          <span className={styles.pulse} aria-hidden="true" />[ 00 ] ·{" "}
          {hero.label}
        </p>
        <SplitText
          as="h1"
          id="hero-title"
          text={hero.headline}
          className={styles.title}
          play={play}
          scroll={false}
        />
        <div className={styles.leadRow}>
          <p className={styles.lead} data-hero-fade="">
            {hero.lead}
          </p>
          <div className={styles.actions} data-hero-fade="">
            <Button section="#projects">See projects</Button>
            <Button section="#contact" variant="solid" icon="arrow-up-right">
              Get in touch
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.side} data-hero-fade="">
        <p className={styles.wordmark} aria-hidden="true" data-hero-wordmark="">
          <MagnifyText
            text={site.firstName}
            decorative
            strength={0.3}
            reach={1}
          />
          <span className={styles.wordmarkSub}>R · P</span>
        </p>
        <nav className={styles.index} aria-label="Index">
          <p>
            <span>Index</span>
            <span>{site.location.coords}</span>
          </p>
          <ul>
            {INDEX.map((item) => (
              <li key={item.hash}>
                <SectionLink to={item.hash}>
                  <span>
                    <span className={styles.indexNum}>{item.index}</span>
                    {item.label}
                  </span>
                  <Icon name="arrow-down" />
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>{hero.footer}</p>
        <SectionLink to="#about" className={styles.scroll}>
          Scroll <Icon name="arrow-down" />
        </SectionLink>
      </div>
    </section>
  );
}
