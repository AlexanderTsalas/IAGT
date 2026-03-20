import {
  Eye, Search, Users, BarChart2, AlertTriangle,
  Layers, Map, DollarSign, Calendar,
  Crosshair, Target, Shield, Network,
  CheckCircle, UserCheck, FileText, Globe,
  TrendingUp, Zap, MessageSquare, Scale,
  Building2, MapPin, Package, Settings,
  ClipboardList, GitBranch, RefreshCw, BarChart,
  FileCheck, Bell, Send, Flag, Compass, Star,
  type LucideIcon,
} from "lucide-react";
import type { ServiceId } from "./services";

export interface ProcessStep {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface Metric {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  sublabel: string;
}

export interface DeliverableDetail {
  title: string;
  description: string;
  process: ProcessStep[];
  metrics: Metric[];
}

export const SERVICE_DETAILS: Record<ServiceId, DeliverableDetail[]> = {

  // ── Market Entry & Strategy ──────────────────────────────────────────────
  "market-entry": [
    {
      title: "Market Assessment & Opportunity Analysis",
      description:
        "We conduct a structured, ground-level assessment of the Greek and Southeast European market for your specific product or service category. This covers sizing the addressable opportunity, identifying demand drivers, mapping the buyer landscape, and flagging structural barriers before you commit capital. The output is a decision-ready intelligence brief — not a desktop report.",
      process: [
        { icon: Eye,          title: "Desk Research & Baseline",   body: "Aggregate regulatory filings, procurement records, and industry data to establish verified market conditions." },
        { icon: Users,        title: "Stakeholder Interviews",      body: "15–25 targeted interviews with buyers, intermediaries, and sector authorities to validate assumptions on the ground." },
        { icon: BarChart2,    title: "Opportunity Sizing",          body: "Bottom-up market model covering addressable revenue, competitive density, and optimal entry window." },
        { icon: AlertTriangle, title: "Risk Register",              body: "Document political, regulatory, and market-specific risks with a severity-likelihood matrix and mitigation options." },
      ],
      metrics: [
        { value: 20, prefix: "", suffix: "+",    label: "Stakeholder Interviews",  sublabel: "Conducted per assessment engagement" },
        { value: 6,  prefix: "", suffix: " wks", label: "Delivery Timeline",       sublabel: "From brief to actionable report" },
        { value: 50, prefix: "€", suffix: "M+",  label: "Market Value Assessed",   sublabel: "Across active client engagements" },
      ],
    },
    {
      title: "Go-to-Market Strategy Development",
      description:
        "A market assessment maps the territory — a go-to-market strategy tells you exactly how to cross it. We translate intelligence into an actionable entry plan: target segments ranked by revenue potential, channel architecture calibrated to your sales model, pricing positioned against local comparables, and a phased launch sequence with measurable milestones. Every recommendation is grounded in the specific realities of operating in Greece.",
      process: [
        { icon: Layers,    title: "Segmentation & Prioritisation", body: "Define and rank customer segments by revenue potential, accessibility, and competitive intensity in this market." },
        { icon: Map,       title: "Channel Architecture",          body: "Map the optimal route to market — direct, distributor, system integrator, or public procurement — with a rationale for each." },
        { icon: DollarSign, title: "Pricing Architecture",         body: "Benchmark against local comparables and develop a pricing model that balances competitiveness with your target margin." },
        { icon: Calendar,  title: "90 / 180 / 365-Day Roadmap",   body: "A phased launch plan with measurable milestones, decision gates, and resource requirements at each stage." },
      ],
      metrics: [
        { value: 90, prefix: "", suffix: "",     label: "Days to First Engagement", sublabel: "From strategy brief to market contact" },
        { value: 3,  prefix: "", suffix: "",     label: "Priority Segments",        sublabel: "Ranked and sized per engagement" },
        { value: 12, prefix: "", suffix: " mo",  label: "Revenue Forecast Horizon", sublabel: "Financial model included as standard" },
      ],
    },
    {
      title: "Competitive Landscape Analysis",
      description:
        "You cannot win a market you do not fully understand. We map your direct and indirect competitors — international entrants and domestic incumbents — decode their positioning, channel strategy, and customer concentration, then identify the defensible whitespace your offer can credibly claim. This is strategic intelligence, not a database export.",
      process: [
        { icon: Search,    title: "Competitor Identification",   body: "Build a comprehensive inventory of active players: international entrants, domestic incumbents, and adjacent-category disruptors." },
        { icon: Crosshair, title: "Positioning Deconstruction",  body: "Analyse pricing, messaging, channel mix, and customer concentration for each competitor in your target segment." },
        { icon: Target,    title: "Whitespace Mapping",          body: "Overlay your value proposition against the competitive grid to identify differentiation points you can defend." },
        { icon: Shield,    title: "Threat Assessment",           body: "Evaluate which competitors are likely to respond to your entry and model their probable countermoves." },
      ],
      metrics: [
        { value: 15, prefix: "", suffix: "+",    label: "Competitors Mapped",         sublabel: "Direct and indirect per engagement" },
        { value: 3,  prefix: "", suffix: "",     label: "Whitespace Opportunities",   sublabel: "Identified and ranked by defensibility" },
        { value: 4,  prefix: "", suffix: "×/yr", label: "Refresh Cadence",            sublabel: "Quarterly updates for retained clients" },
      ],
    },
    {
      title: "Partner & Channel Identification",
      description:
        "The right local partner compresses your time to revenue by years. The wrong one consumes your margin and blocks your direct channel. We run a structured identification, vetting, and shortlisting process so you enter every partnership conversation with leverage — knowing exactly what you need, who fits, and what to pay for it.",
      process: [
        { icon: Star,      title: "Partner Criteria Definition", body: "Translate your commercial and operational requirements into a weighted partner scorecard used throughout the process." },
        { icon: Network,   title: "Market Canvas",               body: "Identify the full population of candidate partners across distributors, resellers, agents, and strategic allies." },
        { icon: CheckCircle, title: "Vetting & Shortlisting",   body: "Reference checks, financial screening, and capability interviews produce a ranked shortlist of 3–5 viable candidates." },
        { icon: UserCheck, title: "Introduction & Facilitation", body: "Arrange introductory meetings, brief all parties, and support term-sheet negotiation through to LOI signature." },
      ],
      metrics: [
        { value: 5,  prefix: "", suffix: "",   label: "Vetted Candidates Delivered", sublabel: "Ranked shortlist per partner search" },
        { value: 3,  prefix: "", suffix: " wk", label: "Identification Timeline",    sublabel: "From brief to ranked shortlist" },
        { value: 85, prefix: "", suffix: "%",   label: "Advance to LOI",             sublabel: "Of structured partner introductions" },
      ],
    },
  ],

  // ── Commercial Representation ────────────────────────────────────────────
  "commercial-rep": [
    {
      title: "Local Commercial Representation",
      description:
        "We become your commercial presence in Greece and Southeast Europe — attending industry events, engaging prospects, and representing your brand with the authority of a local team and the accountability of a partner with skin in the game. You gain immediate market credibility without building headcount, and we operate with full visibility to your headquarters.",
      process: [
        { icon: FileText,   title: "Brand & Product Induction",  body: "Deep-dive into your offer, positioning, competitive advantages, and non-negotiables so we represent you with complete accuracy." },
        { icon: Globe,      title: "Market Activation",          body: "Establish presence in target accounts, sector associations, and procurement networks on your behalf from day one." },
        { icon: TrendingUp, title: "Pipeline Development",       body: "Build and manage an active prospect pipeline with a structured reporting cadence visible to your team." },
        { icon: BarChart,   title: "Quarterly Business Reviews", body: "Pipeline health, win/loss analysis, and strategic recommendations delivered to your executive team every quarter." },
      ],
      metrics: [
        { value: 20, prefix: "", suffix: "+",    label: "Prospect Touchpoints/Month", sublabel: "Active per engagement" },
        { value: 4,  prefix: "", suffix: "×/yr", label: "Executive Reviews",          sublabel: "Quarterly pipeline and strategy briefings" },
        { value: 9,  prefix: "", suffix: " mo",  label: "Avg Ramp to First Deal",     sublabel: "In the Greek market context" },
      ],
    },
    {
      title: "Business Development & Sales Support",
      description:
        "We generate the meetings, qualify the opportunities, and support the commercial process from first contact to signed agreement. You focus on delivery — we build the revenue funnel that makes delivery necessary. Our engagement covers the full sales cycle: outreach, qualification, proposal support, and close coordination, with structured reporting at every stage.",
      process: [
        { icon: Target,     title: "Target Account Mapping",     body: "Identify and prioritise 30–50 target accounts based on fit, budget authority, and procurement cycle timing." },
        { icon: Zap,        title: "Outreach & Engagement",      body: "Execute structured outreach across relationship, event, referral, and digital channels tailored to Greek buyer behaviour." },
        { icon: CheckCircle, title: "Opportunity Qualification", body: "Apply a structured qualification framework before escalating any opportunity to your team — no wasted executive time." },
        { icon: Users,      title: "Deal Support & Close",       body: "Attend key meetings, support proposal development, and manage the local relationship through contract execution." },
      ],
      metrics: [
        { value: 40, prefix: "", suffix: "+",     label: "Target Accounts",         sublabel: "In active penetration per engagement" },
        { value: 8,  prefix: "", suffix: "+",     label: "Qualified Opps/Quarter",  sublabel: "Escalated with full opportunity brief" },
        { value: 90, prefix: "", suffix: " days", label: "Avg Deal Cycle",          sublabel: "First meeting to signed agreement" },
      ],
    },
    {
      title: "Customer Identification & Engagement",
      description:
        "We don't work from cold lists. We map the buyer landscape for your specific product category, identify decision-makers and influencers within each target organisation, and build the relationships that turn into conversations. Every engagement is grounded in account-level intelligence, not volume activity.",
      process: [
        { icon: UserCheck,    title: "Buyer Landscape Mapping",  body: "For each target segment, identify procurement leads, technical evaluators, executive sponsors, and influencers." },
        { icon: Network,      title: "Relationship Entry",       body: "Leverage existing relationships and targeted introductions to open doors at the right authority level." },
        { icon: MessageSquare, title: "Needs Discovery",         body: "Structured discovery conversations that validate fit and surface latent requirements before involving your team." },
        { icon: FileText,     title: "Account Brief & Handoff",  body: "Full account brief prepared before escalating — decision-maker map, buying process, open questions, and recommended next steps." },
      ],
      metrics: [
        { value: 65,  prefix: "", suffix: "%",   label: "Decision-Maker Contact Rate", sublabel: "Reached at the correct authority level" },
        { value: 3,   prefix: "", suffix: "",    label: "Relationships per Account",   sublabel: "Avg contacts built per target organisation" },
        { value: 200, prefix: "", suffix: "+",   label: "Senior Buyer Contacts",       sublabel: "In our active regional network" },
      ],
    },
    {
      title: "Negotiation Support & Contract Facilitation",
      description:
        "Commercial negotiations in Greece carry cultural and procedural dynamics that differ significantly from Northern European or US markets. Pace, face-saving, and relationship precedence all affect outcomes. We manage the local dynamics while you retain full control of commercial terms — ensuring nothing is conceded through unfamiliarity.",
      process: [
        { icon: Eye,      title: "Pre-Negotiation Briefing",    body: "Analyse the counterpart's priorities, constraints, and likely positions before the first negotiation session." },
        { icon: Scale,    title: "Negotiation Facilitation",    body: "Lead negotiation sessions, manage local relationship dynamics, and escalate critical decisions to your team in real time." },
        { icon: FileText, title: "Term Sheet Management",       body: "Draft and review commercial term sheets with your legal advisors, ensuring local enforceability and clarity." },
        { icon: CheckCircle, title: "Close & Execution",        body: "Coordinate contract execution including notarial requirements where applicable, and manage post-signature onboarding." },
      ],
      metrics: [
        { value: 90, prefix: "", suffix: "%", label: "Contract Execution Rate",   sublabel: "On qualified opportunities progressed" },
        { value: 3,  prefix: "", suffix: "",  label: "Avg Negotiation Rounds",    sublabel: "From first session to signed agreement" },
        { value: 48, prefix: "<", suffix: "h", label: "Brief Turnaround",         sublabel: "Pre-negotiation analysis delivered" },
      ],
    },
  ],

  // ── Operational Setup Support ────────────────────────────────────────────
  "operational-setup": [
    {
      title: "Local Entity Setup Coordination",
      description:
        "Establishing a legal presence in Greece involves GEMI (Business Registry) registration, tax authority enrollment, social security setup, and — for regulated sectors — additional licensing bodies, all of which run in a specific sequence. We coordinate the entire formation process with your legal and accounting advisors so nothing is missed, delayed, or duplicated.",
      process: [
        { icon: Layers,    title: "Entity Structure Advisory",   body: "Recommend the optimal legal form (IKE, AE, Branch, Rep Office) based on your activity, liability profile, and tax objectives." },
        { icon: Shield,    title: "Regulatory Pre-Clearance",    body: "Identify sector-specific licences or approvals required before the entity can lawfully trade." },
        { icon: Building2, title: "Registration Coordination",   body: "Manage the GEMI registration, AFM/VAT enrollment, and EFKA (social security) setup sequence with your local advisors." },
        { icon: DollarSign, title: "Bank Account & Treasury",    body: "Support corporate bank account opening and establish local payment infrastructure for day-one operations." },
      ],
      metrics: [
        { value: 8,   prefix: "", suffix: " wks", label: "Typical Formation Timeline", sublabel: "Entity registration to trading status" },
        { value: 3,   prefix: "", suffix: "",      label: "Structures Evaluated",       sublabel: "Per formation engagement" },
        { value: 100, prefix: "", suffix: "%",     label: "Pre-Trading Compliance",     sublabel: "All registrations complete before revenue" },
      ],
    },
    {
      title: "Office & Infrastructure Coordination",
      description:
        "Finding a compliant, functional office in Greece requires navigating lease law, a fragmented real estate market, and landlord expectations shaped by years of domestic negotiating patterns. We identify the right space, manage the lease process, coordinate fit-out, and establish connectivity — so you are operational from day one without spending your first months on facilities.",
      process: [
        { icon: ClipboardList, title: "Requirements Definition",  body: "Translate your headcount plan, operational model, and brand standards into a property brief for the market." },
        { icon: MapPin,        title: "Space Identification",     body: "Canvas relevant sub-markets (Athens CBD, Marousi corridor, Thessaloniki) and shortlist 3–5 qualifying options." },
        { icon: Scale,         title: "Lease Negotiation",        body: "Negotiate commercial terms, break clauses, and landlord fit-out contributions on your behalf." },
        { icon: Settings,      title: "Infrastructure Setup",     body: "Coordinate connectivity, IT infrastructure, access control, and compliance signage for day-one operations." },
      ],
      metrics: [
        { value: 5, prefix: "", suffix: "",      label: "Shortlisted Properties",   sublabel: "Delivered per office search engagement" },
        { value: 6, prefix: "", suffix: " wks",  label: "Lease-to-Handover",        sublabel: "Average timeline in this market" },
        { value: 3, prefix: "", suffix: " yr",   label: "Avg Lease Term Secured",   sublabel: "With break clauses negotiated in" },
      ],
    },
    {
      title: "Vendor & Supplier Identification",
      description:
        "Local vendor relationships are not built overnight, and the wrong vendor in a critical supply chain position is expensive to fix. We identify, vet, and onboard the right local suppliers across all categories — IT, facilities, logistics, professional services — so your operation starts on solid ground rather than inherited risk.",
      process: [
        { icon: Package,    title: "Vendor Category Mapping",    body: "Define the full inventory of local goods and services your operation will require from day one and beyond." },
        { icon: Search,     title: "Market Canvas & Shortlist",  body: "Identify candidates in each category, conduct capability assessments, and shortlist 3 vendors per category." },
        { icon: Star,       title: "Reference Verification",     body: "Check trading history, client references, and financial stability before any vendor recommendation is made." },
        { icon: CheckCircle, title: "Onboarding Facilitation",  body: "Negotiate commercial terms, facilitate contracting, and manage the transition-to-service period for each vendor." },
      ],
      metrics: [
        { value: 3, prefix: "", suffix: "+",     label: "Vendor Categories Managed", sublabel: "Per operational setup engagement" },
        { value: 3, prefix: "", suffix: " wks",  label: "Identification Per Category", sublabel: "Brief to ranked shortlist" },
        { value: 3, prefix: "", suffix: "",      label: "Vetted Candidates Per Category", sublabel: "With verified references" },
      ],
    },
    {
      title: "Operational Process Design",
      description:
        "Workflows designed for a headquarters context often fail in the Greek market — different banking rhythms, different document culture, different decision-making pace. We audit your current processes, identify what requires local adaptation, and design the workflows, SOPs, and escalation paths that actually function in this operating environment.",
      process: [
        { icon: Eye,       title: "HQ Process Audit",          body: "Map existing headquarters processes and identify which require local adaptation versus direct implementation." },
        { icon: GitBranch, title: "Local Adaptation Design",   body: "Redesign procurement, HR, reporting, and compliance workflows for the Greek regulatory and cultural context." },
        { icon: FileText,  title: "SOP Documentation",         body: "Produce Standard Operating Procedures in Greek and English for each critical workflow and decision point." },
        { icon: Users,     title: "Team Handoff & Training",   body: "Train your local team on adapted processes and establish an escalation framework for edge cases and exceptions." },
      ],
      metrics: [
        { value: 8,  prefix: "", suffix: "+",    label: "Core Processes Redesigned", sublabel: "Per operational setup engagement" },
        { value: 2,  prefix: "", suffix: " lang", label: "SOP Documentation",        sublabel: "Greek and English as standard" },
        { value: 30, prefix: "", suffix: " days", label: "Post-Launch Support",       sublabel: "Included with every process design engagement" },
      ],
    },
  ],

  // ── Regulatory & Administrative Coordination ─────────────────────────────
  "regulatory": [
    {
      title: "Legal, Tax & Regulatory Advisory Coordination",
      description:
        "Operating in Greece requires a coordinated advisory team — lawyer, tax advisor, regulatory specialist — each of whom typically works in isolation, producing advice that can conflict in practice. We act as the orchestration layer: ensuring all advisors are aligned, briefed identically, and moving at the pace your business requires. You get one consolidated view, not three competing ones.",
      process: [
        { icon: Users,        title: "Advisory Team Assembly",   body: "Where required, introduce qualified Greek legal, tax, and sector-specific regulatory advisors from our vetted professional network." },
        { icon: FileText,     title: "Brief Alignment",          body: "Ensure all advisors receive the same operational brief so their advice is consistent, complementary, and non-contradictory." },
        { icon: Calendar,     title: "Coordination Cadence",     body: "Weekly or bi-weekly alignment sessions with the full advisory team, consolidated into a single action log for your team." },
        { icon: AlertTriangle, title: "Issue Escalation",        body: "First point of escalation when conflicting advice or regulatory ambiguity arises — bringing all advisors to a working resolution." },
      ],
      metrics: [
        { value: 3,  prefix: "", suffix: "+",    label: "Advisors Coordinated",      sublabel: "Per engagement on average" },
        { value: 40, prefix: "", suffix: "%",    label: "Time Saving",               sublabel: "vs. self-coordinated advisory management" },
        { value: 1,  prefix: "", suffix: " log", label: "Consolidated Action Output", sublabel: "Weekly, for your team — no noise" },
      ],
    },
    {
      title: "Licensing & Compliance Support",
      description:
        "Every sector in Greece has its own licensing architecture. Some licences take weeks; others take 18 months. Applying in the wrong sequence can invalidate a submission entirely. We map the full licence and permit inventory for your specific activity, sequence applications correctly, and track every file to issue — including managing renewals so nothing lapses post-establishment.",
      process: [
        { icon: ClipboardList, title: "Licence Inventory",        body: "Produce a complete map of all licences, permits, and registrations required to trade legally in your specific sector." },
        { icon: Layers,        title: "Application Sequencing",   body: "Determine the correct application order — some are prerequisites for others — and build a dependency-aware timeline." },
        { icon: FileCheck,     title: "Submission & Tracking",    body: "Prepare or review applications, submit to relevant authorities, and manage all follow-up until issue." },
        { icon: RefreshCw,     title: "Renewal Management",       body: "Establish a recurring renewal calendar so no licence, permit, or registration lapses post-establishment." },
      ],
      metrics: [
        { value: 6,   prefix: "", suffix: "+",  label: "Licences Managed Per Setup",  sublabel: "Across permits, registrations, and approvals" },
        { value: 100, prefix: "", suffix: "%",  label: "Renewal Calendar Maintained", sublabel: "For all active client licences" },
        { value: 0,   prefix: "", suffix: "",   label: "Compliance Lapses",           sublabel: "Across all active client portfolios" },
      ],
    },
    {
      title: "Government Authority Liaison",
      description:
        "Effective engagement with Greek government authorities — whether ministries, AADE (tax authority), EFKA, or sector regulators — requires knowing the right departments, the right people, and the right way to communicate. Unrepresented foreign companies routinely wait months for responses that take days for those with established channels. We manage all direct authority engagement on your behalf.",
      process: [
        { icon: Map,          title: "Authority Mapping",          body: "Identify all relevant authorities and the specific departments and officials with jurisdiction over your activities." },
        { icon: Network,      title: "Relationship Activation",    body: "Leverage active ministry and authority relationships to ensure your file receives appropriate and timely attention." },
        { icon: FileText,     title: "Submission Management",      body: "Prepare and submit all required documentation in the correct format, to the correct department, first time." },
        { icon: MessageSquare, title: "Correspondence Handling",   body: "Manage incoming authority correspondence — translate, summarise for your team, and draft responses on your behalf." },
      ],
      metrics: [
        { value: 8,  prefix: "", suffix: "+",  label: "Ministry & Authority Contacts", sublabel: "In our active professional network" },
        { value: 35, prefix: "", suffix: "%",  label: "Faster Authority Response",     sublabel: "vs. unrepresented submissions" },
        { value: 1,  prefix: "", suffix: " lang", label: "Reporting Language",         sublabel: "All correspondence summarised in English" },
      ],
    },
    {
      title: "Regulatory Risk Assessment",
      description:
        "The Greek regulatory environment is continuously active — new legislation, EU directive transpositions, and sector-specific amendments create compliance obligations that headquarters teams cannot track from abroad. We monitor the landscape, assess materiality for your specific situation, and deliver structured briefings so risks are flagged before they become operational or financial problems.",
      process: [
        { icon: Shield,        title: "Regulatory Baseline",    body: "Document your current compliance status across all applicable frameworks at engagement commencement." },
        { icon: Bell,          title: "Change Monitoring",      body: "Monitor official legislative channels and sector-specific regulatory feeds relevant to your activity, continuously." },
        { icon: AlertTriangle, title: "Impact Assessment",      body: "When new regulations are issued, assess materiality and operational impact for your situation within 5 business days." },
        { icon: BarChart,      title: "Advisory Briefings",     body: "Quarterly regulatory briefings delivered to your legal and executive teams with a prioritised action register." },
      ],
      metrics: [
        { value: 6, prefix: "", suffix: "+",      label: "Frameworks Monitored",       sublabel: "Active regulatory coverage per client" },
        { value: 5, prefix: "", suffix: " days",  label: "Impact Assessment Turnaround", sublabel: "From new regulation to client briefing" },
        { value: 4, prefix: "", suffix: "×/yr",   label: "Regulatory Briefing Cadence", sublabel: "Quarterly executive-level update" },
      ],
    },
  ],

  // ── Local Operations Management ──────────────────────────────────────────
  "local-ops": [
    {
      title: "Local Operational Partnership",
      description:
        "We don't just advise — we run. As your local operational partner, we take end-to-end ownership of the Greek operation: vendor relationships, day-to-day coordination, issue resolution, and direct accountability to your headquarters. You gain a functioning local operation without the overhead of building and managing a local team from abroad.",
      process: [
        { icon: Eye,      title: "Operational Induction",      body: "2–4 weeks embedded in your operation to understand existing processes, relationships, and performance baselines." },
        { icon: FileText, title: "Mandate Establishment",      body: "Agree the scope of decision-making authority delegated to us and document in a formal management mandate." },
        { icon: Settings, title: "Steady-State Operations",    body: "Assume management of all in-scope functions: vendors, office, compliance calendar, and local HR coordination." },
        { icon: Send,     title: "Performance Reporting",      body: "Weekly operational dashboards and monthly performance reviews delivered directly to your headquarters team." },
      ],
      metrics: [
        { value: 85, prefix: "", suffix: "%",   label: "Local Decisions Covered",   sublabel: "Typical mandate scope per engagement" },
        { value: 4,  prefix: "<", suffix: " hrs", label: "Issue Response Time",     sublabel: "For operational escalations" },
        { value: 52, prefix: "", suffix: "×/yr", label: "Reporting Cadence",        sublabel: "Weekly dashboards as standard" },
      ],
    },
    {
      title: "Local Vendor & Partner Management",
      description:
        "Vendor relationships in Greece require active management — not annual contracts and passive monitoring. Performance deteriorates without regular contact; pricing drifts at renewal without someone who knows the market. We manage SLA performance, resolve disputes, renegotiate terms at renewal, and replace underperforming vendors before they affect your operation.",
      process: [
        { icon: ClipboardList, title: "Vendor Register",          body: "Maintain a live register of all local vendors with contract terms, performance SLAs, and upcoming renewal dates." },
        { icon: BarChart,      title: "SLA Performance Tracking", body: "Monitor vendor performance against agreed SLAs on a monthly basis and escalate deviations immediately." },
        { icon: Users,         title: "Relationship Management",  body: "Maintain regular contact with vendor account managers and represent your interests in quarterly business reviews." },
        { icon: RefreshCw,     title: "Renegotiation & Renewal",  body: "Lead commercial renegotiations at contract renewal and manage vendor replacement when performance is insufficient." },
      ],
      metrics: [
        { value: 9,  prefix: "", suffix: "+",   label: "Vendors Managed Per Client", sublabel: "Average across active engagements" },
        { value: 15, prefix: "", suffix: "%",   label: "Cost Reduction at Renewal",  sublabel: "Average on first renegotiation" },
        { value: 12, prefix: "", suffix: "×/yr", label: "SLA Performance Reviews",  sublabel: "Monthly reporting per vendor" },
      ],
    },
    {
      title: "Project Coordination & Execution",
      description:
        "Local projects — infrastructure deployments, office relocations, regulatory submissions, or commercial launches — require someone on the ground who can move fast, navigate bureaucracy, and hold local stakeholders accountable. We manage Greek-side execution end-to-end, keeping your HQ team informed without pulling them into local operational detail.",
      process: [
        { icon: Target,   title: "Project Scoping",              body: "Define deliverables, timeline, budget, and success criteria in alignment with your HQ project team." },
        { icon: Network,  title: "Stakeholder Management",       body: "Identify and engage all Greek-side stakeholders — authorities, vendors, landlords, partners — and assign clear accountability." },
        { icon: Flag,     title: "Execution Management",         body: "Run the project on the ground: site visits, outstanding item management, blocker resolution, and timeline control." },
        { icon: FileText, title: "Completion & Handover",        body: "Project closure report with lessons learned, outstanding warranties, and any ongoing compliance obligations." },
      ],
      metrics: [
        { value: 1,  prefix: "€", suffix: "M+",  label: "Avg Project Value Managed", sublabel: "Across active client engagements" },
        { value: 82, prefix: "", suffix: "%",     label: "On-Time Delivery Rate",     sublabel: "Across managed projects" },
        { value: 3,  prefix: "", suffix: "",      label: "Project Types Covered",     sublabel: "Regulatory, infrastructure, commercial" },
      ],
    },
    {
      title: "Structured Reporting to Parent Company",
      description:
        "Your headquarters needs accurate, timely intelligence on the Greek operation — without the noise. We design and maintain a three-cadence reporting framework: operational snapshots weekly, performance reviews monthly, and strategic updates quarterly. Every output is in English, structured for executive consumption, and designed so your board sees what they need without having to ask for it.",
      process: [
        { icon: Calendar,   title: "Reporting Framework Design", body: "Agree metrics, formats, and cadences with your CFO/COO before operations begin — no retrofitting required." },
        { icon: Send,       title: "Weekly Operational Snapshot", body: "A structured 1-page summary covering active issues, progress against plan, and priority actions for the coming week." },
        { icon: BarChart,   title: "Monthly Performance Review", body: "Full review covering financial, operational, and commercial KPIs with variance analysis against targets." },
        { icon: TrendingUp, title: "Quarterly Strategic Update", body: "Board or executive committee presentation covering market conditions, risks, opportunities, and strategic options." },
      ],
      metrics: [
        { value: 3, prefix: "", suffix: "",      label: "Reporting Cadences",       sublabel: "Weekly, monthly, and quarterly" },
        { value: 1, prefix: "", suffix: " lang", label: "Reporting Language",       sublabel: "English throughout, for every output" },
        { value: 5, prefix: "4.", suffix: "/5",  label: "HQ Satisfaction Score",    sublabel: "Average across active engagements" },
      ],
    },
  ],

  // ── Business Development & Expansion ────────────────────────────────────
  "business-dev": [
    {
      title: "Business Opportunity Identification",
      description:
        "The Greek and regional market generates a continuous stream of procurement events, infrastructure tenders, and private-sector opportunities — the majority of which never reach international companies through conventional channels. We monitor the full landscape and deliver pre-qualified, intelligence-backed opportunities directly to your commercial team, with enough context to act immediately.",
      process: [
        { icon: Bell,      title: "Opportunity Feed Setup",    body: "Configure monitoring across public procurement platforms (ESIDIS, DIAVGEIA), private databases, and sector channels for your category." },
        { icon: Crosshair, title: "Qualification Filter",      body: "Apply a structured filter — value, decision timeline, competitive landscape, relationship entry — before escalating." },
        { icon: FileText,  title: "Opportunity Briefing",      body: "A 1-page brief per qualified lead: strategic fit assessment, buyer profile, competitive situation, and recommended approach." },
        { icon: Zap,       title: "Entry Facilitation",        body: "Where appropriate, open the first relationship door and arrange the introductory meeting with the relevant buyer." },
      ],
      metrics: [
        { value: 12,   prefix: "", suffix: "+",   label: "Qualified Opps/Quarter",   sublabel: "Escalated with full opportunity brief" },
        { value: 3000, prefix: "", suffix: "+",   label: "Tenders Reviewed Monthly", sublabel: "Public procurement monitoring" },
        { value: 2,    prefix: "€", suffix: "M+", label: "Avg Opportunity Value",    sublabel: "Across escalated qualified leads" },
      ],
    },
    {
      title: "Strategic Partnership Development",
      description:
        "The right strategic partner in Greece multiplies your market reach without multiplying your cost base. The wrong one extracts margin, blocks your direct channel, and is legally expensive to exit. We identify, evaluate, and negotiate partnerships that are structurally sound from the first conversation — with exclusivity terms, performance obligations, and exit provisions built in.",
      process: [
        { icon: Target,     title: "Partnership Strategy",     body: "Define what you need from a Greek partner: distribution coverage, complementary capability, regulatory access, or customer relationships." },
        { icon: Search,     title: "Partner Identification",   body: "Canvas the market and produce a longlist of 10–15 candidate organisations across your target partner profile." },
        { icon: CheckCircle, title: "Due Diligence",           body: "Reference checks, financial screening, and capability interviews for shortlisted candidates within 3 weeks." },
        { icon: Scale,      title: "Term Negotiation",         body: "Support commercial negotiation of partnership terms: exclusivity, territory, margin structure, and performance obligations." },
      ],
      metrics: [
        { value: 12, prefix: "", suffix: "+",     label: "Longlist Candidates",      sublabel: "Identified per partnership engagement" },
        { value: 3,  prefix: "", suffix: " wks",  label: "Due Diligence Timeline",   sublabel: "From shortlist to vetted recommendation" },
        { value: 75, prefix: "", suffix: "%",     label: "Active at 24 Months",      sublabel: "Of structured partnerships introduced" },
      ],
    },
    {
      title: "Customer Acquisition Support",
      description:
        "We don't generate awareness — we generate customers. From target account definition through to closed contract, we run the Greek-side of your commercial process with the pace and accountability of an internal sales team. The engagement covers ICP definition, account penetration, pipeline management, and revenue recognition coordination.",
      process: [
        { icon: UserCheck, title: "ICP Definition",             body: "Define the Ideal Customer Profile for the Greek market with your commercial team, calibrated to local buying patterns." },
        { icon: Target,    title: "Account Penetration",        body: "Execute a structured penetration programme across the top 30–50 target accounts with weekly progress tracking." },
        { icon: BarChart,  title: "Pipeline Management",        body: "Maintain a live CRM pipeline with weekly updates and a monthly pipeline health review for your commercial leadership." },
        { icon: DollarSign, title: "Revenue Recognition",       body: "Coordinate with your finance team on contract execution, invoicing cadence, and collections from local customers." },
      ],
      metrics: [
        { value: 40, prefix: "", suffix: "+",    label: "Target Accounts Active",   sublabel: "In penetration per engagement" },
        { value: 5,  prefix: "", suffix: " mo",  label: "First Acquisition Avg",    sublabel: "From engagement start to first closed deal" },
        { value: 78, prefix: "", suffix: "%",    label: "12-Month Retention Rate",  sublabel: "Of acquired customers" },
      ],
    },
    {
      title: "Regional Expansion: Balkans, SEE & Middle East",
      description:
        "Greece is the entry point, not the ceiling. Our network extends across Bulgaria, Romania, Serbia, Cyprus, and into the Gulf states — markets where the same entry challenges apply but where fewer international competitors have yet established positions. We provide the ground-level intelligence, in-country relationships, and regulatory mapping to evaluate and sequence your regional expansion.",
      process: [
        { icon: Map,     title: "Market Prioritisation",      body: "Evaluate 8–10 regional markets against product fit, competitive environment, and operational complexity." },
        { icon: Network, title: "In-Country Network",         body: "Engage local partner organisations in priority markets to conduct ground-level opportunity assessment." },
        { icon: Shield,  title: "Regulatory Mapping",         body: "Produce a regulatory entry brief for each priority market: licensing, entity requirements, and key authority relationships." },
        { icon: Compass, title: "Phased Entry Plan",          body: "A sequenced regional roadmap with resource requirements, timelines, and go/no-go criteria for each market." },
      ],
      metrics: [
        { value: 9, prefix: "", suffix: "+",    label: "Markets Assessed",          sublabel: "Per regional expansion engagement" },
        { value: 6, prefix: "", suffix: "",     label: "Countries — Active Network", sublabel: "In-country relationships maintained" },
        { value: 4, prefix: "", suffix: " mo",  label: "First Regional Opportunity", sublabel: "Average from engagement start" },
      ],
    },
  ],
};
