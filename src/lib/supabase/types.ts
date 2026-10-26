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
  website_domain: string | null;
  instagram: string | null;
  featured: boolean;
  review_strengths: string | null;
  review_execution: string | null;
  review_suits: string | null;
  review_verdict: string | null;
};

export type VenueTier = "luxury" | "premium" | "standard";

export type Venue = {
  id: string;
  slug: string;
  name: string;
  tier: VenueTier;
  zone: string;
  styles: string[];
  style_slugs: string[];
  capacity_seated: number;
  capacity_max: number | null;
  sleep_rooms: number | null;
  sleep_guests: number | null;
  min_nights: number;
  price_night_low: number | null;
  price_night_high: number | null;
  catering_policy: string;
  score_overall: number;
  score_quality: number | null;
  score_transparency: number | null;
  score_value: number | null;
  amenities: string[];
  season_high: string | null;
  season_shoulder: string | null;
  season_low: string | null;
  setting_text: string | null;
  ceremony_text: string | null;
  costs_text: string | null;
  suits_text: string | null;
  wpm_selection: boolean;
  last_verified: string | null;
};

export type VenueStyle = { slug: string; name: string; description: string; sort_order: number };

export type VendorCategory = {
  slug: string;
  name: string;
  icon: string;
  headline: string;
  description: string;
  most_booked: boolean;
  sort_order: number;
};

export type Vendor = {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  website: string | null;
  instagram: string | null;
  styles: string[];
  languages: string[];
  score: number;
  price_from: number | null;
  verified: boolean;
};

export type VoteTarget = "planner" | "venue" | "vendor";
export type VoteCount = { target_type: VoteTarget; target_id: string; up: number; down: number };

export type Review = {
  id: string;
  user_id: string;
  target_type: VoteTarget;
  target_id: string;
  rating: number;
  body: string;
  author_name: string | null;
  created_at: string;
};

export type SavedPlan = {
  id: string;
  user_id: string;
  title: string | null;
  guests: number;
  estimate: number;
  state: unknown;
  breakdown: Array<{ group: string; label: string; amount: number; share: number }>;
  created_at: string;
  updated_at: string;
};

export type MonthData = {
  month: number;
  name: string;
  temp_high: number;
  temp_low: number;
  rain_days: number;
  price_index: number;
  availability: "high" | "medium" | "low";
  score: number;
  verdict: string;
  note: string;
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
  /** Best vendor per budget group, revealed to signed-in users. */
  matched: Record<string, { name: string; score: number; category: string }>;
};
