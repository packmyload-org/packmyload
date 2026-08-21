ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS survey_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS survey_fee numeric;