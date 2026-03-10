# Lumon Industries — Macrodata Refinement Terminal

> *"The work is mysterious and important."*
> — Kier Eagan

 I got bored and made a web app inspired by the MDR terminal from the show **Severance**. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

## Features

- **Intro screen** — cascading black and white numbers. Click anywhere to enter.
- **MDR terminal** — CRT scanline effects, phosphor glow, and screen flicker for full immersion.
- **300 clickable numbers** — scroll through and refine numbers into one of the five bins: WO, FC, DR, MA, TE.
- **Scary numbers** — some numbers are pre-marked in red. Click one and you'll be interrupted by a mandatory Kier Eagan quote.
- **Bin locking** — once a bin hits 100%, it locks and auto-switches you to the next incomplete one.
- **Live quota ring** — tracks your overall progress as the average across all five bins.
- **Waffle Party** — fill all five bins to 100% and trigger the full celebration: white flash, confetti numbers, ASCII Milchick dancing, and his typewriter speech announcing the party.
- **System log** — live activity feed in the sidebar.
- **Cobel's message** — she's watching...


## File Structure

```
lumon-mdr/
├── index.html    # Markup and structure
├── styles.css    # All styling, CSS variables, animations
├── intro.js      # Cascading number intro screen
└── main.js       # Game logic, bins, quota, modals, waffle party
```


## How to Play

1. Click a number to refine it into the active bin
2. Switch bins using the tray at the bottom of the screen
3. Fill all five bins to 100% to earn a Waffle Party
4. Avoid clicking red (scary) numbers — they'll trigger a Kier interruption
5. Click **Return to Work** after the party to reset and start a new file

---

## Built With

- HTML5 Canvas (intro animation + waffle party confetti)
- CSS custom properties and keyframe animations
- Vanilla JavaScript — no libraries or frameworks
- [Google Fonts](https://fonts.google.com): VT323, Share Tech Mono, IBM Plex Mono

---

## Disclaimer ( Dont sue me pls )

This is an unofficial fan project made for fun. Severance and all related elements are the property of Apple TV+ and their respective creators. This project is not affiliated with or endorsed by Lumon Industries. Just a fan of the show..

> *You are here to serve Lumon.*
