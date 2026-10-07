-- Seed data for the Wedding Planner Marrakech clone.
-- Planner names and bios are illustrative placeholders: replace with researched profiles.

-- Seasons ------------------------------------------------------------------
insert into public.seasons (id, name, months, multiplier, note, sort_order) values
  ('peak',     'Peak',     'Apr · May · Oct',       1.15, 'Best weather, highest demand. Venues book 18 months out.', 1),
  ('shoulder', 'Shoulder', 'Mar · Jun · Sep · Nov', 1.00, 'Nearly as good as peak with better pricing.', 2),
  ('off',      'Off-peak', 'Jul · Aug · Dec–Feb',   0.88, 'Summer heat or winter evenings. Strong negotiating position.', 3);

-- Venue types --------------------------------------------------------------
insert into public.venue_types (id, name, tagline, max_guests, base_fee, per_guest, sort_order) values
  ('riad',   'Medina riad',       'Intimate, culturally grounded. Caps around 60.',                 60,  1500, 30, 1),
  ('villa',  'Palmeraie villa',   'Private gardens and pools, full creative control.',               220, 6500, 45, 2),
  ('hotel',  'Hotel estate',      'Turnkey logistics, rooms on site, scale without stress.',         400, 9000, 55, 3),
  ('desert', 'Agafay desert camp','Dunes, lanterns and a sky full of stars. Everything is brought in.', 180, 8000, 70, 4),
  ('palace', 'Private palace',    'Historic rooms, marble courtyards, exclusive buyout.',             300, 14000, 60, 5);

-- Events -------------------------------------------------------------------
insert into public.event_types (id, name, description, is_core, fnb_standard, fnb_premium, fnb_luxury, sort_order) values
  ('welcome_dinner',     'Welcome dinner',       'Rooftop or garden dinner the night guests arrive.', false, 70, 105, 150, 1),
  ('ceremony_reception', 'Ceremony & reception', 'The main day: ceremony, cocktails, dinner, dancing.', true, 115, 165, 240, 2),
  ('after_party',        'After party',          'Late-night bar, DJ and street food.',               false, 25, 40, 60, 3),
  ('farewell_brunch',    'Farewell brunch',      'A slow Sunday goodbye by the pool.',                 false, 45, 65, 90, 4);

-- Service categories -------------------------------------------------------
insert into public.service_categories (id, name, section, description, budget_group, vendor_rating, sort_order) values
  ('planning',  'Planning',             'core',        'How much of the weekend you hand over.',                 'planning',   9.6, 1),
  ('staffing',  'Service & staffing',   'core',        'The people who make dinner feel effortless.',             'fnb',        7.4, 2),
  ('music',     'Music',                'core',        'From ceremony PA to the last dance.',                     'music',      8.0, 3),
  ('attire',    'Beauty & attire',      'core',        'Caftans, gowns, suits and the glam team.',                'beauty',     7.9, 4),
  ('decor',     'Florals & decor',      'details',     'Tables, lighting, linens, and the flowers that frame it.', 'decor',      7.5, 5),
  ('photo',     'Photo & film',         'details',     'How the weekend is remembered.',                          'photo',      8.6, 6),
  ('henna',     'Henna night',          'traditions',  'An evening of henna, music and sweets for the bride.',    'traditions', 8.3, 7),
  ('hammam',    'Bridal hammam',        'traditions',  'Black soap, rosewater and ghassoul the day before.',      'traditions', 8.3, 8),
  ('negafa',    'Negafa & amariya',     'traditions',  'Traditional dresser and the bridal palanquin entrance.',  'traditions', 8.1, 9),
  ('gnawa',     'Gnawa procession',     'traditions',  'Drummers and dancers to carry guests between spaces.',    'traditions', 7.8, 10);

-- Service tiers ------------------------------------------------------------
insert into public.service_tiers (category_id, key, name, fixed_cost, per_guest_cost, features, is_default, sort_order) values
  ('planning', 'day_of',       'Day-of',            1900, 0,  array['Final-month takeover','Wedding-day team','Vendor wrangling'], true, 1),
  ('planning', 'full_weekend', 'Full weekend',      4500, 25, array['Everything in Day-of','Three-day run of show','Guest logistics & transfers'], false, 2),
  ('planning', 'concierge',    '12-mo concierge',   9000, 40, array['Everything in Full weekend','Venue scouting trips','Dedicated planner from day one'], false, 3),

  ('staffing', 'essential',   'Essential',    0,   18, array['Waitstaff 1:12','Bar team','Back-of-house'], true, 1),
  ('staffing', 'full',        'Full service', 300, 28, array['Waitstaff 1:8','Sommelier-led bar','Plated service'], false, 2),
  ('staffing', 'white_glove', 'White glove',  600, 45, array['Waitstaff 1:5','Butler-passed canapés','Dedicated guest valets'], false, 3),

  ('music', 'dj',           'DJ',             1500, 0, array['Curated DJ','Ceremony PA','Dance-floor rig'], true, 1),
  ('music', 'dj_live',      'DJ + live',      3200, 0, array['Everything in DJ','Live sax or vocalist','Cocktail-hour trio'], false, 2),
  ('music', 'band_quartet', 'Band + quartet', 6500, 0, array['8-piece band','String quartet ceremony','Full production sound'], false, 3),

  ('attire', 'caftan_glam', 'Caftan + glam',   450,  0, array['Rental caftan','Hair & make-up trial','Day-of glam team'], true, 1),
  ('attire', 'gown_suit',   'Gown + suit',     1800, 0, array['Gown fitting & steaming','Tailored suit','Glam for bride + 2'], false, 2),
  ('attire', 'couture',     'Couture weekend', 4500, 0, array['Three looks across the weekend','Bespoke caftan','Glam for the whole party'], false, 3),

  ('decor', 'essential',  'Essential',  2000, 70,  array['Tables & seating','Festoon lighting','Linens & glass'], true, 1),
  ('decor', 'elevated',   'Elevated',   4500, 120, array['Statement florals','Lounge areas','Candle-lit tablescapes'], false, 2),
  ('decor', 'production', 'Production', 9000, 200, array['Floral installations','Custom build & draping','Lighting designer'], false, 3),

  ('photo', 'photo',    'Photography',    2100, 0, array['10-hour coverage','Edited gallery','Engagement session'], true, 1),
  ('photo', 'photo_film','Photo + film',  3800, 0, array['Two photographers','Highlight film','Drone coverage'], false, 2),
  ('photo', 'crew',     'Full film crew', 6500, 0, array['Three-day coverage','Documentary edit','Same-day teaser'], false, 3),

  ('henna',  'none',     'Skip',       0,   0, array[]::text[], false, 1),
  ('henna',  'included', 'Host it',    600, 8, array['Henna artist','Sweets & mint tea','Chaabi musicians'], true, 2),
  ('hammam', 'none',     'Skip',       0,   0, array[]::text[], false, 1),
  ('hammam', 'included', 'Book it',    650, 0, array['Black soap, rosewater, ghassoul','The bride + 3'], true, 2),
  ('negafa', 'none',     'Skip',       0,   0, array[]::text[], true, 1),
  ('negafa', 'included', 'Include',    900, 0, array['Negafa dresser','Amariya entrance','Four outfit changes'], false, 2),
  ('gnawa',  'none',     'Skip',       0,   0, array[]::text[], true, 1),
  ('gnawa',  'included', 'Include',    700, 0, array['Six drummers & dancers','Processional between spaces'], false, 2);

-- Planners (illustrative placeholders) -------------------------------------
insert into public.planners (slug, name, tagline, bio, founded_year, languages, price_model, price_from, specialties, website, instagram, featured) values
  ('atlas-and-ivory', 'Atlas & Ivory', 'Editorial weddings in the Palmeraie and beyond.',
   'Atlas & Ivory is a boutique studio that plans eight to ten weddings a year, most of them three-day affairs across Palmeraie villas and the Agafay desert. The team is known for restrained, architectural decor and for publishing its fees before the first call. Expect a measured, design-led process with a single planner from brief to breakdown.',
   2016, array['English','French','Arabic'], 'Flat fee', 7500, array['Palmeraie villas','Desert camps','Design-led'], 'https://example.com/atlas-ivory', '@atlasandivory', true),
  ('dar-celebrations', 'Dar Celebrations', 'Riads, rooftops and the full Moroccan ritual.',
   'A medina-based agency that specialises in intimate riad weddings under sixty guests. Dar Celebrations is the team to call when the henna night, negafa and amariya matter as much as the dinner. They work with a close circle of medina artisans and are candid about what a riad can and cannot host.',
   2012, array['Arabic','French','English'], 'Flat fee', 2900, array['Medina riads','Moroccan traditions','Under 60 guests'], 'https://example.com/dar-celebrations', '@darcelebrations', true),
  ('la-kasbah-events', 'La Kasbah Events', 'Large-format production for hotel and palace estates.',
   'La Kasbah Events runs the kind of weddings that need a production manager: two hundred guests, stage builds, pyrotechnics and a fleet of coaches. The team comes from live events rather than hospitality, which shows in their run-of-show discipline. Best suited to couples with a clear vision and a budget above €120,000.',
   2010, array['French','English','Spanish'], 'Commission', 12, array['Hotel estates','Private palaces','200+ guests'], 'https://example.com/la-kasbah', '@lakasbahevents', false),
  ('sahara-rose-weddings', 'Sahara Rose Weddings', 'Desert ceremonies with a small footprint.',
   'Sahara Rose is a two-person studio that only works in the Agafay desert and the Atlas foothills. They own much of their own kit, which keeps desert logistics predictable, and they cap guest counts at one hundred and twenty. The planning style is warm and hands-on; expect to be on first-name terms with every vendor.',
   2018, array['English','French'], 'Flat fee', 5200, array['Agafay desert','Atlas foothills','Sustainable'], 'https://example.com/sahara-rose', '@sahararoseweddings', false),
  ('maison-zellige', 'Maison Zellige', 'Classic Moroccan glamour, meticulously managed.',
   'Maison Zellige plans grand, traditional celebrations for Moroccan and diaspora families. Multi-outfit brides, orchestras, and midnight dinners are standard fare. The agency is highly organised, with a planning portal and weekly updates, and is unusually transparent about vendor pricing.',
   2009, array['Arabic','French','English'], 'Commission', 10, array['Moroccan families','Multi-day celebrations','Traditional'], 'https://example.com/maison-zellige', '@maisonzellige', false),
  ('olive-and-oud', 'Olive & Oud', 'Relaxed garden weddings with a European sensibility.',
   'Olive & Oud was founded by a couple who moved from Lyon to Marrakech and planned their own wedding here first. They favour long tables, natural florals and generous food, and tend to work with villas in the Palmeraie and Route de l''Ourika. Fees are published on their site.',
   2019, array['French','English'], 'Flat fee', 4800, array['Garden weddings','Palmeraie villas','Food-led'], 'https://example.com/olive-oud', '@oliveandoud', false),
  ('riad-and-rose', 'Riad & Rose', 'Elopements and micro-weddings in the medina.',
   'Riad & Rose does one thing well: ceremonies for two to twenty guests. Think a rooftop at sunset, a photographer, a private dinner and a hammam the next morning. Packages are fixed-price and the team can turn a wedding around in eight weeks.',
   2020, array['English','French'], 'Flat fee', 1800, array['Elopements','Micro-weddings','Fast turnaround'], 'https://example.com/riad-rose', '@riadandrose', false),
  ('tamarind-collective', 'Tamarind Collective', 'A network of planners, stylists and producers.',
   'Tamarind Collective pairs couples with a lead planner from its roster depending on venue type and budget. The model gives range but less continuity, so ask who will actually be on site. Strong on photography and film relationships.',
   2015, array['English','French','Arabic','Italian'], 'Commission', 15, array['Villas','Hotels','Photography-led'], 'https://example.com/tamarind', '@tamarindcollective', false),
  ('ourika-weddings', 'Ourika Weddings', 'Valley venues an hour from the city.',
   'Ourika Weddings specialises in the kasbahs and lodges of the Ourika valley, where temperatures run cooler and venues are cheaper than in the city. They handle the guest transport problem well and are a good fit for summer dates.',
   2017, array['French','Arabic','English'], 'Flat fee', 3600, array['Ourika valley','Summer weddings','Guest logistics'], 'https://example.com/ourika', '@ourikaweddings', false),
  ('zahra-studio', 'Zahra Studio', 'Design and planning under one roof.',
   'Zahra Studio is a planner and a floral/decor studio in one, which keeps the design conversation tight and removes a vendor from the chain. Pricing is bundled, so compare the full package rather than the planning line alone.',
   2014, array['Arabic','French','English'], 'Flat fee', 6200, array['Floral design','Decor production','Bundled pricing'], 'https://example.com/zahra', '@zahrastudio', true);

-- Real weddings ------------------------------------------------------------
insert into public.real_weddings (location, wedding_month, guest_count, total_cost, venue_type_id, notes) values
  ('Marrakech medina',  '2024-04-01', 44,  58000,  'riad',   'Three-day weekend, elevated decor, DJ + live.'),
  ('Essaouira',         '2025-05-01', 43,  54000,  'villa',  'Beachside villa, photo + film.'),
  ('Essaouira',         '2025-05-01', 47,  52000,  'villa',  'Two events, full weekend planning.'),
  ('Marrakech medina',  '2023-10-01', 18,  21000,  'riad',   'Riad buyout, single evening.'),
  ('Marrakech medina',  '2024-11-01', 28,  26500,  'riad',   'Henna night + ceremony.'),
  ('Palmeraie',         '2024-10-01', 80,  92000,  'villa',  'Full weekend, band + quartet, production decor.'),
  ('Palmeraie',         '2025-04-01', 95,  104000, 'villa',  'Three events, 12-month concierge.'),
  ('Agafay desert',     '2024-05-01', 70,  88000,  'desert', 'Desert camp with welcome dinner in the city.'),
  ('Agafay desert',     '2025-10-01', 120, 148000, 'desert', 'Two-night camp, full film crew.'),
  ('Route de l''Ourika','2024-06-01', 60,  61000,  'villa',  'Summer garden wedding, DJ.'),
  ('Marrakech',         '2024-04-01', 150, 165000, 'hotel',  'Hotel estate, three events.'),
  ('Marrakech',         '2025-03-01', 200, 210000, 'hotel',  'Large family wedding, orchestra.'),
  ('Marrakech',         '2023-10-01', 180, 240000, 'palace', 'Palace buyout, couture weekend.'),
  ('Marrakech',         '2025-05-01', 260, 310000, 'palace', 'Four-day celebration, 300+ guests over the weekend.'),
  ('Marrakech medina',  '2025-02-01', 12,  14500,  'riad',   'Elopement with hammam and dinner.'),
  ('Palmeraie',         '2024-09-01', 110, 118000, 'villa',  'Villa + after party, DJ + live.'),
  ('Marrakech',         '2024-10-01', 320, 345000, 'hotel',  'Hotel estate buyout, full production.'),
  ('Agafay desert',     '2025-04-01', 55,  64000,  'desert', 'Single-night camp, elevated decor.');

-- FAQ: planner guide section -----------------------------------------------
insert into public.faq_items (section, question, answer, link_label, link_href, sort_order) values
  ('planner_guide', 'Do you need a wedding planner in Marrakech?',
   'For a destination wedding, almost always. Vendors contract in Arabic and French, quote foreign couples differently, and a weekend spread across the medina, the Palmeraie and the Agafay desert leaves no room for guesswork. Couples who self-plan from abroad typically spend 15 to 30 percent more in markups and last-minute fixes.', null, null, 1),
  ('planner_guide', 'What a wedding planner in Marrakech costs',
   'Most planners charge either a flat fee, roughly €2,400 to €15,000 depending on scope, or a commission of 5 to 25 percent on vendor spend. On a €60,000 wedding the planning line lands anywhere from €2,400 for day-of coordination to €30,000 for a full three-day production. The simulator above puts a number on it for your guest count.', null, null, 2),
  ('planner_guide', 'How to choose your Marrakech wedding planner',
   'The good ones give themselves away. They tell you their price before you ask, they show weddings they have actually run rather than styled shoots, and they reply within a day. Build your shortlist from the directory and test each planner on those three signals.', null, null, 3),
  ('planner_guide', 'Why trust any of this',
   'This site is an editorial project, not an agency. We research every venue, planner and vendor ourselves, take no commission, and accept no paid placement. There is no incentive here except giving you the real picture.', null, null, 4),
  ('planner_guide', 'Legal: most couples marry at home and celebrate in Marrakech',
   'Official sources allow a legal marriage in Morocco only in narrow cases. The UK requires a Moroccan partner; French consulates want at least one partner resident in Morocco and Muslim; the American, Belgian and Canadian embassies perform no marriages at all. Most couples marry at the registry office at home and hold a symbolic ceremony here.', 'Marrakech wedding legal requirements', '/guides/legal-requirements', 5),
  ('planner_guide', 'Seasonal: October and April are the safe months',
   'Marrakech runs hot. April and October sit around 24°C with little rain, the Palmeraie in bloom and the city in its best light. June through August is risky for outdoor receptions, and the Ramadan window shifts pricing and availability each year.', 'Best and worst Marrakech wedding seasons', '/guides/best-seasons', 6),
  ('planner_guide', 'Cultural: riad, hotel, villa, desert all carry different rules',
   'Riads cap around 60 guests and feel intimate but limit production. Hotels handle 50 to 400 guests with ease but can feel impersonal. Villas in the Palmeraie and camps in the Agafay give you creative control at a higher production cost. Vendors negotiate in Arabic and French, so the right team matters more than at home.', 'Marrakech wedding zones explained', '/guides/wedding-zones', 7),
  ('planner_guide', 'Planning from abroad: start with the whole picture',
   'If you are planning from another country, start with the complete guide. It lays out a 12-month timeline, flights and transfers, where guests sleep, a programme over three or four days, the legal route and a budget breakdown.', 'Wedding in Marrakech: the complete guide', '/guides/complete-guide', 8);

-- FAQ: general section -----------------------------------------------------
insert into public.faq_items (section, question, answer, sort_order) values
  ('general', 'How much does a Marrakech wedding cost?',
   'A Marrakech wedding for 80 guests typically lands between €60,000 and €120,000 all-in. Venue and catering take roughly half, with the rest split across planning, decor, florals, music, photography and accommodation. Three-day celebrations push higher. Use the simulator above for your own number.', 1),
  ('general', 'What is the best month to get married in Marrakech?',
   'October and April are the most-booked months: mild temperatures, low rain risk and the city in bloom. November and March are nearly as good with better pricing. Avoid June through August and the Ramadan window.', 2),
  ('general', 'Can foreigners legally marry in Morocco?',
   'Only in narrow cases. British citizens can marry here only with a Moroccan partner, French consulates require one partner to be resident and Muslim, and the American, Belgian and Canadian embassies perform no marriages. Most couples marry legally at home and hold a symbolic ceremony in Marrakech.', 3),
  ('general', 'Do I need a wedding planner in Marrakech?',
   'For a destination wedding, almost certainly. A local planner negotiates vendor contracts in Arabic and French, handles logistics across riads, palaces and the desert, and absorbs the inevitable surprises around power, permits and weather.', 4),
  ('general', 'How long does it take to plan a Marrakech wedding?',
   'Twelve to eighteen months is comfortable. Top venues book peak weekends 18 months out. Six to nine months works for off-peak dates with a flexible guest count. Under four months means taking whatever venue and team remain, at a premium.', 5),
  ('general', 'What are the average vendor costs in Marrakech?',
   'Roughly: photographer €2,500 to €6,000, florist €4,000 to €15,000, DJ €1,500 to €3,500, catering €120 to €280 per guest, planner from a €2,400 flat fee up to €15,000 or 5 to 25 percent commission. Riad and villa hire ranges from €5,000 to €60,000+ for a full buyout.', 6),
  ('general', 'Should I book a riad, hotel, or villa for my Marrakech wedding?',
   'Riads (under 60 guests) feel intimate and grounded but cap your size. Hotels (50 to 400) handle logistics but feel less personal. Villas in the Palmeraie or camps in the Agafay give full creative control and exclusivity at higher production cost. Match the venue to your guest count and the experience you want.', 7),
  ('general', 'How does this site work?',
   'We are a planning platform, not a planning agency. The simulator gives you a real budget in two minutes. Save your plan and our editorial team reviews it and sends a personalised vendor shortlist. Nothing here is paid placement.', 8);

-- Guides -------------------------------------------------------------------
insert into public.guides (slug, title, excerpt, body, category, read_minutes, published_at) values
  ('legal-requirements', 'Marrakech wedding legal requirements',
   'Who can legally marry in Morocco, who cannot, and why most couples sign at home first.',
   E'## The short version\n\nMost foreign couples cannot legally marry in Morocco. Marry at your registry office at home, then hold a symbolic ceremony in Marrakech with the officiant and vows you choose.\n\n## Who can marry here\n\n- **UK citizens**: only if the partner is Moroccan, with paperwork via the British consulate and the Moroccan family court.\n- **French citizens**: consulates require at least one partner to be resident in Morocco and Muslim.\n- **US, Belgian, Canadian citizens**: embassies perform no marriages in Morocco.\n\n## What a symbolic ceremony needs\n\nNothing from the Moroccan state. Your planner books an officiant or a friend leads it, and you sign a keepsake certificate. Guests rarely notice the difference.\n\n## Timeline\n\nBook the registry office at home three to six months ahead. Many couples do it the week before flying, others months earlier to simplify name changes and travel documents.',
   'Legal', 4, '2025-01-15'),
  ('best-seasons', 'Best and worst Marrakech wedding seasons',
   'April and October win. Here is the full calendar, with temperatures, pricing and the Ramadan window.',
   E'## The calendar at a glance\n\n| Month | Daytime | Verdict |\n|---|---|---|\n| Mar | 22°C | Shoulder, good value |\n| Apr | 24°C | Peak, book early |\n| May | 28°C | Peak, warm evenings |\n| Jun | 33°C | Hot, evening-only receptions |\n| Jul–Aug | 37°C+ | Avoid outdoor receptions |\n| Sep | 30°C | Shoulder, improving |\n| Oct | 24°C | Peak, best light |\n| Nov | 19°C | Shoulder, cool evenings |\n| Dec–Feb | 15°C | Off-peak, heaters needed |\n\n## Ramadan\n\nThe dates move about eleven days earlier each year. Vendor availability drops and some venues close their bars. Check the window for your year before fixing a date.\n\n## Pricing\n\nExpect venues and caterers to add 10 to 20 percent for April, May and October weekends. Off-peak dates give you real negotiating room.',
   'Planning', 5, '2025-02-10'),
  ('wedding-zones', 'Marrakech wedding zones explained',
   'Medina, Palmeraie, Agafay, Ourika: what each zone offers, what it costs and who it suits.',
   E'## Medina\n\nRiads and small palaces inside the old walls. Intimate, atmospheric, walkable from most hotels. Capacity caps between 20 and 60. Noise restrictions after midnight.\n\n## Palmeraie\n\nTwenty minutes north: private villas with gardens and pools. Capacity 50 to 220. Full creative control, but everything from generators to loos is brought in.\n\n## Agafay desert\n\nForty minutes southwest: stone desert camps with the Atlas as a backdrop. Capacity up to 180. Spectacular, logistically heavy, and reliant on your planner owning the details.\n\n## Ourika valley\n\nAn hour south: kasbahs and lodges with cooler air and lower prices. Good for summer dates. Budget for guest coaches.\n\n## Hotel estates\n\nThe large resorts on the Route de Fès and Route d''Amizmiz: rooms, catering and power all on site. Capacity up to 400. Less personal, far fewer surprises.',
   'Venues', 6, '2025-03-02'),
  ('complete-guide', 'Wedding in Marrakech: the complete guide',
   'A 12-month plan for couples planning from abroad: timeline, travel, accommodation, programme, legal route and budget.',
   E'## 12 months out\n\nFix your guest count range and budget ceiling. Shortlist three venue types using the zone guide. Interview planners and sign one.\n\n## 9 months out\n\nConfirm venue and date. Block hotel rooms for guests. Send save-the-dates with flight guidance.\n\n## 6 months out\n\nLock caterer, photographer, music and decor. Book the hammam and henna night if you are hosting them.\n\n## 3 months out\n\nFinal menu tasting. Guest transport plan. Legal paperwork at home.\n\n## The weekend\n\nThursday arrivals and welcome dinner. Friday hammam and henna. Saturday ceremony and reception. Sunday farewell brunch.\n\n## Budget\n\nFor 80 guests expect €60,000 to €120,000 all-in. Use the simulator on the home page and save your plan to get a reviewed version.',
   'Planning', 9, '2025-03-20');
