import ScrambleText from "./ScrambleText";
import styles from "./SectionLabel.module.css";

type Props = {
  index: string;
  label: string;
  total?: string;
  className?: string;
};

export default function SectionLabel({
  index,
  label,
  total = "04",
  className,
}: Props) {
  return (
    <p className={[styles.label, className].filter(Boolean).join(" ")}>
      <span className={styles.square} aria-hidden="true" />
      <ScrambleText text={`[ ${index} / ${total} ]`} trigger="view" />
      <span aria-hidden="true">·</span>
      <ScrambleText text={label} trigger="view" />
    </p>
  );
}
