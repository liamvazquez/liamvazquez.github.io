import { Heart, MessageCircle, Bookmark, MapPin } from "lucide-react";
import liamAvatar from "@/assets/liam-avatar.png.asset.json";
import { diaryPosts } from "@/data/posts";

export function BlogFeed() {
  return (
    <div className="mx-auto w-full max-w-[34rem] px-5 pb-32">
      <header className="animate-soft-rise border-b border-border pt-4 pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-5xl font-light text-cream italic">
          The Feed
        </h2>
        <p className="mt-3 text-xs tracking-[0.2em] text-ash uppercase">
          Entries he never meant to publish
        </p>
      </header>

      <div className="mt-12 space-y-20">
        {diaryPosts.map((post, i) => (
          <article
            key={post.id}
            className="animate-soft-rise"
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <img
                src={liamAvatar.url}
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

            <div className="mt-4 flex items-center gap-5 text-cream/80">
              <Heart className="h-5 w-5" strokeWidth={1.2} />
              <MessageCircle className="h-5 w-5" strokeWidth={1.2} />
              <Bookmark className="ml-auto h-5 w-5" strokeWidth={1.2} />
            </div>

            <p className="mt-3 text-xs tracking-[0.18em] text-cream uppercase">
              {post.likes.toLocaleString()} likes
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
    </div>
  );
}
