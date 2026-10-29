import type { ComponentType } from "react";
import type { CoverKind } from "../../content/projects";
import styles from "./ProjectCover.module.css";

const CHROME: Record<CoverKind, { title: string; state: string }> = {
  trust: { title: "zt-dt · zero trust engine", state: "live" },
  govern: { title: "govflow · governance run", state: "audited" },
  hud: { title: "deepguard · session scan", state: "scanning" },
  scan: { title: "web_security_scanner.py", state: "owasp" },
  arp: { title: "scanner.py · sample output", state: "scapy" },
  packets: { title: "capture · eth0", state: "tcp/ip" },
  meter: { title: "password-strength-meter", state: "zxcvbn" },
};

const TRUST = [1, 0.81, 0.65, 0.52, 0.42];
const POLICY = ["allow", "allow", "restrict", "restrict", "isolate"];

function TrustBody() {
  return (
    <div className={styles.split}>
      <div className={styles.bars}>
        {TRUST.map((value, index) => (
          <div key={index} className={styles.barColumn}>
            <span>{value.toFixed(2)}</span>
            <span
              className={styles.bar}
              data-tone={POLICY[index]}
              style={{ height: `${value * 72}%` }}
            />
            <span>t{index}</span>
          </div>
        ))}
      </div>
      <div className={styles.log}>
        <p className={styles.dim}>status · anomaly · trust · action</p>
        <p>
          normal 0.12 0.9500 <b data-tone="allow">ALLOW</b>
        </p>
        <p>
          normal 0.08 0.9600 <b data-tone="allow">ALLOW</b>
        </p>
        <p>
          attack 0.87 0.3400 <b data-tone="restrict">RESTRICT</b>
        </p>
        <p>
          attack 1.00 0.4200 <b data-tone="isolate">ISOLATE</b>
        </p>
        <p className={styles.formula}>
          trust(t) = α·trust(t−1) + (1−α)·(1 − anomaly)
        </p>
      </div>
    </div>
  );
}

const LANDMARKS: [number, number][] = [
  [38, 54],
  [52, 54],
  [68, 54],
  [82, 54],
  [45, 62],
  [75, 62],
  [60, 78],
  [52, 86],
  [68, 86],
  [46, 98],
  [60, 103],
  [74, 98],
  [30, 72],
  [90, 72],
  [36, 100],
  [84, 100],
  [60, 120],
  [60, 30],
];

function HudBody() {
  return (
    <div className={styles.split}>
      <div className={styles.face}>
        <svg viewBox="0 0 120 140" className={styles.faceSvg}>
          <ellipse cx="60" cy="72" rx="38" ry="52" />
          <path d="M38 56h14M68 56h14M60 64v18l-6 4M46 98q14 10 28 0" />
          {LANDMARKS.map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              x={x - 1.5}
              y={y - 1.5}
              width="3"
              height="3"
              className={styles.landmark}
            />
          ))}
        </svg>
        <span className={styles.bracket} data-corner="tl" />
        <span className={styles.bracket} data-corner="tr" />
        <span className={styles.bracket} data-corner="bl" />
        <span className={styles.bracket} data-corner="br" />
        <span className={styles.sweep} />
      </div>
      <ul className={styles.checks}>
        {["liveness", "lip-sync", "artifacts", "behavior"].map(
          (label, index) => (
            <li key={label}>
              <span>{label}</span>
              <span className={styles.meter}>
                <span style={{ animationDelay: `${index * -0.7}s` }} />
              </span>
            </li>
          ),
        )}
        <li className={styles.verdict}>
          <span>video + audio</span>
          <b data-tone="allow">&lt; 2 s</b>
        </li>
      </ul>
    </div>
  );
}

function GovernBody() {
  return (
    <div className={styles.log}>
      <p className={styles.prompt}>$ govflow scan --config govflow.yaml</p>
      <p className={styles.dim}>12 resources · 17 policies · pass 15 · fail 22</p>
      <p>
        plan 6 actions · <b data-tone="allow">3 allowed</b> ·{" "}
        <b data-tone="restrict">3 blocked</b> · digest 2af816aa
      </p>
      <p className={styles.prompt}>$ govflow apply --execute</p>
      <p>
        <b data-tone="isolate">refused</b> no approval for this plan digest
      </p>
      <p className={styles.prompt}>$ govflow approve --digest 2af816aa</p>
      <p>
        <b data-tone="allow">approved</b> · apply opened 3 pull requests
      </p>
      <p className={styles.rule}>
        audit chain verified · 15 events · head af8a5f52
      </p>
    </div>
  );
}

function ScanBody() {
  return (
    <div className={styles.log}>
      <p className={styles.prompt}>
        $ python3 web_security_scanner.py -v --format html
        https://demo.testfire.net/
      </p>
      <p>[10:30:15] starting comprehensive security scan</p>
      <p>[10:30:16] analyzing security headers</p>
      <p>
        [10:30:16] <b data-tone="restrict">✗</b> Content-Security-Policy:
        missing
      </p>
      <p>
        [10:30:16] <b data-tone="restrict">✗</b> X-Frame-Options: missing
      </p>
      <p>[10:30:17] found 3 forms</p>
      <p>
        [10:30:18] <b data-tone="isolate">✗</b> XSS vulnerability in form at
        /search
      </p>
      <p className={styles.rule}>scan results — total 5 · risk HIGH</p>
      <p>
        critical 0 · high <b data-tone="isolate">2</b> · medium{" "}
        <b data-tone="restrict">2</b> · low 1
      </p>
    </div>
  );
}

const HOSTS = [
  ["192.168.2.1", "02:42:ac:11:00:01"],
  ["192.168.2.14", "02:42:ac:11:00:0e"],
  ["192.168.2.37", "02:42:ac:11:00:25"],
  ["192.168.2.52", "02:42:ac:11:00:34"],
];

function ArpBody() {
  return (
    <div className={styles.log}>
      <p className={styles.prompt}>
        $ sudo python3 scanner.py ARP 192.168.2.1/24
      </p>
      <p className={styles.dim}>ip address mac address</p>
      {HOSTS.map(([ip, mac]) => (
        <p key={ip}>
          {ip.padEnd(18, " ")}
          {mac}
        </p>
      ))}
      <p className={styles.prompt}>
        $ sudo python3 scanner.py TCP 192.168.2.1 --range 0 1000
      </p>
      <p>
        22/tcp <b data-tone="allow">open</b> · 80/tcp{" "}
        <b data-tone="allow">open</b> · 443/tcp <b data-tone="allow">open</b>
      </p>
    </div>
  );
}

const PACKETS = [
  ["1", "0.000", "192.0.2.10", "198.51.100.7", "TCP", "51544 → 443 [SYN]"],
  ["2", "0.021", "198.51.100.7", "192.0.2.10", "TCP", "443 → 51544 [SYN, ACK]"],
  ["3", "0.021", "192.0.2.10", "198.51.100.7", "TCP", "51544 → 443 [ACK]"],
  ["4", "0.024", "192.0.2.10", "198.51.100.7", "TLSv1.3", "Client Hello"],
  ["5", "0.049", "198.51.100.7", "192.0.2.10", "TLSv1.3", "Server Hello"],
  ["6", "0.112", "192.0.2.10", "203.0.113.53", "DNS", "Standard query A"],
];

function PacketsBody() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>no.</th>
          <th>time</th>
          <th>source</th>
          <th>destination</th>
          <th>proto</th>
          <th>info</th>
        </tr>
      </thead>
      <tbody>
        {PACKETS.map((row) => (
          <tr key={row[0]} data-tone={row[4] === "TCP" ? undefined : "allow"}>
            {row.map((cell, index) => (
              <td key={index}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MeterBody() {
  return (
    <div className={styles.passwordBox}>
      <p className={styles.dim}>password</p>
      <p className={styles.field}>●●●●●●●●●●●●●●</p>
      <div className={styles.segments}>
        {[0, 1, 2, 3, 4].map((segment) => (
          <span key={segment} data-on={segment < 4 ? "true" : "false"} />
        ))}
      </div>
      <p>
        strength <b data-tone="allow">4 / 4</b> · very strong
      </p>
      <p className={styles.dim}>
        ✓ not a common password · ✓ no keyboard patterns · ✓ long passphrase
      </p>
    </div>
  );
}

const BODIES: Record<CoverKind, ComponentType> = {
  trust: TrustBody,
  govern: GovernBody,
  hud: HudBody,
  scan: ScanBody,
  arp: ArpBody,
  packets: PacketsBody,
  meter: MeterBody,
};

export default function ProjectCover({
  kind,
  large = false,
}: {
  kind: CoverKind;
  large?: boolean;
}) {
  const Body = BODIES[kind];
  return (
    <div
      className={[styles.cover, large ? styles.large : ""].join(" ")}
      aria-hidden="true"
    >
      <div className={styles.chrome}>
        <span className={styles.lights}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.title}>{CHROME[kind].title}</span>
        <span className={styles.state}>{CHROME[kind].state}</span>
      </div>
      <div className={styles.body}>
        <Body />
      </div>
      <span className={styles.scan} />
    </div>
  );
}
