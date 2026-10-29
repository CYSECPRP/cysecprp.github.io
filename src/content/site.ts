export const site = {
  name: "Prajwal R Pattanshetti",
  shortName: "Prajwal R P",
  firstName: "Prajwal",
  monogram: "PRP",
  handle: "CySecPrp",
  url: "https://cysecprp.github.io",
  description:
    "Portfolio of Prajwal R Pattanshetti, cybersecurity student and software engineering intern at General Motors: network security, cloud automation on AWS and GCP, and AI-driven threat detection.",
  email: "prajwalrajupattanshetti@gmail.com",
  github: "https://github.com/cysecprp",
  githubLabel: "github.com/cysecprp",
  linkedin: "https://www.linkedin.com/in/prajwal-r-p2005",
  linkedinLabel: "linkedin.com/in/prajwal-r-p2005",
  // Path (inside /public) of a phone-free resume PDF. Leave null to hide the download button.
  resumePdf: null as string | null,
  location: {
    city: "Bengaluru",
    region: "Karnataka, India",
    short: "Bengaluru, IN",
    coords: "12.97°N · 77.59°E",
    lat: 12.97,
    lon: 77.59,
    timeZone: "Asia/Kolkata",
    tzLabel: "IST",
  },
  tagline: "Security, automation and AI protecting real-world systems.",
};

export const projectsIntro =
  "Research prototypes, security tools and experiments — each with a short case study of what it does and how it was built.";

export const hero = {
  status: "Open to security roles & collaborations",
  label: "Open to security roles",
  headline: ["Securing systems", "from packet", "to cloud"],
  lead: "Cybersecurity engineering student and software engineering intern at General Motors. I build Python security tooling, analyze network traffic and automate cloud configuration checks — from packet capture to AWS and GCP.",
  role: ["Cybersecurity student · SWE intern", "Network • Cloud • AI security"],
  footer: "Cybersecurity & software engineering — 2026",
};

export const marqueeWords = ["Detect", "Analyze", "Defend"];

export const bootLines = [
  "init secure shell",
  "load typefaces",
  "compile dither shader",
  "verify tls handshake",
  "ready",
];

export const about = {
  heading: "From packets to protection",
  lead: "Computer Science and Engineering student specializing in network security, software engineering and system automation. I currently work as a Software Engineering Intern (Cloud & Automation) at General Motors, building Python automation for cloud networks and helping keep operations running smoothly.",
  paragraphs: [
    "I am highly proficient in Python and SQL, with hands-on experience building backend tools, analyzing network traffic and ensuring cloud infrastructure reliability. Day to day I work with Python, PostgreSQL, Linux, AWS and GCP, and I practice offensive and defensive security with Wireshark, Nmap and Burp Suite.",
    "Ranked in the top 3% globally on TryHackMe, I am drawn to network security, AI-driven threat detection, cloud-native networking and secure system design — and eager to bring a solid foundation in networking protocols and software development to innovative telecommunication and connectivity systems.",
  ],
  profile: [
    { term: "Based in", value: "Bengaluru, IN" },
    { term: "Role", value: "SWE Intern · Cloud & Automation" },
    { term: "At", value: "General Motors" },
    { term: "Study", value: "B.Tech CSE (Cyber Security)" },
    { term: "University", value: "Dayananda Sagar University" },
    { term: "CGPA", value: "8.04" },
    { term: "Focus", value: "Network • Cloud • AI security" },
  ],
};

export const rank = {
  label: "[ Rank ] · Bengaluru → Worldwide",
  caption: "Ranked in the top 3% of TryHackMe players worldwide.",
  facts: [
    { term: "Base", value: "Bengaluru, IN", meta: "12.97°N · 77.59°E" },
    { term: "Rank", value: "TryHackMe", meta: "Top 3% globally" },
  ],
  text: "Based in India's tech capital and training against a worldwide leaderboard: every room solved sharpens system analysis, network diagnostics and threat detection.",
};

export type FocusVisual = "burst" | "ridges" | "servers";

export const focusAreas: {
  tag: string;
  title: string;
  text: string;
  visual: FocusVisual;
}[] = [
  {
    tag: "#01 · NET",
    title: "Network security & traffic analysis",
    text: "Hands-on packet analysis and vulnerability investigation with Wireshark, Nmap and Linux — TCP/IP and the OSI model put to work on real traffic.",
    visual: "burst",
  },
  {
    tag: "#02 · AI",
    title: "AI-driven threat detection",
    text: "Machine-learning defenses, from DeepGuard's real-time deepfake detection to Isolation Forest anomaly scoring for industrial control systems.",
    visual: "ridges",
  },
  {
    tag: "#03 · CLOUD",
    title: "Cloud automation & reliability",
    text: "Python automation that runs configuration checks across AWS and GCP, plus alert monitoring and root-cause analysis that keep operations running smoothly.",
    visual: "servers",
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    title: "Languages & Core CS",
    items: [
      "Python (Advanced)",
      "SQL (PostgreSQL)",
      "Bash",
      "Data Structures",
      "Scripting",
      "Automation",
    ],
  },
  {
    title: "Networking & Telecom",
    items: [
      "TCP/IP",
      "OSI Model",
      "Network Security",
      "Packet Analysis",
      "Firewalls",
      "Cloud-Native Networks",
    ],
  },
  {
    title: "Security Tooling",
    items: ["Wireshark", "Nmap", "Burp Suite", "Scapy", "Kali Linux"],
  },
  {
    title: "Cloud & Systems",
    items: [
      "AWS",
      "GCP",
      "Linux/Unix Administration",
      "System Architecture",
      "Distributed Systems",
      "Git",
    ],
  },
  {
    title: "AI & Data",
    items: [
      "TensorFlow",
      "OpenCV",
      "scikit-learn",
      "Machine Learning",
      "Isolation Forest",
      "LSTM AutoEncoders",
      "Streamlit",
    ],
  },
  {
    title: "Security Practice",
    items: [
      "OWASP Testing",
      "Vulnerability Assessment",
      "Threat Detection",
      "Anomaly Detection",
      "Zero Trust",
      "Security Automation",
    ],
  },
];

// The four groups exactly as they appear on the PDF resume.
export const resumeSkills: SkillGroup[] = [
  {
    title: "Languages & Core CS",
    items: [
      "Python (Advanced)",
      "SQL (PostgreSQL)",
      "Data Structures",
      "Scripting",
      "Automation",
    ],
  },
  {
    title: "Networking & Telecom",
    items: [
      "TCP/IP",
      "OSI Model",
      "Network Security",
      "Packet Analysis",
      "Firewalls",
      "Cloud-Native Networks",
    ],
  },
  {
    title: "Software & AI",
    items: [
      "System Architecture",
      "Distributed Systems",
      "AWS",
      "GCP",
      "TensorFlow",
      "OpenCV",
    ],
  },
  {
    title: "Tools & OS",
    items: [
      "Wireshark",
      "Nmap",
      "Burp Suite",
      "Linux/Unix Administration",
      "Git",
    ],
  },
];

export const expertise = [
  "Network Security & Packet Analysis",
  "Threat & Anomaly Detection",
  "Web Application Security (OWASP)",
  "Cloud Automation — AWS & GCP",
  "Machine Learning for Security",
  "Secure System Architecture",
  "Security Tool Development",
];

export type Job = {
  period: string;
  role: string;
  company: string;
  meta: string;
  summary: string;
  bullets: string[];
  tags: string[];
};

export const experience: Job[] = [
  {
    period: "Jul. 2026 — Present",
    role: "Software Engineering Intern",
    company: "General Motors",
    meta: "Cloud & Automation · Bengaluru, India",
    summary:
      "Developing Python scripts for cloud networks that automate configuration checks across AWS and GCP environments. Supporting the monitoring of system alerts and helping identify the root cause of network issues to keep operations running smoothly, while maintaining technical documentation alongside senior engineers.",
    bullets: [
      "Assisted in developing Python scripts for cloud networks, automating configuration checks across AWS and GCP environments.",
      "Supported the monitoring of system alerts and helped identify the root cause of network issues to keep operations running smoothly.",
      "Worked closely with senior team members to maintain technical documentation and observed system planning exercises.",
    ],
    tags: [
      "Python automation",
      "AWS & GCP config checks",
      "Alert monitoring",
      "Root-cause analysis",
      "Technical documentation",
    ],
  },
  {
    period: "Aug. — Dec. 2024",
    role: "Data & Operations Intern",
    company: "Qtrans Language Solution",
    meta: "SQL / Systems · Remote, India",
    summary:
      "Improved database queries to speed up the processing of large-scale system logs and security alerts, and contributed to system architecture documents — applying problem-solving skills to technical software challenges.",
    bullets: [
      "Improved database queries to speed up the processing of large-scale system logs and security alerts.",
      "Contributed to system architecture documents, applying problem-solving skills to assist with technical software challenges.",
    ],
    tags: [
      "SQL optimization",
      "Log processing",
      "Security alerts",
      "Architecture docs",
    ],
  },
];

export type Credential = {
  period: string;
  title: string;
  org: string;
  note?: string;
};

export const education: Credential[] = [
  {
    period: "2023 — 2027",
    title: "B.Tech in Computer Science & Engineering (Cyber Security)",
    org: "Dayananda Sagar University, Bengaluru",
    note: "CGPA 8.04 · graduating July 2027",
  },
];

export const credentials: Credential[] = [
  {
    period: "Certification",
    title: "Microsoft Professional Cybersecurity Certificate",
    org: "Microsoft",
  },
  {
    period: "Global rank",
    title: "TryHackMe — Top 3% globally",
    org: "System analysis, network diagnostics & threat detection",
  },
  {
    period: "Hackathon",
    title: "2nd Runner-up — DSU Cybersecurity Hackathon",
    org: "Automated compliance tool, rebuilt open source as govflow",
  },
];

export const resumeSummary =
  "Computer Science and Engineering student with an 8.04 CGPA, specializing in Network Security, Software Engineering, and System Automation. Highly proficient in Python and SQL, with hands-on experience building backend tools, analyzing network traffic, and ensuring cloud infrastructure reliability. Ranked in the Top 3% Globally on TryHackMe, demonstrating strong analytical and problem-solving skills. Eager to leverage a solid foundation in networking protocols and software development to contribute to innovative telecommunication and connectivity systems.";

export const resumeAchievements = [
  "Global Rank (TryHackMe): Top 3% globally in technical challenges, validating practical skills in system analysis, network diagnostics and threat detection.",
  "Hackathon: 2nd Runner-up at the DSU Cybersecurity Hackathon for an automated compliance scanning tool, presented to cross-functional evaluation teams and since rebuilt as an open-source governance engine.",
  "Certification: Microsoft Professional Cybersecurity Certificate.",
];

export const impact = [
  "Top 3% globally on TryHackMe — practical skill in system analysis, network diagnostics and threat detection",
  "2nd Runner-up at the DSU Cybersecurity Hackathon — the compliance tool now runs weekly as an open-source governance engine",
  "Configuration checks automated across AWS and GCP environments at General Motors",
  "Faster processing of large-scale system logs and security alerts through optimized SQL queries",
  "Team prototype of an IEEE-published Zero-Trust Digital Twin for industrial control systems",
  "DeepGuard — real-time deepfake detection designed to analyze video and audio in under 2 seconds",
];

export const lab = {
  heading: "Hack. Learn. Defend.",
  sub: "04 training grounds · 01 live terminal",
  items: [
    { name: "TryHackMe", tag: "Top 3% global", command: "achievements" },
    { name: "OverTheWire", tag: "Bandit wargame", command: "lab" },
    { name: "DSU Hackathon", tag: "2nd runner-up", command: "achievements" },
    { name: "Home lab", tag: "Kali · Ubuntu · Windows", command: "lab" },
  ],
};

export const contact = {
  heading: "Let's secure it together",
  title: "Let's stay in touch",
  text: "I'm open to security internships, research collaborations and graduate roles. Feel free to reach out!",
};

export const footer = {
  line: "Cybersecurity & software engineering — Bengaluru, India.",
  text: "I build security tooling, automate cloud checks and apply machine learning to catch threats early.",
};
