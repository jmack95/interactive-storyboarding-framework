/* =============================================================================
   Contoso Countryside Demo Hub — DATA
   -----------------------------------------------------------------------------
   THIS FILE IS THE EASIEST PLACE TO EDIT THE DEMO.
   Everything the user sees (farm names, labels, scenario story content, and
   where each farm sits on the map) is defined here. You normally won't need to
   touch app.js or styles.css to change content.

   Source of truth: "Contoso Agro – CRM Demo, Consolidated Use-Case Briefing"
   (Use Cases UC1–UC5). Items grounded in that document are real; anything that
   is an illustrative stand-in (farmer names, hectares, product names, discount
   thresholds, account counts) is explicitly marked "[Placeholder]".

   -----------------------------------------------------------------------------
   HOW TO EDIT
   -----------------------------------------------------------------------------
   • Change wording  -> edit the text inside each scenario below.
   • Move a farm     -> change its "tile" [col, row] in MAP_CONFIG.farms.
                        The grid is isometric; bigger col pushes right-down,
                        bigger row pushes left-down. Try small changes (±1).
   • Recolour a crop -> change "crop" to one of the keys in MAP_CONFIG.cropColors
                        (or add your own colour there).
   • Add a farm      -> add an entry to SCENARIOS *and* a matching entry (same
                        id) to MAP_CONFIG.farms.
   • Rebrand colours -> see styles.css :root variables (top of that file).
   ============================================================================= */

/* -----------------------------------------------------------------------------
   MAP_CONFIG — the physical layout of the countryside scene.
   tile: [col, row] position on the isometric grid (grid is GRID_SIZE x GRID_SIZE).
   crop: colour theme of the farm's surrounding fields (see cropColors).
   variant: small visual differences between farmsteads (0–3) so they don't all
            look identical.
   -------------------------------------------------------------------------- */
const MAP_CONFIG = {
  gridSize: 13,            // number of tiles per side of the land
  // Crop / field colour palette (top face, then the darker left/right sides
  // are derived automatically in app.js).
  cropColors: {
    wheat:     "#e8c15a",  // golden cereal
    youngCorn: "#7cb342",  // bright green rows
    vine:      "#9ccc65",  // light vineyard green
    rapeseed:  "#f2d24b",  // yellow flowering
    plowed:    "#9c6b43",  // brown tilled soil
    pasture:   "#86c06a",  // grazing green
    orchard:   "#6fae54",  // mid green
    fallow:    "#c2b280",  // dry stubble
  },
  // The 6 farms shown in this demo, and where they live on the map.
  // id must match a SCENARIOS id. Numbered left-to-right, top row then bottom row.
  farms: [
    { id: "nav-overview",     tile: [2.3, 2.2],  crop: "wheat",     variant: 0 },
    { id: "flow-until-visit", tile: [6.5, 1.8],  crop: "youngCorn", variant: 1 },
    { id: "sales-steering",   tile: [10.4, 2.2], crop: "rapeseed",  variant: 2 },
    { id: "flow-after-visit", tile: [2.4, 9.4],  crop: "vine",      variant: 3 },
    { id: "quote-management", tile: [6.5, 9.2],  crop: "pasture",   variant: 0 },
    { id: "master-data-gdpr", tile: [10.4, 9.6], crop: "orchard",   variant: 2 },
  ],
};

/* -----------------------------------------------------------------------------
   SCENARIOS — the storyboard card content for each farm.
   Field meanings (the card renders them in this order):
     number       short order shown on the map sign + card
     name         scenario title (also the floating sign above the farm)
     sign         very short label shown on the map sign (keep it brief)
     farmer       the farm/account name shown on the sign + card
     useCase      which briefing use case(s) this maps to
     summary      one-line business summary
     context      customer / farmer context
     items        array — items / systems involved (bullets)
     problem      key business problem
     solution     Microsoft solution demonstrated
     sequence     array — ordered demo actions
     outcome      expected business outcome
     talk         suggested presenter talk track (spoken aloud)
   Anything illustrative is tagged "[Placeholder]".
   -------------------------------------------------------------------------- */
const SCENARIOS = [
  /* ---------------------------------------------------------- FARM 1 (intro) */
  {
    id: "nav-overview",
    number: 1,
    name: "Navigating Dynamics 365 Sales",
    sign: "Navigating Dynamics 365 Sales",
    farmer: "The everyday workspace for every Contoso sales rep",
    useCase: "Demo introduction · navigation & user experience",
    keyMessage: {
      headline:
        "An introduction to navigating Dynamics 365 Sales — the everyday workspace where every Contoso sales rep finds, understands and acts on their farmers.",
      points: [
        "One home for every farmer — accounts, contacts, activities and history together in a single, familiar workspace.",
        "Everything is connected: leads, opportunities, quotes and visits all link back to the same farmer record, with nothing re-keyed.",
        "AI, Copilot and Teams are built in, ready to surface insights and drive the next step from inside the flow of work.",
      ],
    },
    items: [
      "Dynamics 365 Sales",
      "Microsoft 365 Copilot",
      "Sales Accelerator & Sales Sequences",
      "Microsoft Teams",
      "Microsoft Power BI",
      "Microsoft Power Automate",
    ],
    sequence: [
      { title: "A familiar, intuitive interface", text: "The Sales Hub feels instantly familiar to anyone who uses Microsoft 365, so reps are productive on day one with little training and low resistance to adopt." },
      { title: "Dashboards that show what matters", text: "Personalised, interactive dashboards put each rep's pipeline, priorities and performance front and centre — decisions are made on live data, not spreadsheets." },
      { title: "Find anything in seconds", text: "A fast, intelligent search jumps straight to any farmer, contact or record, so reps spend their time selling instead of hunting for information." },
      { title: "A 360° view of every farmer", text: "Account and contact views bring profile, crops, history and relationships into one place, so every conversation is informed and personal." },
      { title: "Guided activities & tasks", text: "The Sales Accelerator turns a to-do list into a prioritised work queue with the next best action, so no follow-up is missed and every rep stays on top of their day." },
      { title: "Work where you collaborate", text: "Native Microsoft Teams integration means reps discuss, share and get approvals on a farmer without ever leaving the flow — joining up the whole team around the deal." },
      { title: "Copilot built into the application", text: "Microsoft 365 Copilot is embedded directly in Dynamics, summarising records and drafting the next step in seconds — turning everyday data into action without switching tools. With the new Data Exploration Agent, reps can also find records and filter views with natural language — e.g. “opportunities closing in the next 3 months” — so they analyse data instead of building views by hand." },
    ],
  },

  /* -------------------------------------------------------------------- FARM 2 */
  {
    id: "flow-until-visit",
    number: 2,
    name: "Flow until Visit",
    sign: "Flow Until Visit",
    farmer: "Danube Crop Farm  ·  Primary contact: Jake McCormack",
    useCase: "UC1 Flow until Visit · UC2 Sales Steering",
    // NOTE (Scenario 2): the Business summary, Key business problem, Microsoft
    // solution and Expected outcome cards are intentionally hidden. They're
    // commented out below — uncomment any to bring its card back. The Customer
    // context card IS shown (it introduces the farm we're about to visit).
    // summary:
    //   "The rep starts the day in Microsoft 365 Copilot, asks who to visit this week, and gets a prioritised, classification-driven list and a complete visit-prep view.",
    // Key demo message — a clear headline plus a few crisp value statements.
    //   headline -> the one-line "why this matters"
    //   points   -> short, single-line value statements (keep to 3–4)
    keyMessage: {
      headline:
        "Less time preparing visits means more visits per year and higher sales productivity.",
      points: [
        "The system helps each rep decide who to visit, when to visit, and which topics to discuss.",
        "Reps can work with CRM using natural language, then seamlessly open Dynamics 365 to access the complete farmer profile, AI recommendations, and visit history.",
        "AI prioritises the right farmers, ensuring every visit is focused on the highest-value opportunities rather than guesswork.",
      ],
    },
    // Key details surfaced as compact chips in the header (most important facts).
    heroFacts: [
      "≈ 2,400 ha",
      "Wheat · Maize · Sunflower · Rapeseed",
      "Brăila, lower Danube",
      { label: "Credit limit", value: "$75,000.00" },
      "Private ownership",
      "Precision agriculture",
    ],
    items: [
      "Microsoft 365 Copilot",
      "Dynamics 365 Sales",
      "Sales Accelerator & Sales Sequences",
      "Microsoft Power BI",
    ],
    // problem:
    //   "Reps lose preparation time navigating CRM manually and it is unclear whom to prioritise. Management needs scalable, data-based steering of visit frequency across the region.",
    // solution:
    //   "Conversational CRM through Copilot returns a Dynamics-style prioritised list; FieldOps classification derives visit frequency; a single visit-prep screen answers what I know, what's missing, which products are relevant and what to raise.",
    // Sequence supports plain strings OR { title, text } for the road nodes.
    // Framed as the value the Contoso team gets at each step (not presenter clicks).
    sequence: [
      { title: "Ask Copilot for your priorities", text: "Open a dialog with Microsoft 365 Copilot and ask for your prioritised accounts — your whole book of business, ranked by value, in one natural-language question." },
      { title: "See this week's planned visits", text: "From that list, view all the planned visits for these accounts this week, so the week is mapped out at a glance instead of pieced together by hand." },
      { title: "Know exactly what to discuss", text: "Prepare right there: the right products for the season, the open topics to raise and the data to confirm — so you walk in knowing exactly what to discuss." },
      { title: "Step into Dynamics 365", text: "Open the chosen farmer in the Dynamics 365 Sales UI — the complete profile, history, crops and AI recommendations, all in one place." },
      { title: "Work the plan in Sales Accelerator", text: "Move into the Sales Accelerator, where a guided sequence lays out the next best steps — calls, follow-ups and reminders — so nothing slips and every visit drives forward." },
    ],
    // outcome:
    //   "Less preparation time and more meaningful visits per year, with consistent, defensible prioritisation across the whole region.",
    // talk:
    //   "“Notice the rep never kept Dynamics open in a tab clicking around. They simply asked, in plain language, who to see this week — and the system answered with a prioritised, classification-driven list, then opened a single screen with everything needed for the visit.”",
  },

  /* -------------------------------------------------------------------- FARM 3 */
  {
    id: "sales-steering",
    number: 3,
    name: "Sales Steering: Key Account Planning & Regional Manager Support",
    sign: "Sales Steering: Key Account Planning & Regional Managers Support",
    farmer: "Regional sales management",
    useCase: "UC2 Sales Steering",
    // Streamlined card: Business summary, Customer context, Key business problem,
    // Microsoft solution and Expected outcome are intentionally omitted so this
    // card shows only Key demo message, Solution components and the sequence.
    keyMessage: {
      headline:
        "This use case shows how Sales Managers can steer direct and indirect sales activities from one central cockpit.",
      points: [
        "By combining Sales Accelerator automation, Sales Sequences and rule-based task assignment with FieldOps Strategic Visit Planning, the system helps translate customer classification and scoring into structured visit rhythms, automated visit suggestions and transparent team execution tracking.",
      ],
    },
    items: [
      "Microsoft Dynamics 365 Sales",
      "Sales Accelerator",
      "Sales Sequences",
      "Power BI",
      "FieldOps Strategic Visit Planning",
      "FieldOps Classification and Scoring",
      "FieldOps Scheduler",
      "PCF Controls",
    ],
    sequence: [
      { title: "Start from the Sales Manager cockpit", text: "The demo starts with a dashboard from the Sales Manager view. Map, list and board views provide a clear overview of customers, activities and sales opportunities." },
      { title: "Switch between Direct and Indirect Sales", text: "Sales Managers can move seamlessly between the Indirect Sales view for distributors and the Direct Sales view for farms. This allows different sales channels to be managed in one consistent interface." },
      { title: "Automate activities in the Sales Accelerator", text: "In the Sales Accelerator, we show how tasks can be triggered automatically for specific sales events. Using the launch of a product innovation as an example, activities are created and assigned to the right Sales Managers." },
      { title: "Show the logic behind the automation", text: "Sales Sequences reveal how recurring activities and tasks are structured in the system. Assignment Rules define how these activities are distributed and who is responsible for the next step." },
      { title: "Turn customer classification into visit strategy", text: "A customer classification inspired by a BCG matrix becomes the basis for strategic visit planning. Depending on the customer segment and potential, the system derives the right visit rhythm automatically." },
      { title: "Generate visit suggestions for Sales Reps", text: "Based on the classification and visit rhythm, the system creates automated visit suggestions. Sales Reps can review these suggestions in the scheduler and place them directly into their calendar." },
      { title: "Track team productivity and execution", text: "The demo ends with a productivity dashboard for Sales Managers. It helps them track visits, activities and team execution, making it clear whether strategic planning is turning into real sales action." },
    ],
  },

  /* -------------------------------------------------------------------- FARM 4 */
  {
    id: "flow-after-visit",
    number: 4,
    name: "Flow after Visit: Documentation of the Visit",
    sign: "Flow After Visit: Documentation of the Visit",
    farmer: "",
    useCase: "UC3 Flow after Visit",
    keyMessage: {
      headline:
        "Less time spent on visit reports leads to more visits per year and higher sales productivity.",
      points: [
        "The system helps reps capture information from their visits quickly and accurately.",
        "Declarative agents in Microsoft 365 connect directly to business apps, so visit data is captured in the flow of work.",
        "Low-code Power Apps optimised for visits work even when offline, while business process flows and sequences guide reps through consistent, complete capture.",
      ],
    },
    // Streamlined card: Business summary, Customer context, Key business problem,
    // Microsoft solution and Expected outcome are intentionally omitted so this
    // card shows only Key demo message, Solution components and the sequence.
    items: [
      "Dynamics 365 Sales",
      "M365 Copilot",
      "Power Apps",
      "Business Process Flows",
      "Sequences",
      "MCP (Model Context Protocol)",
    ],
    sequence: [
      { title: "Find the visit in M365 Copilot", text: "The rep starts in Microsoft 365 Copilot and uses a declarative agent to search for their farm visits — no navigating through CRM screens to find the right record." },
      { title: "Append notes any way you like", text: "Notes are added to the visit however suits the rep — handwritten, typed or by voice — supporting true mobile, in-the-field capture with no rigid form to complete." },
      { title: "AI turns notes into structured updates", text: "The notes are processed and an update-form widget is populated with the extracted insights — updated crop, address, new stakeholders, products discussed, competitor mentions and agreed next steps — writing straight back to the CRM with mandatory fields, field logic and autocomplete keeping the data complete and consistent." },
      { title: "Review the changes the agent made", text: "The agent returns a clear summary of the data changes it applied, and the rep can jump into the CRM to check the updated visit — confidence that the right information landed in the right place." },
      { title: "Capture on the go with Power Apps", text: "As an alternative approach, a low-code Power App gives an online/offline-enabled experience purpose-built for capturing insights while visiting farms or retailers — even with no signal, syncing when back online." },
      { title: "Consolidate into tendencies and action", text: "As visit data flows in, the system consolidates it to reveal tendencies — a rising interest in specific products can trigger a new campaign, or a shifting market can surface a new segmentation group." },
    ],
  },

  /* -------------------------------------------------------------------- FARM 5 */
  {
    id: "quote-management",
    number: 5,
    name: "Quote Management",
    sign: "Quote Management",
    farmer: "",
    useCase: "UC4 Quote Management",
    // Streamlined card: Business summary, Customer context, Key business problem,
    // Microsoft solution and Expected outcome are intentionally omitted so this
    // card shows only Key demo message, Solution components and the sequence.
    keyMessage: {
      headline:
        "The quote management process enables Sales Reps and Sales Managers to create, manage and finalize customer quotes directly from an Opportunity.",
      points: [
        "The demo highlights how quote history, automated discount recommendations, quote finalization and document generation support a more transparent, guided and efficient sales process.",
      ],
    },
    items: [
      "Microsoft Dynamics 365 Sales",
      "Power Automate",
      "PCF Controls",
    ],
    sequence: [
      { title: "Start from the Opportunity", text: "The demo starts on an Opportunity, giving a brief overview of the sales context. The focus stays light here, as the Opportunity is only the starting point for the quote management process." },
      { title: "Review the Quote history", text: "From the Opportunity, we show how users can see the full Quote history. Multiple Quotes may exist for one sales opportunity, with different statuses such as draft, won or lost." },
      { title: "Create a new Quote from the Opportunity", text: "The next step shows how a new Quote can be created directly from the Opportunity. This connects the commercial proposal back to the original sales opportunity and keeps the process traceable." },
      { title: "Open and explain the Quote", text: "We then open a Quote and walk through its key details. The Quote includes products, pricing, discounts and the relevant customer and opportunity data needed to continue the process." },
      { title: "Use automated discount recommendations", text: "The central part of the demo focuses on the system’s discount recommendation logic. Users can see how the application automatically suggests appropriate discounts based on the Quote context and predefined business rules." },
      { title: "Finalize the Quote and generate the document", text: "Once the Quote is reviewed and completed, we show how it can be finalized. The demo also includes a look at the Quote document that is generated from the structured Quote data." },
      { title: "Track Quotes in the overview dashboard", text: "The use case ends in a Quote overview dashboard. Sales Managers and Sales Reps can monitor all Quotes, including their status, related activities, next steps and overall progress." },
    ],
  },

  /* -------------------------------------------------------------------- FARM 6 */
  {
    id: "master-data-gdpr",
    number: 6,
    name: "Master Data Entry & GDPR",
    sign: "Master Data Entry & GDPR",
    farmer: "Master data quality & GDPR compliance",
    useCase: "UC5 Master Data Entry & GDPR",
    // Streamlined card: Business summary, Customer context, Key business problem,
    // Microsoft solution and Expected outcome are intentionally omitted so this
    // card shows only Key demo message, Solution components and the sequence.
    keyMessage: {
      headline:
        "This use case shows how Sales Reps can simplify master data entry, improve data quality and manage GDPR-relevant customer consent in a guided and efficient way.",
      points: [
        "The demo highlights how AI-supported data extraction, natural language filtering, consent management and M365 Copilot-based CoWork automation help reduce manual effort while keeping CRM data accurate, structured and compliant.",
      ],
    },
    items: [
      "Microsoft Dynamics 365 Sales",
      "Microsoft Dynamics 365 Customer Insights - Journeys",
      "M365 Copilot",
      "CoWork",
    ],
    sequence: [
      { title: "Capture account data with AI support", text: "The demo starts from the Sales Rep perspective, showing how account information can be entered more efficiently. By uploading a press article, relevant data is extracted and used to populate CRM account fields." },
      { title: "Work with CRM data using natural language", text: "Next, we show how Sales Reps can filter CRM lists using natural language. This allows users to find and narrow down relevant records without manually building complex filter criteria." },
      { title: "Manage consent and preferences", text: "The demo then moves into Microsoft Dynamics 365 Customer Insights - Journeys to show how consent topics and preference center processes are supported. On the Contact record, users can review and manage customer permissions and GDPR-relevant consent information." },
      { title: "Monitor data quality", text: "A short look at the Data Quality Dashboard shows how teams can monitor the completeness and quality of CRM master data. This helps identify missing information, inconsistencies and areas for improvement." },
      { title: "Create CRM records from emails with M365 Copilot and CoWork", text: "The use case ends with a modern M365 Copilot and CoWork scenario. Information from a large number of emails is extracted automatically and transformed into structured CRM records." },
    ],
  },
];

/* The benefit strip shown in the header — one pill per core demo scenario.
   Outcome-led wording tuned for Contoso stakeholders. Arrows are added
   automatically between items. Edit these to re-label the strip. */
const REP_JOURNEY = [
  "Plan visits effortlessly",          // Flow until Visit
  "Structured key-account planning",   // Sales Steering
  "Less time on visit reports",        // Flow after Visit
  "Faster, governed quotes",           // Quote Management
  "Simple data maintenance",           // Master Data & GDPR
];
