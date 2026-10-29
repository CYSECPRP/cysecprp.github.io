import { useRef } from "react";
import { Link } from "react-router";
import { projects, type Project } from "../content/projects";
import { pad } from "../lib/format";
import { gsap, useGSAP } from "../lib/gsap";
import { useTilt } from "../lib/interactions";
import Button from "../components/ui/Button";
import Chip from "../components/ui/Chip";
import Icon from "../components/ui/Icon";
import MagnifyText from "../components/ui/MagnifyText";
import SectionLabel from "../components/ui/SectionLabel";
import SplitText from "../components/ui/SplitText";
import ProjectCover from "../components/visuals/ProjectCover";
import styles from "./Projects.module.css";

const FEATURED = projects.filter((project) => project.featured);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tilt = useTilt();
  const technologies = project.stack
    .flatMap((group) => group.items)
    .slice(0, 5);

  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        <span>
          {pad(index + 1)} / {pad(FEATURED.length)}
        </span>
        <span>
          {project.type} · {project.year}
        </span>
      </header>
      <Link
        ref={tilt}
        to={`/projects/${project.slug}`}
        className={styles.coverLink}
        aria-label={`View details — ${project.title}`}
        data-cursor-label="View"
      >
        <ProjectCover kind={project.cover} />
      </Link>
      <h3 className={styles.cardTitle}>
        <MagnifyText text={project.title} strength={0.3} reach={1.6} />
      </h3>
      <p className={styles.cardText}>{project.summary}</p>
      <div className={styles.tech}>
        <h4 className="sr-only">Technologies</h4>
        <ul>
          {technologies.map((technology) => (
            <li key={technology}>
              <Chip>{technology}</Chip>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.cardActions}>
        <Button to={`/projects/${project.slug}`} variant="solid">
          View details
        </Button>
        {project.links.code ? (
          <Button href={project.links.code} external icon="arrow-up-right">
            View code
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sectionElement = section.current;
      const viewportElement = viewport.current;
      const trackElement = track.current;
      if (!sectionElement || !viewportElement || !trackElement) return;

      gsap
        .matchMedia()
        .add(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          () => {
            const distance = () =>
              Math.max(
                0,
                trackElement.scrollWidth - viewportElement.clientWidth,
              );
            gsap.to(trackElement, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: sectionElement,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
          },
        );
    },
    { scope: section },
  );

  return (
    <section
      id="projects"
      ref={section}
      className={styles.projects}
      aria-labelledby="projects-title"
    >
      <div className={styles.intro}>
        <SectionLabel index="02" label="Work" />
        <SplitText
          as="h2"
          id="projects-title"
          text={["Selected", "projects"]}
          className={styles.title}
        />
        <p className={styles.text}>
          Security tooling, research prototypes and AI defenses — designed,
          built and tested end to end.
        </p>
        <p className={styles.hint}>
          Scroll <Icon name="arrow-right" />
        </p>
      </div>

      <div ref={viewport} className={styles.viewport}>
        <div ref={track} className={styles.track}>
          {FEATURED.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
          <Link to="/projects" className={styles.all}>
            <span className={styles.allLabel}>
              All projects · {pad(projects.length)}
            </span>
            <span className={styles.allTitle}>
              <MagnifyText text="View all projects" strength={0.3} />
            </span>
            <Icon name="arrow-right" className={styles.allIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
}
