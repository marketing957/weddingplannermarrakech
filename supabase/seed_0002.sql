-- Seed for catalog + season data. Venue names are real, public properties; the figures and
-- editorial text are illustrative estimates to be replaced by researched data.

insert into public.venue_styles (slug, name, description, sort_order) values
  ('luxury',         'Luxury',          'Palace service, dedicated events teams and the highest scores we track.', 1),
  ('intimate',       'Intimate',        'Riads and small estates for under 80 guests.', 2),
  ('garden',         'Garden',          'Palmeraie and countryside estates with lawns, pools and olive groves.', 3),
  ('riad',           'Riad',            'Restored medina houses built around a courtyard.', 4),
  ('villa',          'Villa',           'Private houses with full creative control.', 5),
  ('budget-friendly','Budget-Friendly', 'Venues under €5,000 a night that still photograph beautifully.', 6),
  ('large-weddings', 'Large Weddings',  'Properties that seat 200 or more.', 7),
  ('pool-party',     'Pool Party',      'Day-after brunches and poolside receptions.', 8),
  ('exclusive-buyout','Exclusive Buyout','Whole-property privatisation for the weekend.', 9);

insert into public.venues (slug, name, tier, zone, styles, style_slugs, capacity_seated, capacity_max, sleep_rooms, sleep_guests, min_nights, price_night_low, price_night_high, catering_policy, score_overall, score_quality, score_transparency, score_value, amenities, wpm_selection, last_verified) values
  ('palais-namaskar-wedding-cost',   'Palais Namaskar',      'luxury',  'Palmeraie',       array['romantic','oasis','garden'],           array['luxury','garden','exclusive-buyout'],      164, 250, 41, 82,  2, 35000, 49000, 'In-house only', 9.8, 9.8, 6.5, 7.0, array['pool','spa','parking','bridal suite','wifi','av equipment','helipad','accommodation'], true,  '2026-01-15'),
  ('royal-mansour-wedding-cost',     'Royal Mansour',        'luxury',  'Medina',          array['palace','royal','luxury'],             array['luxury','exclusive-buyout'],               106, 150, 53, 106, 2, 35000, 60000, 'In-house only', 9.8, 9.9, 6.0, 6.5, array['spa','parking','bridal suite','wifi','av equipment','accommodation'], true, '2026-01-15'),
  ('la-mamounia-wedding-cost',       'La Mamounia',          'luxury',  'Hivernage',       array['palace','garden'],                     array['luxury','garden','large-weddings'],        300, 400, 209, 400, 2, 48000, 70000, 'In-house only', 9.7, 9.8, 6.5, 6.8, array['pool','spa','parking','bridal suite','wifi','av equipment','accommodation'], true, '2026-01-15'),
  ('dar-ahlam-wedding-cost',         'Dar Ahlam',            'luxury',  'Skoura / Desert', array['desert','garden'],                     array['luxury','intimate','exclusive-buyout'],    50,  80,  14, 30,  2, 15000, 24000, 'In-house only', 9.6, 9.6, 7.0, 7.5, array['pool','spa','accommodation','wifi'], true, '2025-11-20'),
  ('selman-marrakech-wedding-cost',  'Selman Marrakesh',     'luxury',  'Route d''Amizmiz',array['equestrian','luxury'],                 array['luxury','large-weddings','garden'],        260, 350, 60, 120, 2, 65000, 90000, 'In-house only', 9.6, 9.7, 6.0, 6.5, array['pool','spa','parking','bridal suite','wifi','av equipment','accommodation'], true, '2026-01-15'),
  ('amanjena-wedding-cost',          'Amanjena',             'luxury',  'Route de Ouarzazate', array['palace','desert','garden'],        array['luxury','garden','exclusive-buyout'],      160, 200, 40, 80,  2, 50000, 75000, 'In-house only', 9.5, 9.6, 6.0, 6.5, array['pool','spa','parking','bridal suite','wifi','accommodation'], true, '2025-12-10'),
  ('oberoi-marrakech-wedding-cost',  'The Oberoi Marrakesh', 'luxury',  'Route de Ouarzazate', array['luxury','fusion'],                 array['luxury','large-weddings','garden'],        336, 400, 84, 170, 2, 100000, 140000, 'In-house only', 9.5, 9.7, 6.0, 6.0, array['pool','spa','parking','bridal suite','wifi','av equipment','helipad','accommodation'], true, '2026-01-15'),
  ('kasbah-tamadot-wedding-cost',    'Kasbah Tamadot',       'luxury',  'Atlas / Asni',    array['hotel','riad','mountain kasbah','berber fortress'], array['luxury','intimate','exclusive-buyout'], 85, 120, 28, 56, 2, 15000, 25000, 'In-house only', 9.4, 9.5, 7.0, 7.5, array['pool','spa','parking','wifi','accommodation'], true, '2025-10-05'),
  ('mandarin-oriental-wedding-cost', 'Mandarin Oriental',    'luxury',  'Route du Golf',   array['glamour','modern'],                    array['luxury','garden','exclusive-buyout'],      126, 180, 63, 126, 2, 60000, 85000, 'In-house only', 9.4, 9.5, 6.0, 6.2, array['pool','spa','parking','bridal suite','wifi','av equipment','accommodation'], false, '2026-01-15'),
  ('four-seasons-marrakech-wedding-cost','Four Seasons Resort','luxury','Hivernage',       array['majestic','garden'],                   array['luxury','large-weddings','garden','pool-party'], 282, 350, 141, 282, 2, 50000, 70000, 'In-house only', 9.3, 9.4, 6.5, 6.8, array['pool','spa','parking','bridal suite','wifi','av equipment','accommodation'], false, '2026-01-15'),
  ('villa-des-orangers-wedding-cost','La Villa des Orangers','luxury',  'Medina',          array['riad','hotel','palace','relais chateaux'], array['luxury','riad','intimate'],            120, 150, 27, 54,  2, 14000, 20000, 'In-house only', 9.3, 9.4, 7.0, 7.5, array['pool','spa','bridal suite','wifi','accommodation'], false, '2025-12-01'),
  ('villa-d-marrakech-wedding-cost', 'Villa D Marrakesh',    'luxury',  'Route de l''Ourika', array['villa','design','pise','countryside'], array['luxury','villa','garden','budget-friendly'], 150, 200, 8, 16, 2, 3000, 5000, 'External allowed', 9.3, 9.2, 8.5, 9.0, array['pool','parking','wifi','accommodation'], true, '2025-11-12'),
  ('fairmont-royal-palm-wedding-cost','Fairmont Royal Palm', 'luxury',  'Route d''Amizmiz',array['resort','golf'],                       array['luxury','large-weddings','garden','pool-party'], 200, 300, 134, 268, 2, 44000, 60000, 'In-house only', 9.2, 9.3, 6.5, 6.8, array['pool','spa','parking','bridal suite','wifi','av equipment','accommodation'], false, '2026-01-15'),
  ('jnane-rumi-wedding-cost',        'Jnane Rumi',           'premium', 'Palmeraie',       array['villa','boutique','garden','design','art'], array['garden','villa','intimate','exclusive-buyout'], 90, 120, 10, 20, 2, 6500, 9000, 'External allowed', 9.1, 9.0, 8.0, 8.5, array['pool','parking','wifi','accommodation'], true, '2025-10-20'),
  ('palais-ronsard-wedding-cost',    'Palais Ronsard',       'premium', 'Palmeraie',       array['art deco','garden','palace'],          array['garden','luxury','intimate'],              80,  120, 12, 24,  2, 9000, 14000, 'In-house only', 9.0, 9.1, 7.0, 7.5, array['pool','spa','parking','wifi','accommodation'], false, '2025-12-01'),
  ('dar-zemora-wedding-cost',        'Dar Zemora',           'premium', 'Palmeraie',       array['villa','garden','classic'],            array['garden','villa','intimate','exclusive-buyout'], 60, 90, 9, 18, 2, 4500, 7000, 'External allowed', 8.9, 8.8, 8.0, 8.5, array['pool','parking','wifi','accommodation'], false, '2025-09-15'),
  ('villa-dinari-wedding-cost',      'Villa Dinari',         'premium', 'Palmeraie',       array['villa','garden','boho'],               array['garden','villa','budget-friendly','pool-party'], 120, 160, 7, 14, 2, 3500, 5500, 'External allowed', 8.8, 8.7, 8.5, 9.0, array['pool','parking','wifi','accommodation'], false, '2025-09-15'),
  ('beldi-country-club-wedding-cost','Beldi Country Club',   'premium', 'Route du Barrage',array['garden','rustic','pottery'],           array['garden','large-weddings','pool-party'],    250, 400, 38, 76,  1, 8000, 12000, 'In-house only', 8.8, 8.7, 8.0, 8.5, array['pool','spa','parking','wifi','accommodation'], true, '2025-11-01'),
  ('les-deux-tours-wedding-cost',    'Les Deux Tours',       'premium', 'Palmeraie',       array['garden','traditional'],                array['garden','intimate','riad'],                160, 200, 36, 72,  2, 15000, 20000, 'In-house only', 8.3, 8.5, 7.0, 7.0, array['pool','spa','parking','wifi','accommodation'], false, '2025-09-15'),
  ('ksar-char-bagh-wedding-cost',    'Ksar Char Bagh',       'premium', 'Palmeraie',       array['luxury riad','classic'],               array['riad','intimate','exclusive-buyout'],      88,  110, 12, 24,  2, 11200, 15000, 'In-house only', 8.3, 8.6, 7.0, 7.0, array['pool','spa','parking','wifi','accommodation'], false, '2025-09-15'),
  ('casa-lalla-takerkoust-wedding-cost','Casa Lalla Takerkoust','premium','Lalla Takerkoust', array['garden','lakeside','beach club','boho chic'], array['garden','pool-party','budget-friendly'], 200, 300, 6, 12, 1, 3500, 5000, 'In-house only', 8.3, 8.2, 8.5, 8.8, array['pool','parking','wifi'], false, '2025-08-20'),
  ('la-pause-wedding-cost',          'La Pause',             'standard','Agafay',          array['desert'],                              array['budget-friendly','intimate','exclusive-buyout'], 120, 180, 20, 40, 1, 3000, 4500, 'In-house only', 8.3, 8.0, 8.5, 9.0, array['pool','parking','accommodation'], false, '2025-08-20'),
  ('scarabeo-camp-wedding-cost',     'Scarabeo Camp',        'premium', 'Agafay',          array['desert','camp','nomad'],               array['intimate','exclusive-buyout','budget-friendly'], 80, 120, 15, 30, 1, 4500, 7000, 'In-house only', 8.7, 8.8, 8.0, 8.5, array['accommodation','parking'], true, '2025-10-10'),
  ('inara-camp-wedding-cost',        'Inara Camp',           'premium', 'Agafay',          array['desert','luxury camp'],                array['intimate','exclusive-buyout'],             60,  100, 12, 24,  1, 5000, 8000, 'In-house only', 8.6, 8.7, 7.5, 8.0, array['pool','accommodation','parking'], false, '2025-10-10'),
  ('riad-el-fenn-wedding-cost',      'El Fenn',              'premium', 'Medina',          array['riad','art','rooftop'],                array['riad','intimate','budget-friendly'],       60,  90,  41, 82,  2, 4500, 7000, 'In-house only', 8.9, 9.0, 7.5, 8.0, array['pool','spa','bridal suite','wifi','accommodation'], true, '2025-12-01'),
  ('riad-kniza-wedding-cost',        'Riad Kniza',           'standard','Medina',          array['riad','traditional'],                  array['riad','intimate','budget-friendly'],       40,  60,  11, 22,  2, 2500, 4000, 'In-house only', 8.4, 8.5, 8.0, 8.5, array['pool','spa','wifi','accommodation'], false, '2025-08-01'),
  ('riad-fes-marrakech-wedding-cost','Riad Yasmine',         'standard','Medina',          array['riad','boho','photogenic'],            array['riad','intimate','budget-friendly'],       30,  40,  8,  16,  2, 1800, 3000, 'External allowed', 8.2, 8.3, 8.5, 8.8, array['pool','wifi','accommodation'], false, '2025-08-01'),
  ('palais-paysan-wedding-cost',     'Palais Paysan',        'standard','Route de l''Ourika', array['country','rustic'],                 array['garden','budget-friendly','intimate'],     80,  120, 12, 24,  1, 7000, 9000, 'In-house only', 8.0, 8.0, 7.5, 7.5, array['pool','parking','wifi','accommodation'], false, '2025-07-15'),
  ('villa-laarissa-wedding-cost',    'Villa Laarissa',       'standard','Route de Fès',    array['event venue','villa','garden','hall'], array['large-weddings','budget-friendly','villa'], 600, 800, 0, 0, 1, 2000, 3500, 'External allowed', 8.4, 8.2, 8.5, 9.0, array['parking','av equipment','wifi'], false, '2025-07-15'),
  ('royal-mirage-deluxe-wedding-cost','Royal Mirage Deluxe', 'standard','Hivernage',       array['hotel','urban','spa'],                 array['large-weddings','budget-friendly'],        250, 350, 197, 390, 1, 3000, 4500, 'In-house only', 8.4, 8.2, 8.0, 8.5, array['pool','spa','parking','av equipment','wifi','accommodation'], false, '2025-07-15'),
  ('be-live-palmeraie-wedding-cost', 'Be Live Experience Palmeraie','standard','Palmeraie', array['resort','hotel','garden','all inclusive'], array['large-weddings','budget-friendly','pool-party'], 300, 400, 300, 600, 1, 4000, 6000, 'In-house only', 8.3, 8.0, 8.0, 8.5, array['pool','spa','parking','av equipment','wifi','accommodation'], false, '2025-07-15'),
  ('kasbah-bab-ourika-wedding-cost', 'Kasbah Bab Ourika',    'premium', 'Ourika valley',   array['kasbah','mountain','eco'],             array['garden','intimate','exclusive-buyout'],    70,  100, 26, 52,  2, 8000, 12000, 'In-house only', 9.0, 9.1, 7.5, 8.0, array['pool','parking','wifi','accommodation'], true, '2025-10-10'),
  ('domaine-des-remparts-wedding-cost','Domaine des Remparts','premium','Route de Fès',    array['garden','classic','hotel'],            array['garden','large-weddings'],                 180, 250, 34, 68,  1, 6000, 9000, 'In-house only', 8.5, 8.5, 7.5, 8.0, array['pool','spa','parking','wifi','accommodation'], false, '2025-09-01'),
  ('villa-taj-wedding-cost',         'Villa Taj',            'premium', 'Palmeraie',       array['villa','garden','pool'],               array['villa','garden','pool-party','exclusive-buyout'], 150, 220, 12, 24, 2, 5500, 8000, 'External allowed', 8.6, 8.5, 8.0, 8.5, array['pool','parking','wifi','accommodation'], false, '2025-09-01'),
  ('le-jardin-des-douars-wedding-cost','Le Jardin des Douars','premium','Essaouira',       array['garden','countryside','family'],       array['garden','intimate','budget-friendly'],     90,  130, 26, 52,  2, 4000, 6000, 'In-house only', 8.7, 8.7, 8.0, 8.5, array['pool','spa','parking','wifi','accommodation'], false, '2025-09-01');

-- Templated editorial text (replace with researched copy)
update public.venues set
  setting_text = format('%s sits in %s and carries a %s/10 editorial score. The property reads as %s, with %s rooms sleeping around %s guests on site. It is a %s-tier address, which shows in the service and in the pricing.',
    name, zone, score_overall, array_to_string(styles, ', '), coalesce(sleep_rooms, 0), coalesce(sleep_guests, 0), tier),
  ceremony_text = format('%s seats around %s guests for dinner and stretches toward %s for a standing celebration. Catering is %s, which decides how much control you have over the biggest line in the budget. Expect a minimum stay of %s nights for a wedding block.',
    name, capacity_seated, coalesce(capacity_max, capacity_seated), lower(catering_policy), min_nights),
  costs_text = format('We track the venue hire at %s between €%s and €%s per night before catering, flowers and music. Peak weekends in April, May and October price at the top of that range; February and midsummer at the bottom. Ask for the private-use fee, room nights and catering minimum as separate lines.',
    name, to_char(price_night_low, 'FM999,999'), to_char(coalesce(price_night_high, price_night_low), 'FM999,999')),
  suits_text = format('Choose %s if you want a %s setting for roughly %s guests and the %s policy suits your plans. Score %s on quality, %s on transparency and %s on value for money. Confirm the current management and terms in writing before paying a deposit.',
    name, array_to_string(styles, ' / '), capacity_seated, lower(catering_policy), coalesce(score_quality, score_overall), coalesce(score_transparency, 7.0), coalesce(score_value, 7.0)),
  season_high = 'Apr · May · Oct',
  season_shoulder = 'Mar · Jun · Sep · Nov',
  season_low = 'Jul · Aug · Dec–Feb';

-- Vendor categories ----------------------------------------------------------
insert into public.vendor_categories (slug, name, icon, headline, description, most_booked, sort_order) values
  ('photographer', 'Wedding Photographers',  'camera',     'Wedding Photographers in Marrakesh, with real prices.', 'Fine-art, documentary and editorial styles, all with verified portfolios.', true, 1),
  ('florist',      'Wedding Florists',       'flower',     'Wedding Florists in Marrakesh, with real prices.',      'From medina rose markets to large-scale installations.', false, 2),
  ('dj',           'Wedding DJs & Music',    'music',      'Wedding DJs & Music in Marrakesh, with real prices.',   'DJs, live bands, Gnawa troupes and string quartets.', false, 3),
  ('caterer',      'Wedding Caterers',       'utensils',   'Wedding Caterers in Marrakesh, with real prices.',      'Moroccan feasts, plated menus and chef-led tasting dinners, priced per guest.', false, 4),
  ('cake',         'Wedding cake designers', 'cake',       'Wedding cake designers in Marrakesh, with real prices.','Pâtissiers who deliver in Marrakesh heat.', false, 5),
  ('makeup',       'Bridal makeup artists',  'sparkles',   'Bridal makeup artists in Marrakesh, with real prices.', 'Trials, day-of glam and caftan looks.', false, 6),
  ('sound-lights', 'Sound & Lighting',       'lightbulb',  'Sound & Lighting in Marrakesh, with real prices.',      'Festoon, uplighting, stage and PA rigs for gardens and desert camps.', false, 7),
  ('entertainment','Wedding Entertainment',  'drama',      'Wedding Entertainment in Marrakesh, with real prices.', 'Fire shows, belly dancers, Gnawa, horse and carriage.', false, 8);

-- Vendors (illustrative) -----------------------------------------------------
insert into public.vendors (slug, name, category_slug, website, instagram, styles, languages, score, price_from, verified) values
  ('atlas-lens-studio','Atlas Lens Studio','photographer','atlaslens.studio','@atlaslens', array['editorial','vogue','high fashion'], array['French','Arabic','English'], 9.8, 2960, true),
  ('noor-frames','Noor Frames','photographer','noorframes.com','@noorframes', array['fine art','luminous'], array['French','Arabic','English'], 9.5, 2360, true),
  ('ilaria-costa-photo','Ilaria Costa','photographer','ilariacosta.photo','@ilariacosta', array['international chic'], array['English','Italian','French'], 9.3, 2280, true),
  ('marc-delorme','Marc Delorme','photographer','marcdelorme.com','@marcdelorme', array['modern documentary'], array['French','English'], 9.1, 2200, true),
  ('clara-vidal','Clara Vidal','photographer','claravidal.com','@claravidal', array['glamour','editorial'], array['French','English','Spanish'], 8.9, 2120, true),
  ('yassine-photo','Yassine Berrada','photographer','yassineberrada.com','@yassine.photo', array['photojournalistic','natural'], array['French','English','Arabic'], 8.5, 1500, false),
  ('maia-rose','Maia Rose','photographer','maiarose.com','@maiarose', array['colorful','vibrant','documentary'], array['French','English'], 8.5, 1500, false),
  ('imane-studio','Imane Studio','photographer','imanestudio.ma','@imanestudio', array['fine art','documentary','editorial'], array['French','English','Arabic'], 8.3, 1300, false),

  ('fleurs-du-souk','Fleurs du Souk','florist','fleursdusouk.ma','@fleursdusouk', array['installations','wild','seasonal'], array['French','Arabic','English'], 9.4, 4000, true),
  ('rosa-medina','Rosa Medina','florist','rosamedina.com','@rosamedina', array['romantic','garden roses'], array['French','English'], 9.0, 2500, true),
  ('palm-and-petal','Palm & Petal','florist','palmandpetal.co','@palmandpetal', array['modern','minimal','dried'], array['English','French'], 8.7, 1500, false),
  ('jardin-floral','Jardin Floral','florist','jardinfloral.ma','@jardinfloral', array['classic','abundant'], array['Arabic','French'], 8.2, 600, false),

  ('dj-karim-k','DJ Karim K','dj','djkarimk.com','@djkarimk', array['open format','deep house','oriental'], array['French','Arabic','English'], 9.3, 1800, true),
  ('medina-sound','Medina Sound Collective','dj','medinasound.com','@medinasound', array['live band','jazz','soul'], array['French','English'], 9.0, 4500, true),
  ('gnawa-brothers','Gnawa Brothers','dj',null,'@gnawabrothers', array['gnawa','traditional','processional'], array['Arabic','French'], 8.8, 700, true),
  ('quartet-marrakech','Quartet Marrakesh','dj','quartetmarrakech.com','@quartetmarrakech', array['string quartet','ceremony'], array['French','English'], 8.6, 900, false),
  ('dj-selma','DJ Selma','dj',null,'@djselma', array['afro house','disco'], array['French','English','Arabic'], 8.4, 500, false),

  ('dar-tajine-traiteur','Dar Tajine Traiteur','caterer','dartajine.ma','@dartajine', array['moroccan feast','family style'], array['Arabic','French','English'], 9.5, 95, true),
  ('maison-saveurs','Maison Saveurs','caterer','maisonsaveurs.com','@maisonsaveurs', array['plated','french-moroccan'], array['French','English'], 9.2, 140, true),
  ('chef-amine-privé','Chef Amine Privé','caterer','chefamine.com','@chefamine', array['tasting menu','chef-led'], array['French','English','Arabic'], 9.0, 240, true),
  ('souk-street-food','Souk Street Food','caterer',null,'@soukstreetfood', array['street food','after party'], array['Arabic','French'], 8.5, 24, false),

  ('sucre-et-sel','Sucre & Sel','cake','sucreetsel.ma','@sucreetsel', array['modern','textured buttercream'], array['French','English'], 9.2, 450, true),
  ('patisserie-amandine','Pâtisserie Amandine','cake','amandine.ma','@patisserieamandine', array['classic','french'], array['French','Arabic'], 8.8, 350, true),
  ('cake-atelier-mk','Cake Atelier MK','cake',null,'@cakeateliermk', array['sculpted','sugar flowers'], array['English','French'], 8.5, 200, false),

  ('glam-by-lina','Glam by Lina','makeup','glambylina.com','@glambylina', array['bridal glam','caftan looks'], array['Arabic','French','English'], 9.4, 450, true),
  ('studio-nour-beauty','Studio Nour Beauty','makeup','studionour.ma','@studionour', array['natural','editorial'], array['French','English'], 9.0, 380, true),
  ('maquillage-sara','Maquillage Sara','makeup',null,'@maquillagesara', array['classic','long-wear'], array['French','Arabic'], 8.6, 200, false),

  ('lumiere-events','Lumière Events','sound-lights','lumiere-events.ma','@lumiereevents', array['festoon','uplighting','stage'], array['French','Arabic','English'], 9.3, 2500, true),
  ('desert-rig','Desert Rig','sound-lights','desertrig.com','@desertrig', array['desert camps','generators','PA'], array['French','English'], 9.0, 3200, true),
  ('mk-sonorisation','MK Sonorisation','sound-lights',null,'@mksonorisation', array['PA','dance floor','basics'], array['Arabic','French'], 8.4, 600, false),

  ('feu-et-sable','Feu & Sable','entertainment','feuetsable.com','@feuetsable', array['fire show','desert'], array['French','Arabic'], 9.1, 900, true),
  ('amariya-marrakech','Amariya Marrakesh','entertainment',null,'@amariyamarrakech', array['amariya','negafa','traditional'], array['Arabic','French'], 9.0, 800, true),
  ('oriental-dance-co','Oriental Dance Co','entertainment','orientaldance.ma','@orientaldanceco', array['belly dance','show'], array['Arabic','French','English'], 8.6, 400, false),
  ('caleche-royale','Calèche Royale','entertainment',null,'@calecheroyale', array['horse and carriage','entrance'], array['Arabic','French'], 8.2, 100, false);

-- Months -------------------------------------------------------------------
insert into public.months (month, name, temp_high, temp_low, rain_days, price_index, availability, score, verdict, note) values
  (1,  'January',   18, 6,  4, 0.80, 'high',   6.5, 'Off-peak, crisp',       'Clear days, cold evenings. Heaters and an indoor plan B are mandatory. Strong negotiating position.'),
  (2,  'February',  20, 8,  4, 0.80, 'high',   7.0, 'Off-peak, almond blossom', 'Almond trees bloom in the valleys. Still cold after dark; good value for riad weddings.'),
  (3,  'March',     23, 10, 3, 0.95, 'medium', 8.5, 'Shoulder, good value',  'Gardens green up, prices still below peak. Watch the Ramadan window.'),
  (4,  'April',     26, 12, 2, 1.15, 'low',    9.5, 'Peak, book early',      'The sweet spot: warm days, cool nights, full bloom. Venues book 18 months out.'),
  (5,  'May',       29, 15, 1, 1.15, 'low',    9.0, 'Peak, warm evenings',   'Reliably dry and warm. Late-afternoon ceremonies work best.'),
  (6,  'June',      34, 19, 0, 1.00, 'medium', 7.0, 'Hot, evening-only',     'Ceremonies after 6pm. Pool venues shine; avoid the desert at midday.'),
  (7,  'July',      38, 22, 0, 0.75, 'high',   4.0, 'Avoid outdoor receptions', 'Regularly 38 to 42°C. Air-conditioned indoor venues only; discounts of 25 to 35 percent.'),
  (8,  'August',    38, 23, 0, 0.75, 'high',   4.0, 'Avoid outdoor receptions', 'Same heat as July plus Moroccan holiday demand on hotels. Ourika and Essaouira are cooler escapes.'),
  (9,  'September', 33, 19, 1, 1.00, 'medium', 7.5, 'Shoulder, improving',   'Heat eases in the second half. Good availability, honest pricing.'),
  (10, 'October',   28, 15, 2, 1.15, 'low',    9.8, 'Peak, best light',      'The most-booked month in Marrakesh. Golden light, 24 to 28°C, almost no rain.'),
  (11, 'November',  22, 10, 3, 0.95, 'medium', 8.5, 'Shoulder, cool evenings', 'Still beautiful by day, cool after sunset. Bring the pashminas.'),
  (12, 'December',  19, 7,  3, 0.85, 'medium', 7.0, 'Off-peak, festive',     'Holiday-week premiums on hotels; otherwise quiet and atmospheric.');

-- Planner review text + domains + a few more planners --------------------------
update public.planners set
  website_domain = regexp_replace(coalesce(website, ''), '^https?://(www\.)?', ''),
  review_strengths = coalesce(bio, ''),
  review_execution = format('%s runs a %s model. Expect the team to take the wedding from first brief to the last song: venue, ceremony, catering, decor, entertainment and the logistics that hold a multi-day event together. Ask who will be on site on the day and get the answer in writing.', name, lower(coalesce(price_model, 'full-service'))),
  review_suits = format('Choose %s if their specialties (%s) match the wedding you are planning and you are comfortable working in %s. Treat the first conversation as due diligence, not a formality.', name, array_to_string(specialties, ', '), array_to_string(languages, ', ')),
  review_verdict = format('%s is a credible choice for the couples described above. Get the full budget in writing, ask exactly what the fee covers, and ask to see recent real weddings. For a transparent, local, minimalist wedding compare against a flat-fee planner first.', name);

insert into public.planners (slug, name, tagline, bio, founded_year, languages, price_model, price_from, specialties, website, website_domain, instagram, featured) values
  ('medina-moments', 'Medina Moments', 'Rooftop ceremonies and lantern-lit dinners.', 'Medina Moments plans small riad weddings with an eye for the rooftop at sunset and the courtyard at midnight. The team is medina-born and negotiates every artisan directly.', 2017, array['Arabic','French','English'], 'Flat fee', 2400, array['Medina riads','Rooftops','Under 40 guests'], 'https://example.com/medina-moments', 'medinamoments.example.com', '@medinamoments', false),
  ('palm-grove-planners', 'Palm Grove Planners', 'Villa weekends with the logistics handled.', 'Palm Grove Planners specialises in Palmeraie villa buyouts for 80 to 150 guests, with a strong transport and accommodation desk.', 2015, array['French','English'], 'Commission', 12, array['Palmeraie villas','Guest logistics','Three-day weekends'], 'https://example.com/palm-grove', 'palmgrove.example.com', '@palmgroveplanners', false),
  ('kasbah-and-co', 'Kasbah & Co', 'Mountain and valley weddings an hour from the city.', 'Kasbah & Co works the Atlas foothills and the Ourika valley, where venues are cooler and cheaper. Good for summer dates and adventurous guest lists.', 2018, array['English','French','Arabic'], 'Flat fee', 3900, array['Atlas foothills','Ourika valley','Summer weddings'], 'https://example.com/kasbah-co', 'kasbahco.example.com', '@kasbahandco', false),
  ('lumen-weddings', 'Lumen Weddings', 'Design-forward, production-heavy celebrations.', 'Lumen Weddings comes from live events and treats a wedding as a show: lighting design, staging, run-of-show discipline. Best above €100,000.', 2013, array['French','English'], 'Commission', 15, array['Production','Lighting design','150+ guests'], 'https://example.com/lumen', 'lumen.example.com', '@lumenweddings', false),
  ('amal-events', 'Amal Events', 'Traditional Moroccan weddings, flawlessly run.', 'Amal Events plans large family weddings with negafa, amariya, orchestras and midnight dinners. Strong vendor relationships across Marrakesh and Casablanca.', 2008, array['Arabic','French'], 'Commission', 10, array['Moroccan families','Traditional','300+ guests'], 'https://example.com/amal', 'amal.example.com', '@amalevents', false),
  ('the-good-day', 'The Good Day', 'Relaxed, food-first weddings for 40 to 100 guests.', 'The Good Day favours long tables, natural wine and generous Moroccan food in garden settings. Published fees, quick replies.', 2021, array['English','French'], 'Flat fee', 4200, array['Garden weddings','Food-led','Published fees'], 'https://example.com/good-day', 'thegoodday.example.com', '@thegooddaymarrakech', false);

update public.planners set
  review_strengths = coalesce(review_strengths, bio),
  review_execution = coalesce(review_execution, format('%s runs a %s model and takes the wedding from first brief to the last song.', name, lower(coalesce(price_model, 'full-service')))),
  review_suits = coalesce(review_suits, format('Choose %s if their specialties (%s) match the wedding you are planning.', name, array_to_string(specialties, ', '))),
  review_verdict = coalesce(review_verdict, format('%s is a credible choice. Get the full budget in writing before you commit.', name))
where review_execution is null;
