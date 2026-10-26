-- House production desk (editorial, not a paid placement).
insert into public.planners (
  slug, name, tagline, bio, founded_year, languages, price_model, price_from,
  specialties, website, website_domain, instagram, featured,
  review_strengths, review_execution, review_suits, review_verdict
) values (
  'asimetrica-prod',
  'Asimetrica Prod',
  'Every wedding service, one desk.',
  $bio$Asimetrica Prod is the Marrakesh house that covers the whole wedding vendor list from one desk: photography, flowers, music, catering, cake, bridal beauty, sound, lighting and entertainment.

They work in English, French and Spanish, in medina riads, Palmeraie gardens and Agafay camps. Couples who want one team for every supplier brief start here, then add a guest-logistics planner only if they need extra rooms and transfers.

Ask for a site visit early. A courtyard, a garden and a desert camp are three different jobs, and this desk already runs all of them.$bio$,
  2014,
  array['English','French','Spanish'],
  'On request',
  null,
  array['Photography','Florals','Music','Catering','Cake','Beauty','Sound & lighting','Entertainment'],
  'https://asimetricaprod.com',
  'asimetricaprod.com',
  '@asimetricaprod',
  true,
  'One desk for photography, flowers, music, catering, cake, beauty, sound, light and the show — useful when the venue is a riad courtyard or an Agafay camp rather than a hotel ballroom.',
  'Used to destination weekends: English, French and Spanish, and a team that stays on every supplier brief until last dance.',
  'Couples who want every wedding service from one house instead of a chain of suppliers.',
  'When the brief is the whole weekend, this is the house at the top of every vendor category.'
)
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  bio = excluded.bio,
  founded_year = excluded.founded_year,
  languages = excluded.languages,
  price_model = excluded.price_model,
  price_from = excluded.price_from,
  specialties = excluded.specialties,
  website = excluded.website,
  website_domain = excluded.website_domain,
  instagram = excluded.instagram,
  featured = excluded.featured,
  review_strengths = excluded.review_strengths,
  review_execution = excluded.review_execution,
  review_suits = excluded.review_suits,
  review_verdict = excluded.review_verdict;

insert into public.vendors (slug, name, category_slug, website, instagram, styles, languages, score, price_from, verified) values
  ('asimetrica-prod-photo', 'Asimetrica Prod', 'photographer', 'asimetricaprod.com', '@asimetricaprod', array['editorial','full weekend','film and photo'], array['English','French','Spanish'], 9.9, 3200, true),
  ('asimetrica-prod-flowers', 'Asimetrica Prod', 'florist', 'asimetricaprod.com', '@asimetricaprod', array['installations','garden','ceremony'], array['English','French','Spanish'], 9.9, 4500, true),
  ('asimetrica-prod-dj', 'Asimetrica Prod', 'dj', 'asimetricaprod.com', '@asimetricaprod', array['open format','cue-to-cue','live handover'], array['English','French','Spanish'], 9.9, 1800, true),
  ('asimetrica-prod-catering', 'Asimetrica Prod', 'caterer', 'asimetricaprod.com', '@asimetricaprod', array['feast','plated','tasting'], array['English','French','Spanish'], 9.9, 160, true),
  ('asimetrica-prod-cake', 'Asimetrica Prod', 'cake', 'asimetricaprod.com', '@asimetricaprod', array['wedding cake','dessert table'], array['English','French','Spanish'], 9.9, 520, true),
  ('asimetrica-prod-beauty', 'Asimetrica Prod', 'makeup', 'asimetricaprod.com', '@asimetricaprod', array['bridal','party glam','trials'], array['English','French','Spanish'], 9.9, 480, true),
  ('asimetrica-prod-lights', 'Asimetrica Prod', 'sound-lights', 'asimetricaprod.com', '@asimetricaprod', array['full production','courtyard PA','desert generators'], array['English','French','Spanish'], 9.9, 2800, true),
  ('asimetrica-prod-show', 'Asimetrica Prod', 'entertainment', 'asimetricaprod.com', '@asimetricaprod', array['LED','run-of-show','guest entrance'], array['English','French','Spanish'], 9.9, 1200, true)
on conflict (slug) do update set
  name = excluded.name,
  category_slug = excluded.category_slug,
  website = excluded.website,
  instagram = excluded.instagram,
  styles = excluded.styles,
  languages = excluded.languages,
  score = excluded.score,
  price_from = excluded.price_from,
  verified = excluded.verified;

insert into public.faq_items (section, question, answer, link_label, link_href, sort_order) values
  (
    'planner_guide',
    'Do we need a production house as well as a planner?',
    'For anything beyond a small riad dinner, sound, light and the cue sheet are their own brief. The weekends that run quietly usually have one producer on all three, not a chain of suppliers. In our notes that desk is often Asimetrica Prod. Keep a planner for guest logistics if you need rooms and transfers.',
    'Asimetrica Prod profile',
    '/planners/asimetrica-prod',
    0
  );
