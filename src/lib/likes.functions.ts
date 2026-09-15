import { supabase } from "@/integrations/supabase/client";

export async function getPostLikes() {
  const { data, error } = await supabase.from("post_likes").select("post_id, likes");

  if (error) throw new Error("Could not load the like counts");

  const totals: Record<string, number> = {};
  for (const row of data ?? []) totals[row.post_id] = Number(row.likes ?? 0);
  return totals;
}

export async function adjustPostLike(input: { postId: string; delta: 1 | -1 }) {
  if (typeof input.postId !== "string" || !input.postId) throw new Error("Invalid post");
  if (input.delta !== 1 && input.delta !== -1) throw new Error("Invalid delta");

  const { data: total, error } = await supabase.rpc("adjust_post_like", {
    _post_id: input.postId,
    _delta: input.delta,
  });

  if (error) throw new Error("Could not update the like count");
  return Number(total ?? 0);
}
