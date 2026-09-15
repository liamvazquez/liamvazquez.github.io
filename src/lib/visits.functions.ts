import { supabase } from "@/integrations/supabase/client";

export async function incrementDiaryVisit() {
  const { data, error } = await supabase.rpc("increment_diary_visit");

  if (error) throw new Error("Could not update the diary visitor count");
  return Number(data ?? 0);
}