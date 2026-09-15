import liamAvatar from "@/assets/liam-avatar.png.asset.json";

export type RelationType = "hate" | "love" | "friend" | "complicated" | "rival" | "family";

export const relationMeta: Record<RelationType, { label: string; color: string }> = {
  hate: { label: "Hatred", color: "#e0252b" },
  love: { label: "Romantic love", color: "#f27cae" },
  friend: { label: "Friendship", color: "#4a90e2" },
  complicated: { label: "Complicated", color: "#9b6cd6" },
  rival: { label: "Rivalry", color: "#f08a24" },
  family: { label: "Family", color: "#46b06a" },
};

export type Character = {
  id: string;
  name: string;
  role?: string;
  image?: string;
  /** Position relative to the canvas center, in px. */
  x: number;
  y: number;
  /** Text shown on the attached card when the node is clicked. */
  note: string;
};

export type Connection = {
  from: string;
  to: string;
  type: RelationType;
  label?: string;
};

/** Add new characters here — x/y are offsets from Liam at (0,0). */
export const characters: Character[] = [
  {
    id: "liam",
    name: "Liam Vazquez",
    role: "That's me",
    image: liamAvatar.url,
    x: 0,
    y: 0,
    note: "That's me, what the actual fuck do you want me to tell you? It's just myself.",
  },
];

/** Add new connections here. */
export const connections: Connection[] = [];
