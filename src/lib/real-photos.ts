export type RealShot = {
  src: string;
  width: number;
  height: number;
  credit: string;
  licenseName: string;
  licenseUrl: string;
  setting: string;
  settingFr: string;
  depicts: "venue" | "area";
};

const BY_SA_40 = "https://creativecommons.org/licenses/by-sa/4.0/";
const BY_SA_30 = "https://creativecommons.org/licenses/by-sa/3.0/";
const BY_SA_20 = "https://creativecommons.org/licenses/by-sa/2.0/";
const BY_40 = "https://creativecommons.org/licenses/by/4.0/";
const BY_30 = "https://creativecommons.org/licenses/by/3.0/";
const BY_20 = "https://creativecommons.org/licenses/by/2.0/";

const koutoubia: RealShot = {
  src: "/photos/koutoubia.jpg",
  width: 1280,
  height: 960,
  credit: "Marcin Sochacki",
  licenseName: "CC BY-SA 4.0",
  licenseUrl: BY_SA_40,
  setting: "Koutoubia Mosque, the medina skyline",
  settingFr: "mosquée Koutoubia, ciel de la médina",
  depicts: "area",
};

const jemaa: RealShot = {
  src: "/photos/jemaa.jpg",
  width: 1024,
  height: 768,
  credit: "stefanx80",
  licenseName: "CC BY-SA 2.0",
  licenseUrl: BY_SA_20,
  setting: "Jemaa el-Fna at the heart of the medina",
  settingFr: "Jemaa el-Fna au cœur de la médina",
  depicts: "area",
};

const jemaaNight: RealShot = {
  src: "/photos/jemaa-evening.jpg",
  width: 1024,
  height: 682,
  credit: "mattk1979",
  licenseName: "CC BY-SA 2.0",
  licenseUrl: BY_SA_20,
  setting: "Jemaa el-Fna in the evening",
  settingFr: "Jemaa el-Fna le soir",
  depicts: "area",
};

const riadCourtyard: RealShot = {
  src: "/photos/riad-bachawya.jpg",
  width: 1024,
  height: 765,
  credit: "qcom",
  licenseName: "CC BY-SA 2.0",
  licenseUrl: BY_SA_20,
  setting: "a riad courtyard in the medina (Riad Bachawya)",
  settingFr: "patio de riad dans la médina (Riad Bachawya)",
  depicts: "area",
};

const palmeraie: RealShot = {
  src: "/photos/namaskar.jpg",
  width: 1280,
  height: 720,
  credit: "Hamza El Hakym",
  licenseName: "CC BY-SA 4.0",
  licenseUrl: BY_SA_40,
  setting: "a garden reception among the Palmeraie palms",
  settingFr: "une réception dans les palmiers de la Palmeraie",
  depicts: "area",
};

const agafay: RealShot = {
  src: "/photos/agafay.jpg",
  width: 1280,
  height: 854,
  credit: "Jakub Hałun",
  licenseName: "CC BY 4.0",
  licenseUrl: BY_40,
  setting: "the stone desert of Agafay, Atlas on the horizon",
  settingFr: "désert de pierre d'Agafay, Atlas à l'horizon",
  depicts: "area",
};

const agafayCamels: RealShot = {
  src: "/photos/agafay-camels.jpg",
  width: 1280,
  height: 855,
  credit: "Jakub Hałun",
  licenseName: "CC BY 4.0",
  licenseUrl: BY_40,
  setting: "dromedaries on the Agafay plateau",
  settingFr: "dromadaires sur le plateau d'Agafay",
  depicts: "area",
};

const agafayEvening: RealShot = {
  src: "/photos/agafay-evening.jpg",
  width: 1280,
  height: 850,
  credit: "Jakub Hałun",
  licenseName: "CC BY 4.0",
  licenseUrl: BY_40,
  setting: "Agafay in the last light",
  settingFr: "Agafay dans la dernière lumière",
  depicts: "area",
};

const agafayWide: RealShot = {
  src: "/photos/agafay-wide.jpg",
  width: 960,
  height: 641,
  credit: "Jakub Hałun",
  licenseName: "CC BY 4.0",
  licenseUrl: BY_40,
  setting: "open Agafay desert west of Marrakesh",
  settingFr: "désert ouvert d'Agafay à l'ouest de Marrakesh",
  depicts: "area",
};

const ourikaValley: RealShot = {
  src: "/photos/ourika-valley.jpg",
  width: 1024,
  height: 618,
  credit: "gripso_banana_prune",
  licenseName: "CC BY-SA 2.0",
  licenseUrl: BY_SA_20,
  setting: "the Ourika valley below the High Atlas",
  settingFr: "la vallée de l'Ourika sous le Haut Atlas",
  depicts: "area",
};

const ourikaBridge: RealShot = {
  src: "/photos/ourika-bridge.jpg",
  width: 960,
  height: 1280,
  credit: "krebsmaus07",
  licenseName: "CC BY 2.0",
  licenseUrl: BY_20,
  setting: "a bridge in the Ourika valley",
  settingFr: "un pont dans la vallée de l'Ourika",
  depicts: "area",
};

const ourikaVillage: RealShot = {
  src: "/photos/ourika-village.jpg",
  width: 960,
  height: 638,
  credit: "Jean-Marc Astesana",
  licenseName: "CC BY-SA 2.0",
  licenseUrl: BY_SA_20,
  setting: "a Berber village in the Ourika valley",
  settingFr: "un village berbère dans la vallée de l'Ourika",
  depicts: "area",
};

const ourikaKasbah: RealShot = {
  src: "/photos/ourika-kasbah.jpg",
  width: 1024,
  height: 681,
  credit: "Fathzer",
  licenseName: "CC BY-SA 2.0",
  licenseUrl: BY_SA_20,
  setting: "a kasbah in the Ourika valley",
  settingFr: "une kasbah dans la vallée de l'Ourika",
  depicts: "area",
};

const essaouiraRamparts: RealShot = {
  src: "/photos/essaouira-ramparts.jpg",
  width: 960,
  height: 720,
  credit: "Kayaky",
  licenseName: "CC BY 3.0",
  licenseUrl: BY_30,
  setting: "the Atlantic ramparts of Essaouira",
  settingFr: "les remparts atlantiques d'Essaouira",
  depicts: "area",
};

const essaouiraSea: RealShot = {
  src: "/photos/essaouira-sea.jpg",
  width: 1024,
  height: 639,
  credit: "Lawrence Murray",
  licenseName: "CC BY 2.0",
  licenseUrl: BY_20,
  setting: "Essaouira ramparts above the Atlantic",
  settingFr: "remparts d'Essaouira au-dessus de l'Atlantique",
  depicts: "area",
};

const lake: RealShot = {
  src: "/photos/lalla-takerkoust.jpg",
  width: 1600,
  height: 1200,
  credit: "WiLPrZ",
  licenseName: "CC BY-SA 2.0",
  licenseUrl: BY_SA_20,
  setting: "the reservoir at Lalla Takerkoust",
  settingFr: "le lac de barrage de Lalla Takerkoust",
  depicts: "area",
};

const skoura: RealShot = {
  src: "/photos/skoura.jpg",
  width: 1024,
  height: 1024,
  credit: "mededeler",
  licenseName: "CC BY 2.0",
  licenseUrl: BY_20,
  setting: "Kasbah Amridil in the Skoura palm grove",
  settingFr: "kasbah Amridil dans la palmeraie de Skoura",
  depicts: "area",
};

const skouraWide: RealShot = {
  src: "/photos/skoura-wide.jpg",
  width: 1024,
  height: 768,
  credit: "mededeler",
  licenseName: "CC BY 2.0",
  licenseUrl: BY_20,
  setting: "the Skoura oasis and its kasbah",
  settingFr: "l'oasis de Skoura et sa kasbah",
  depicts: "area",
};

const mamouniaPool: RealShot = {
  src: "/photos/mamounia-pool.jpg",
  width: 1280,
  height: 622,
  credit: "Pi3.124",
  licenseName: "CC BY-SA 4.0",
  licenseUrl: BY_SA_40,
  setting: "the outdoor pool at La Mamounia",
  settingFr: "la piscine extérieure de La Mamounia",
  depicts: "venue",
};

const mamouniaEntrance: RealShot = {
  src: "/photos/mamounia-entrance.jpg",
  width: 1600,
  height: 778,
  credit: "Pi3.124",
  licenseName: "CC BY-SA 4.0",
  licenseUrl: BY_SA_40,
  setting: "the entrance of La Mamounia",
  settingFr: "l'entrée de La Mamounia",
  depicts: "venue",
};

const fourSeasons: RealShot = {
  src: "/photos/four-seasons.jpg",
  width: 1600,
  height: 1067,
  credit: "Didier Lefort",
  licenseName: "CC BY-SA 3.0",
  licenseUrl: BY_SA_30,
  setting: "Four Seasons Resort Marrakech",
  settingFr: "Four Seasons Resort Marrakech",
  depicts: "venue",
};

function flickrShot(
  file: string,
  width: number,
  height: number,
  credit: string,
  setting: string,
  settingFr: string,
): RealShot {
  return {
    src: `/photos/${file}`,
    width,
    height,
    credit,
    licenseName: "CC BY 2.0",
    licenseUrl: BY_20,
    setting,
    settingFr,
    depicts: "venue",
  };
}

export const HERO_MEDINA = koutoubia;
export const HERO_PALMERAIE = palmeraie;
export const HERO_AGAFAY = agafayWide;
export const STYLE_RIAD = riadCourtyard;
export const STYLE_HOTEL = fourSeasons;
export const STYLE_PALACE = mamouniaEntrance;

const VENUE: Record<string, RealShot[]> = {
  "la-mamounia-wedding-cost": [mamouniaPool, mamouniaEntrance],
  "four-seasons-marrakech-wedding-cost": [fourSeasons],
  "kasbah-tamadot-wedding-cost": [
    flickrShot("tamadot-1.jpg", 1024, 683, "muffinn", "Kasbah Tamadot in the Atlas foothills", "Kasbah Tamadot dans les contreforts de l'Atlas"),
    flickrShot("tamadot-2.jpg", 1024, 683, "muffinn", "the kasbah walls at Kasbah Tamadot", "les murs de pisé de Kasbah Tamadot"),
    flickrShot("tamadot-3.jpg", 1024, 683, "muffinn", "Kasbah Tamadot above the valley", "Kasbah Tamadot au-dessus de la vallée"),
    flickrShot("tamadot-4.jpg", 1024, 683, "muffinn", "a terrace at Kasbah Tamadot", "une terrasse de Kasbah Tamadot"),
  ],
  "kasbah-bab-ourika-wedding-cost": [
    flickrShot("bab-ourika-1.jpg", 1024, 768, "Sar and Ish", "Kasbah Bab Ourika in the Ourika valley", "Kasbah Bab Ourika dans la vallée de l'Ourika"),
    flickrShot("bab-ourika-2.jpg", 1024, 768, "Sar and Ish", "the gardens at Kasbah Bab Ourika", "les jardins de Kasbah Bab Ourika"),
    flickrShot("bab-ourika-3.jpg", 1024, 768, "Sar and Ish", "Kasbah Bab Ourika from the valley", "Kasbah Bab Ourika depuis la vallée"),
    flickrShot("bab-ourika-4.jpg", 1024, 768, "Sar and Ish", "terraces at Kasbah Bab Ourika", "terrasses de Kasbah Bab Ourika"),
  ],
  "riad-el-fenn-wedding-cost": [
    flickrShot("el-fenn.jpg", 1024, 683, "Qu1m", "sunset from the roof of El Fenn", "coucher de soleil depuis le toit d'El Fenn"),
  ],
  "riad-kniza-wedding-cost": [
    flickrShot("riad-kniza.jpg", 1024, 683, "atkinson000", "a dinner table at Riad Kniza", "une table du dîner au Riad Kniza"),
  ],
  "palais-namaskar-wedding-cost": [
    {
      src: "/photos/namaskar.jpg",
      width: 1280,
      height: 720,
      credit: "Hamza El Hakym",
      licenseName: "CC BY-SA 4.0",
      licenseUrl: BY_SA_40,
      setting: "Palais Namaskar in the Palmeraie",
      settingFr: "le Palais Namaskar dans la Palmeraie",
      depicts: "venue",
    },
  ],
  "amanjena-wedding-cost": [
    flickrShot("amanjena-2.jpg", 1024, 768, "richardmichaelshaw", "the pool and pavilions at Amanjena", "le bassin et les pavillons d'Amanjena"),
  ],
};

const ZONE: Record<string, RealShot[]> = {
  Medina: [koutoubia, jemaa, riadCourtyard, jemaaNight],
  Palmeraie: [palmeraie, koutoubia],
  Agafay: [agafayWide, agafayEvening, agafayCamels, agafay],
  "Ourika valley": [ourikaValley, ourikaKasbah, ourikaBridge, ourikaVillage],
  "Route de l'Ourika": [ourikaValley, ourikaKasbah, ourikaBridge, ourikaVillage],
  "Atlas / Asni": [ourikaKasbah, ourikaValley, ourikaVillage, ourikaBridge],
  Essaouira: [essaouiraRamparts, essaouiraSea],
  "Lalla Takerkoust": [lake],
  "Route du Barrage": [lake, palmeraie],
  "Skoura / Desert": [skoura, skouraWide],
  Hivernage: [koutoubia, jemaa, jemaaNight],
  "Route du Golf": [palmeraie, koutoubia],
  "Route d'Amizmiz": [palmeraie, agafay, koutoubia],
  "Route de Fès": [palmeraie, koutoubia],
  "Route de Ouarzazate": [palmeraie, koutoubia, ourikaValley],
};

export function realShotsFor(slug: string, zone: string, count: number): RealShot[] {
  const own = VENUE[slug];
  if (own?.length) return own.slice(0, count);
  const area = ZONE[zone] ?? [koutoubia, jemaa, palmeraie];
  return area.slice(0, count);
}
