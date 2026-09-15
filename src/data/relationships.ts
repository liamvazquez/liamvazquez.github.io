import liamAvatar from "@/assets/liam-avatar.png";

export type RelationType =
  | "hate"
  | "love"
  | "crush"
  | "friend"
  | "respect"
  | "rival"
  | "complicated"
  | "family"
  | "acquaintance"
  | "trust"
  | "distrust"
  | "mentor";

export const relationMeta: Record<RelationType, { label: string; description: string; color: string }> = {
  hate: { label: "Hatred", description: "Hostility", color: "var(--relation-hate)" },
  love: { label: "Romantic love", description: "Devotion", color: "var(--relation-love)" },
  crush: { label: "Crush", description: "Unsaid attraction", color: "var(--relation-crush)" },
  friend: { label: "Friendship", description: "Trusted circle", color: "var(--relation-friend)" },
  respect: { label: "Respect / Admiration", description: "Earned regard", color: "var(--relation-respect)" },
  rival: { label: "Rivalry", description: "Competitive tension", color: "var(--relation-rival)" },
  complicated: { label: "Complicated", description: "Hard to define", color: "var(--relation-complicated)" },
  family: { label: "Family", description: "Blood and bonds", color: "var(--relation-family)" },
  acquaintance: { label: "Acquaintance / Distant", description: "Peripheral", color: "var(--relation-acquaintance)" },
  trust: { label: "Trust", description: "Guard lowered", color: "var(--relation-trust)" },
  distrust: { label: "Distrust", description: "Always watching", color: "var(--relation-distrust)" },
  mentor: { label: "Mentor / Guidance", description: "A hand on the compass", color: "var(--relation-mentor)" },
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
    image: liamAvatar,
    x: 0,
    y: 0,
    note: "That's me, what the actual fuck do you want me to tell you? It's just myself.",
  },
];

/** Add new connections here. */
export const connections: Connection[] = [];
