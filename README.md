# Fly Index – A Fly Tying Pattern Library

A clean, responsive web app for browsing, searching, and filtering fly tying patterns. Perfect for fly fishers who want to quickly find patterns they can tie with the materials they have on hand.

## Features

- Beautiful grid view of fly patterns with high-quality photos
- Detailed fly modal with:
  - Large photo
  - Variant selector dropdown (different colors/sizes of the same pattern)
  - Materials list
  - Tags
  - Step-by-step tying instructions
- Powerful filtering:
  - Search by name or tag
  - Filter by tags (Freshwater, Streamer, Trout, etc.) with always-visible clickable buttons
  - Filter by available materials (select what you have, see what you can tie)
- "Add Fly Pattern" button linking to a Google Form for community contributions
- Fully responsive – works great on mobile, tablet, and desktop
- Offline-first – all data stored locally in `flies.json`

## Project Structure

fly-index/
├── index.html
├── style.css
├── script.js
├── flies.json
├── README.md
└── images/
├── woolly-bugger/
│   └── standard.jpg
├── pheasant-tail-nymph/
│   └── standard.jpg
├── elk-hair-caddis/
│   └── standard.jpg
└── ... (one folder per fly)


## Image Organization

Images are now organized in **nested folders**:
- One folder per fly: named in lowercase with hyphens (e.g., `woolly-bugger`)
- Inside each folder: one image per variant (e.g., `black.jpg`, `olive.jpg`, `standard.jpg`)
- In `flies.json`, only specify the filename (e.g., `"image": "black.jpg"`)

## How to Add or Edit Flies

Edit **`flies.json`**:

```json
{
  "name": "Woolly Bugger",
  "variants": [
    {
      "variantName": "Black",
      "image": "black.jpg",
      "materials": [...],
      "tags": [...],
      "instructions": "Steps with \\n for line breaks..."
    }
  ]
}

Create folder images/woolly-bugger/
Add black.jpg inside it
Use \n for line breaks in instructions

Contributing
Click the + button in the app to submit new patterns via Google Form.
Local Development

Open index.html in browser
Edit flies.json and add images to correct folders
Hard refresh (Ctrl+Shift+R) to see changes

Deployment
Static site – deploy to:

GitHub Pages
Netlify
Vercel

Built for the fly tying community. Tight lines! 🎣
