import { contact, site } from "../content/site";
import Icon from "../components/ui/Icon";
import SectionLabel from "../components/ui/SectionLabel";
import SplitText from "../components/ui/SplitText";
import DotGlobe from "../components/visuals/DotGlobe";
import ContactForm from "./ContactForm";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-title"
    >
      <div className={styles.globe} aria-hidden="true">
        <DotGlobe variant="ambient" />
      </div>

      <div className={styles.inner}>
        <SectionLabel index="04" label="Contact" />
        <SplitText
          as="h2"
          id="contact-title"
          text={contact.heading}
          className={styles.title}
        />
        <a
          className={styles.email}
          href={`mailto:${site.email}`}
          data-cursor-label="Write"
        >
          <span>{site.email}</span>
          <Icon name="arrow-up-right" className={styles.emailIcon} />
        </a>

        <div className={styles.grid}>
          <div className={styles.details}>
            <h3 className={styles.detailsTitle}>{contact.title}</h3>
            <p className={styles.detailsText}>{contact.text}</p>
            <ul className={styles.channels}>
              <li>
                <a href={`mailto:${site.email}`} className={styles.channel}>
                  <span className={styles.channelLabel}>Email</span>
                  <Icon name="mail" />
                  <span className={styles.channelValue}>{site.email}</span>
                  <Icon name="arrow-up-right" />
                </a>
              </li>
              <li>
                <div className={styles.channel}>
                  <span className={styles.channelLabel}>Base</span>
                  <Icon name="pin" />
                  <span className={styles.channelValue}>
                    {site.location.city}, {site.location.region}
                  </span>
                </div>
              </li>
            </ul>
            <div className={styles.socials}>
              <a
                href={site.github}
                className={styles.social}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" />
                <span>GitHub</span>
              </a>
              <a
                href={site.linkedin}
                className={styles.social}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="linkedin" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
