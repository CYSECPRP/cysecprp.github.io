import { Link } from "react-router";
import { projects } from "../content/projects";
import { site } from "../content/site";
import { pad } from "../lib/format";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import Icon from "../components/ui/Icon";
import MagnifyText from "../components/ui/MagnifyText";
import SplitText from "../components/ui/SplitText";
import styles from "./ProjectsPage.module.css";

export default function ProjectsPage() {
  useDocumentTitle(`Projects — ${site.name}`);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={styles.label}>
          <span className={styles.square} aria-hidden="true" />[ All projects ]
          · {pad(projects.length)}
        </p>
        <SplitText
          as="h1"
          text={["Every project,", "end to end"]}
          className={styles.title}
          scroll={false}
        />
        <p className={styles.text}>
          Research prototypes, security tools and experiments — each with a
          short case study of what it does and how it was built.
        </p>
      </header>

      <ol className={styles.list}>
        {projects.map((project, index) => (
          <li key={project.slug}>
            <Link
              to={`/projects/${project.slug}`}
              className={styles.row}
              data-cursor-label="View"
            >
              <span className={styles.index}>{pad(index + 1)}</span>
              <span className={styles.name}>
                <MagnifyText text={project.title} strength={0.3} reach={1.6} />
              </span>
              <span className={styles.meta}>
                {project.type} · {project.year}
              </span>
              <span className={styles.tags}>
                {project.tags
                  .slice(0, 3)
                  .map((tag) => `#${tag}`)
                  .join(" ")}
              </span>
              <Icon name="arrow-right" className={styles.arrow} />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
