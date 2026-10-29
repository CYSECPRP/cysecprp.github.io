export type CoverKind =
  | "trust"
  | "govern"
  | "hud"
  | "scan"
  | "arp"
  | "packets"
  | "meter";

export type Metric = {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
};

export type Project = {
  slug: string;
  title: string;
  short: string;
  subtitle: string;
  year: string;
  status: string;
  type: string;
  languages: string;
  summary: string;
  about: string[];
  features: string[];
  solutions: string[];
  stack: { group: string; items: string[] }[];
  tags: string[];
  metrics?: Metric[];
  metricsNote?: string;
  credit?: string;
  links: { code?: string; paper?: string; demo?: string };
  cover: CoverKind;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "zt-dt",
    title: "ZT-DT — Zero-Trust Digital Twin",
    short: "ZT-DT",
    subtitle:
      "Real-time anomaly detection for industrial cyber-physical systems",
    year: "2025",
    status: "Research prototype",
    type: "Team research",
    languages: "Python",
    summary:
      "Team prototype of an IEEE-published Zero Trust framework that never trusts and always verifies: an Isolation Forest digital twin scores every sensor reading, an EMA trust engine turns anomalies into ALLOW, RESTRICT or ISOLATE decisions, and a Streamlit SOC dashboard shows it all live.",
    about: [
      "Industrial cyber-physical systems — water treatment plants, power grids, manufacturing lines — still lean on perimeter security that trusts anything already inside the network. ZT-DT replaces that assumption with continuous verification: a digital twin models normal plant behavior, every reading is scored against it, and an exponential-moving-average trust engine enforces adaptive access control in real time.",
      "Built by a five-member student team at TTEH Lab, Dayananda Sagar University, as the prototype implementation of the paper “Zero Trust-Enabled Digital Twins for Real-Time Anomaly Detection in Industrial Cyber-Physical Systems” (2025 Third International Conference on Networks, Multimedia and Information Technology — NMITCON, IEEE Xplore). It is validated on the SWaT and BATADAL water-system benchmarks from iTrust, SUTD.",
    ],
    features: [
      "Digital Twin core: an Isolation Forest ensemble (100 estimators) modelling normal CPS behavior",
      "Anomaly score from 0 to 1 for every streaming sensor reading, with no buffering",
      "Zero Trust policy engine with EMA-based trust scoring",
      "Adaptive enforcement: ALLOW, RESTRICT or ISOLATE from live trust levels",
      "Attack injector simulating scaling, sensor-spoofing and gradual-drift attacks",
      "Streamlit SOC dashboard with live trust, anomaly and flow-rate charts",
      "CPS topology view with per-node trust levels",
      "Color-coded audit log of every policy decision",
      "One-click attack injection and simulation controls",
    ],
    solutions: [
      "Isolation Forest isolates rare, statistically different readings without distance metrics — fast in high-dimensional sensor space",
      "An LSTM AutoEncoder adds a second detector for subtle, gradual manipulation",
      "EMA trust history separates sensor noise from sustained attacks: trust is slow to earn and quick to lose",
      "Thresholds calibrated with grid search and 5-fold cross-validation",
      "Evaluated on SWaT (~900K records, 51 sensors) and BATADAL (~500K records, 43 sensors)",
      "Light enough to run on edge hardware alongside the control loop",
    ],
    stack: [
      { group: "Core", items: ["Python", "scikit-learn", "TensorFlow"] },
      {
        group: "Models",
        items: ["Isolation Forest", "LSTM AutoEncoder", "EMA trust scoring"],
      },
      { group: "Interface", items: ["Streamlit", "Plotly"] },
      { group: "Data", items: ["SWaT", "BATADAL"] },
    ],
    tags: [
      "zero-trust",
      "digital-twin",
      "ics-security",
      "anomaly-detection",
      "machine-learning",
    ],
    metrics: [
      { label: "F1-score", value: 94.5, decimals: 1, suffix: "%" },
      { label: "False-positive rate", value: 2.8, decimals: 1, suffix: "%" },
      { label: "Response time", value: 1.7, decimals: 1, suffix: " s" },
      {
        label: "Gain vs rule-based IDS",
        value: 11.2,
        decimals: 1,
        suffix: "%",
      },
    ],
    metricsNote: "Benchmark figures as reported in the project repository.",
    credit:
      "Team: Prajwal R P, Sudeep Gowda, Darshan H, Shashanka N, Shivalingayya S Yadrami · Mentor: Dr. Prajwalasimha S N · TTEH Lab, Dayananda Sagar University",
    links: {
      code: "https://github.com/CYSECPRP/zt-dt-industrial-cps",
      paper: "https://doi.org/10.1109/NMITCON65824.2025.11188236",
    },
    cover: "trust",
    featured: true,
  },
  {
    slug: "governance-engine",
    title: "Automated Integration & Documentation Engine",
    short: "govflow",
    subtitle:
      "Governed IT automation with policy-as-code, approval gates and self-writing compliance docs",
    year: "2026",
    status: "Live · weekly runs",
    type: "Hackathon project · rebuilt",
    languages: "Python · YAML · Jinja",
    summary:
      "A governed IT automation workflow built from scratch: it integrates with GitHub and cloud configuration, checks everything against 17 policy-as-code rules, plans fixes behind a digest-bound approval gate, ships approved changes as pull requests and writes its own compliance documentation on top of a tamper-evident audit trail.",
    about: [
      "Compliance work usually splits into three disconnected jobs: someone scans, someone else fixes, and someone writes documentation for the auditors afterwards. govflow joins them into one governed pipeline. Each run collects resources, evaluates declarative YAML policies mapped to OpenSSF Scorecard and CIS benchmarks, plans remediation only for allowlisted actions and targets, and refuses to change anything until someone approves the SHA-256 digest of that exact plan.",
      "It is an open-source rebuild of the automated compliance scanning tool that placed 2nd Runner-up at the DSU Cybersecurity Hackathon, where I presented the design process to cross-functional evaluation teams. The rebuild runs every week in GitHub Actions against my own repositories, publishes a live evidence site and keeps its hash-chained audit trail on a dedicated branch.",
    ],
    features: [
      "Live GitHub integration: branch protection, security files, pinned actions and token permissions through the REST API",
      "AWS and GCP configuration checks from offline snapshot files",
      "17 policy-as-code checks in YAML, mapped to OpenSSF Scorecard and CIS benchmarks",
      "Remediation plans limited to allowlisted actions and targets",
      "Approvals bound to a SHA-256 digest of the exact plan",
      "Approved fixes shipped as pull requests, never as direct pushes",
      "Hash-chained, tamper-evident audit log with a verify command",
      "Generated evidence site, Markdown report and JSON for every run",
      "Weekly GitHub Actions run with a protected approval environment",
    ],
    solutions: [
      "A small declarative condition language is parsed, never evaluated, so policies are safe to load and easy to review",
      "Three-valued logic reports missing permissions as not assessed instead of guessing pass or fail",
      "Every audit event stores the SHA-256 of the previous one, so edits, deletions and reordering are detected",
      "Each run chains to the previous run's audit head on an evidence branch, with git history as a second record",
      "Recorded API fixtures drive the real HTTP client, so the offline demo exercises production code paths",
      "Least-privilege CI: SHA-pinned actions, per-job permissions and workflow inputs passed only through environment variables",
    ],
    stack: [
      { group: "Core", items: ["Python", "Typer", "Pydantic", "httpx"] },
      {
        group: "Automation",
        items: ["GitHub Actions", "GitHub REST API", "GitHub Pages"],
      },
      { group: "Documentation", items: ["Jinja", "Markdown", "JSON"] },
      { group: "Quality", items: ["pytest", "mypy", "ruff"] },
    ],
    tags: [
      "policy-as-code",
      "devsecops",
      "compliance-automation",
      "audit-trail",
      "github-actions",
    ],
    metrics: [
      { label: "Policy checks", value: 17 },
      { label: "Automated tests", value: 116 },
      { label: "Test coverage", value: 97, suffix: "%" },
    ],
    metricsNote: "Figures from the repository's policy catalog and test suite.",
    links: {
      code: "https://github.com/CYSECPRP/automated-integration-documentation-engine",
      demo: "https://cysecprp.github.io/automated-integration-documentation-engine/",
    },
    cover: "govern",
    featured: true,
  },
  {
    slug: "deepguard",
    title: "DeepGuard",
    short: "DeepGuard",
    subtitle: "AI-powered defense against deepfake identity fraud",
    year: "2024 — Present",
    status: "In progress",
    type: "Personal project",
    languages: "Python",
    summary:
      "Real-time AI security platform that fights deepfake-based identity fraud through live camera authenticity verification, behavioral analysis and intelligent risk detection — designed to analyze video and audio in under 2 seconds.",
    about: [
      "AI-generated impersonation has turned video calls and identity checks into an attack surface. DeepGuard is a real-time security platform built to catch it as it happens: it verifies the authenticity of a live camera feed, analyzes behavior throughout the session and raises an intelligent risk signal before fraud succeeds.",
      "Under the hood, computer-vision and machine-learning algorithms study facial movements, lip synchronization and AI-generation artifacts — a practical application of computer vision and machine learning to securing digital ecosystems.",
    ],
    features: [
      "Live camera authenticity verification",
      "Facial-movement analysis",
      "Lip-synchronization checks between audio and video",
      "Detection of AI-generation artifacts",
      "Behavioral analysis across the whole session",
      "Intelligent risk detection and alerting",
      "Video and audio analysis designed to run in under 2 seconds",
    ],
    solutions: [
      "Real-time frame processing with OpenCV",
      "TensorFlow machine-learning models for authenticity verification",
      "Several signals — motion, lip-sync and artifacts — instead of a single classifier",
      "Risk scoring built for live sessions rather than offline forensics",
    ],
    stack: [
      { group: "Core", items: ["Python"] },
      {
        group: "Vision & ML",
        items: ["OpenCV", "TensorFlow", "Machine Learning"],
      },
      {
        group: "Focus",
        items: ["Deepfake detection", "Identity-fraud prevention"],
      },
    ],
    tags: [
      "deepfake-detection",
      "computer-vision",
      "ai-security",
      "identity-fraud",
    ],
    links: { code: "https://github.com/CYSECPRP/deepguard-ai-defense" },
    cover: "hud",
    featured: true,
  },
  {
    slug: "web-security-scanner",
    title: "Web Application Security Scanner",
    short: "Web Security Scanner",
    subtitle: "OWASP-aligned vulnerability assessment from the command line",
    year: "2025",
    status: "Open source",
    type: "Personal project",
    languages: "Python · Shell",
    summary:
      "Automated web vulnerability scanner following the OWASP testing methodology — XSS, SQL injection, directory traversal, security-header and SSL/TLS checks — with severity-rated JSON and HTML reports.",
    about: [
      "A command-line assessment tool for authorized testing that walks a target through the OWASP Testing Guide v4 flow: information gathering, input-validation testing and error handling. It discovers forms, injects payloads parameter by parameter and analyzes every response with context-aware severity.",
      "Findings are classified as Critical, High, Medium or Low and exported as JSON or a styled HTML report with an executive summary and remediation guidance — built and exercised against intentionally vulnerable targets such as DVWA, WebGoat and testphp.vulnweb.com.",
    ],
    features: [
      "Reflected XSS detection with 8 payload types",
      "SQL injection detection across 10 database error patterns",
      "Directory traversal testing with 7 techniques",
      "Analysis of 7 critical security headers",
      "SSL/TLS (HTTPS) implementation check",
      "Information disclosure checks via robots.txt",
      "Multi-threaded scanning",
      "JSON and HTML reports with severity classification",
      "Remediation guidance for every finding",
      "Configurable scans: --no-forms, --no-headers, --no-robots",
    ],
    solutions: [
      "Follows OWASP Testing Guide v4: OTG-INFO, OTG-INPVAL and OTG-ERR",
      "Form discovery with BeautifulSoup, then payload injection per parameter",
      "Error-based, union-based and boolean-based SQL injection indicators",
      "Encoding bypass attempts for traversal payloads",
      "Severity breakdown and overall risk level computed for every scan",
      "Authorized-testing-only design with safe practice targets",
    ],
    stack: [
      { group: "Core", items: ["Python", "Shell"] },
      {
        group: "Libraries",
        items: ["requests", "BeautifulSoup4", "lxml", "urllib3"],
      },
      { group: "Method", items: ["OWASP Testing Guide v4"] },
    ],
    tags: ["owasp", "web-security", "vulnerability-scanner", "pentest-tooling"],
    links: {
      code: "https://github.com/CYSECPRP/Professional-Web-Application-Security-Scanner",
    },
    cover: "scan",
    featured: true,
  },
  {
    slug: "network-scanner",
    title: "Network Scanner",
    short: "Network Scanner",
    subtitle: "ARP host discovery and TCP SYN port scanning with Scapy",
    year: "2025",
    status: "Open source",
    type: "Personal project",
    languages: "Python",
    summary:
      "Command-line network scanner built with Scapy: ARP sweeps map IP-to-MAC addresses across a subnet, and TCP SYN scans reveal the open ports of a target host.",
    about: [
      "A lightweight reconnaissance tool for networks you own or are authorized to test. In ARP mode it broadcasts ARP requests to every address in a range and collects the replies to build an IP-to-MAC table of live devices. In TCP mode it sends SYN packets to chosen ports and records the SYN+ACK replies to find what is open.",
      "Built directly on raw packets with Scapy, it is a hands-on study of how host discovery and port scanning work at the protocol level.",
    ],
    features: [
      "ARP scan of a single IP or a whole CIDR range (e.g. 192.168.2.1/24)",
      "IP-to-MAC mapping of live hosts",
      "TCP SYN scan of individual ports",
      "Port-range scanning with --range low high",
      "Simple CLI with ARP and TCP sub-commands",
    ],
    solutions: [
      "Raw packet crafting and sniffing with Scapy",
      "ARP replies collected into a host table",
      "Half-open SYN scan: a SYN+ACK reply marks a port as open",
      "Runs with root privileges on UNIX for raw sockets",
    ],
    stack: [
      { group: "Core", items: ["Python", "Scapy", "argparse"] },
      { group: "Protocols", items: ["ARP", "TCP/IP"] },
    ],
    tags: ["recon", "network-scanning", "scapy", "tcp-ip"],
    links: { code: "https://github.com/CYSECPRP/Network-Scanner" },
    cover: "arp",
    featured: true,
  },
  {
    slug: "network-security-analysis",
    title: "Network Security & System Analysis",
    short: "Network Analysis",
    subtitle: "Hands-on traffic analysis and vulnerability research",
    year: "2024 — Present",
    status: "Ongoing",
    type: "Research",
    languages: "Wireshark · TCP/IP · Linux",
    summary:
      "Ongoing hands-on analysis of network traffic and system vulnerabilities using industry-standard networking tools — investigating complex software flaws to help design safer, more reliable application architectures.",
    about: [
      "A continuous research track alongside my degree: capturing and dissecting real traffic, mapping it to the TCP/IP and OSI models, and investigating the vulnerabilities and software flaws that surface along the way.",
      "The goal is practical: turn analytical findings into concrete recommendations for safer and more reliable application architectures.",
    ],
    features: [
      "Packet capture and protocol analysis with Wireshark",
      "Investigation of system vulnerabilities with industry-standard tools",
      "Analysis of complex software flaws",
      "Recommendations for safer application architectures",
    ],
    solutions: [
      "Protocol-level reading of TCP/IP and the OSI layers",
      "Linux-based analysis environment",
      "An evidence-driven, analytical approach to every flaw",
    ],
    stack: [
      { group: "Tools", items: ["Wireshark", "Nmap", "Linux"] },
      { group: "Protocols", items: ["TCP/IP", "OSI Model"] },
    ],
    tags: ["packet-analysis", "vulnerability-research", "network-security"],
    links: {},
    cover: "packets",
    featured: false,
  },
  {
    slug: "password-strength-meter",
    title: "Password Strength Meter",
    short: "Password Meter",
    subtitle: "Angular component with zxcvbn-based strength estimation",
    year: "2025",
    status: "Open source",
    type: "Study project",
    languages: "TypeScript · HTML · SCSS",
    summary:
      "Angular password-strength meter that uses Dropbox's zxcvbn estimator to score passwords from 0 to 4 and give live visual feedback, suggestions and warnings.",
    about: [
      "A study of realistic password-strength estimation in the browser. Instead of naive character-class rules, it relies on zxcvbn — Dropbox's estimator inspired by password crackers, which checks input against dictionaries of common words, names and passwords.",
      "The component takes a password and emits a 0–4 strength score, with a configurable minimum length, meter colors and optional feedback messages. It is based on the open-source angular-password-strength-meter library.",
    ],
    features: [
      "Real-time strength score from 0 to 4",
      "Visual meter with configurable colors",
      "Optional suggestions and warning messages",
      "Configurable minimum password length (default 8)",
      "strengthChange output event for parent components",
    ],
    solutions: [
      "Strength estimated with zxcvbn instead of simple regex rules",
      "Dictionary-aware scoring against common passwords, names and words",
      "Packaged as a reusable Angular module and component",
    ],
    stack: [
      { group: "Front-end", items: ["Angular", "TypeScript", "SCSS"] },
      { group: "Library", items: ["zxcvbn"] },
    ],
    tags: ["angular", "password-security", "zxcvbn"],
    links: {
      code: "https://github.com/CYSECPRP/password-strength-meter-angular",
    },
    cover: "meter",
    featured: false,
  },
];
