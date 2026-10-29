import { projects } from "../content/projects";
import {
  education,
  experience,
  resumeAchievements,
  resumeSkills,
  resumeSummary,
  site,
} from "../content/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import Button from "../components/ui/Button";
import styles from "./ResumePage.module.css";

const RESUME_PROJECTS = [
  "deepguard",
  "network-security-analysis",
  "zt-dt",
  "web-security-scanner",
]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project) => project !== undefined);

export default function ResumePage() {
  useDocumentTitle(`Resume — ${site.name}`);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Button to="/" icon="arrow-left">
          Back to website
        </Button>
        <div className={styles.toolbarActions}>
          <Button onClick={() => window.print()} icon="print">
            Print
          </Button>
          {site.resumePdf ? (
            <Button
              href={`${import.meta.env.BASE_URL}${site.resumePdf}`}
              download
              variant="solid"
              icon="download"
            >
              Download PDF
            </Button>
          ) : null}
        </div>
      </div>

      <article className={styles.sheet}>
        <header className={styles.header}>
          <h1 className={styles.name}>{site.name}</h1>
          <p className={styles.role}>
            Cybersecurity student · Software Engineering Intern (Cloud &amp;
            Automation)
          </p>
          <ul className={styles.contacts}>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              {site.location.city}, {site.location.region}
            </li>
            <li>
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                {site.githubLabel}
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                {site.linkedinLabel}
              </a>
            </li>
          </ul>
        </header>

        <section className={styles.section}>
          <h2 className={styles.heading}>Profile</h2>
          <p>{resumeSummary}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Experience</h2>
          {experience.map((job) => (
            <div key={job.company} className={styles.entry}>
              <div className={styles.entryHead}>
                <h3>{job.role}</h3>
                <p>{job.period}</p>
              </div>
              <p className={styles.entryOrg}>
                {job.company} · {job.meta}
              </p>
              <ul className={styles.bullets}>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Education</h2>
          {education.map((item) => (
            <div key={item.title} className={styles.entry}>
              <div className={styles.entryHead}>
                <h3>{item.title}</h3>
                <p>{item.period}</p>
              </div>
              <p className={styles.entryOrg}>
                {item.org}
                {item.note ? ` · ${item.note}` : ""}
              </p>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Projects &amp; research</h2>
          {RESUME_PROJECTS.map((project) => (
            <div key={project.slug} className={styles.entry}>
              <div className={styles.entryHead}>
                <h3>{project.title}</h3>
                <p>{project.year}</p>
              </div>
              <p className={styles.entryOrg}>
                {project.stack
                  .flatMap((group) => group.items)
                  .slice(0, 5)
                  .join(" · ")}
              </p>
              <p>{project.summary}</p>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Technical skills</h2>
          <dl className={styles.skills}>
            {resumeSkills.map((group) => (
              <div key={group.title}>
                <dt>{group.title}</dt>
                <dd>{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Achievements &amp; certifications</h2>
          <ul className={styles.bullets}>
            {resumeAchievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
