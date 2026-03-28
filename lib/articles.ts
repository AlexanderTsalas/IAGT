export interface Author {
  name: string;
  title: string;
  initials: string;
}

export interface KeyStat {
  value: string;
  label: string;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; intro?: string; items: string[] }
  | { type: "subsection"; heading: string; body: ContentBlock[] };

export interface ArticleSection {
  heading: string;          // renders as <h2>
  content: ContentBlock[];
}

export interface Source {
  title: string;
  publisher: string;
  year: number;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  readingTime: number;
  author: Author;
  tags: string[];
  excerpt: string;
  coverLabel: string;
  coverImage?: string;
  keyStats: KeyStat[];
  sections: ArticleSection[];
  sources: Source[];
}

/* ─────────────────────────────────────────────────────────────────────────── */

export const articles: Article[] = [
  /* ── 1 ── Data Centres ──────────────────────────────────────────────────── */
  {
    slug: "greece-data-centre-frontier",
    title: "Greece Emerges as Southern Europe's Data Centre Frontier",
    subtitle:
      "A confluence of subsea cable infrastructure, renewable energy capacity, and EU-harmonised regulation is repositioning Greece as a tier-one destination for hyperscale and colocation investment.",
    publishedAt: "2026-02-18",
    readingTime: 8,
    author: {
      name: "Alexandros Papadopoulos",
      title: "Senior Market Intelligence Analyst",
      initials: "AP",
    },
    tags: ["Technology", "Infrastructure", "FDI", "Greece"],
    excerpt:
      "Microsoft's €1 bn commitment and AWS's announced expansion have confirmed what infrastructure specialists have long suspected: Greece is becoming a critical node in Europe's digital backbone.",
    coverLabel: "DATA CENTRES · GREECE",
    coverImage: "/news/data-centre.png",
    keyStats: [
      { value: "€1bn+", label: "Hyperscaler capex committed (2024–2026)" },
      { value: "3",     label: "Major subsea cable landings in Attica" },
      { value: "40%",   label: "Share of electricity from renewables (2025)" },
      { value: "2026",  label: "Target year for Greece's first Tier III hyperscale campus" },
    ],
    sections: [
      {
        heading: "Why Now?",
        content: [
          {
            type: "paragraph",
            text: "Greece spent much of the past decade managing sovereign-debt fallout rather than positioning itself as an investment destination. That calculus has shifted decisively. A series of structural factors have converged with a market opportunity created by saturation in the Amsterdam–Frankfurt–London–Dublin (AFLD) corridor.",
          },
          {
            type: "bullets",
            intro: "Key structural drivers behind the inflection point include:",
            items: [
              "Stable EU membership providing a harmonised regulatory and legal framework",
              "Improved sovereign credit ratings (investment-grade restoration in 2023)",
              "Aggressive government incentives under the National Recovery and Resilience Plan",
              "AFLD corridor saturation driving operators to scout alternative EU markets",
            ],
          },
          {
            type: "paragraph",
            text: "Data centre capacity in the AFLD corridor is increasingly constrained by power availability, planning restrictions, and cooling costs. Greece offers structural advantages that are difficult to replicate quickly elsewhere in Europe.",
          },
        ],
      },
      {
        heading: "Infrastructure Fundamentals",
        content: [
          {
            type: "paragraph",
            text: "Greece sits at the intersection of three major subsea cable systems — including the 2Africa cable and the forthcoming EIG extension — making it a natural landing point for traffic flowing between Europe, the Middle East, and Africa. The Port of Piraeus, combined with Attica's fibre backhaul density, provides the connectivity fundamentals that hyperscalers demand.",
          },
          {
            type: "subsection",
            heading: "Power and Renewables",
            body: [
              {
                type: "paragraph",
                text: "On power, Greece's renewable capacity has expanded rapidly: solar installed capacity doubled between 2021 and 2025, and the country regularly generates electricity surpluses exported to neighbouring markets. This matters because data centre operators face growing ESG pressure to demonstrate renewable energy coverage.",
              },
              {
                type: "bullets",
                intro: "Greece's energy mix for data centre operators offers:",
                items: [
                  "Solar, wind, and hydropower combination enabling credible renewable coverage",
                  "Electricity surplus available without reliance on long-distance PPAs",
                  "Ongoing grid expansion funded under the National Recovery Plan",
                ],
              },
            ],
          },
        ],
      },
      {
        heading: "The Regulatory and Incentive Landscape",
        content: [
          {
            type: "paragraph",
            text: "The Greek government's fast-track licensing regime — introduced in 2020 and substantially expanded in 2023 — reduces permitting timelines for strategic investments to as little as 45 days, compared with 18–36 months under standard procedures. Data centres above a defined capacity threshold qualify automatically.",
          },
          {
            type: "bullets",
            intro: "Key incentives for qualifying data centre investments include:",
            items: [
              "Ten-year tax exemption on profits derived from qualifying data centre operations",
              "Accelerated depreciation schedule for IT and cooling infrastructure",
              "Co-financing access through the Hellenic Development Bank",
              "Fast-track permitting (45 days vs. up to 36 months standard)",
            ],
          },
          {
            type: "paragraph",
            text: "For international operators unfamiliar with Greek administrative processes, these incentives are significant — but navigating the qualification criteria and liaising with multiple ministries requires local expertise.",
          },
        ],
      },
      {
        heading: "Market Entry Considerations",
        content: [
          {
            type: "paragraph",
            text: "For technology companies considering Greek data centre investment, three factors deserve particular attention.",
          },
          {
            type: "bullets",
            items: [
              "Land availability in Attica is increasingly competitive — site control strategies must be developed early, before the best locations are absorbed by first movers.",
              "Local technical workforce for data centre operations is thinner than in Western European markets; workforce planning and training pipelines should feature in feasibility assessments from day one.",
              "Utility connection timelines, particularly for high-voltage grid connections, remain longer than operators may expect — early engagement with ADMIE (the Independent Power Transmission Operator) is essential.",
            ],
          },
          {
            type: "paragraph",
            text: "Companies that move in the next 12–18 months will benefit from first-mover land positioning and the strongest incentive packages. The window for advantaged entry is real, but not indefinite.",
          },
        ],
      },
    ],
    sources: [
      { title: "Greece National Recovery and Resilience Plan — Digital Pillar", publisher: "Hellenic Republic Ministry of Digital Governance", year: 2024 },
      { title: "European Data Centre Market Report Q4 2025", publisher: "Cushman & Wakefield EMEA Research", year: 2025 },
      { title: "Renewable Energy Integration in Southeast Europe", publisher: "International Energy Agency", year: 2025 },
      { title: "Fast-Track Investment Licensing Law 4608/2019 — Updated Commentary", publisher: "Enterprise Greece", year: 2024 },
    ],
  },

  /* ── 2 ── AI Act ─────────────────────────────────────────────────────────── */
  {
    slug: "eu-ai-act-compliance-roadmap",
    title: "The EU AI Act Compliance Roadmap for Non-European Technology Companies",
    subtitle:
      "With the EU AI Act's high-risk provisions entering force in August 2026, technology companies without a European compliance infrastructure face a narrowing window to establish the required governance, documentation, and local-representative obligations.",
    publishedAt: "2026-03-05",
    readingTime: 10,
    author: {
      name: "Elena Vassilakis",
      title: "Regulatory Affairs Specialist",
      initials: "EV",
    },
    tags: ["Regulatory", "Technology", "AI", "Compliance"],
    excerpt:
      "The AI Act's extraterritorial reach means that any company whose AI system outputs are used in the EU must comply — regardless of where the developer is incorporated. For many technology firms, the most immediate obligation is appointing an EU-based authorised representative.",
    coverLabel: "AI ACT · REGULATORY",
    coverImage: "/news/ai-compliance.png",
    keyStats: [
      { value: "Aug 2026", label: "High-risk AI provisions enter force" },
      { value: "€35m",     label: "Maximum fine for high-risk non-compliance" },
      { value: "7%",       label: "Global turnover fine cap for systemic violations" },
      { value: "3%",       label: "Turnover cap for high-risk AI infringements" },
    ],
    sections: [
      {
        heading: "Scope: Who Is Caught?",
        content: [
          {
            type: "paragraph",
            text: "The EU AI Act (Regulation 2024/1689) applies to any provider that places an AI system on the EU market or puts it into service within the EU — irrespective of where that provider is established. The extraterritorial reach is explicit: a US-incorporated company whose software-as-a-service product is used by European businesses or consumers is within scope.",
          },
          {
            type: "subsection",
            heading: "Risk Classification Tiers",
            body: [
              {
                type: "paragraph",
                text: "The regulation establishes a tiered risk hierarchy that determines the compliance obligations applicable to each system:",
              },
              {
                type: "bullets",
                items: [
                  "Unacceptable risk — prohibited outright (e.g. social scoring, real-time biometric surveillance in public spaces)",
                  "High risk — subject to mandatory conformity assessment, technical documentation, and post-market monitoring",
                  "Limited risk — subject to transparency obligations only (e.g. chatbots must disclose their AI nature)",
                  "Minimal risk — no mandatory obligations; voluntary codes of practice apply",
                ],
              },
              {
                type: "paragraph",
                text: "Most enterprise AI applications — those used in hiring, credit scoring, critical infrastructure management, and certain customer-service contexts — fall into the high-risk category.",
              },
            ],
          },
        ],
      },
      {
        heading: "The Authorised Representative Obligation",
        content: [
          {
            type: "paragraph",
            text: "Non-EU providers of high-risk AI systems are required to appoint an EU-based authorised representative by written mandate. This representative serves as the formal point of contact for EU market surveillance authorities and carries responsibility for ensuring that the provider's obligations under the Act are fulfilled.",
          },
          {
            type: "bullets",
            intro: "The representative must be able to:",
            items: [
              "Cooperate with national competent authorities on request",
              "Provide access to technical documentation within prescribed timelines (as short as 15 working days)",
              "Forward complaints and incidents from EU users to the provider",
              "Maintain an up-to-date register of high-risk AI systems placed on the EU market",
            ],
          },
          {
            type: "paragraph",
            text: "This obligation mirrors the structure established under the GDPR for non-EU data controllers and the EU MDR for medical device manufacturers. Companies that have already established Article 27 GDPR representatives will find the structural template familiar, but the AI Act representative must have deeper technical engagement with the system's conformity assessment process.",
          },
        ],
      },
      {
        heading: "Documentation and Conformity Assessment",
        content: [
          {
            type: "paragraph",
            text: "High-risk AI systems must be accompanied by technical documentation that is maintained and updated throughout the system's lifecycle. For certain high-risk categories, third-party conformity assessment by a notified body is mandatory rather than self-certification.",
          },
          {
            type: "subsection",
            heading: "Required Technical Documentation",
            body: [
              {
                type: "bullets",
                items: [
                  "System architecture and component description",
                  "Training data governance and data quality measures",
                  "Performance metrics disaggregated across relevant demographic groups",
                  "Cybersecurity measures and known vulnerabilities",
                  "Post-market monitoring plan and incident reporting procedures",
                  "Human oversight mechanisms and override capabilities",
                ],
              },
            ],
          },
          {
            type: "paragraph",
            text: "Greece has designated EETT (the Hellenic Telecommunications and Post Commission) and ELOT (the Hellenic Organisation for Standardisation) as national competent bodies with roles in AI Act oversight, providing an accessible entry point for companies establishing EU compliance infrastructure through a Greek entity.",
          },
        ],
      },
      {
        heading: "Practical Steps for Technology Companies",
        content: [
          {
            type: "paragraph",
            text: "Companies should prioritise four actions in the near term to build a defensible compliance position before the August 2026 enforcement date.",
          },
          {
            type: "bullets",
            items: [
              "Conduct an AI Act inventory — catalogue all AI systems deployed to or accessible by EU users and classify each against the risk hierarchy. This scoping exercise defines the compliance perimeter.",
              "Appoint an authorised representative in an EU member state with the legal mandate, technical access, and regulatory relationships required to discharge the obligation credibly — not merely a postal address.",
              "Initiate technical documentation programmes for high-risk systems immediately, as documentation gaps are the most common reason conformity assessments stall.",
              "Build post-market monitoring mechanisms into system architecture — ongoing incident reporting and performance tracking are continuing obligations, not one-time compliance activities.",
            ],
          },
          {
            type: "paragraph",
            text: "Greece offers a practical base for EU authorised representative functions: English-language proficiency among legal and regulatory professionals is high, time-zone alignment with both European and Middle Eastern markets is advantageous, and operating costs are meaningfully lower than in Western European regulatory hubs.",
          },
        ],
      },
    ],
    sources: [
      { title: "Regulation (EU) 2024/1689 — Artificial Intelligence Act", publisher: "Official Journal of the European Union", year: 2024 },
      { title: "AI Act Implementation Timeline and Transitional Provisions — Guidance Note", publisher: "European AI Office", year: 2025 },
      { title: "Authorised Representatives Under EU Product Regulation: Comparative Analysis", publisher: "Fieldfisher LLP", year: 2025 },
      { title: "EETT Designation as National Competent Authority for AI Act Oversight", publisher: "Hellenic Telecommunications and Post Commission", year: 2025 },
    ],
  },

  /* ── 3 ── Balkans Infrastructure ─────────────────────────────────────────── */
  {
    slug: "western-balkans-infrastructure-corridors",
    title: "Western Balkans Connectivity: The Infrastructure Corridor Opportunity",
    subtitle:
      "EU pre-accession funding, the Global Gateway initiative, and IFI lending are channelling over €30 billion into transport, energy, and digital infrastructure across the Western Balkans — creating significant commercial opportunities for companies positioned to serve the region.",
    publishedAt: "2026-01-29",
    readingTime: 9,
    author: {
      name: "Nikos Stavros",
      title: "Infrastructure & Investment Analyst",
      initials: "NS",
    },
    tags: ["Infrastructure", "Market Entry", "Balkans", "FDI"],
    excerpt:
      "The Western Balkans infrastructure cycle is entering its most capital-intensive phase since Yugoslav-era construction. For companies with relevant expertise — engineering, logistics, energy, and digital — the procurement pipeline is substantial and the competition from established local players is more limited than in mature EU markets.",
    coverLabel: "BALKANS · INFRASTRUCTURE",
    coverImage: "/news/balkans-infrastructure.png",
    keyStats: [
      { value: "€30bn+", label: "Committed IFI and EU funding to Western Balkans (2021–2027)" },
      { value: "6",      label: "Western Balkans countries in EU accession pipeline" },
      { value: "2030",   label: "Target year for Western Balkans digital single market alignment" },
      { value: "€9bn",   label: "Global Gateway Western Balkans package (2021–2027)" },
    ],
    sections: [
      {
        heading: "The Funding Architecture",
        content: [
          {
            type: "paragraph",
            text: "Three overlapping funding streams are driving Western Balkans infrastructure investment at a density unusual for a market of approximately 17 million people.",
          },
          {
            type: "bullets",
            intro: "The three primary funding mechanisms are:",
            items: [
              "IPA III (EU Instrument for Pre-Accession Assistance) — €14.2 billion envelope for 2021–2027, funding transport corridors, border modernisation, and digital infrastructure",
              "EU Global Gateway Initiative — €9 billion Western Balkans package focused on clean energy connectivity, undersea cables, and key transport links",
              "International Financial Institutions (EBRD, EIB, World Bank) — continuing to lend at scale across all six Western Balkans jurisdictions",
            ],
          },
          {
            type: "paragraph",
            text: "The political logic behind this funding density is clear: accelerating EU accession requires closing the infrastructure gap that makes economic integration complex. For international companies with relevant expertise, the procurement pipeline represents a multi-year commercial opportunity.",
          },
        ],
      },
      {
        heading: "Priority Corridors and Sectors",
        content: [
          {
            type: "paragraph",
            text: "The most immediately active procurement pipeline concentrates in three sectors, each with distinct entry characteristics.",
          },
          {
            type: "subsection",
            heading: "Transport Infrastructure",
            body: [
              {
                type: "paragraph",
                text: "Transport remains the largest sector by procurement value. Key active programmes include:",
              },
              {
                type: "bullets",
                items: [
                  "Corridor X motorway rehabilitation across Serbia and North Macedonia",
                  "Serbia–North Macedonia–Greece rail corridor modernisation",
                  "Via Carpathia extensions connecting the Adriatic to Poland",
                  "Border crossing upgrades at major EU–Balkans entry points",
                ],
              },
            ],
          },
          {
            type: "subsection",
            heading: "Energy Interconnection",
            body: [
              {
                type: "paragraph",
                text: "The Western Balkans energy transition is driven by EU Green Deal alignment requirements and post-2022 energy security imperatives. Active projects include new transmission interconnectors between Albania, North Macedonia, and Greece, and between Serbia and Romania, alongside large-scale renewable energy developments.",
              },
              {
                type: "bullets",
                items: [
                  "Solar energy projects in Serbia — 500 MW+ pipeline under IPA-supported frameworks",
                  "Wind capacity expansion in Albania — targeting 2 GW by 2030",
                  "Gas interconnectors being partially repurposed for future hydrogen transmission",
                ],
              },
            ],
          },
          {
            type: "subsection",
            heading: "Digital Infrastructure",
            body: [
              {
                type: "paragraph",
                text: "The fastest-growing sector by procurement activity. Funded under IPA III and Global Gateway, the digital pipeline spans fibre backbone extensions, data centre development (particularly in Serbia and Albania), and e-government platform modernisation.",
              },
              {
                type: "bullets",
                items: [
                  "Fibre backbone extensions connecting Balkan capitals to EU networks",
                  "Data centre development in Belgrade and Tirana receiving IFI co-financing",
                  "E-government and digital public services modernisation programmes",
                ],
              },
            ],
          },
        ],
      },
      {
        heading: "Market Entry Dynamics",
        content: [
          {
            type: "paragraph",
            text: "The Western Balkans is not a homogeneous market. Each country has distinct procurement systems, local content expectations, and established relationships between public and private sector actors.",
          },
          {
            type: "bullets",
            intro: "Country-level market characteristics at a glance:",
            items: [
              "Serbia — most developed private sector and largest domestic construction industry; strongest competition from established local players",
              "Albania — fastest-growing market with significant IFI-backed pipeline; regulatory predictability improving but still lower than EU norms",
              "North Macedonia — most advanced EU accession trajectory; regulatory environment most familiar to European companies",
              "Bosnia & Herzegovina — complex governance structure requires careful stakeholder mapping at entity and state level",
              "Montenegro — smallest market, but EU candidacy most advanced; attractive for pilot and demonstration projects",
              "Kosovo — youngest market; significant USAID and EU-funded reconstruction pipeline",
            ],
          },
          {
            type: "paragraph",
            text: "For companies entering the region for the first time, the most effective approach is to lead with a niche expertise where local competition is weak — specialised engineering, advanced digital systems, or project management — and to build local partnerships for labour, materials, and regulatory navigation.",
          },
        ],
      },
      {
        heading: "Greece as Regional Gateway",
        content: [
          {
            type: "paragraph",
            text: "For international companies approaching the Western Balkans, Greece serves as a natural gateway for several compounding reasons.",
          },
          {
            type: "bullets",
            items: [
              "Geographic connectivity — the Athens–Thessaloniki axis connects by road and rail to North Macedonia, Bulgaria, and Serbia; the Egnatia Odos connects to Albania",
              "Commercial experience — Greek firms have decades of established Balkan market presence with legal, banking, and logistics infrastructure that supports regional operations",
              "EU legal status — a Greek entity provides EU legal standing relevant to participation in IPA-funded tenders without requiring multiple country presences",
              "Double tax treaty network — Greece's treaties cover all Western Balkans jurisdictions, enabling efficient cross-border revenue flows",
              "Lower cost base — operational costs are meaningfully lower than Western European hubs while maintaining full EU regulatory alignment",
            ],
          },
          {
            type: "paragraph",
            text: "Companies that want to participate in IPA-funded procurement without establishing multiple country presences will find a Greek hub structurally sound — provided it is supported by credible local partnerships in each target market.",
          },
        ],
      },
    ],
    sources: [
      { title: "IPA III Regulation and Western Balkans Indicative Strategy Paper 2021–2027", publisher: "European Commission DG NEAR", year: 2024 },
      { title: "Global Gateway Western Balkans Investment Package — Progress Report", publisher: "European Commission", year: 2025 },
      { title: "Western Balkans Infrastructure Investment Gap Analysis", publisher: "European Bank for Reconstruction and Development", year: 2025 },
      { title: "Corridor X and Via Carpathia Procurement Pipeline Update", publisher: "International Road Federation", year: 2025 },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */

export const allTags: string[] = Array.from(
  new Set(articles.flatMap(a => a.tags)),
).sort();

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter(a => a.tags.includes(tag));
}
