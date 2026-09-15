CREATE TABLE public.site_counters (
  counter_key text PRIMARY KEY,
  count bigint NOT NULL DEFAULT 0 CHECK (count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_counters TO anon, authenticated;
GRANT ALL ON public.site_counters TO service_role;

ALTER TABLE public.site_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site counters"
ON public.site_counters
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.site_counters (counter_key, count)
VALUES ('diary_visits', 0);

CREATE OR REPLACE FUNCTION public.increment_diary_visit()
RETURNS bigint
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.site_counters
  SET count = count + 1,
      updated_at = now()
  WHERE counter_key = 'diary_visits'
  RETURNING count;
$$;

REVOKE ALL ON FUNCTION public.increment_diary_visit() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_diary_visit() TO anon, authenticated, service_role;