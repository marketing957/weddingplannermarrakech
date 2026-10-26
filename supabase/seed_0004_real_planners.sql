-- Replaces the placeholder planners with real Marrakesh wedding planners.
-- Facts, prices and founding years come from each company's own website (October 2026).
-- Prices are only filled where the company publishes them; everything else reads "On request".

delete from public.votes
where target_type = 'planner'
  and target_id in (select id from public.planners where slug <> 'asimetrica-prod');

delete from public.reviews
where target_type = 'planner'
  and target_id in (select id from public.planners where slug <> 'asimetrica-prod');

delete from public.planners where slug <> 'asimetrica-prod';

insert into public.planners (
  slug, name, tagline, bio, founded_year, languages, price_model, price_from, specialties,
  website, website_domain, instagram, featured,
  review_strengths, review_execution, review_suits, review_verdict
) values
(
  'amelie-wedding', 'Amélie Wedding', 'Planned abroad, run on the ground.',
  $b$Amélie is a Marrakesh wedding planner built for couples who live abroad. The team says it has planned more than 120 weddings since setting up in Marrakesh in 2022, and works in French, English and Arabic.

Venue visits, vendor meetings and tastings are run on video with the couple, with photos, samples and voice notes sent the same week. The team is on the ground from the Monday of the wedding week for the welcome dinner, rehearsals, vendor briefs and transfers.$b$,
  2022, array['French','English','Arabic'], null, null,
  array['Destination weddings','Remote planning','Wedding week'],
  'https://amelie.wedding/', 'amelie.wedding', '@amelie.wedding', false,
  'Remote planning by video, with a long-standing roster of caterers, florists and musicians.',
  'Design, venue, vendors, guest experience, budget and contracts, plus the wedding week on site.',
  'Couples planning from abroad who want one team from first call to last dance.',
  'A planner organised around couples who cannot fly in for every decision. Ask for the fee in writing on the first call.'
),
(
  'philocaly-weddings', 'Philocaly Weddings', 'Luxury weddings in Marrakesh, Taghazout, Tangier and Essaouira.',
  $b$Philocaly Weddings and Events produces luxury weddings and private events in Marrakesh, Taghazout, Tangier and Essaouira. The team designs, styles, produces and plans each event, so couples deal with one team from the first brief.

Recent work on their site includes weddings at Amanjena and an editorial wedding at Riad El Fenn. Client reviews name Nesrine and Ayoub as the planners couples work with.$b$,
  null, array['English'], null, null,
  array['Luxury weddings','Design and styling','Morocco-wide'],
  'https://philocalyevents.com/', 'philocalyevents.com', '@philocaly.weddings', false,
  'Design-led production: stages, table design and lighting built for each wedding.',
  'Planning, design, styling and production handled in-house.',
  'Couples who want a styled, editorial wedding at a luxury Marrakesh venue.',
  'A design-first agency with work at Amanjena and El Fenn. Ask for the fee structure before the creative brief.'
),
(
  'amaria-events', 'Amaria Events', 'The agency that publishes its prices.',
  $b$Amaria Events plans weddings and family celebrations in Marrakesh for couples organising from Paris, London or Brussels. Its prices are on its website: day-of coordination from €3,500, partial planning from €6,500, and full planning at 10 to 12 percent of the budget with a minimum of €8,500. All-inclusive packages start at €12,900.

The agency says it takes no hidden percentage from vendors and shows couples the invoices. It also plans henna nights, engagements, sbou3 and other family celebrations.$b$,
  null, array['French','English'], 'Flat fee', 3500,
  array['Published prices','Remote planning','Family celebrations'],
  'https://amariaevents.com/', 'amariaevents.com', null, false,
  'Published fees and no vendor commissions, with invoices shown to the couple.',
  'Five-step remote method: scouting, negotiating and running the day on site.',
  'Couples who want the planner fee and the vendor costs kept separate and visible.',
  'One of the few Marrakesh planners with prices on the website. Check which tier covers your guest count.'
),
(
  'studio-maev', 'MAEV', 'Where magic happens.',
  $b$MAEV has organised weddings in Marrakesh since 2009, working from offices in Harbil. The team brings planning, art direction, scenography, production and on-site coordination under one roof.

Alongside bespoke weddings, from intimate gatherings to three-day celebrations, MAEV runs corporate events, private parties, festivals and destination events.$b$,
  2009, array['French','English'], null, null,
  array['Three-day weddings','Scenography','Production'],
  'https://www.studiomaev.com/', 'studiomaev.com', '@maev_weddings', false,
  'Art direction and scenography produced by the same team that plans the wedding.',
  'From venue choice and budget to set design, vendors and the wedding day.',
  'Large or multi-day weddings that need production as well as planning.',
  'A long-running Marrakesh studio with its own production side. Ask for a line-by-line quote.'
),
(
  'ceremonia-event', 'Ceremonia Event', 'Elegant, made-to-measure weddings in Marrakesh.',
  $b$Ceremonia Event plans high-end weddings in Marrakesh for local and international couples, in palaces, riads, Palmeraie villas and the Agafay desert.

The agency organises weddings remotely for couples in France, Belgium and Canada. Services cover full planning, design and decor, catering, venue and logistics, music, photography and video, and beauty and styling.$b$,
  null, array['French'], null, null,
  array['Palmeraie villas','Agafay desert','Remote planning'],
  'https://ceremoniaevent.com/', 'ceremoniaevent.com', '@ceremoniaevent', false,
  'Covers the whole vendor list, from catering and decor to photo, video and beauty.',
  'Starts with a project brief, then a tailored proposal of venues, vendors and concepts.',
  'French-speaking couples planning a Marrakesh wedding from Europe or Canada.',
  'A full-service agency for French-speaking couples abroad. Ask how its vendor fees are charged.'
),
(
  'exceptional-moment', 'Exceptional Moment', 'One direction, one dedicated team.',
  $b$Exceptional Moment is a Marrakesh events house that plans weddings in Marrakesh, across Morocco and abroad. One team handles venue search, vendors, decor, catering, hospitality and day-of coordination.

It offers full planning, focused coordination for couples who have already booked vendors, and multi-day celebrations where the welcome dinner, wedding and brunch are each scoped and budgeted separately.$b$,
  null, array['French'], null, null,
  array['Full planning','Coordination','Wedding weekends'],
  'https://exceptionalmoment.com/', 'exceptionalmoment.com', '@exceptional_moment_', false,
  'Decor, scenography and catering produced in-house alongside planning.',
  'Each quote lists services, contacts, deadlines and what stays with the couple.',
  'Couples who want a wedding weekend with each day budgeted on its own.',
  'Clear about scope in its quotes. Read the deliverables list before signing.'
),
(
  'redkeys-marrakech', 'REDKEYS Marrakech', 'From the stay to the celebration.',
  $b$REDKEYS is the events arm of RED Agency et Conciergerie and has organised events in Marrakesh since 2016. For weddings it combines the venue and reception with the guests' stay: arrivals, accommodation, welcome dinner, transfers, brunch and activities.

Its published budget guides start at €13,000 for a traditional dinner for 100 guests in an event hall, and €35,000 for a fully produced evening for 150 guests. These depend on date, venue and final scope.$b$,
  2016, array['French'], null, null,
  array['Destination weddings','Guest concierge','Franco-Moroccan weddings'],
  'https://redkeys-marrakech.com/organisation-mariage-marrakech', 'redkeys-marrakech.com', '@redkeys_marrakech', false,
  'A concierge background, so guest stays, transfers and activities are part of the plan.',
  'Venue scouting, set-up, ceremony, table setting and day-of coordination.',
  'Couples hosting many travelling guests who need rooms and transport handled.',
  'Strong on guest logistics, with budget guides on its site. Get the final scope in writing.'
),
(
  'zinevent-marrakech', 'ZinEvent Marrakech', 'Luxury events and weddings.',
  $b$ZinEvent Marrakech organises weddings, birthdays, conferences and galas, combining event planning with its own catering. Services include decoration, entertainment, custom wedding cakes and pre-wedding photography.

The office is at Zinaya Center in Targa, Marrakesh.$b$,
  null, array['English'], null, null,
  array['Catering','Decoration','Wedding cakes'],
  'https://zineventmarrakech.com/', 'zineventmarrakech.com', '@zineventt', false,
  'Catering, cakes and decoration in-house, alongside the planning.',
  'Turnkey organisation and coordination from menu to decor.',
  'Couples who want food, cake and decor from a single supplier.',
  'A catering-led events company. Taste the menu before you commit.'
),
(
  'the-souk-department', 'The Souk Department', 'Luxury weddings and events across Morocco.',
  $b$The Souk Department is a full-service event planning and design agency based in Marrakesh. Claimy Anthonissen founded it in 2013 after more than a decade in the events industry, and she oversees both the planning and design teams.

The agency produces weddings, private parties and brand events across Morocco, taking each from concept to execution.$b$,
  2013, array['English'], null, null,
  array['Luxury weddings','Event design','Brand events'],
  'https://thesoukdepartment.com/', 'thesoukdepartment.com', '@thesoukdepartment', false,
  'Planning and design held to the same standard, under the founder''s direct oversight.',
  'Concept to execution, with planning and design teams working together.',
  'Couples who want a highly styled celebration with a strong design voice.',
  'A design-led agency with more than a decade of Marrakesh weddings. Ask for the fee model early.'
),
(
  'boutique-souk', 'Boutique Souk', 'The inside track on Marrakesh, since 2005.',
  $b$Boutique Souk has worked in Marrakesh since 2005 as a concierge and wedding planning company. Its wedding team has produced weddings for couples of many cultures and nationalities, and its events side runs palace parties, desert events and brand launches.

Condé Nast Traveller has called it Morocco's leading concierge and wedding planning company.$b$,
  2005, array['English'], null, null,
  array['Destination weddings','Concierge','Palace and desert events'],
  'https://boutiquesouk.com/', 'boutiquesouk.com', '@boutiquesouk', false,
  'Twenty years of Marrakesh venues and suppliers, with a concierge desk for guests.',
  'Weddings and events from venue scouting to party production.',
  'International couples who want insider venues and guest concierge in one team.',
  'One of the longest-established planners in the city. Ask for recent case studies at your venue.'
),
(
  'la-perle-events', 'La Perle Events', 'Bespoke destination weddings in Marrakesh.',
  $b$La Perle Events is a boutique agency that plans, designs and coordinates destination weddings in Marrakesh for international couples. It offers four tiers: full-service planning, month-of coordination, part-time planning and elopements.

The agency's weddings have appeared in Junebug Weddings, Wedding Chicks, Inspired by This and One Fab Day. Package prices are given on request.$b$,
  null, array['English','French'], null, null,
  array['Destination weddings','Elopements','Month-of coordination'],
  'https://www.la-perle-events.com/en', 'la-perle-events.com', '@laperlevents_marrakech', false,
  'Flexible tiers, from elopements to full planning, with published inclusions.',
  'Venue and vendor selection, budget, timeline and day-of coordination with assistants.',
  'International couples, from intimate elopements to larger weddings.',
  'Well documented in the wedding press. Compare the four tiers against what you already have booked.'
),
(
  'instants-magiques', 'Instants Magiques', 'Wedding designer in Marrakesh since 2003.',
  $b$Instants Magiques has specialised in luxury events and made-to-measure weddings in Marrakesh since 2003. The agency designs its own decor and staging and coordinates every vendor.

Services cover the venue, invitations, guest care, catering, scenography, entertainment, beauty, photo and video. Its brand clients include Chaumet, Cartier, Dior and Louis Vuitton.$b$,
  2003, array['French'], null, null,
  array['Scenography','Luxury weddings','Brand events'],
  'https://instantsmagiques-marrakech.com/', 'instantsmagiques-marrakech.com', '@instants_magiques_marrakech', false,
  'Original decor and staging, backed by work for luxury fashion houses.',
  'The wedding planner handles coordination, negotiation and vendor logistics.',
  'Couples who want a strongly designed, theatrical setting.',
  'More than twenty years in Marrakesh, with a scenography focus. Ask for references from recent weddings.'
);
