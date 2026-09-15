REVOKE EXECUTE ON FUNCTION public.increment_diary_visit() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_diary_visit() TO service_role;