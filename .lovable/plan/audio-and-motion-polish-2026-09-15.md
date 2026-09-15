# Audio and motion polish

## What will change
- Add a compact Web Audio sound system that starts only after a visitor gesture and gives each diary action its own short sound: entrance Yes, denial No, section tabs, feed filters, like, comment refusal, favorite, relationship node, card close, zoom, and recenter.
- Start a low-volume, original groovy jazz loop after the final Yes. It will use synthesized brushed drums, walking bass, and muted electric-piano chords, with a discreet sound toggle so visitors can silence it.
- Replace the second-Yes blur with a layered cinematic transition: an expanding cream portal/ring, sweeping frame lines, a camera push, typography separation, and a clean reveal into the diary.
- Make the denial sequence more physical: fracture lines will draw and slash in from different edges and lengths instead of appearing fully formed, while retaining the red CRT pulse and lockout.
- Add a subtle editorial background animation behind the blog feed using slow vertical archival lines, drifting date fragments, and film texture without competing with posts.
- Turn the visitor eye into an accessible hover/focus explanation using Liam’s exact line: “That’s the number of persons that visited my diary. What the fuck could it be? What else could it be?”
- Simplify relationship legend entries to category names only, removing the AI-like descriptive sublabels, and add three distinct categories: Trust, Distrust, and Mentor.

## Interaction and accessibility
- Respect reduced-motion preferences by replacing major transitions with short fades and stopping decorative motion.
- Keep audio opt-in through the entrance click, start jazz quietly, pause it when the page is hidden, and expose a labeled mute/unmute control.
- Preserve all current likes, favorites, visitor count, lockout, pan/zoom, and relationship card behavior.

## Technical details
- Use one shared client-side Web Audio manager rather than separate audio contexts, with synthesized effects and a look-ahead jazz scheduler; no downloaded audio files or external runtime dependencies.
- Route every existing clickable diary control through named sound cues while keeping semantic Button components and keyboard focus behavior.
- Extend the relationship data type and color tokens for the three new categories, but remove legend descriptions from the rendered UI.
- Verify the complete flow on desktop and mobile: both entrance decisions, final transition, music toggle, every control sound trigger, feed motion, tooltip, lockout line animation, and relationship legend/card behavior.
