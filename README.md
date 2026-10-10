# Shilpa & Siddharth – Wedding Invitation Website

A static website (HTML, CSS, JavaScript). No backend, database, API keys or build step.

## Folder structure

```
wedding-invitation/
├── index.html
├── css/style.css
├── js/script.js
├── favicon/favicon.svg
└── assets/
    ├── couple-1.jpg        your first photo
    ├── couple-2.jpg        your second photo
    ├── wedding-music.mp3   background music
    └── og-image.jpg        preview image shown when the link is shared
```

## Photos and music

Your two photos and the music file are already in `assets/` under the correct names.
To replace them, overwrite the files with the same names:

- `assets/couple-1.jpg` and `assets/couple-2.jpg` (portrait photos work best, around 800–1200 px wide, under 300 KB each)
- `assets/wedding-music.mp3`

If a photo is missing, a soft floral placeholder appears. If the music file is missing, the music button hides itself. Nothing breaks either way.

To crop a photo differently, change `object-position` on the `<img>` tag in `index.html` (for example `50% 20%` shows more of the top).

## Run locally

Option 1: double-click `index.html`. It works, but opening through a local server is closer to the real site.

Option 2 (needs Python): in the folder, run `python -m http.server 8000`, then open http://localhost:8000.

Option 3 (needs Node): run `npx serve .` and open the address it prints.

## Deploy to Vercel

Using the website:
1. Create a free account at vercel.com.
2. Click **Add New… → Project**, and choose **Deploy without Git** (or drag the folder into the dashboard).
3. Upload the `wedding-invitation` folder. Leave all build settings empty. Framework preset: **Other**.
4. Click **Deploy**. You get a link like `https://your-name.vercel.app`.

Using the command line: run `npm i -g vercel`, then `vercel` inside the folder, and `vercel --prod` to publish.

## Deploy to Netlify

Go to app.netlify.com/drop and drag the `wedding-invitation` folder onto the page.

## WhatsApp link preview (do this after deploying)

WhatsApp needs a full web address for the preview image. After you have your live link, open `index.html` and change this line:

```html
<meta property="og:image" content="assets/og-image.jpg">
```

to

```html
<meta property="og:image" content="https://YOUR-LIVE-LINK/assets/og-image.jpg">
```

Redeploy. WhatsApp caches previews, so test with a new chat or add `?v=2` to the link you share.

## Editing details

- Wedding text, dates, names and map links are all in `index.html`.
- The countdown target is in `js/script.js` (`2026-12-03T18:00:00+05:30`, 6:00 PM India time).
- The RSVP number and message are in the WhatsApp button's `href` in `index.html`.
- To add gallery photos, put them in `assets/` and copy one `<figure class="gallery-item">…</figure>` block inside the gallery section.
- Fonts (Cormorant Garamond and Jost) load from Google Fonts. If they cannot load, the site falls back to Georgia and the phone's default font.

## Version 2 notes

- Opening screen is now a curtain. A guest taps once, the curtains part, and the music starts from that same tap. There is no music button.
- RSVP contact is now Alok Verma (+91 63932 35528). The WhatsApp message starts with "Hello Alok ji". Both are in the RSVP section of `index.html`.
- Browsers only allow sound after a tap, so the music always begins from the curtain tap and never on page load.

## Version 3 notes

The design is now midnight blue with gold, rose-gold accents and a deep wine curtain. The content, music, countdown, RSVP and maps work as before.

## Version 4 notes

- Haldi Tales, Mehfil-e-Mehendi and Musical Masti (Sangeet) are at home: Village Gopalpur Madhaiya, Post Belahi, Lambhua, Sultanpur, UP 222302. They share one map link. The wedding is at Kailash Marriage Lawn with its own map link.
- The Moments gallery uses `assets/moment-1.jpg`, `moment-2.jpg` and `moment-3.jpg`. The hero keeps `couple-1.jpg` and `couple-2.jpg`.
- RSVP contact is Alok Verma. Change the name in the RSVP section and in the `wa.me` link in `index.html`.
- If a maps.app.goo.gl link says "took too long to respond", the phone or network is blocking that Google domain. It is not a code problem. Try mobile data instead of WiFi, or another browser.
