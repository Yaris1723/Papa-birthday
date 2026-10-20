import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Star, Cake, Flame, Volume2, Camera, Quote } from 'lucide-react';

export function PageRenderer({ pageData, isBackFace = false }) {
  // If pageData is just a string URL, render image directly like original Framer
  if (typeof pageData === 'string') {
    return (
      <img
        src={pageData}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          WebkitUserDrag: 'none',
          pointerEvents: 'none'
        }}
      />
    );
  }

  if (!pageData) {
    return <div className="page-blank" />;
  }

  if (pageData.imageUrl && !pageData.type) {
    return (
      <img
        src={pageData.imageUrl}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          WebkitUserDrag: 'none',
          pointerEvents: 'none'
        }}
      />
    );
  }

  switch (pageData.type) {
    case 'cover':
      return <CoverPage data={pageData} />;
    case 'letter':
      return <LetterPage data={pageData} />;
    case 'polaroid':
      return <PolaroidPage data={pageData} />;
    case 'reasons':
      return <ReasonsPage data={pageData} />;
    case 'scrapbook':
      return <ScrapbookPage data={pageData} />;
    case 'wishesWall':
      return <WishesWallPage data={pageData} />;
    case 'interactiveCake':
      return <InteractiveCakePage data={pageData} />;
    case 'futureChapter':
      return <FutureChapterPage data={pageData} />;
    case 'closingLetter':
      return <ClosingLetterPage data={pageData} />;
    case 'backCover':
      return <BackCoverPage data={pageData} />;
    default:
      if (pageData.imageUrl) {
        return (
          <img
            src={pageData.imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        );
      }
      return <div className="page-blank" />;
  }
}

// -------------------------------------------------------------
// FRONT COVER
// -------------------------------------------------------------
function CoverPage({ data }) {
  return (
    <div
      className="cover-page"
      style={{
        width: '100%',
        height: '100%',
        background: data.coverColor || '#1e1b4b',
        color: '#fef3c7',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '36px 28px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Decorative Leather & Grain Texture */}
      <div className="cover-texture-overlay" />

      {/* Gold Foil Double Border */}
      <div className="cover-gold-border">
        <div className="corner-decor top-left">✦</div>
        <div className="corner-decor top-right">✦</div>
        <div className="corner-decor bottom-left">✦</div>
        <div className="corner-decor bottom-right">✦</div>
      </div>

      {/* Top Badge */}
      <div className="cover-top-badge">
        <Sparkles size={14} className="gold-icon" />
        <span>{data.badge || "SPECIAL BIRTHDAY EDITION"}</span>
        <Sparkles size={14} className="gold-icon" />
      </div>

      {/* Central Title Cluster */}
      <div className="cover-center-content">
        <div className="cover-stars">
          <Star size={16} fill="#fbbf24" stroke="none" />
          <Star size={20} fill="#fbbf24" stroke="none" />
          <Star size={16} fill="#fbbf24" stroke="none" />
        </div>
        <h2 className="cover-cursive-title">{data.title || "Happy Birthday"}</h2>
        <h1 className="cover-main-name">{data.name || "MANISA"}</h1>
        <div className="gold-divider">
          <span className="divider-line" />
          <span className="divider-gem">❖</span>
          <span className="divider-line" />
        </div>
        <p className="cover-subtitle">{data.subtitle}</p>
      </div>

      {/* Bottom Info & Tap Hint */}
      <div className="cover-bottom">
        <div className="cover-date-pill">{data.date || "OCTOBER 20"}</div>
        <div className="cover-tap-hint">
          <span>Tap to open book</span>
          <span className="tap-arrow">→</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 1: HEARTFELT LETTER
// -------------------------------------------------------------
function LetterPage({ data }) {
  return (
    <div className="letter-page">
      <div className="page-watermark">01</div>
      <div className="letter-header">
        <div className="letter-wax-seal">
          <span>M</span>
        </div>
        <h2 className="letter-heading">{data.heading}</h2>
      </div>

      <div className="letter-body">
        {data.body.map((paragraph, idx) => (
          <p key={idx} className="letter-p">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="letter-footer">
        <p className="letter-closing">{data.closing}</p>
        <p className="letter-signature">{data.signature}</p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 2: POLAROID PHOTO
// -------------------------------------------------------------
function PolaroidPage({ data }) {
  return (
    <div className="polaroid-page">
      <div className="page-watermark">{data.pageNumber}</div>
      <div className="page-top-header">
        <span className="tag-pill">{data.badge || "Memories"}</span>
        <h3 className="page-title">{data.title}</h3>
      </div>

      <div className="polaroid-frame">
        <div className="washi-tape" />
        <div className="polaroid-img-box">
          <img src={data.imageUrl} alt={data.title} />
        </div>
        <div className="polaroid-caption">
          <p className="caption-text">{data.caption}</p>
          <span className="polaroid-date">{data.dateStamp}</span>
        </div>
      </div>

      <div className="handwritten-sticky">
        <Heart size={14} fill="#f43f5e" stroke="none" />
        <span>{data.note}</span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 3: REASONS WE LOVE YOU
// -------------------------------------------------------------
function ReasonsPage({ data }) {
  return (
    <div className="reasons-page">
      <div className="page-watermark">{data.pageNumber}</div>
      <div className="section-head">
        <h3 className="serif-title">{data.title}</h3>
        <p className="sub-caption">{data.subtitle}</p>
      </div>

      <div className="reasons-list">
        {data.items.map((item, idx) => (
          <div key={idx} className="reason-item">
            <span className="reason-emoji">{item.emoji}</span>
            <p className="reason-text">{item.text}</p>
          </div>
        ))}
      </div>

      {data.footerQuote && (
        <div className="quote-box">
          <Quote size={18} className="quote-icon" />
          <p className="quote-text">{data.footerQuote}</p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 4: SCRAPBOOK DUAL PHOTOS
// -------------------------------------------------------------
function ScrapbookPage({ data }) {
  return (
    <div className="scrapbook-page">
      <div className="page-watermark">{data.pageNumber}</div>
      <div className="scrapbook-header">
        <h3 className="serif-title">{data.title}</h3>
        <p className="sub-caption">{data.subtitle}</p>
      </div>

      <div className="scrapbook-photos">
        {data.images.map((img, idx) => (
          <div
            key={idx}
            className={`scrapbook-card card-${idx}`}
            style={{ transform: `rotate(${img.rotate}deg)` }}
          >
            <div className="tape-strip" />
            <img src={img.url} alt="" />
            <p className="scrapbook-label">{img.caption}</p>
          </div>
        ))}
      </div>

      <p className="scrapbook-footer-note">{data.footerNote}</p>
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 5: WISHES WALL
// -------------------------------------------------------------
function WishesWallPage({ data }) {
  return (
    <div className="wishes-wall-page">
      <div className="page-watermark">{data.pageNumber}</div>
      <div className="section-head">
        <h3 className="serif-title">{data.title}</h3>
        <p className="sub-caption">{data.subtitle}</p>
      </div>

      <div className="sticky-notes-grid">
        {data.notes.map((note, idx) => (
          <div
            key={idx}
            className="sticky-note"
            style={{
              backgroundColor: note.color,
              transform: `rotate(${note.rotate}deg)`
            }}
          >
            <div className="pin-dot" />
            <p className="sticky-text">{note.text}</p>
            <span className="sticky-from">— {note.from}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 6: INTERACTIVE BIRTHDAY CAKE
// -------------------------------------------------------------
function InteractiveCakePage({ data }) {
  const [blownOut, setBlownOut] = useState(false);

  const handleBlowCandle = (e) => {
    e.stopPropagation();
    if (!blownOut) {
      setBlownOut(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f43f5e', '#a855f7', '#38bdf8', '#34d399']
      });
    } else {
      setBlownOut(false);
    }
  };

  return (
    <div className="cake-page">
      <div className="page-watermark">{data.pageNumber}</div>
      <div className="section-head text-center">
        <h3 className="serif-title">{data.title}</h3>
        <p className="sub-caption">{data.subtitle}</p>
      </div>

      <div className="cake-stage" onClick={handleBlowCandle}>
        {/* Animated candle & cake illustration */}
        <div className="cake-container">
          <div className="candle-holder">
            <div className={`flame-wrap ${blownOut ? 'extinguished' : 'burning'}`}>
              <div className="flame-core" />
              <div className="flame-glow" />
            </div>
            {blownOut && <div className="smoke-puff">💨</div>}
            <div className="candle-stick">
              <div className="candle-stripes" />
            </div>
          </div>

          <div className="cake-layer top-layer">
            <div className="frosting-drops">
              <span /><span /><span /><span /><span />
            </div>
            <div className="cherries">🍒 🍓 🍒</div>
          </div>
          <div className="cake-layer middle-layer">
            <div className="cake-cream-ribbon" />
          </div>
          <div className="cake-layer base-layer" />
          <div className="cake-plate" />
        </div>

        <button className="blow-btn" onClick={handleBlowCandle}>
          {blownOut ? "✨ Wish Made! Tap to Relight 🕯️" : "🕯️ Tap to Blow Candle & Make a Wish!"}
        </button>
      </div>

      <p className="cake-instructions">{data.instructions}</p>
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 7: FUTURE CHAPTER
// -------------------------------------------------------------
function FutureChapterPage({ data }) {
  return (
    <div className="future-page">
      <div className="page-watermark">{data.pageNumber}</div>
      <div className="future-banner">
        <span className="gold-star">✦</span>
        <span className="future-tag">{data.subtitle}</span>
        <span className="gold-star">✦</span>
      </div>

      <h3 className="future-title">{data.title}</h3>

      <div className="future-img-box">
        <img src={data.imageUrl} alt="" />
      </div>

      <p className="future-text">{data.text}</p>

      {data.quote && (
        <div className="quote-callout">
          <p>{data.quote}</p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// PAGE 8: CLOSING LETTER
// -------------------------------------------------------------
function ClosingLetterPage({ data }) {
  return (
    <div className="closing-page">
      <div className="page-watermark">{data.pageNumber}</div>
      <div className="closing-content">
        <h3 className="serif-title">{data.title}</h3>
        <p className="closing-msg">{data.message}</p>

        {data.polaroidUrl && (
          <div className="closing-photo-wrap">
            <div className="washi-tape" />
            <img src={data.polaroidUrl} alt="" />
          </div>
        )}

        <div className="cheers-box">
          <p className="cheers-text">{data.signoff}</p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// BACK COVER
// -------------------------------------------------------------
function BackCoverPage({ data }) {
  return (
    <div
      className="back-cover-page"
      style={{
        width: '100%',
        height: '100%',
        background: data.coverColor || '#1e1b4b',
        color: '#fef3c7',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '36px 28px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      <div className="cover-texture-overlay" />
      <div className="cover-gold-border">
        <div className="corner-decor top-left">✦</div>
        <div className="corner-decor top-right">✦</div>
        <div className="corner-decor bottom-left">✦</div>
        <div className="corner-decor bottom-right">✦</div>
      </div>

      <div className="back-top" />

      <div className="back-center">
        <div className="back-monogram">
          <span>{data.monogram || "M"}</span>
        </div>
        <div className="gold-divider">
          <span className="divider-line" />
          <span className="divider-gem">❖</span>
          <span className="divider-line" />
        </div>
        <p className="back-subtitle">{data.subtitle}</p>
      </div>

      <div className="back-bottom">
        <div className="barcode-mock">{data.barcode || "||| | || |||| | ||| ||"}</div>
        <p className="edition-text">{data.editionText || "Collector’s Edition • 2026"}</p>
      </div>
    </div>
  );
}
