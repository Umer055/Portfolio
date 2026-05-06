/* ─── SHARED DATA STORE ─── */
/* All editable content lives here, persisted to localStorage */

const DEFAULT_POSTS = [
  { id: 'post-001', title: 'BlackHat MEA 2025 — Riyadh Onsite Finals', category: 'ctf', date: 'Dec 2025', image: '',
    excerpt: 'How we qualified and competed at BlackHat MEA onsite finals in Riyadh against international teams.',
    content: `## Overview\n\nBlackHat MEA is one of the largest cybersecurity events in the Middle East & Africa. Making it to the **top 50** and competing onsite in Riyadh was a major milestone.\n\n## Qualification\n\nThe online qualification featured challenges across multiple categories. Our team focused on **Reverse Engineering** and **Forensics**.\n\nKey techniques:\n- Static binary analysis with \`Ghidra\`\n- Memory forensics using \`Volatility\`\n- Network PCAP analysis with \`Wireshark\`\n\n## Onsite in Riyadh\n\nCompeting against professional red teams and researchers from around the world. Challenges were significantly harder than university CTFs — some required days of analysis.\n\n## Key Takeaway\n\nInternational CTF exposure is irreplaceable. **Compete to learn, not just to win.**` },
  { id: 'post-002', title: 'Building SkyCheck — Multi-Cloud GRC Automation', category: 'grc', date: 'Jan 2026', image: '',
    excerpt: 'Architecture decisions and lessons learned building a cloud compliance tool for AWS, Azure and GCP.',
    content: `## Why SkyCheck?\n\nManual cloud compliance audits are slow and expensive. SkyCheck is a locally deployable alternative for developers who want compliance clarity without vendor overhead.\n\n## Architecture\n\nModular checker design:\n- **Collector** — boto3 (AWS), azure-mgmt (Azure), google-cloud (GCP)\n- **Mapping engine** — maps findings to ISO 27001 / NIST controls\n- **Scoring model** — severity × exposure × exploitability\n- **Report generator** — JSON, CSV, HTML output\n\n## Framework Mapping Challenges\n\nMost cloud misconfigs don't map to a single control. An unencrypted S3 bucket touches \`ISO 27001 A.10.1\`, \`A.12.4\`, and \`A.18.1\` simultaneously.\n\nSolved this with a **many-to-many control tag system**.` },
  { id: 'post-003', title: 'Malware Analysis: Dissecting a Dropper Sample', category: 'malware', date: 'Nov 2024', image: '',
    excerpt: 'Step-by-step static and dynamic analysis of a malware dropper — IOCs, persistence, and C2 patterns.',
    content: `## Sample Overview\n\nAnalyzed a PE executable suspected of being a dropper. Submitted to a controlled sandbox before any dynamic analysis.\n\n## Static Analysis\n\n\`strings sample.exe | grep -i http\` revealed hardcoded C2 URLs.\n\nImport table in **Ghidra** showed:\n- \`CreateRemoteThread\` — process injection\n- \`VirtualAllocEx\` — remote memory allocation\n- \`WriteProcessMemory\` — payload injection\n\n## Dynamic Analysis\n\n1. **Persistence**: Registry key at \`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\`\n2. **Network**: Beaconing to C2 every 120s\n3. **Process**: Injected into \`explorer.exe\`\n\n## Lesson\n\nDroppers exist to deliver payloads stealthily. Focus on **behavioral indicators** over code complexity.` }
];

const DEFAULT_EXPERIENCE = [
  { id: 'exp-001', role: 'Cybersecurity Intern', org: 'DeltaLine International', date: 'Jul – Sep 2025', status: 'resolved', incidentId: 'INC-2025-002', link: '',
    desc: 'Live SOC operations in a real enterprise environment. Monitored and triaged security alerts, conducted vulnerability assessments.',
    findings: ['Monitored security events via Rapid7 InsightIDR — detecting suspicious patterns', 'Conducted vulnerability & exposure analysis using Rapid7 InsightVM', 'Endpoint threat monitoring and malware detection with Kaspersky', 'Incident triage, log analysis, and SOC reporting workflows'],
    tools: ['Rapid7 InsightIDR', 'InsightVM', 'Kaspersky', 'Log Analysis', 'SIEM'] },
  { id: 'exp-002', role: 'SOC Analyst Intern', org: 'Itsolera Pvt Limited', date: 'Jul – Sep 2024', status: 'resolved', incidentId: 'INC-2024-001', link: '',
    desc: 'Built and managed security infrastructure from the ground up. Integrated open-source tooling with network infrastructure.',
    findings: ['Integrated Wazuh SIEM with pfSense firewall and Squid proxy', 'Blocked unauthorized IPs and malicious domains — active threat response', 'Monitored FIM (File Integrity Monitoring) and malware detection pipelines'],
    tools: ['Wazuh', 'pfSense', 'Squid Proxy', 'FIM', 'IDS'] },
  { id: 'exp-003', role: 'Club President', org: 'Cyber Hactivators Club — COMSATS', date: 'Feb 2025 – Present', status: 'ongoing', incidentId: 'INC-2025-003', link: '',
    desc: 'Leading a university cybersecurity community. Organizes workshops, nationwide CTF competitions, and builds the technical infrastructure.',
    findings: [],
    tools: ['CTFd', 'Forensics', 'Rev Eng', 'Leadership'] }
];

const DEFAULT_ACHIEVEMENTS = [
  { id: 'ach-001', event: 'BlackHat MEA 2025', rank: 'TOP 50', title: 'Onsite Finals — Riyadh', date: 'December 2025', link: '', image: '', desc: 'Qualified and competed in onsite finals of one of the most prestigious cybersecurity competitions in the Middle East & Africa.', featured: true },
  { id: 'ach-002', event: 'NasCon 2025', rank: '3rd', title: '3rd Position', date: 'April 2025', link: '', image: '', desc: 'National-level CTF competition.', featured: false },
  { id: 'ach-003', event: 'Insomnia Hacks CTF — Sweden', rank: 'ONSITE', title: 'Qualified for Onsite Finals', date: 'March 2025', link: '', image: '', desc: 'International CTF — qualified for onsite round in Sweden.', featured: false },
  { id: 'ach-004', event: 'NUST MCS CTF 2025', rank: '2nd', title: '2nd Position', date: 'February 2025', link: '', image: '', desc: 'University-level national CTF.', featured: false },
  { id: 'ach-005', event: 'Ignite Cybersecurity Hackathon', rank: '5th', title: '5th in Pakistan', date: 'December 2024', link: '', image: '', desc: 'National hackathon final round.', featured: false },
  { id: 'ach-006', event: 'Pakistan Cyber Security Challenge', rank: '3rd', title: '3rd — Student Scoreboard', date: 'December 2024', link: '', image: '', desc: 'National student-tier cybersecurity challenge.', featured: false },
  { id: 'ach-007', event: 'BizzTech 2024', rank: '2nd', title: '2nd Position', date: 'December 2024', link: '', image: '', desc: 'Technical competition.', featured: false }
];

function loadData(key, defaults) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : JSON.parse(JSON.stringify(defaults)); } catch { return JSON.parse(JSON.stringify(defaults)); }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

const DEFAULT_SKILLS = [
  { id: 'sk-001', label: 'INCIDENT RESPONSE', value: 88, color: 'accent', link: '' },
  { id: 'sk-002', label: 'GRC COMPLIANCE',    value: 82, color: 'green',  link: '' },
  { id: 'sk-003', label: 'THREAT HUNTING',    value: 75, color: 'amber',  link: '' },
  { id: 'sk-004', label: 'DFIR',              value: 80, color: 'accent', link: '' }
];

const DEFAULT_PROJECTS = [
  { id: 'proj-001', caseId: 'CASE-2025-001', name: 'SkyCheck', category: 'cloud', severity: 'critical', status: 'active', indicator: 'active', 
    overview: 'Multi-cloud compliance assessment tool (AWS, Azure, GCP). Automates control checks against ISO 27001, NIST, GDPR, FedRAMP — eliminating manual audit bottlenecks.',
    frameworks: ['ISO 27001', 'NIST', 'GDPR', 'FedRAMP'],
    capabilities: ['Automated compliance checks across 3 clouds', 'Risk scoring: severity × exposure × exploitability', 'MITRE ATT&CK mapping per finding', 'Threat intel: Shodan, VirusTotal', 'Output: JSON, CSV, PDF/HTML']
  },
  { id: 'proj-002', caseId: 'CASE-2024-002', name: 'CTF Infrastructure', category: 'offense', severity: 'high', status: 'active', indicator: 'active',
    overview: 'Full-stack CTF platform for nationwide university competitions. Responsible for both infrastructure and challenges — Cryptography, Reverse Engineering, Digital Forensics.',
    frameworks: ['CTFd', 'Docker', 'AWS EC2'],
    capabilities: ['Challenge deployment & scoring', 'Real-time leaderboard', 'User authentication', 'Flag validation system']
  }
];

const DEFAULT_OPERATOR_LOADOUT = [
  {
    id: 'og-001',
    name: 'SOC & DETECTION',
    color: 'accent',
    items: [
      { id: 'oi-001', label: 'Rapid7 InsightIDR', value: 88 },
      { id: 'oi-002', label: 'Rapid7 InsightVM',  value: 85 },
      { id: 'oi-003', label: 'Wazuh SIEM',        value: 90 },
      { id: 'oi-004', label: 'Kaspersky EDR',     value: 80 },
      { id: 'oi-005', label: 'pfSense / Squid',   value: 78 }
    ]
  },
  {
    id: 'og-002',
    name: 'DFIR & FORENSICS',
    color: 'amber',
    items: [
      { id: 'oi-006', label: 'Autopsy',    value: 82 },
      { id: 'oi-007', label: 'FTK Imager', value: 80 },
      { id: 'oi-008', label: 'Volatility', value: 75 },
      { id: 'oi-009', label: 'Ghidra (RE)',value: 78 },
      { id: 'oi-010', label: 'Wireshark',  value: 85 },
      { id: 'oi-011', label: 'MobSF',      value: 70 }
    ]
  },
  {
    id: 'og-003',
    name: 'OFFENSIVE / PENTESTING',
    color: 'red',
    items: [
      { id: 'oi-012', label: 'Metasploit',       value: 80 },
      { id: 'oi-013', label: 'Burp Suite',        value: 85 },
      { id: 'oi-014', label: 'Nmap',              value: 90 },
      { id: 'oi-015', label: 'SQLmap',            value: 82 },
      { id: 'oi-016', label: 'Hydra / Hashcat',  value: 78 },
      { id: 'oi-017', label: 'Nikto / WPScan',   value: 75 }
    ]
  },
  {
    id: 'og-004',
    name: 'GRC COMPLIANCE MATRIX',
    color: 'green',
    isGrc: true,
    items: [
      { id: 'oi-018', label: 'ISO 27001',    status: 'PROFICIENT', controls: [{ code:'RA', title:'Risk Assessment', active:true },{ code:'CM', title:'Control Mapping', active:true },{ code:'AE', title:'Audit Evidence', active:true },{ code:'DO', title:'Documentation', active:true },{ code:'CE', title:'Certification', active:false }] },
      { id: 'oi-019', label: 'NIST CSF',     status: 'PROFICIENT', controls: [{ code:'ID', title:'Identify', active:true },{ code:'PR', title:'Protect', active:true },{ code:'DE', title:'Detect', active:true },{ code:'RS', title:'Respond', active:true },{ code:'RC', title:'Recover', active:false }] },
      { id: 'oi-020', label: 'GDPR',         status: 'WORKING',    controls: [{ code:'DM', title:'Data Mapping', active:true },{ code:'RA', title:'Risk Assessment', active:true },{ code:'DP', title:'DPA', active:false },{ code:'BN', title:'Breach Notification', active:false }] },
      { id: 'oi-021', label: 'MITRE ATT&CK', status: 'PROFICIENT', controls: [{ code:'TA', title:'Tactics', active:true },{ code:'TC', title:'Techniques', active:true },{ code:'MP', title:'Mapping', active:true },{ code:'DT', title:'Detection', active:true }] },
      { id: 'oi-022', label: 'FedRAMP',      status: 'LEARNING',   controls: [{ code:'CT', title:'Controls', active:true },{ code:'AS', title:'Assessment', active:false },{ code:'AU', title:'Authorization', active:false }] }
    ]
  }
];

const KEYS = { posts: 'uf_posts', experience: 'uf_experience', achievements: 'uf_achievements', skills: 'uf_skills', projects: 'uf_projects', operatorLoadout: 'uf_operator_loadout' };
