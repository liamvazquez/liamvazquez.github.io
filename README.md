# Liam's Private Echo

Build a fictional personal diary website for Liam Vazquez with an editorial dark aesthetic (black backgrounds, cream/beige typography, cinematic transitions).

Key features:
1. Entrance Screen:
- Background uses FIRST attached image (darkened, vignette, centered, atmospheric).
- Prompt: "Are you sure you want to enter his diary?" with YES and NO buttons.
- Clicking NO: Dramatic glitch transition to dark red screen, large white cross, blunt message: "Then fuck off then.", total lockout until page reload.
- Clicking YES: Smooth transition to second confirmation: "Are you sure?" (YES/NO). NO returns to screen 1; YES triggers a cinematic blur/fade/zoom entrance into the diary.

2. Visitor Counter & Snarky Comments:
- Top-left eye icon with persistent visitor count incremented on successful entry.
- Dynamic comment below counter based on count:
  * <10: "That's the beginning of my diary, I think no one cares."
  * 10–29: "A couple of weirdos found this, apparently."
  * 30–49: "Jesus Christ, I'm starting to get famous."
  * 50+: "Jeez, people really like stalking my diaries."

3. Navigation:
- Minimalist, non-traditional navigation with only two options: "BLOG" and "RELATIONSHIPS".

4. Blog Section:
- Unique fictional dark social media diary feed (Instagram-inspired but custom dark editorial aesthetic).
- First post uses SECOND attached image, author "Liam Vazquez", date "September 15, 2026", caption:
  "First day at Midori High.\n\nThe basketball court looks good, I might sign up to a club."
- Realistic likes count (e.g. 742 likes), 0 comments.
- Structured data architecture for posts in a separate data/config file so future posts can be easily added.

5. Relationships Section:
- Interactive zoomable/pannable relationship network graph.
- Liam in the center with FIRST image.
- Relationship categories & colors: Red (Hate/hatred), Pink (Romantic love), Blue (Friendship), Purple (Complicated), Orange (Rivalry), Green (Family) with an elegant legend.
- Clicking Liam expands an attached card with beige text: "That's me, what the actual fuck do you want me to tell you? It's just myself."
- Clean modular data structure for adding future characters and connections effortlessly.

6. Responsive, highly polished, with refined serif titles, cream text, and zero generic template feel.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e6b8294c-5dff-47b7-808d-42594381c0a9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
