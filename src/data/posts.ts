import postOne from "@/assets/liam-post-1.png.asset.json";

export type DiaryPost = {
  id: string;
  author: string;
  handle: string;
  date: string;
  image: string;
  imageAlt: string;
  caption: string;
  likes: number;
  comments: number;
  location?: string;
};

/**
 * Add future diary posts here — newest first.
 * Images: upload with lovable-assets and import the .asset.json pointer.
 */
export const diaryPosts: DiaryPost[] = [
  {
    id: "2026-09-15-midori",
    author: "Liam Vazquez",
    handle: "@vazquez",
    date: "September 15, 2026",
    image: postOne.url,
    imageAlt: "Liam sitting outside at dusk, reading in his school uniform",
    caption:
      "First day at Midori High.\n\nThe basketball court looks good, I might sign up to a club.",
    likes: 742,
    comments: 0,
    location: "Midori High",
  },
];
