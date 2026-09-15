GRANT EXECUTE ON FUNCTION public.increment_diary_visit() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_post_like(text, int) TO anon, authenticated;