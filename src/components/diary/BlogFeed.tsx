import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Bookmark, MapPin } from "lucide-react";
import liamAvatar from "@/assets/liam-avatar.png";
import { diaryPosts } from "@/data/posts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { diaryAudio } from "@/lib/diaryAudio";
import { adjustPostLike, getPostLikes } from "@/lib/likes.functions";

const FAVORITES_KEY = "liam-diary-favorites";
const SESSION_LIKES_KEY = "liam-diary-session-likes";

type FeedFilter = "all" | "favorites";

function readStored(storage: Storage | undefined, key: string): Set<string> {
  try {
    const saved = JSON.parse(storage?.getItem(key) ?? "[]");
    if (Array.isArray(saved)) return new Set(saved.filter((id): id is string => typeof id === "string"));
  } catch {
    // Ignore unreadable browser storage.
  }
  return new Set();
}

function persist(storage: Storage | undefined, key: string, value: Set<string>) {
  try {
    storage?.setItem(key, JSON.stringify([...value]));
  } catch {
    // Saving is best-effort when browser storage is unavailable.
  }
}

export function BlogFeed() {
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [liked, setLiked] = useState<Set<string>>(() => new Set());
  const [likeTotals, setLikeTotals] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    setFavorites(readStored(window.localStorage, FAVORITES_KEY));
    setLiked(readStored(window.sessionStorage, SESSION_LIKES_KEY));
    getPostLikes()
      .then(setLikeTotals)
      .catch(() => setLikeTotals({}));
  }, []);

  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  const toggleLike = (id: string) => {
    const isLiked = liked.has(id);
    const delta: 1 | -1 = isLiked ? -1 : 1;
    diaryAudio.play(isLiked ? "unlike" : "like");

    const nextLiked = new Set(liked);
    if (isLiked) nextLiked.delete(id);
    else nextLiked.add(id);
    setLiked(nextLiked);
    persist(window.sessionStorage, SESSION_LIKES_KEY, nextLiked);

    setLikeTotals((current) => ({ ...current, [id]: Math.max((current[id] ?? 0) + delta, 0) }));

    adjustPostLike({ data: { postId: id, delta } })
      .then((total) => setLikeTotals((current) => ({ ...current, [id]: total })))
      .catch(() => {
        setLikeTotals((current) => ({ ...current, [id]: Math.max((current[id] ?? 0) - delta, 0) }));
        setLiked((current) => {
          const reverted = new Set(current);
          if (isLiked) reverted.add(id);
          else reverted.delete(id);
          persist(window.sessionStorage, SESSION_LIKES_KEY, reverted);
          return reverted;
        });
      });
  };

  const toggleFavorite = (id: string) => {
    diaryAudio.play(favorites.has(id) ? "unfavorite" : "favorite");
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      } catch {
        // Saving is best-effort when browser storage is unavailable.
      }
      return next;
    });
  };

  const refuseComment = () => {
    diaryAudio.play("comment");
    setNotice("No, you can't fucking comment on my own fucking diary.");
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  };

  const visiblePosts = filter === "all" ? diaryPosts : diaryPosts.filter((post) => favorites.has(post.id));

  return (
    <div className="blog-atmosphere relative mx-auto w-full max-w-[34rem] px-5 pb-32">
      <div className="blog-rain" aria-hidden="true">
        <span>09 / 15 / 26</span><span>PRIVATE</span><span>MIDORI</span><span>LV—001</span>
        <i className="blog-light blog-light-one" /><i className="blog-light blog-light-two" />
        <i className="blog-paper blog-paper-one" /><i className="blog-paper blog-paper-two" />
      </div>
      <header className="animate-soft-rise border-b border-border pt-4 pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-5xl font-light text-cream italic">
          The Feed
        </h2>
        <p className="mt-3 text-xs tracking-[0.2em] text-ash uppercase">
          Welcome, I guess
        </p>
        <div className="mt-8 flex items-center gap-7" role="tablist" aria-label="Filter posts">
          {(["all", "favorites"] as const).map((key) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={filter === key}
              onClick={() => {
                diaryAudio.play("filter");
                setFilter(key);
              }}
              className={cn(
                "h-auto rounded-none border-b px-0 py-2 text-[0.68rem] font-normal uppercase tracking-[0.18em] shadow-none hover:bg-transparent",
                filter === key
                  ? "border-cream text-cream"
                  : "border-transparent text-ash hover:text-cream",
              )}
            >
              {key === "all" ? "All Posts" : `Favorites (${favorites.size})`}
            </Button>
          ))}
        </div>
      </header>

      <div className="mt-12 space-y-20">
        {visiblePosts.length === 0 ? (
          <div className="animate-soft-rise border-y border-border py-20 text-center">
            <Bookmark className="mx-auto h-5 w-5 text-ash" strokeWidth={1.1} />
            <p className="mt-5 font-[family-name:var(--font-display)] text-2xl text-cream italic">
              Nothing saved. Yet.
            </p>
          </div>
        ) : visiblePosts.map((post, i) => (
          <article
            key={post.id}
            className="animate-soft-rise"
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <img
                src={liamAvatar}
                alt=""
                className="h-10 w-10 rounded-full border border-border bg-secondary object-cover object-top"
              />
              <div className="leading-tight">
                <p className="font-[family-name:var(--font-display)] text-lg text-cream">
                  {post.author}
                </p>
                {post.location ? (
                  <p className="flex items-center gap-1 text-[0.65rem] tracking-[0.18em] text-ash uppercase">
                    <MapPin className="h-3 w-3" strokeWidth={1.2} />
                    {post.location}
                  </p>
                ) : null}
              </div>
              <span className="ml-auto text-[0.65rem] tracking-[0.18em] text-ash uppercase">
                {post.date}
              </span>
            </div>

            <div className="mt-5 overflow-hidden border border-border bg-black">
              <img
                src={post.image}
                alt={post.imageAlt}
                loading="lazy"
                className="w-full object-cover brightness-[0.92] transition-transform duration-[1.4s] ease-out hover:scale-[1.03]"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-cream/80">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={liked.has(post.id) ? "Unlike post" : "Like post"}
                aria-pressed={liked.has(post.id)}
                onClick={() => toggleLike(post.id)}
                className={cn("rounded-full hover:bg-accent", liked.has(post.id) && "text-destructive")}
              >
                <Heart className={cn("transition-transform duration-300", liked.has(post.id) && "scale-110 fill-current")} strokeWidth={1.4} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Comment on post"
                onClick={refuseComment}
                className="rounded-full hover:bg-accent"
              >
                <MessageCircle strokeWidth={1.2} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={favorites.has(post.id) ? "Remove from favorites" : "Save to favorites"}
                aria-pressed={favorites.has(post.id)}
                onClick={() => toggleFavorite(post.id)}
                className={cn("ml-auto rounded-full hover:bg-accent", favorites.has(post.id) && "text-cream")}
              >
                <Bookmark className={cn("transition-transform duration-300", favorites.has(post.id) && "scale-110 fill-current")} strokeWidth={1.2} />
              </Button>
            </div>

            <p className="mt-3 text-xs tracking-[0.18em] text-cream uppercase">
              {(post.likes + (liked.has(post.id) ? 1 : 0)).toLocaleString()} likes
            </p>

            <p className="mt-4 text-sm leading-[1.9] whitespace-pre-line text-cream/85">
              {post.caption}
            </p>

            <p className="mt-5 text-[0.7rem] tracking-[0.18em] text-ash uppercase">
              {post.comments === 0
                ? "No comments"
                : `${post.comments} comment${post.comments === 1 ? "" : "s"}`}
            </p>
          </article>
        ))}
      </div>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          "fixed bottom-7 left-1/2 z-30 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 border border-border bg-card/95 px-6 py-5 text-center font-[family-name:var(--font-display)] text-lg text-cream italic shadow-2xl backdrop-blur-md transition-all duration-300",
          notice ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        {notice}
      </div>
    </div>
  );
}
