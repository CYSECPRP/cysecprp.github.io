import { dismissToast, useToasts } from "../../lib/toast";
import Icon from "../ui/Icon";
import styles from "./Toaster.module.css";

export default function Toaster() {
  const toasts = useToasts();

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={styles.toast}>
          <p className={styles.title}>
            <Icon name="flag" />
            {toast.title}
          </p>
          {toast.body ? <p className={styles.body}>{toast.body}</p> : null}
          <button
            type="button"
            className={styles.dismiss}
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss"
          >
            <Icon name="close" />
          </button>
        </div>
      ))}
    </div>
  );
}
