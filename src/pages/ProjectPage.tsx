import { Link, useParams } from "react-router";
import { projects } from "../content/projects";
import { site } from "../content/site";
import { pad } from "../lib/format";
import { useTilt } from "../lib/interactions";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import Button from "../components/ui/Button";
import Chip from "../components/ui/Chip";
import Counter from "../components/ui/Counter";
import Icon from "../components/ui/Icon";
import MagnifyText from "../components/ui/MagnifyText";
import Reveal from "../components/ui/Reveal";
import SplitText from "../components/ui/SplitText";
import ProjectCover from "../components/visuals/ProjectCover";
import NotFound from "./NotFound";
import styles from "./ProjectPage.module.css";

export default function ProjectPage() {
  const { slug } = useParams();
  const index = projects.findIndex((project) => project.slug === slug);
  const project = index >= 0 ? projects[index] : undefined;
  useDocumentTitle(
    project ? `${project.title} — ${site.name}` : `Not found — ${site.name}`,
  );
  const tilt = useTilt(4);

  if (!project) return <NotFound />;

  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];
  const technologies = project.stack.reduce(
    (count, group) => count + group.items.length,
    0,
  );
  const stats = [
    { label: "Main features", value: project.features.length },
    { label: "Technical challenges", value: project.solutions.length },
    { label: "Technologies", value: technologies },
  ];

  return (
    <article className={styles.page}>
      <div className={styles.top}>
        <Link to="/projects" className={styles.back}>
          <Icon name="arrow-left" /> Back
        </Link>
        <p className={styles.mono}>
          Case study · {pad(index + 1)} / {pad(projects.length)}
        </p>
      </div>

      <header className={styles.head}>
        <SplitText
          key={project.slug}
          as="h1"
          text={project.title}
          className={styles.title}
          scroll={false}
        />
        <p className={styles.subtitle}>{project.subtitle}</p>
        <dl className={styles.meta}>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{project.type}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{project.languages}</dd>
          </div>
        </dl>
        <div className={styles.links}>
          {project.links.code ? (
            <Button
              href={project.links.code}
              external
              variant="solid"
              icon="arrow-up-right"
            >
              View code
            </Button>
          ) : null}
          {project.links.paper ? (
            <Button href={project.links.paper} external icon="arrow-up-right">
              Read the paper
            </Button>
          ) : null}
        </div>
      </header>

      <Reveal>
        <figure className={styles.figure}>
          <div ref={tilt}>
            <ProjectCover kind={project.cover} large />
          </div>
          <figcaption className={styles.caption}>
            <span>Fig. 01 — {project.short}</span>
            <span>Hover for color</span>
          </figcaption>
        </figure>
      </Reveal>

      <section className={styles.about} aria-labelledby="about-project">
        <p id="about-project" className={styles.mono}>
          About the project
        </p>
        <div className={styles.aboutText}>
          <p className={styles.summary}>{project.summary}</p>
          {project.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {project.credit ? (
            <p className={styles.credit}>{project.credit}</p>
          ) : null}
        </div>
      </section>

      <section className={styles.stats} aria-label="Key figures">
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <Counter value={stat.value} className={styles.statValue} />
            <p className={styles.mono}>{stat.label}</p>
          </div>
        ))}
        <div className={styles.stat}>
          <p className={styles.statValue}>{project.year.slice(0, 4)}</p>
          <p className={styles.mono}>Year</p>
        </div>
      </section>

      {project.metrics ? (
        <section className={styles.metrics} aria-label="Results">
          {project.metrics.map((metric) => (
            <div key={metric.label} className={styles.stat}>
              <Counter
                value={metric.value}
                decimals={metric.decimals}
                suffix={metric.suffix}
                className={`${styles.statValue} ${styles.accentValue}`}
              />
              <p className={styles.mono}>{metric.label}</p>
            </div>
          ))}
          {project.metricsNote ? (
            <p className={styles.note}>{project.metricsNote}</p>
          ) : null}
        </section>
      ) : null}

      <section className={styles.block} aria-labelledby="what-it-does">
        <header className={styles.blockHead}>
          <p className={styles.mono}>Main features</p>
          <h2 id="what-it-does" className={styles.blockTitle}>
            What it does
          </h2>
        </header>
        <ol className={styles.numbered}>
          {project.features.map((feature, featureIndex) => (
            <li key={feature}>
              <span>{pad(featureIndex + 1)}</span>
              {feature}
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.block} aria-labelledby="how-it-works">
        <header className={styles.blockHead}>
          <p className={styles.mono}>Technical challenges</p>
          <h2 id="how-it-works" className={styles.blockTitle}>
            How it was solved
          </h2>
        </header>
        <ol className={styles.numbered}>
          {project.solutions.map((solution, solutionIndex) => (
            <li key={solution}>
              <span>{pad(solutionIndex + 1)}</span>
              {solution}
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.block} aria-labelledby="stack">
        <header className={styles.blockHead}>
          <p className={styles.mono}>Technologies</p>
          <h2 id="stack" className={styles.blockTitle}>
            Stack
          </h2>
        </header>
        <div className={styles.stack}>
          {project.stack.map((group) => (
            <div key={group.group} className={styles.stackGroup}>
              <p className={styles.mono}>{group.group}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    <Chip>{item}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className={styles.tags}>
            {project.tags.map((tag) => `#${tag}`).join(" ")}
          </p>
        </div>
      </section>

      <Link
        to={`/projects/${next.slug}`}
        className={styles.next}
        data-cursor-label="Next"
      >
        <span className={styles.mono}>
          Next project · {pad(nextIndex + 1)} / {pad(projects.length)}
        </span>
        <span className={styles.nextTitle}>
          <MagnifyText text={next.title} strength={0.24} />
        </span>
        <span className={styles.nextCta}>
          Read the case study <Icon name="arrow-right" />
        </span>
      </Link>
    </article>
  );
}
