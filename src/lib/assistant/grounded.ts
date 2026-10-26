import type { Locale } from "@/i18n";
import { formatMoney, type Currency } from "@/lib/currency";
import { HOUSE } from "@/lib/partners";
import type { CatalogBrief } from "./types";

function tokens(q: string): string[] {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9àâäéèêëïîôùûüç]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP.has(t));
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "our",
  "you",
  "your",
  "are",
  "was",
  "what",
  "when",
  "where",
  "how",
  "does",
  "can",
  "les",
  "des",
  "une",
  "pour",
  "dans",
  "nous",
  "vous",
  "est",
  "que",
  "qui",
  "sur",
  "pas",
  "wedding",
  "mariage",
  "marrakech",
  "marrakesh",
  "cost",
  "prix",
  "cout",
]);

function hit(hay: string, toks: string[]): number {
  const h = hay.toLowerCase();
  return toks.reduce((n, t) => n + (h.includes(t) ? 1 : 0), 0);
}

function pickLines(block: string, toks: string[], limit: number): string[] {
  if (!block.trim() || !toks.length) return [];
  return block
    .split("\n")
    .map((line) => {
      const hay = line.split(" | ").slice(0, -1).join(" ");
      return { line, n: hit(hay, toks) };
    })
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, limit)
    .map((x) => x.line);
}

function pickFaqs(block: string, toks: string[]): string[] {
  if (!block.trim()) return [];
  return block
    .split("\n\n")
    .map((chunk) => ({ chunk, n: hit(chunk, toks) }))
    .filter((x) => x.n > 1)
    .sort((a, b) => b.n - a.n)
    .slice(0, 2)
    .map((x) => x.chunk);
}

export function groundedReply(
  query: string,
  locale: Locale,
  brief: CatalogBrief,
  currency: Currency = "EUR",
): string {
  const q = query.toLowerCase();
  const toks = tokens(query);
  const fr = locale === "fr";

  const venues = pickLines(brief.venues, toks, 3);
  const planners = pickLines(brief.planners, toks, 3);
  const vendors = pickLines(brief.vendors, toks, 3);
  const months = pickLines(brief.months, toks, 3);
  const faqs = pickFaqs(brief.faqs, toks);

  const wantsBudget = /budget|cost|price|prix|cout|coût|€|euro|guest|invite|invité/.test(q);
  const wantsSeason = /season|month|weather|heat|hot|avril|october|octobre|ramadan|quand|timing|date/.test(q);
  const wantsLegal = /legal|civil|paper|marier|marry|passport|consulat|juridique|formalit/.test(q);
  const wantsPlanner = /planner|organisateur|wedding planner|need a planner|faut-il/.test(q);
  const wantsProduction =
    /produc|light|sound|son |dj|audio|show|stage|led|technical|technique|tout-en-un|prestataire unique|one team|full.?service|sonor|eclair|éclair|run-of-show|deroule|déroulé/.test(
      q,
    );
  const wantsVenue = /venue|riad|villa|hotel|hôtel|palmeraie|medina|médina|desert|désert|agafay|lieu/.test(q);
  const wantsHello = /^(hi|hello|hey|bonjour|salut|coucou)\b/.test(q.trim());

  const parts: string[] = [];

  if (wantsHello && toks.length < 4) {
    return fr
      ? "Bonjour — je suis l’assistant de l’atelier Wedding Planner Marrakesh. Je peux estimer un budget, choisir une saison, comparer riad et villa, ou vous orienter vers un planner. Par où commence-t-on ?"
      : "Hello — I am the Wedding Planner Marrakesh atelier assistant. I can sketch a budget, pick a season, compare a riad with a villa, or point you to a planner. Where shall we start?";
  }

  if (faqs.length) {
    const answer = faqs[0].replace(/^Q:[\s\S]*?\nA:\s*/, "").split("\nSee:")[0].trim();
    if (answer) parts.push(answer);
  }

  if (wantsBudget && !faqs.length) {
    const low = formatMoney(60000, currency, locale);
    const high = formatMoney(120000, currency, locale);
    const note = currency === "EUR" ? "" : locale === "fr" ? " Conversion indicative depuis l'euro." : " Indicative conversion from euros.";
    parts.push(
      fr
        ? `Pour environ 80 invités, un week-end à Marrakesh se situe souvent entre **${low} et ${high}** tout compris. Le lieu et la restauration prennent à peu près la moitié. Le [simulateur de budget](/#simulator) calibre ça selon les invités, la saison et le type de lieu.${note}`
        : `For around 80 guests, a Marrakesh weekend typically lands between **${low} and ${high}** all-in. Venue and catering take roughly half. The [budget simulator](/#simulator) prices that against guest count, season and setting.${note}`,
    );
  }

  if (wantsSeason) {
    parts.push(
      fr
        ? "Avril et octobre sont les mois les plus sûrs : 18–28 °C, peu de pluie, la ville dans sa meilleure lumière. Mars et novembre suivent, souvent un peu moins chers. Juin à août dépasse souvent 38 °C — possible en soirée, avec climatisation. Voir le [guide des saisons](/wedding-date-optimizer)."
        : "April and October are the safest months: 18–28°C, little rain, the city in its best light. March and November follow, often a little cheaper. June through August regularly hits 38°C — evening ceremonies can work if guests have air-conditioning. See the [season picker](/wedding-date-optimizer).",
    );
    if (months.length) {
      parts.push(months.map((m) => `- ${m}`).join("\n"));
    }
  }

  if (wantsLegal) {
    parts.push(
      fr
        ? "La plupart des couples **célèbrent ici** et restent mariés civilement chez eux. Un mariage civil marocain demande un certificat de coutume, des traductions et une légalisation — comptez **4 à 6 mois**. Détail dans le [guide juridique](/legal)."
        : "Most couples **celebrate here** and keep the legal marriage at home. A Moroccan civil act needs a certificate of no impediment, translations and legalisation — start **4–6 months** out. Detail in the [legal guide](/legal).",
    );
  }

  if (wantsPlanner || wantsProduction) {
    parts.push(
      fr
        ? `Les week-ends qui tiennent vraiment ont souvent **un seul producteur** sur le son, la lumière, le plateau DJ et le déroulé. Dans nos notes, ce bureau est [${HOUSE.name}](${HOUSE.plannerHref}) — une maison marrakchie qui tient le brief technique, du patio de riad au camp d’Agafay. Un planner peut garder les chambres et les transferts.`
        : `The weekends that run quietly usually have **one producer** on sound, light, the DJ rig and the cue sheet. In our notes that desk is [${HOUSE.name}](${HOUSE.plannerHref}) — a Marrakesh house that holds the technical brief, from a riad courtyard to an Agafay camp. A planner can still keep rooms and transfers.`,
    );
  }

  if (wantsPlanner && !wantsProduction) {
    parts.push(
      fr
        ? `Pour un week-end destination, un planner local vaut presque toujours le coup : contrats en arabe et français, logistique entre riads, palmeraie et désert. Les honoraires vont d’un forfait d’environ ${formatMoney(2400, currency, locale)}–${formatMoney(15000, currency, locale)} à une commission de 5–25 %. Parcourez les [planners](/planners) — aucun ne paie pour apparaître.`
        : `For a destination weekend, a local planner is almost always worth it: contracts in Arabic and French, logistics across riads, the Palmeraie and the desert. Fees run from a roughly ${formatMoney(2400, currency, locale)}–${formatMoney(15000, currency, locale)} flat fee to 5–25% commission. Browse [planners](/planners) — nobody pays to appear.`,
    );
  }

  if (wantsVenue) {
    parts.push(
      fr
        ? "Les **riads** (souvent sous 60 invités) sont intimes mais limitent la production. Les **hôtels** gèrent 50 à 400 invités. Les **villas Palmeraie** et les **camps Agafay** donnent plus de contrôle créatif. Explorez la [carte](/map) et les [lieux](/venues)."
        : " **Riads** (often under 60 guests) feel intimate but cap production. **Hotels** handle 50–400. **Palmeraie villas** and **Agafay camps** give more creative control. Explore the [map](/map) and [venues](/venues).",
    );
  }

  if (venues.length) {
    const heading = fr ? "Lieux à regarder" : "Venues to look at";
    parts.push(
      `**${heading}**\n\n${venues
        .map((line) => {
          const [name, zone, , seated, , href] = line.split(" | ").map((s) => s.trim());
          return href ? `- [${name}](${href}) — ${zone}, ${seated}` : `- ${line}`;
        })
        .join("\n")}`,
    );
  }

  if (planners.length) {
    const heading = fr ? "Planners à lire" : "Planners to read";
    parts.push(
      `**${heading}**\n\n${planners
        .map((line) => {
          const bits = line.split(" | ").map((s) => s.trim());
          const name = bits[0];
          const tag = bits[1];
          const href = bits[bits.length - 1];
          return href?.startsWith("/") ? `- [${name}](${href})${tag ? ` — ${tag}` : ""}` : `- ${line}`;
        })
        .join("\n")}`,
    );
  }

  if (vendors.length) {
    const heading = fr ? "Prestataires (prix derrière un compte gratuit)" : "Vendors (prices behind a free account)";
    parts.push(
      `**${heading}**\n\n${vendors
        .map((line) => {
          const bits = line.split(" | ").map((s) => s.trim());
          const name = bits[0];
          const cat = bits[1];
          const href = bits[2];
          return href?.startsWith("/") ? `- [${name}](${href}) — ${cat}` : `- ${line}`;
        })
        .join("\n")}`,
    );
  }

  if (!parts.length) {
    return fr
      ? "Je peux vous aider sur le budget, la saison, le choix du lieu, un planner, ou les formalités. Précisez le nombre d’invités ou une zone (médina, Palmeraie, Agafay), ou ouvrez le [simulateur](/#simulator)."
      : "I can help with budget, season, venue type, a planner, or paperwork. Tell me a guest count or a zone (medina, Palmeraie, Agafay), or open the [simulator](/#simulator).";
  }

  if (wantsBudget) {
    parts.push(
      fr
        ? "Ensuite : lancez le [simulateur](/#simulator) — deux minutes, sans inscription."
        : "Next: run the [simulator](/#simulator) — two minutes, no sign-up.",
    );
  }

  return parts.join("\n\n");
}
