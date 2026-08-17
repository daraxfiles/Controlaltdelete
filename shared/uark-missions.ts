// ── CTRL+ALT+MEDIA @ UArk — Starter Missions ─────────────────────────────
// Static mission data for the UArk hub. Missions live here so they can be
// imported on both client and server without a DB round-trip.

export interface UArkMission {
  id: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Beginner/Intermediate" | "Intermediate/Advanced";
  topics: string[];
  description: string;
  steps: string[];
  possibleOutputs: string[];
  finalQuestion: string;
  category: string;
  estimatedTime: string;
  skills: string[];
}

export const UARK_MISSIONS: UArkMission[] = [
  {
    id: "uark-ai-said-what",
    title: "AI Said What About Arkansas?",
    subtitle: "Audit what AI systems get wrong about your home.",
    level: "Beginner/Intermediate",
    topics: ["AI Literacy", "Verification", "Local Knowledge"],
    category: "ai_literacy",
    estimatedTime: "3–5 hours",
    skills: ["Claim extraction", "Source verification", "Media production"],
    description:
      "Ask an AI system questions about Arkansas, the University of Arkansas, Northwest Arkansas, or a local community — then fact-check every claim it makes against credible sources.",
    steps: [
      "Record the AI response verbatim.",
      "Extract every factual claim from the response.",
      "Verify each claim using at least two credible sources.",
      "Identify inaccuracies, missing context, and stereotypes.",
      "Produce a corrected, evidence-backed media artifact.",
    ],
    possibleOutputs: [
      "Infographic",
      "Article",
      "Short video",
      "Podcast",
      "Interactive webpage",
      "AI fact-check card",
    ],
    finalQuestion: "What did the AI get right, wrong, or leave out?",
  },
  {
    id: "uark-who-gets-quoted",
    title: "Who Gets Quoted at UArk?",
    subtitle: "Map whose voices shape campus narratives.",
    level: "Intermediate",
    topics: ["Representation", "Journalism", "Data Literacy"],
    category: "representation",
    estimatedTime: "4–6 hours",
    skills: ["Content analysis", "Data visualization", "Media criticism"],
    description:
      "Analyze a sample of campus-related media stories to identify who gets quoted, whose voices dominate, and whose perspectives are missing from the record.",
    steps: [
      "Collect a sample of campus news stories (at least 10).",
      "Code each quote: student, faculty, administrator, or community member.",
      "Tabulate who gets quoted most and least.",
      "Identify voices missing from the coverage.",
      "Create a data visualization and written interpretation.",
    ],
    possibleOutputs: [
      "Data visualization",
      "Written analysis",
      "Comparison infographic",
      "Short documentary",
    ],
    finalQuestion: "Who gets to speak when our campus stories are told?",
  },
  {
    id: "uark-rumor-trace",
    title: "Razorback Rumor Trace",
    subtitle: "Follow a campus claim from origin to outcome.",
    level: "Beginner",
    topics: ["Misinformation", "Verification"],
    category: "misinformation",
    estimatedTime: "2–4 hours",
    skills: ["Source tracing", "Information flow analysis", "Verification"],
    description:
      "Investigate a non-sensitive rumor, claim, or questionable piece of information circulating in the university community. Focus on how it traveled — not just whether it was true.",
    steps: [
      "Identify the claim and its earliest traceable origin.",
      "Map how it spread: reposts, word-of-mouth, platforms.",
      "Document how the wording changed across retellings.",
      "Identify evidence used by those sharing it.",
      "Compare against official and credible sources.",
      "Reach a verified conclusion with documented reasoning.",
    ],
    possibleOutputs: [
      "Annotated information flow diagram",
      "Written trace report",
      "Short video explanation",
    ],
    finalQuestion: "How did this claim move through the campus information ecosystem?",
  },
  {
    id: "uark-algorithm-audit",
    title: "Algorithm Audit: Razorback Edition",
    subtitle: "Compare how platforms shape what you see.",
    level: "Intermediate/Advanced",
    topics: ["Algorithmic Literacy", "AI Literacy"],
    category: "algorithms",
    estimatedTime: "4–8 hours",
    skills: ["Comparative analysis", "Platform literacy", "Critical media analysis"],
    description:
      "Investigate how different platforms present information about the same topic. Document what appears first, what is prioritized, what is missing, and how personalization shapes each result.",
    steps: [
      "Select a topic connected to UArk, Fayetteville, or Arkansas.",
      "Search the same topic across at least three platforms (e.g. Google, TikTok, Reddit, AI assistant).",
      "Screenshot and document first-page results for each platform.",
      "Compare: what information is prioritized, and what is missing?",
      "Identify commercial influence, personalization, or potential bias.",
      "Document your findings with evidence and produce a comparison report.",
    ],
    possibleOutputs: [
      "Comparison report",
      "Side-by-side visual audit",
      "Short documentary",
      "Infographic",
    ],
    finalQuestion:
      "How might different information systems create different versions of the same reality?",
  },
  {
    id: "uark-information-desert-map",
    title: "UArk Information Desert Map",
    subtitle: "Find where campus information breaks down.",
    level: "Advanced",
    topics: ["Information Access", "Design", "Community Research"],
    category: "information_access",
    estimatedTime: "6–10 hours",
    skills: ["Survey design", "User research", "Information mapping", "Design"],
    description:
      "Investigate where members of the university community actually obtain important information — and identify gaps where key information is difficult to locate or understand.",
    steps: [
      "Select a population: first-year students, international students, graduate students, etc.",
      "Design and conduct brief interviews or surveys about how they find information.",
      "Map all sources they rely on: university sites, email, GroupMe, TikTok, friends, etc.",
      "Identify specific gaps where important information is hard to find or understand.",
      "Propose or create a resource that addresses the most significant gap.",
    ],
    possibleOutputs: [
      "Visual information map",
      "Accessible guide or FAQ",
      "Interactive webpage",
      "Recommendation report",
    ],
    finalQuestion:
      "Where does the campus information ecosystem break down — and who does that hurt most?",
  },
  {
    id: "uark-public-document-decoder",
    title: "Public Document Decoder",
    subtitle: "Make the complicated legible for everyone.",
    level: "Beginner/Intermediate",
    topics: ["Information Design", "Accessibility"],
    category: "accessibility",
    estimatedTime: "3–5 hours",
    skills: ["Plain-language writing", "Design", "Accessibility review"],
    description:
      "Select a publicly available university or community document and convert its complicated information into an accessible, public-facing explanation that anyone can understand and use.",
    steps: [
      "Select an appropriate public document (a policy, procedure, or report).",
      "Identify the intended audience and their likely prior knowledge.",
      "Break down jargon, complex procedures, and inaccessible language.",
      "Design an accessible alternative format for the same information.",
      "Test with at least one person unfamiliar with the document.",
    ],
    possibleOutputs: [
      "Infographic",
      "FAQ document",
      "Short explainer video",
      "Plain-language guide",
      "Interactive webpage",
    ],
    finalQuestion:
      "Can someone unfamiliar with this system understand and use this information?",
  },
  {
    id: "uark-search-yourself",
    title: "Search Yourself: Razorback Edition",
    subtitle: "Audit what search engines say about your campus.",
    level: "Intermediate",
    topics: ["Verification", "AI Literacy", "Representation"],
    category: "ai_literacy",
    estimatedTime: "3–6 hours",
    skills: ["Search literacy", "Source evaluation", "Critical analysis"],
    description:
      "Investigate what search engines and AI systems say about UArk, a campus organization, an academic field, Fayetteville, Northwest Arkansas, or an Arkansas community — then compare representations and identify inaccuracies.",
    steps: [
      "Choose a subject: UArk, a campus org, Fayetteville, or an Arkansas community.",
      "Search across Google, an AI assistant, and at least one other platform.",
      "Document inaccuracies, outdated information, missing context, and stereotypes.",
      "Assess source quality: authoritative vs. weak.",
      "Produce a correction or improved public-facing resource.",
    ],
    possibleOutputs: [
      "Comparison report",
      "Correction article",
      "Updated public resource",
      "Infographic",
    ],
    finalQuestion:
      "What does the information ecosystem get wrong about this community — and who is harmed by those gaps?",
  },
  {
    id: "uark-accessibility-audit",
    title: "Accessibility Audit",
    subtitle: "Ask who is unintentionally excluded.",
    level: "Intermediate",
    topics: ["Accessibility", "Information Design", "Inclusion"],
    category: "accessibility",
    estimatedTime: "4–6 hours",
    skills: ["Accessibility evaluation", "Design critique", "Plain-language writing"],
    description:
      "Examine a publicly accessible information resource or digital tool and identify who may be unintentionally excluded from accessing it — then build an improved version or recommendation.",
    steps: [
      "Select a public digital resource (university webpage, PDF, form, etc.).",
      "Evaluate for: readability, captions, alt text, color contrast, navigation, mobile usability.",
      "Document specific barriers with evidence and examples.",
      "Identify which populations are most affected by each barrier.",
      "Build an improved version or a detailed recommendation report.",
    ],
    possibleOutputs: [
      "Accessibility report",
      "Redesigned resource",
      "Recommendation guide",
      "Video walkthrough of barriers",
    ],
    finalQuestion:
      "Who may be unintentionally excluded — and what would it take to include them?",
  },
];

export const UARK_MISSION_CATEGORIES = [
  { id: "all",               label: "All Missions" },
  { id: "ai_literacy",       label: "AI Literacy" },
  { id: "misinformation",    label: "Misinformation" },
  { id: "representation",    label: "Representation" },
  { id: "algorithms",        label: "Algorithms" },
  { id: "information_access",label: "Information Access" },
  { id: "accessibility",     label: "Accessibility" },
];
