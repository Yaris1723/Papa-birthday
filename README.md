# 🎂 Manisa's Birthday Interactive Book 📖✨

An interactive 3D flipping memory book built with **React**, **Framer Motion**, and **Vite**, based on the Framer InteractiveBook module ([`InteractiveBook-xGXc.js@uLOYl8huI2w4XDdONaRK`](https://framer.com/m/InteractiveBook-xGXc.js@uLOYl8huI2w4XDdONaRK)).

---

## 🚀 Quick Start

To launch the interactive book in your browser:

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
```

---

## 🛠️ How to Edit & Customize

### 1. The Quickest Way: In-Browser Editor ⚡
When you run the app, click the **"Edit"** button in the bottom floating toolbar to open the customization drawer. You can change:
- Birthday Person's Name
- Celebration Date
- Cover Titles & Subtitles
- Opening Letter
- Photos & Captions

---

### 2. Full Customization via `src/bookData.js` 📝
All the content, pages, photos, and messages are cleanly organized inside [`src/bookData.js`](./src/bookData.js).

#### To add your own photos:
1. Save your image files in `public/images/` (e.g., `public/images/manisa1.jpg`).
2. In `src/bookData.js`, set the image URL:
   ```js
   imageUrl: "/images/manisa1.jpg"
   ```

#### Pre-built Birthday Page Types:
- **`cover`**: Midnight navy & gold foil embossed book cover.
- **`letter`**: Vintage parchment letter with cursive handwriting & wax seal.
- **`polaroid`**: Realistic taped polaroid photo with date stamp and caption.
- **`reasons`**: "Things we love about you" card list with icons.
- **`scrapbook`**: Dual tilted photos with washi tape and captions.
- **`wishesWall`**: Colorful sticky notes with heartfelt messages.
- **`interactiveCake`**: Interactive birthday cake! Click the candle flame to blow it out and pop confetti! 🎉
- **`futureChapter`**: Editorial style look-ahead section.
- **`closingLetter`**: Warm closing message and toast.
- **`backCover`**: Elegant gold monogram back cover.

#### Or use full-bleed image designs (like original Framer):
If you already designed your pages as full images (e.g., from Canva or Photoshop), you can simply provide the image URL:
```js
{ imageUrl: "/images/page1.jpg" }
// or
"https://your-domain.com/page1.jpg"
```

---

## 📂 Project Structure

```
├── public/
│   └── images/              <- Put your local photos here
├── src/
│   ├── bookData.js          <- ⭐️ Central configuration file (edit this!)
│   ├── App.jsx              <- Main container, responsive scale & background
│   ├── index.css            <- Luxurious dark theme, gold accents & 3D styling
│   ├── main.jsx             <- React entry point
│   ├── components/
│   │   ├── InteractiveBook.jsx       <- 3D flipping physics + bidirectional controls
│   │   ├── InteractiveBookFramer.jsx <- 100% exact replica of original Framer component
│   │   ├── PageTemplates.jsx         <- Rich birthday page templates
│   │   ├── Controls.jsx              <- Bottom navigation toolbar
│   │   └── QuickEditModal.jsx        <- In-browser editor & preview
│   └── utils/
│       └── sound.js         <- Web Audio realistic page-turn sound synthesizer
├── package.json
└── vite.config.js
```

---

## 🎮 Interactive Features
- **Click to Turn Pages**: Click right page to flip forward, click left page to flip backward.
- **Keyboard Navigation**: Use <kbd>←</kbd> and <kbd>→</kbd> arrow keys or <kbd>Space</kbd>.
- **Sound Effects**: Realistic paper turn sound synthesized via the Web Audio API (no external audio files required, toggleable on/off).
- **Celebration Button**: Burst colorful confetti across the screen! 🎊
- **Blow the Candle**: On page 6, tap the candle flame to blow it out and trigger celebration confetti!
- **Auto-Responsive**: Seamlessly scales to fit any screen size (mobile, tablet, desktop).
