import { credentials, education, experience } from "../content/site";
import Chip from "../components/ui/Chip";
import MagnifyText from "../components/ui/MagnifyText";
import Reveal from "../components/ui/Reveal";
import SplitText from "../components/ui/SplitText";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <div className={styles.experience}>
      <header className={styles.head}>
        <SplitText
          as="h3"
          text="Professional experience"
          className={styles.title}
        />
        <p className={styles.tag}>Path</p>
      </header>

      <ol className={styles.list}>
        {experience.map((job, index) => (
          <li key={job.company}>
            <Reveal className={styles.row}>
              <p className={styles.when}>
                <span className={styles.number}>#{index + 1}</span> ·{" "}
                {job.period}
              </p>
              <div className={styles.who}>
                <h4 className={styles.role}>
                  <MagnifyText text={job.role} strength={0.3} reach={1.6} />
                </h4>
                <p className={styles.company}>{job.company}</p>
                <p className={styles.meta}>{job.meta}</p>
              </div>
              <div className={styles.what}>
                <p>{job.summary}</p>
                <ul className={styles.tags}>
                  {job.tags.map((tag) => (
                    <li key={tag}>
                      <Chip>{tag}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className={styles.lower}>
        <div>
          <h4 className={styles.subhead}>Education</h4>
          <ul className={styles.entries}>
            {education.map((item) => (
              <li key={item.title} className={styles.entry}>
                <p className={styles.entryPeriod}>{item.period}</p>
                <p className={styles.entryTitle}>{item.title}</p>
                <p className={styles.entryOrg}>{item.org}</p>
                {item.note ? (
                  <p className={styles.entryNote}>{item.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={styles.subhead}>Certifications &amp; awards</h4>
          <ul className={styles.entries}>
            {credentials.map((item) => (
              <li key={item.title} className={styles.entry}>
                <p className={styles.entryPeriod}>{item.period}</p>
                <p className={styles.entryTitle}>{item.title}</p>
                <p className={styles.entryOrg}>{item.org}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
