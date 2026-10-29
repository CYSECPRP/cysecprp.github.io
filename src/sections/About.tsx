import { useRef } from "react";
import {
  about,
  focusAreas,
  rank,
  site,
  type FocusVisual,
} from "../content/site";
import { gsap, MOTION_OK, useGSAP } from "../lib/gsap";
import Button from "../components/ui/Button";
import Counter from "../components/ui/Counter";
import Reveal from "../components/ui/Reveal";
import SectionLabel from "../components/ui/SectionLabel";
import SplitText from "../components/ui/SplitText";
import DitherCanvas from "../components/visuals/DitherCanvas";
import DotGlobe from "../components/visuals/DotGlobe";
import PacketBurst from "../components/visuals/PacketBurst";
import Ridges from "../components/visuals/Ridges";
import styles from "./About.module.css";

function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          element.querySelectorAll("[data-word]"),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              end: "bottom 52%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, index) => (
        <span key={index} data-word="">
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

function FocusCanvas({ visual }: { visual: FocusVisual }) {
  if (visual === "burst") return <PacketBurst />;
  if (visual === "ridges") return <Ridges />;
  return <DitherCanvas shape="servers" cell={3} />;
}

export default function About() {
  return (
    <>
      <div className={styles.intro}>
        <header className={styles.head}>
          <SectionLabel index="01" label="About" />
          <SplitText
            as="h2"
            id="about-title"
            text={about.heading}
            className={styles.title}
          />
        </header>

        <div className={styles.body}>
          <div className={styles.text}>
            <WordReveal text={about.lead} className={styles.lead} />
            {about.paragraphs.map((paragraph) => (
              <Reveal key={paragraph}>
                <p className={styles.paragraph}>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <aside className={styles.profile} aria-label="Profile">
              <span className={styles.plus} data-pos="tl" aria-hidden="true">
                +
              </span>
              <span className={styles.plus} data-pos="br" aria-hidden="true">
                +
              </span>
              <p className={styles.profileTitle}>Profile</p>
              <dl className={styles.facts}>
                {about.profile.map(({ term, value }) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.profileActions}>
                <Button to="/resume" variant="solid" icon="arrow-right">
                  View resume
                </Button>
                {site.resumePdf ? (
                  <Button
                    href={`${import.meta.env.BASE_URL}${site.resumePdf}`}
                    download
                    icon="download"
                  >
                    Download resume PDF
                  </Button>
                ) : (
                  <Button href={site.github} external icon="arrow-up-right">
                    GitHub profile
                  </Button>
                )}
              </div>
            </aside>
          </Reveal>
        </div>
      </div>

      <div className={styles.rank}>
        <div className={styles.rankText}>
          <p className={styles.rankLabel}>{rank.label}</p>
          <p className={styles.rankValue}>
            <Counter value={3} from={100} prefix="Top " suffix="%" scrub />
          </p>
          <p className={styles.rankCaption}>{rank.caption}</p>
          <dl className={styles.rankFacts}>
            {rank.facts.map((fact) => (
              <div key={fact.term}>
                <dt>{fact.term}</dt>
                <dd>{fact.value}</dd>
                <dd className={styles.rankMeta}>{fact.meta}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.rankBody}>{rank.text}</p>
        </div>
        <div className={styles.rankVisual}>
          <DotGlobe />
        </div>
      </div>

      <div className={styles.cards}>
        {focusAreas.map((area, index) => (
          <Reveal
            key={area.tag}
            className={[styles.card, index % 2 ? styles.flip : ""].join(" ")}
          >
            <article className={styles.cardInner}>
              <div className={styles.cardVisual}>
                <FocusCanvas visual={area.visual} />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardTag}>{area.tag}</p>
                <h3 className={styles.cardTitle}>{area.title}</h3>
                <p className={styles.cardText}>{area.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
