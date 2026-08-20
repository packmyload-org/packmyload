CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference text NOT NULL UNIQUE,
  service text NOT NULL,
  move_size text,
  pickup_address text NOT NULL,
  destination_address text NOT NULL,
  pickup_floor text,
  destination_floor text,
  moving_date date,
  arrival_window text,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  notes text,
  photo_paths text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read bookings" ON public.bookings FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can upload booking photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'booking-photos');
CREATE POLICY "Admins can read booking photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'booking-photos' AND private.has_role(auth.uid(), 'admin'));