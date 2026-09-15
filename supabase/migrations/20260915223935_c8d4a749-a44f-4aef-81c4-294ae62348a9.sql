CREATE OR REPLACE FUNCTION public.validate_site_counter_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.counter_key <> OLD.counter_key OR NEW.count <> OLD.count + 1 THEN
    RAISE EXCEPTION 'site counter changes must increment by exactly one';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_site_counter_change ON public.site_counters;
CREATE TRIGGER validate_site_counter_change
BEFORE UPDATE ON public.site_counters
FOR EACH ROW EXECUTE FUNCTION public.validate_site_counter_change();

CREATE POLICY "Anyone can increment site counters"
ON public.site_counters
FOR UPDATE
TO anon, authenticated
USING (counter_key = 'diary_visits')
WITH CHECK (counter_key = 'diary_visits');

GRANT UPDATE (count, updated_at) ON public.site_counters TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_diary_visit()
RETURNS bigint
LANGUAGE sql
VOLATILE
SECURITY INVOKER
SET search_path = public
AS $$
  UPDATE public.site_counters
  SET count = count + 1,
      updated_at = now()
  WHERE counter_key = 'diary_visits'
  RETURNING count;
$$;

CREATE OR REPLACE FUNCTION public.validate_post_like_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.likes NOT IN (0, 1) THEN
      RAISE EXCEPTION 'new like counters must start at zero or one';
    END IF;
  ELSIF NEW.post_id <> OLD.post_id OR abs(NEW.likes - OLD.likes) <> 1 THEN
    RAISE EXCEPTION 'like counters must change by exactly one';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_post_like_change ON public.post_likes;
CREATE TRIGGER validate_post_like_change
BEFORE INSERT OR UPDATE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.validate_post_like_change();

CREATE POLICY "Anyone can create post like counters"
ON public.post_likes
FOR INSERT
TO anon, authenticated
WITH CHECK (likes IN (0, 1));

CREATE POLICY "Anyone can adjust post like counters"
ON public.post_likes
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (likes >= 0);

GRANT INSERT (post_id, likes, updated_at), UPDATE (likes, updated_at) ON public.post_likes TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.adjust_post_like(_post_id text, _delta int)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
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