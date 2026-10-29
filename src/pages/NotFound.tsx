import { useLocation } from "react-router";
import { site } from "../content/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import Button from "../components/ui/Button";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const { pathname } = useLocation();
  useDocumentTitle(`404 — ${site.name}`);

  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <p className={styles.label}>Error · 404</p>
      <h1 id="not-found-title" className={styles.title}>
        Route not found
      </h1>
      <pre className={styles.log}>
        {`> GET ${pathname}\n> 404 — no such route on this host\n> suggestion: return to base`}
      </pre>
      <Button to="/" variant="solid" icon="arrow-right">
        Back to home
      </Button>
    </section>
  );
}
