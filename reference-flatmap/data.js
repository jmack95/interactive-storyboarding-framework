/* =============================================================================
   Leeds Building Society — "Know me → Understand me → Help me → Remember me"
   Connected Member Engagement Demo Hub — DATA
   -----------------------------------------------------------------------------
   THIS FILE IS THE EASIEST PLACE TO EDIT THE DEMO.
   Everything the user sees (building names, labels, scenario story content, and
   where each building sits on the high street) is defined here. You normally
   won't need to touch app.js or styles.css to change content.

   DEMO FOCUS
   ----------
   A "Day in the Life" of connected member engagement for Leeds Building Society.
   Primary platform: Dynamics 365 Customer Service Premium (full Contact Centre
   capabilities), Dynamics 365 Customer Insights – Data, and Customer Insights –
   Journeys. Amplified by Microsoft 365 Copilot and a Copilot Studio "LBS Member
   Concierge". The story is member engagement + insight.

   NARRATIVE SPINE (shown in the header strip):
      Know me  →  Understand me  →  Help me  →  Remember me

   HERO PERSONAS
     • Olivia Blake — the member we follow across the whole journey. [Persona]
     • Amy Black    — the LBS representative/colleague who serves Olivia and is the
                      hero of the colleague-experience scenario. [Persona — assumed
                      to be a colleague; change if Amy is a second member.]

   Supporting personas woven in: Customers in Vulnerable Circumstances (CiVC),
   and the colleague who today juggles 20+ systems.

   GROUNDING NOTE: Leeds Building Society is a real UK mutual (savings & mortgages).
   Every member/persona detail, figure and specific below is an ILLUSTRATIVE
   stand-in and is tagged "[Placeholder]" (or "[Persona]"). Replace with the real
   demo script before presenting.

   -----------------------------------------------------------------------------
   HOW TO EDIT
   -----------------------------------------------------------------------------
   • Change wording  -> edit the text inside each scenario below.
   • Move a building -> change its "tile" [col, row] in MAP_CONFIG.buildings.
   • Recolour a zone -> change "crop" to a key in MAP_CONFIG.cropColors.
   • Change a shape  -> set "kind" (flagship | shop | house | desk | advice | vault).
   • Add a building  -> add to SCENARIOS *and* a matching entry (same id) to
                        MAP_CONFIG.buildings.
   • Rebrand colours -> see styles.css :root variables (top of that file).
   ============================================================================= */

const MAP_CONFIG = {
  // Flat illustrated city-map layout. Each building has a pixel position on the
  // 1600 x 1040 map canvas, a "kind" (which building illustration to draw) and a
  // "channel" (how the member is reaching out on that beat — shows as a badge).
  //   pos:     [x, y] anchor (ground-centre of the building) on the map canvas
  //   kind:    hq | shop | office | home | care | backoffice
  //   channel: branch | chat | omni | app | care | copilot
  // id must match a SCENARIOS id. Move a building by changing its pos.
  buildings: [
    { id: "know-me",       pos: [360, 372],  kind: "hq",         channel: "branch"  },
    { id: "understand-me", pos: [808, 250],  kind: "shop",       channel: "chat"    },
    { id: "help-me",       pos: [1258, 356], kind: "office",     channel: "omni"    },
    { id: "remember-me",   pos: [360, 726],  kind: "home",       channel: "app"     },
    { id: "civc-care",     pos: [820, 772],  kind: "care",       channel: "care"    },
    { id: "colleague-one", pos: [1262, 738], kind: "backoffice", channel: "copilot" },
  ],
};
// app.js iterates MAP_CONFIG.farms — keep that wiring intact.
MAP_CONFIG.farms = MAP_CONFIG.buildings;

/* -----------------------------------------------------------------------------
   SCENARIOS — the storyboard card content for each building.
   Fields render in this order: keyMessage, heroFacts, items (logo tiles),
   summary, context(+contextFacts), problem, solution, sequence (winding street),
   outcome. Omit any field to hide that card block.
   -------------------------------------------------------------------------- */
const SCENARIOS = [

  /* ============================================================ 1 · KNOW ME */
  {
    id: "know-me",
    number: 1,
    name: "Know me — Member 360",
    sign: "Know Me",
    farmer: "Olivia Blake · a complete, single view of the member",
    useCase: "Member 360 · Customer Insights – Data · unified profile",
    keyMessage: {
      headline:
        "The moment Olivia gets in touch, the representative already knows her — one complete, trusted view of the member, not twenty systems.",
      points: [
        "A single Member 360 brings Olivia's products, recent activity, service history, preferences and support needs into one screen.",
        "Customer Insights – Data unifies fragmented source systems into one trusted profile, resolved to the real Olivia.",
        "The representative starts every conversation informed, so Olivia feels recognised from the very first second.",
      ],
    },
    heroFacts: [
      "Olivia Blake [Persona]",
      "Member since 2016 [Placeholder]",
      { label: "Products", value: "Residential mortgage · Cash ISA [Placeholder]" },
      { label: "Preferred channel", value: "App & web chat [Placeholder]" },
      "Digitally active, values self-service [Placeholder]",
    ],
    items: [
      "Dynamics 365 Customer Insights - Data",
      "Dynamics 365 Customer Service Premium",
      "Microsoft 365 Copilot",
    ],
    context:
      "Olivia is a digitally-active member with a mortgage and savings. Her data lives across many back-end systems, so today no one sees the whole picture at once. [Placeholder]",
    problem:
      "Member data is fragmented across 20+ systems. Colleagues stitch the picture together manually, causing latency, inconsistency and a member who has to re-explain who they are. [Placeholder]",
    solution:
      "Customer Insights – Data unifies and resolves the sources into one trusted profile; Dynamics 365 surfaces it as a live Member 360 the moment Olivia makes contact. [Placeholder]",
    sequence: [
      { title: "Unify the sources", text: "Customer Insights – Data ingests and matches fragmented records into one resolved profile of Olivia. [Placeholder]" },
      { title: "One Member 360", text: "Products, activity, history, preferences and support needs appear on a single screen. [Placeholder]" },
      { title: "Recognised instantly", text: "The representative opens the conversation already knowing Olivia — no hunting, no re-keying. [Placeholder]" },
    ],
    outcome:
      "Faster, warmer, more consistent service from the first second — and the trusted data foundation the other three beats build on. [Placeholder]",
    talk: "Open here. Establish Olivia and the single view. Everything after this hangs off Member 360. [Placeholder]",
  },

  /* ====================================================== 2 · UNDERSTAND ME */
  {
    id: "understand-me",
    number: 2,
    name: "Understand me — Member Concierge",
    sign: "Understand Me",
    farmer: "Olivia Blake · the LBS Member Concierge understands why she's here",
    useCase: "Copilot Studio concierge · conversation history · sentiment · summaries",
    keyMessage: {
      headline:
        "Olivia should never have to repeat herself — the LBS Member Concierge understands why she's here before a human even joins.",
      points: [
        "A Copilot Studio 'Member Concierge' greets Olivia across voice and chat and captures her intent in her own words.",
        "Conversation history and sentiment travel with her, so context is never lost between channels or interactions.",
        "Copilot generates a crisp summary of the need, so the representative picks up mid-story — not from scratch.",
      ],
    },
    heroFacts: [
      "Olivia Blake [Persona]",
      "Reason for contact: query a letter [Placeholder]",
      "Channel: web chat → voice [Placeholder]",
      { label: "Sentiment", value: "Slightly anxious [Placeholder]" },
    ],
    items: [
      "Copilot Studio Member Concierge",
      "Dynamics 365 Customer Service Premium",
      "Microsoft 365 Copilot",
    ],
    context:
      "Olivia starts in self-service — she's digitally active and would rather not sit in a queue. She's a little anxious about a letter she's received. [Placeholder]",
    problem:
      "Channels are siloed. Members repeat themselves at every handoff, context and sentiment are lost, and colleagues start each contact cold. [Placeholder]",
    solution:
      "A Copilot Studio concierge captures intent and sentiment up front; Customer Service carries the full history; Copilot summarises so no one starts from zero. [Placeholder]",
    sequence: [
      { title: "Concierge greets Olivia", text: "The LBS Member Concierge (Copilot Studio) meets Olivia in self-service and understands her question in natural language. [Placeholder]" },
      { title: "Context that travels", text: "Conversation history and sentiment are attached to Olivia and follow her across channels. [Placeholder]" },
      { title: "Copilot summarises the need", text: "A concise Copilot summary of why Olivia is here is ready the instant a human is needed. [Placeholder]" },
    ],
    outcome:
      "Olivia is understood without repeating herself; routine questions self-resolve, and every handoff is warm and context-rich. [Placeholder]",
    talk: "Show the concierge deflecting and enriching — self-service that makes the human handoff better, not colder. [Placeholder]",
  },

  /* ============================================================ 3 · HELP ME */
  {
    id: "help-me",
    number: 3,
    name: "Help me — Guided Resolution",
    sign: "Help Me",
    farmer: "Amy Black · representative, supported by Copilot & approved knowledge",
    useCase: "D365 Customer Service Premium · Contact Centre · intelligent routing · Copilot",
    keyMessage: {
      headline:
        "Route Olivia to the right skilled representative and supercharge them with Copilot, approved knowledge and guided case management.",
      points: [
        "Unified routing sends Olivia to the best-skilled representative — here, Amy Black — with full context in hand.",
        "Copilot suggests knowledge-grounded answers and recommended actions live, drawing only on approved LBS content.",
        "Guided case management makes sure the right steps happen in the right order, every time.",
      ],
    },
    heroFacts: [
      "Amy Black · LBS representative [Persona]",
      "Routed by skill & context [Placeholder]",
      "Copilot-assisted, live [Placeholder]",
      "Approved knowledge only [Placeholder]",
    ],
    items: [
      "Dynamics 365 Customer Service Premium",
      "Dynamics 365 Contact Center",
      "Microsoft 365 Copilot",
      "Microsoft Teams",
    ],
    context:
      "Olivia's query needs a person. She's routed to Amy Black, a skilled representative, who must resolve it accurately and confidently — first time. [Placeholder]",
    problem:
      "Without unified routing and in-context help, members reach the wrong person, colleagues dig through 20+ systems, and answers are slow and inconsistent. [Placeholder]",
    solution:
      "Customer Service Premium's contact-centre routing puts Olivia with Amy; Copilot serves approved answers and next-best actions; guided cases keep resolution on rails. [Placeholder]",
    sequence: [
      { title: "Right person, right skill", text: "Unified routing connects Olivia to Amy — the best-skilled representative — with all context attached. [Placeholder]" },
      { title: "Copilot in the flow", text: "Copilot suggests grounded answers and recommended actions from approved LBS knowledge while Amy talks to Olivia. [Placeholder]" },
      { title: "Guided case management", text: "A guided case ensures every required step and check happens in the right order. [Placeholder]" },
      { title: "Collaborate to resolve", text: "If needed, Amy pulls in an expert via Teams, linked to the case, and resolves Olivia's need first time. [Placeholder]" },
    ],
    outcome:
      "First-contact resolution, lower handle time, consistent quality, and a representative who feels expert on day one — not after months. [Placeholder]",
    talk: "The engine room. Show routing + Copilot + guided case working as one. Amy looks brilliant because the platform has her back. [Placeholder]",
  },

  /* ======================================================== 4 · REMEMBER ME */
  {
    id: "remember-me",
    number: 4,
    name: "Remember me — Continue the Relationship",
    sign: "Remember Me",
    farmer: "Olivia Blake · the relationship continues, automatically",
    useCase: "Auto wrap-up · follow-ups · Customer Insights – Journeys · retained context",
    keyMessage: {
      headline:
        "The conversation ends, but the relationship doesn't — the outcome is remembered and the next best step set in motion, automatically.",
      points: [
        "Copilot records the outcome, drafts the confirmation, and creates the right follow-up activities — no after-call admin.",
        "Customer Insights – Journeys nurtures Olivia with timely, relevant, consented communications, triggered by what just happened.",
        "Full context is retained, so Olivia's next interaction begins exactly where this one left off.",
      ],
    },
    heroFacts: [
      "Olivia Blake [Persona]",
      "Outcome logged automatically [Placeholder]",
      "Confirmation sent [Placeholder]",
      { label: "Next journey", value: "Relevant, consented nurture [Placeholder]" },
    ],
    items: [
      "Dynamics 365 Customer Insights - Journeys",
      "Dynamics 365 Customer Service Premium",
      "Microsoft 365 Copilot",
    ],
    context:
      "Olivia's need is resolved. What happens next decides whether she feels like a valued member or a ticket that got closed. [Placeholder]",
    problem:
      "After-call admin is manual and often skipped; follow-ups slip, confirmations are inconsistent, and the next interaction starts cold again. [Placeholder]",
    solution:
      "Copilot auto-wraps the case and drafts confirmation and follow-ups; Customer Insights – Journeys triggers the right next communication; context is retained for next time. [Placeholder]",
    sequence: [
      { title: "Automatic wrap-up", text: "Copilot summarises the outcome and closes the case — after-call work all but disappears. [Placeholder]" },
      { title: "Confirm & follow up", text: "A confirmation and the right follow-up activities are created for Olivia automatically. [Placeholder]" },
      { title: "Nurture with Journeys", text: "Customer Insights – Journeys sends timely, consented, relevant next communications based on what just happened. [Placeholder]" },
      { title: "Ready for next time", text: "Full context is retained so Olivia's next interaction starts where this one ended. [Placeholder]" },
    ],
    outcome:
      "Members feel remembered and valued, colleagues lose the admin tax, and engagement compounds into loyalty and lifetime value. [Placeholder]",
    talk: "Close the loop. 'Remember me' is where engagement becomes a relationship. Tie Journeys back to the resolved need. [Placeholder]",
  },

  /* ================================================= 5 · CiVC / DUTY OF CARE */
  {
    id: "civc-care",
    number: 5,
    name: "Customers in Vulnerable Circumstances",
    sign: "Duty of Care",
    farmer: "Recognising CiVC and carrying due care across the whole journey",
    useCase: "CiVC identification · Consumer Duty · care woven through Know→Remember",
    keyMessage: {
      headline:
        "Recognise Customers in Vulnerable Circumstances and carry that care end-to-end — so every colleague, on every channel, provides the right support.",
      points: [
        "CiVC signals are identified and made visible across the whole servicing journey, not trapped in one system.",
        "The flag travels with the member, prompting colleagues to adapt and provide the necessary support and due care.",
        "Consumer Duty outcomes are evidenced for leaders and regulators — care you can prove, not just claim.",
      ],
    },
    heroFacts: [
      "CiVC identified & carried E2E [Placeholder]",
      "Visible to every colleague [Placeholder]",
      "Consumer Duty evidenced [Placeholder]",
    ],
    items: [
      "Dynamics 365 Customer Service Premium",
      "Dynamics 365 Customer Insights - Data",
      "Microsoft 365 Copilot",
      "Microsoft Power BI",
    ],
    context:
      "Some members are in vulnerable circumstances. It's critical LBS recognises them and provides due care consistently across the entire end-to-end servicing process. [Placeholder]",
    problem:
      "Today a CiVC indication can be missed or siloed. If the flag doesn't travel, a colleague downstream may not know to adapt — a care and compliance risk. [Placeholder]",
    solution:
      "CiVC signals are captured on the unified profile and surfaced everywhere the member is served; Copilot and guided cases prompt appropriate care; Power BI evidences outcomes. [Placeholder]",
    sequence: [
      { title: "Identify sensitively", text: "Signals of vulnerable circumstances are captured against the member's unified profile. [Placeholder]" },
      { title: "Carry it everywhere", text: "The CiVC flag travels across channels and colleagues throughout the whole journey. [Placeholder]" },
      { title: "Prompt the right care", text: "Colleagues are prompted to adapt and provide the necessary support at every touchpoint. [Placeholder]" },
      { title: "Evidence fair outcomes", text: "Consumer Duty outcomes for CiVC members are evidenced in live dashboards. [Placeholder]" },
    ],
    outcome:
      "Consistent, compassionate care for every member who needs it — and demonstrable, provable fair outcomes for the regulator. [Placeholder]",
    talk: "The heart of a mutual. Show the flag being set once and honoured everywhere. This is a real differentiator for LBS. [Placeholder]",
  },

  /* ============================================= 6 · COLLEAGUE · ONE WORKSPACE */
  {
    id: "colleague-one",
    number: 6,
    name: "One workspace, not twenty systems",
    sign: "Colleague XP",
    farmer: "Amy Black & colleagues · one place to serve every member",
    useCase: "Colleague experience · replace 20+ systems · faster onboarding · single view",
    keyMessage: {
      headline:
        "Replace 20+ systems with one member workspace — colleagues serve faster, onboard sooner, and back-office teams get the single view too.",
      points: [
        "One workspace ends the swivel-chair across 20+ systems, cutting servicing latency and colleague frustration.",
        "New colleagues get productive far faster — a shorter, less daunting onboarding on one familiar tool.",
        "Back-office teams (e.g. marketing) get the same single, consistent, at-pace view of the member.",
      ],
    },
    heroFacts: [
      "Was: 20+ systems [Placeholder]",
      "Now: one workspace [Placeholder]",
      "Faster onboarding [Placeholder]",
      "Single view for back office [Placeholder]",
    ],
    items: [
      "Dynamics 365 Customer Service Premium",
      "Dynamics 365 Customer Insights - Data",
      "Microsoft 365 Copilot",
      "Microsoft Power Automate",
    ],
    context:
      "A colleague today navigates over 20 systems to service a member — slow, error-prone, and daunting for new starters. Back-office teams struggle for a single view too. [Placeholder]",
    problem:
      "20+ systems create latency, frustration and long onboarding; inconsistent views mean members get different answers depending on who — and which screen — they reach. [Placeholder]",
    solution:
      "Customer Service Premium and Customer Insights present one unified workspace and profile; Copilot and Power Automate remove the manual glue between systems. [Placeholder]",
    sequence: [
      { title: "Retire the swivel-chair", text: "The 20+ systems collapse into one member workspace for every servicing task. [Placeholder]" },
      { title: "Onboard in days, not months", text: "New colleagues learn one familiar tool and get confident far faster. [Placeholder]" },
      { title: "One view for everyone", text: "Front-line and back-office (e.g. marketing) share the same single, consistent member view. [Placeholder]" },
      { title: "Automate the busywork", text: "Power Automate handles cross-system steps behind the scenes so colleagues focus on members. [Placeholder]" },
    ],
    outcome:
      "Lower servicing latency, happier and faster-onboarded colleagues, and one consistent member view across the whole Society. [Placeholder]",
    talk: "The colleague and cost-to-serve story for the exec audience. Quantify systems removed and onboarding time saved. [Placeholder]",
  },
];

/* -----------------------------------------------------------------------------
   JOURNEY — the narrative spine, shown in the header strip.
   (app.js reads REP_JOURNEY — keep that name.)
   -------------------------------------------------------------------------- */
const REP_JOURNEY = [
  "Know me",
  "Understand me",
  "Help me",
  "Remember me",
];
