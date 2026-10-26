export type ChecklistPhase = {
  id: string;
  title: string;
  window: string;
  items: Array<{ id: string; label: string; href?: string }>;
};

export const CHECKLIST_STORAGE_KEY = "wpm:checklist";

export const CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: "foundations",
    title: "Foundations",
    window: "12–10 months out",
    items: [
      { id: "budget", label: "Set a working budget in the simulator", href: "/#simulator" },
      { id: "season", label: "Pick a season and month", href: "/wedding-date-optimizer" },
      { id: "zone", label: "Choose a wedding zone on the map", href: "/map" },
      { id: "legal", label: "Read the legal requirements for getting married in Morocco", href: "/legal" },
      { id: "planner", label: "Shortlist 2–3 planners and book chemistry calls", href: "/planners" },
    ],
  },
  {
    id: "place",
    title: "Place & rooms",
    window: "10–8 months out",
    items: [
      { id: "venue", label: "Book the ceremony and reception venue", href: "/venues" },
      { id: "rooms", label: "Hold a room block for guests flying in" },
      { id: "welcome", label: "Decide welcome dinner vs. one-night party" },
    ],
  },
  {
    id: "vendors",
    title: "Vendors",
    window: "8–5 months out",
    items: [
      { id: "photo", label: "Book photography and videography", href: "/vendors" },
      { id: "music", label: "Book DJ, band or both" },
      { id: "decor", label: "Lock florals, lighting and tenting" },
      { id: "beauty", label: "Reserve hair, makeup and henna" },
      { id: "catering", label: "Confirm catering policy and tasting dates" },
    ],
  },
  {
    id: "guests",
    title: "Guests & paper",
    window: "5–3 months out",
    items: [
      { id: "list", label: "Freeze the guest list and collect dietary notes" },
      { id: "invites", label: "Send save-the-dates, then invitations" },
      { id: "travel", label: "Share airport, taxi and dress-code notes" },
      { id: "traditions", label: "Plan henna, tea ceremony or Amazigh extras" },
    ],
  },
  {
    id: "final",
    title: "Final month",
    window: "30 days out",
    items: [
      { id: "numbers", label: "Confirm final headcount with venue and caterer" },
      { id: "seating", label: "Draw the seating plan" },
      { id: "runsheet", label: "Lock the day-of run of show" },
      { id: "payments", label: "Settle remaining vendor deposits" },
      { id: "emergency", label: "Share WhatsApp group and emergency contacts", href: "/contact" },
    ],
  },
];

export const ALL_CHECKLIST_IDS = CHECKLIST_PHASES.flatMap((p) => p.items.map((i) => i.id));

export const TIMELINE = [
  {
    month: "12 months",
    title: "Decide the destination",
    body: "Run the budget simulator, pick a season, and decide whether you want a medina riad, Palmeraie garden or Agafay camp.",
    href: "/#simulator",
  },
  {
    month: "11 months",
    title: "Legal & paperwork",
    body: "If you will marry legally in Morocco, start the certificat de coutume and translations. Civil ceremonies need an appointment at the consulate or commune.",
    href: "/legal",
  },
  {
    month: "10 months",
    title: "Hire a planner",
    body: "Interview two or three independent planners. Ask who they have worked with at your shortlisted venues, and how they bill.",
    href: "/planners",
  },
  {
    month: "9 months",
    title: "Hold the venue",
    body: "Peak spring and autumn weekends go first. Confirm minimum nights, catering policy and whether a buyout is required.",
    href: "/venues",
  },
  {
    month: "8 months",
    title: "Rooms for guests",
    body: "Block rooms on-site or nearby. Medina riads sleep few; most groups split between a palace hotel and a couple of overflow riads.",
    href: "/map",
  },
  {
    month: "7 months",
    title: "Photo, film, music",
    body: "The strongest vendors book 8–12 months ahead for April–May and September–October. Lock the creative team before décor.",
    href: "/vendors",
  },
  {
    month: "6 months",
    title: "Look of the day",
    body: "Florals, lighting, tenting and rentals. Desert and garden weddings need a backup for wind and 40°C afternoons.",
    href: "/vendors",
  },
  {
    month: "4 months",
    title: "Invitations & travel",
    body: "Send paper or digital invites with airport transfer notes, dress code and a WhatsApp for the weekend.",
    href: "/checklist",
  },
  {
    month: "3 months",
    title: "Beauty & traditions",
    body: "Hair, makeup trials, henna night, tea service. Confirm language needs for MCs and officiants.",
    href: "/vendors",
  },
  {
    month: "2 months",
    title: "Menu tasting",
    body: "Taste, confirm alcohol policy, and share dietary counts. Many estates require in-house kitchens.",
    href: "/venues",
  },
  {
    month: "1 month",
    title: "Run of show",
    body: "Final headcount, seating, vendor meals, dawn-to-dawn timeline, and a printed call sheet for the coordinator.",
    href: "/checklist",
  },
  {
    month: "Wedding week",
    title: "Arrive early",
    body: "Land three to four days before. Walk the site at ceremony hour, meet the chef, and test the generator and lighting.",
    href: "/contact",
  },
];
