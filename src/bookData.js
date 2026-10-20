/**
 * ============================================================
 * 🎂 MANISA'S BIRTHDAY BOOK CONFIGURATION
 * ============================================================
 * Images loaded from your PDF export:
 * - Cover: First cover page.png
 * - Pages: Page-1 to Page-8
 * - Back Cover: Last cover page.png
 */

export const bookConfig = {
  title: "Happy Birthday Manisa ✨",
  subtitle: "Click the book or use arrow keys to flip through the pages",
  personName: "Manisa",
  celebrationDate: "Special Birthday Edition",

  // Book Dimensions: calibrated to the exact 941x1672 aspect ratio of your pages
  width: 360,           // Width of a single page in px (opened book is 720px)
  height: 640,          // Height of the book in px
  borderRadius: 8,      // Page corner curvature
  shadow: {
    color: "#000000",
    opacity: 0.45,
    blur: 30,
    offsetX: 10,
    offsetY: 15,
    spread: 0,
  },

  soundEnabledDefault: true,
};

/**
 * 📖 BOOK PAGES (Ordered sequence)
 * Total: 10 pages = 5 leaves (front & back)
 */
export const bookPages = [
  // Leaf 0: Front Cover & Page 1
  "/images/cover.png",        // Front Cover
  "/images/Page-1.png",       // Page 1 (inside front cover)

  // Leaf 1: Page 2 & Page 3
  "/images/Page-2.png",       // Page 2
  "/images/Page-3.png",       // Page 3

  // Leaf 2: Page 4 & Page 5
  "/images/Page-4.png",       // Page 4
  "/images/Page-5.png",       // Page 5

  // Leaf 3: Page 6 & Page 7
  "/images/Page-6.png",       // Page 6
  "/images/Page-7.png",       // Page 7

  // Leaf 4: Page 8 & Back Cover
  "/images/Page-8.png",       // Page 8
  "/images/backcover.png",    // Back Cover
];
