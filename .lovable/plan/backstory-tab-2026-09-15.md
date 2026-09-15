# Backstory Tab

## Build
- Add **BACKSTORY** beside BLOG and RELATIONSHIPS, with unstable analog-horror twitching even before it is opened.
- On selection, replace the diary content with a stark full-screen backstory state containing only: “It’s too early for that, don’t you think?”
- Give the backstory screen layered tape damage, tracking slips, text corruption, and intermittent restrained flashes while keeping it readable.
- Crossfade the jazz into an original synthesized horror ambience over two seconds; selecting BLOG or RELATIONSHIPS crossfades back to jazz and restores the normal diary atmosphere.
- Keep volume and mute controls working for both soundscapes.

## Validation
- Verify entering and leaving BACKSTORY on desktop and mobile, including audio-state transitions, readable text, reduced-motion behavior, and no layout overflow.

## Technical details
- Extend the existing section state and shared Web Audio engine rather than adding another route or external audio file.
- Add scoped animation classes and semantic color treatments to the existing design system.
