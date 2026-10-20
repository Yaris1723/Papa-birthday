import React, { useState } from 'react';
import { X, Check, Copy, Code, Sparkles, Image, FileText, HelpCircle } from 'lucide-react';

export default function QuickEditModal({
  isOpen,
  onClose,
  config,
  pages,
  onSaveConfig,
  onSavePages,
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('quick');
  const [copied, setCopied] = useState(false);

  // Form states for quick editing
  const [personName, setPersonName] = useState(config.personName || "Manisa");
  const [celebrationDate, setCelebrationDate] = useState(config.celebrationDate || "October 20");
  const [coverSubtitle, setCoverSubtitle] = useState(pages[0]?.subtitle || "");
  const [letterHeading, setLetterHeading] = useState(pages[1]?.heading || "");
  const [letterParagraph, setLetterParagraph] = useState(pages[1]?.body?.[0] || "");
  const [polaroidUrl, setPolaroidUrl] = useState(pages[2]?.imageUrl || "");
  const [polaroidCaption, setPolaroidCaption] = useState(pages[2]?.caption || "");

  const handleApplyChanges = () => {
    // Clone config
    const newConfig = {
      ...config,
      personName,
      celebrationDate,
      title: `Happy Birthday ${personName} ✨`,
    };

    // Clone pages with updated fields
    const newPages = JSON.parse(JSON.stringify(pages));

    // Cover
    if (newPages[0]) {
      newPages[0].name = personName.toUpperCase();
      newPages[0].subtitle = coverSubtitle;
      newPages[0].date = celebrationDate;
    }

    // Letter
    if (newPages[1]) {
      newPages[1].heading = letterHeading;
      if (newPages[1].body && newPages[1].body.length > 0) {
        newPages[1].body[0] = letterParagraph;
      }
    }

    // Polaroid
    if (newPages[2]) {
      newPages[2].imageUrl = polaroidUrl;
      newPages[2].caption = polaroidCaption;
    }

    onSaveConfig(newConfig);
    onSavePages(newPages);
    onClose();
  };

  const handleCopyCode = () => {
    const codeString = `export const bookConfig = ${JSON.stringify(config, null, 2)};\n\nexport const bookPages = ${JSON.stringify(pages, null, 2)};\n`;
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={20} className="modal-icon" />
            <h3>Customize Birthday Book</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            <Sparkles size={16} /> Quick Edit
          </button>
          <button
            className={`tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            <HelpCircle size={16} /> How to Add Your Photos
          </button>
          <button
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <Code size={16} /> View bookData.js
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body">
          {activeTab === 'quick' && (
            <div className="form-grid">
              <div className="form-group">
                <label>Birthday Person's Name</label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="e.g. Manisa"
                />
              </div>

              <div className="form-group">
                <label>Celebration Date / Text</label>
                <input
                  type="text"
                  value={celebrationDate}
                  onChange={(e) => setCelebrationDate(e.target.value)}
                  placeholder="e.g. October 20"
                />
              </div>

              <div className="form-group full-width">
                <label>Cover Subtitle</label>
                <input
                  type="text"
                  value={coverSubtitle}
                  onChange={(e) => setCoverSubtitle(e.target.value)}
                  placeholder="A special edition dedicated to your sweetest moments"
                />
              </div>

              <div className="form-group">
                <label>Page 1 Letter Heading</label>
                <input
                  type="text"
                  value={letterHeading}
                  onChange={(e) => setLetterHeading(e.target.value)}
                  placeholder="Dearest Manisa,"
                />
              </div>

              <div className="form-group full-width">
                <label>Page 1 Opening Message</label>
                <textarea
                  rows={3}
                  value={letterParagraph}
                  onChange={(e) => setLetterParagraph(e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label>Page 2 Photo URL (or /images/yourphoto.jpg)</label>
                <input
                  type="text"
                  value={polaroidUrl}
                  onChange={(e) => setPolaroidUrl(e.target.value)}
                  placeholder="https://... or /images/manisa.jpg"
                />
              </div>

              <div className="form-group full-width">
                <label>Page 2 Photo Caption</label>
                <input
                  type="text"
                  value={polaroidCaption}
                  onChange={(e) => setPolaroidCaption(e.target.value)}
                  placeholder="That unforgettable smile that lights up every room."
                />
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="guide-content">
              <h4>📸 How to use your own photos & custom pages:</h4>
              <ol className="guide-steps">
                <li>
                  <strong>Step 1: Put photos in the public folder</strong>
                  <p>Drop your photos inside <code>public/images/</code> (e.g. <code>photo1.jpg</code>, <code>manisa.png</code>).</p>
                </li>
                <li>
                  <strong>Step 2: Open <code>src/bookData.js</code> in your editor</strong>
                  <p>
                    Every page is neatly organized. Simply change <code>imageUrl: "/images/photo1.jpg"</code> or edit the text messages directly!
                  </p>
                </li>
                <li>
                  <strong>Want full-page graphic images like Framer?</strong>
                  <p>
                    If you designed pages in Canva or Photoshop, just replace any page with:
                    <br />
                    <code>&#123; imageUrl: "/images/page1.jpg" &#125;</code> or string URL!
                  </p>
                </li>
                <li>
                  <strong>Adding more pages:</strong>
                  <p>
                    Add pairs of pages to the <code>bookPages</code> array in <code>src/bookData.js</code>. The 3D book will automatically calculate leaf thickness and smooth flipping!
                  </p>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="code-content">
              <div className="code-header">
                <span>src/bookData.js</span>
                <button className="copy-btn" onClick={handleCopyCode}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy Configuration"}</span>
                </button>
              </div>
              <pre className="code-block">
                {`// src/bookData.js is located at:
// /Users/lokeshwaran/Documents/Valaithalam/Manisa bday/src/bookData.js

export const bookConfig = ${JSON.stringify(config, null, 2)};

export const bookPages = ${JSON.stringify(pages, null, 2)};`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          {activeTab === 'quick' && (
            <button className="btn btn-primary" onClick={handleApplyChanges}>
              Save & Update Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
