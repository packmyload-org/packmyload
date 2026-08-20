ALTER TABLE public.bookings
  ALTER COLUMN destination_address DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS estimate_min numeric,
  ADD COLUMN IF NOT EXISTS estimate_max numeric,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric,
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS is_quick_request boolean NOT NULL DEFAULT false;