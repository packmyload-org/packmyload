INSERT INTO public.artisans (full_name, trade, phone, whatsapp, service_areas, bio, rate_min, rate_max, rate_unit, is_verified, is_active) VALUES
('Emeka Okonkwo', 'Electrician', '+2348030000101', '2348030000101', ARRAY['Lekki','Ajah','Victoria Island'], 'Certified electrician with 11 years on residential rewiring, DB board upgrades and inverter installs. Handles post-move light fittings and sockets same day.', 25000, 90000, 'per job', true, true),
('Ibrahim Suleiman', 'Plumber', '+2348030000102', '2348030000102', ARRAY['Ikeja','Maryland','Gbagada'], 'Plumbing specialist for water heaters, pressure pumps and leak repairs. Known for tidy finishing and quick diagnostics.', 15000, 70000, 'per job', true, true),
('Tunde Adeyemi', 'Carpenter', '+2348030000103', '2348030000103', ARRAY['Yaba','Surulere','Ikoyi'], 'Furniture carpenter and fitter. Rebuilds wardrobes, kitchen cabinets and bed frames after long-distance moves.', 20000, 120000, 'per job', true, true),
('Blessing Eze', 'Painter', '+2348030000104', '2348030000104', ARRAY['Lekki','Ikate','Ajah'], 'Interior painting crew lead. Emulsion, texture and screeding for apartments handed over before move-in day.', 3500, 6000, 'per day', true, true),
('Samuel Ogundipe', 'AC technician', '+2348030000105', '2348030000105', ARRAY['Victoria Island','Ikoyi','Lekki'], 'HVAC engineer for split and cassette units. Uninstall before a move, reinstall and gas top-up at the new home.', 18000, 45000, 'per visit', true, true),
('Grace Adeniyi', 'Cleaner', '+2348030000106', '2348030000106', ARRAY['Ikeja','Ogba','Agege'], 'Deep-clean team lead for post-move and pre-handover cleaning, including kitchens, bathrooms and windows.', 25000, 85000, 'per job', true, true),
('Chidi Nwosu', 'Fumigation', '+2348030000107', '2348030000107', ARRAY['Lagos Mainland','Ikorodu','Ketu'], 'Licensed pest control operator. Safe, odourless fumigation for empty apartments before your items arrive.', 30000, 75000, 'per visit', true, true),
('Yusuf Bala', 'Tiler', '+2348030000108', '2348030000108', ARRAY['Abuja','Wuse','Gwarinpa'], 'Floor and wall tiling with laser levelling. Repairs damaged tiles and thresholds after heavy furniture moves.', 4000, 7000, 'per day', true, true),
('Peter Danladi', 'Satellite & internet installer', '+2348030000109', '2348030000109', ARRAY['Abuja','Maitama','Jabi'], 'DStv, Starlink and router installs with neat cable management. Same-day setup in your new place.', 12000, 40000, 'per job', true, true),
('Amaka Obi', 'CCTV & smart locks', '+2348030000110', '2348030000110', ARRAY['Lekki','Ikoyi','Victoria Island'], 'Security installer for CCTV, video doorbells and smart locks, with phone app setup and handover training.', 60000, 250000, 'per job', true, true),
('Musa Adamu', 'Generator technician', '+2348030000111', '2348030000111', ARRAY['Ikeja','Ilupeju','Oshodi'], 'Generator servicing, ATS wiring and relocation of standby sets. Stocks common spares for quick fixes.', 20000, 95000, 'per job', false, true),
('Femi Balogun', 'Furniture assembly', '+2348030000112', '2348030000112', ARRAY['Lekki','Ajah','Sangotedo'], 'Flat-pack specialist for IKEA-style wardrobes, desks and shelving. Assembles and anchors safely to walls.', 10000, 55000, 'per job', true, true),
('Kelechi Umeh', 'Handyman', '+2348030000113', '2348030000113', ARRAY['Yaba','Surulere','Ebute Metta'], 'All-round handyman for TV mounting, curtain rails, door locks and small repairs on move-in day.', 8000, 35000, 'per visit', false, true);

CREATE TABLE public.outbound_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination text NOT NULL,
  label text,
  source_path text,
  referrer text,
  utm jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.outbound_clicks TO anon, authenticated;
GRANT SELECT ON public.outbound_clicks TO authenticated;
GRANT ALL ON public.outbound_clicks TO service_role;

ALTER TABLE public.outbound_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log an outbound click" ON public.outbound_clicks
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read outbound clicks" ON public.outbound_clicks
FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX outbound_clicks_created_at_idx ON public.outbound_clicks (created_at DESC);