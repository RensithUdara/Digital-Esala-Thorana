# Digital Esala Thorana

An interactive digital Vesak / Esala thorana web experience based on the Vessantara Jataka story. The project renders a colorful animated LED-style thorana on an HTML canvas, includes story-panel focus mode, background music, visitor presence, wishes, lamps, and suggestion features.

Live site: https://digital-esala-thorana.vercel.app

## Overview

Digital Esala Thorana is a static frontend web application built with plain HTML, CSS, and JavaScript. It recreates a festival thorana experience in the browser with animated light patterns, Sinhala story content, image panels, ambient music, and community interactions powered by Firebase.

The main experience is designed around:

- A large animated thorana canvas
- Eight Vessantara Jataka story panels
- A focus mode that zooms into each panel
- A 45-second automatic focus tour
- Manual panel selection
- Background music using `assets/audio/music.mp3`
- Sound mute / unmute control
- Online visitor display
- Wishes wall
- Lamp-lighting feature
- Suggestion / comment modal
- Vercel static deployment

## Features

### Animated Thorana

- Canvas-rendered LED thorana design
- Multiple animated light patterns
- Central Buddha image
- Eight circular story panels
- Peacock and decorative image assets
- Responsive scaling for desktop and mobile

### Story Panels

- Eight Vessantara Jataka panels
- Clickable circular panel detection
- Sinhala story title and description
- Panel image shown in focus mode
- Highlighted selected panel on the thorana

### Focus Mode

- First entry asks whether the user wants focus mode
- If accepted, starts from panel 1
- Each panel stays for 45 seconds
- Automatically moves through panels 1 to 8
- After panel 8, focus mode closes and full thorana is shown
- Manual panel clicks open that panel directly without starting auto movement
- Previous / next controls
- Fullscreen control
- Comments shortcut

### Audio

- Uses only one audio file: `assets/audio/music.mp3`
- Background music loops during the experience
- Header sound button toggles mute / unmute
- No separate panel audio files are required

### Community Features

Firebase-powered features include:

- Online visitor count
- Visitor movement around the thorana
- Daily visit count
- Wishes wall
- Lamp lighting
- Suggestions, comments, and feedback

If Firebase is unavailable or not configured, the core thorana still loads as a static page, but community features may not save or sync.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- HTML Canvas
- Firebase Realtime Database
- Firebase Firestore
- Vercel hosting
- Font Awesome icons
- Google Fonts

## Project Structure

```text
.
├── assets/
│   ├── audio/
│   │   └── music.mp3
│   └── images/
│       ├── b.png
│       ├── buddhist-flag.gif
│       ├── srilanka-flag.gif
│       └── vessantara_panel_1.png ... vessantara_panel_8.png
├── css/
│   ├── base/
│   │   └── style.css
│   ├── components/
│   │   ├── focus-mode.css
│   │   └── welcome.css
│   └── main.css
├── js/
│   ├── app.js
│   ├── config/
│   │   ├── firebase-config.js
│   │   ├── thorana-assets.js
│   │   └── ui-config.js
│   ├── data/
│   │   └── chapters.js
│   ├── services/
│   │   └── firebase-service.js
│   └── utils/
│       └── dom.js
├── database.rules.json
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── index.html
├── vercel.json
└── README.md
```

## Getting Started

### Prerequisites

You only need a modern browser to run the site locally.

Optional tools:

- Node.js, for syntax checks or local tooling
- Python, for a simple static server
- Vercel CLI, for deployment
- Firebase project, for live community features

### Run Locally

Because this is a static site, you can open `index.html` directly in a browser.

For a local server, run one of these commands from the project root:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

If you use Node tooling, you can also serve the folder with any static server package.

## Firebase Setup

Firebase configuration is stored in:

```text
js/config/firebase-config.js
```

The app expects Firebase Realtime Database and optionally Firestore.

Used data areas include:

- `visitors`
- `stats`
- `wishes`
- `lamps`
- `suggestions`

Firebase rules are included:

```text
database.rules.json
firestore.rules
firestore.indexes.json
firebase.json
```

If you create a new Firebase project, update `js/config/firebase-config.js` with your own Firebase project values.

## Deployment

The project is deployed on Vercel as a static site.

Production URL:

```text
https://digital-esala-thorana.vercel.app
```

### Deploy With Vercel CLI

Install or use the Vercel CLI:

```bash
npm install -g vercel
```

Login:

```bash
vercel login
```

Link the project:

```bash
vercel link --project digital-esala-thorana
```

Deploy to production:

```bash
vercel deploy --prod
```

### Vercel Routing

`vercel.json` is included so all paths rewrite to `index.html`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Customization

### Change Story Content

Edit:

```text
js/data/chapters.js
```

Each chapter includes:

- `id`
- `img`
- `titleSi`
- `titleEn`
- `storySi`
- `storyEn`
- `themeColor`

### Change Thorana Assets

Edit:

```text
js/config/thorana-assets.js
```

This file controls image paths and visual configuration for the thorana assets.

### Change Styles

Main CSS entry:

```text
css/main.css
```

Detailed styles:

```text
css/base/style.css
css/components/focus-mode.css
css/components/welcome.css
```

### Change Music

Replace:

```text
assets/audio/music.mp3
```

Keep the same filename if you do not want to edit `index.html`.

## Important Behavior Notes

- The app uses only `music.mp3` for audio.
- `w1.mp3` through `w8.mp3` are not used.
- Focus mode auto-tour stays 45 seconds on each panel.
- Manual panel click opens only that panel and does not auto-advance.
- The header sound button controls mute / unmute for all audio.
- The thorana is centered on desktop, with controls placed on the right side.
- On smaller screens, controls move below the thorana.

## Validation

JavaScript syntax can be checked with:

```bash
node --check js/app.js
```

For deployment verification, check the live URL returns `200 OK`:

```bash
curl -I https://digital-esala-thorana.vercel.app
```

## Credits

Developed by Rensith Udara Gonalagoda.

## License

No license file is currently included. Add a license before distributing or accepting external contributions.
