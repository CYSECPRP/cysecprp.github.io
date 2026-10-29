import { captureFlag, useFlags, type FlagId } from "../../lib/flags";
import Icon from "./Icon";
import styles from "./FlagButton.module.css";

export default function FlagButton({
  id,
  className,
}: {
  id: FlagId;
  className?: string;
}) {
  const captured = useFlags().includes(id);

  return (
    <button
      type="button"
      className={[styles.flag, className].filter(Boolean).join(" ")}
      data-captured={captured ? "true" : "false"}
      aria-label={captured ? "Flag captured" : "Hidden flag"}
      onClick={() => captureFlag(id)}
    >
      <Icon name="flag" />
    </button>
  );
}
