CREATE TABLE public.post_likes (
  post_id text PRIMARY KEY,
  likes bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.post_likes TO anon, authenticated;
GRANT ALL ON public.post_likes TO service_role;

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post likes"
ON public.post_likes FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.adjust_post_like(_post_id text, _delta int)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total bigint;
BEGIN
  IF _delta NOT IN (-1, 1) THEN
    RAISE EXCEPTION 'invalid delta';
  END IF;

  INSERT INTO public.post_likes (post_id, likes)
  VALUES (_post_id, GREATEST(_delta, 0))
  ON CONFLICT (post_id) DO UPDATE
    SET likes = GREATEST(public.post_likes.likes + _delta, 0),
        updated_at = now()
  RETURNING likes INTO new_total;

  RETURN new_total;
END;
$$;

REVOKE ALL ON FUNCTION public.adjust_post_like(text, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_post_like(text, int) TO service_role;

INSERT INTO public.post_likes (post_id, likes) VALUES ('2026-09-15-midori', 17)
ON CONFLICT (post_id) DO NOTHING;