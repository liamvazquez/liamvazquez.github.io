# Refine the diary’s ambience and sound controls

## What will change
- Make **No** on either confirmation immediately enter the permanent denial screen.
- Restyle the entrance **No** control with cleaner editorial typography and smoother states, removing its pixelated feel.
- Rework the denial screen with richer static details, restrained red ambience, and smooth reveals; its linework will remain fixed instead of traveling across the screen.
- Add subtle, slow-moving background layers across both the blog and relationships views so the diary feels alive without distracting from the content.
- Replace the mute-only control with a compact jazz volume slider, retaining a quick mute button and remembering the chosen volume.

## Interaction details
- The second confirmation’s **No** uses the same immediate denial treatment and sound as the first.
- The volume control changes only the jazz level; interface sound effects remain audible.
- Reduced-motion preferences will stop decorative movement while preserving the visual texture.

## Technical details
- Extend the shared audio controller with persisted music-volume getters/setters and separate music gain handling.
- Keep all visual additions within the existing dark editorial token system and existing controls.
- Verify entrance branches, volume behavior, layout, and motion on desktop and mobile.
