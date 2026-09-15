import { createServerFn } from "@tanstack/react-start";

export const incrementDiaryVisit = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("increment_diary_visit");

  if (error) throw new Error("Could not update the diary visitor count");
  return Number(data ?? 0);
});