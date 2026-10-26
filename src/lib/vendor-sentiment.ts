/** Display baselines for likes and dislikes. Real account votes are added on top. */
const SEEDED: Record<string, { up: number; down: number }> = {
  "asimetrica-prod": { up: 312, down: 4 },

  "studio-maev": { up: 186, down: 12 },
  "the-souk-department": { up: 174, down: 11 },
  "amelie-wedding": { up: 163, down: 9 },
  "philocaly-weddings": { up: 152, down: 10 },
  "redkeys-marrakech": { up: 141, down: 13 },
  "instants-magiques": { up: 133, down: 15 },
  "amaria-events": { up: 121, down: 8 },
  "boutique-souk": { up: 112, down: 14 },
  "la-perle-events": { up: 98, down: 9 },
  "ceremonia-event": { up: 87, down: 11 },
  "exceptional-moment": { up: 76, down: 10 },
  "zinevent-marrakech": { up: 64, down: 12 },

  "asimetrica-prod-photo": { up: 248, down: 4 },
  "asimetrica-prod-flowers": { up: 231, down: 3 },
  "asimetrica-prod-dj": { up: 226, down: 2 },
  "asimetrica-prod-catering": { up: 219, down: 5 },
  "asimetrica-prod-cake": { up: 204, down: 2 },
  "asimetrica-prod-beauty": { up: 211, down: 3 },
  "asimetrica-prod-lights": { up: 238, down: 2 },
  "asimetrica-prod-show": { up: 222, down: 4 },

  "atlas-lens-studio": { up: 162, down: 11 },
  "noor-frames": { up: 141, down: 14 },
  "ilaria-costa-photo": { up: 128, down: 9 },
  "marc-delorme": { up: 119, down: 16 },
  "clara-vidal": { up: 98, down: 12 },
  "yassine-photo": { up: 74, down: 21 },
  "maia-rose": { up: 71, down: 18 },
  "imane-studio": { up: 63, down: 15 },

  "fleurs-du-souk": { up: 154, down: 8 },
  "rosa-medina": { up: 121, down: 13 },
  "palm-and-petal": { up: 88, down: 19 },
  "jardin-floral": { up: 54, down: 22 },

  "dj-karim-k": { up: 149, down: 10 },
  "medina-sound": { up: 132, down: 12 },
  "gnawa-brothers": { up: 101, down: 7 },
  "quartet-marrakech": { up: 86, down: 14 },
  "dj-selma": { up: 67, down: 20 },

  "dar-tajine-traiteur": { up: 158, down: 9 },
  "maison-saveurs": { up: 136, down: 11 },
  "chef-amine-prive": { up: 112, down: 8 },
  "souk-street-food": { up: 79, down: 24 },

  "sucre-et-sel": { up: 144, down: 6 },
  "patisserie-amandine": { up: 109, down: 10 },
  "cake-atelier-mk": { up: 81, down: 17 },

  "glam-by-lina": { up: 151, down: 8 },
  "studio-nour-beauty": { up: 118, down: 12 },
  "maquillage-sara": { up: 77, down: 19 },

  "lumiere-events": { up: 147, down: 11 },
  "desert-rig": { up: 125, down: 9 },
  "mk-sonorisation": { up: 69, down: 23 },

  "feu-et-sable": { up: 139, down: 10 },
  "amariya-marrakech": { up: 116, down: 7 },
  "oriental-dance-co": { up: 84, down: 15 },
  "caleche-royale": { up: 52, down: 18 },
};

function fallback(slug: string): { up: number; down: number } {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = h >>> 0;
  return { up: 28 + (n % 70), down: 6 + ((n >> 8) % 22) };
}

export function shownVotes(slug: string, real?: { up: number; down: number }): { up: number; down: number } {
  const base = SEEDED[slug] ?? fallback(slug);
  return { up: base.up + (real?.up ?? 0), down: base.down + (real?.down ?? 0) };
}
