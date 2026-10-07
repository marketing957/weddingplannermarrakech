export type Season = {
  id: string;
  name: string;
  months: string;
  multiplier: number;
  note: string | null;
  sort_order: number;
};

export type VenueType = {
  id: string;
  name: string;
  tagline: string;
  max_guests: number;
  base_fee: number;
  per_guest: number;
  sort_order: number;
};

export type EventType = {
  id: string;
  name: string;
  description: string | null;
  is_core: boolean;
  fnb_standard: number;
  fnb_premium: number;
  fnb_luxury: number;
  sort_order: number;
};

export type BudgetGroup =
  | "venue"
  | "fnb"
  | "planning"
  | "decor"
  | "photo"
  | "music"
  | "beauty"
  | "traditions";

export type ServiceSection = "core" | "details" | "traditions";

export type ServiceCategory = {
  id: string;
  name: string;
  section: ServiceSection;
  description: string | null;
  budget_group: BudgetGroup;
  vendor_rating: number | null;
  sort_order: number;
};

export type ServiceTier = {
  id: string;
  category_id: string;
  key: string;
  name: string;
  fixed_cost: number;
  per_guest_cost: number;
  features: string[];
  is_default: boolean;
  sort_order: number;
};

export type Planner = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  bio: string | null;
  founded_year: number | null;
  languages: string[];
  price_model: string | null;
  price_from: number | null;
  specialties: string[];
  website: string | null;
  instagram: string | null;
  featured: boolean;
};

export type RealWedding = {
  id: string;
  location: string;
  wedding_month: string;
  guest_count: number;
  total_cost: number;
  venue_type_id: string | null;
  notes: string | null;
};

export type FaqItem = {
  id: string;
  section: "planner_guide" | "general";
  question: string;
  answer: string;
  link_label: string | null;
  link_href: string | null;
  sort_order: number;
};

export type Guide = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  read_minutes: number;
  published_at: string;
};

export type LeadInsert = {
  email: string;
  name?: string | null;
  wedding_date?: string | null;
  guest_count?: number | null;
  estimate?: number | null;
  plan?: unknown;
};

/** Everything the budget simulator needs, fetched once on the server. */
export type PricingConfig = {
  seasons: Season[];
  venues: VenueType[];
  events: EventType[];
  categories: ServiceCategory[];
  tiers: ServiceTier[];
  realWeddings: RealWedding[];
};
