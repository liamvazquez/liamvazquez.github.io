import { createServerFn } from "@tanstack/react-start";

export const getPostLikes = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("post_likes").select("post_id, likes");

  if (error) throw new Error("Could not load the like counts");

  const totals: Record<string, number> = {};
  for (const row of data ?? []) totals[row.post_id] = Number(row.likes ?? 0);
  return totals;
});

export const adjustPostLike = createServerFn({ method: "POST" })
  .inputValidator((input: { postId: string; delta: 1 | -1 }) => {
    if (typeof input?.postId !== "string" || !input.postId) throw new Error("Invalid post");
    if (input.delta !== 1 && input.delta !== -1) throw new Error("Invalid delta");
    return input;
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: total, error } = await supabaseAdmin.rpc("adjust_post_like", {
      _post_id: data.postId,
      _delta: data.delta,
    });

    if (error) throw new Error("Could not update the like count");
    return Number(total ?? 0);
  });
