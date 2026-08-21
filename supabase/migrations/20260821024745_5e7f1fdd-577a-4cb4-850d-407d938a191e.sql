CREATE TABLE public.artisans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  trade text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  service_areas text[] NOT NULL DEFAULT '{}',
  bio text,
  rate_min numeric,
  rate_max numeric,
  rate_unit text NOT NULL DEFAULT 'per job',
  photo_url text,
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT (id, full_name, trade, service_areas, bio, rate_min, rate_max, rate_unit, photo_url, is_verified, is_active, created_at) ON public.artisans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artisans TO authenticated;
GRANT ALL ON public.artisans TO service_role;

ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active artisans" ON public.artisans
FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Admins can view all artisans" ON public.artisans
FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can add artisans" ON public.artisans
FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update artisans" ON public.artisans
FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete artisans" ON public.artisans
FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.artisan_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artisan_id uuid REFERENCES public.artisans(id) ON DELETE SET NULL,
  trade text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  details text,
  preferred_date date,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.artisan_requests TO anon, authenticated;
GRANT SELECT, UPDATE ON public.artisan_requests TO authenticated;
GRANT ALL ON public.artisan_requests TO service_role;

ALTER TABLE public.artisan_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an artisan request" ON public.artisan_requests
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read artisan requests" ON public.artisan_requests
FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update artisan requests" ON public.artisan_requests
FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.touch_artisans_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.touch_artisans_updated_at() FROM anon, authenticated;

CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON public.artisans
FOR EACH ROW EXECUTE FUNCTION public.touch_artisans_updated_at();