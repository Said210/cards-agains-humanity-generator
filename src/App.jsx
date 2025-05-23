import React, { useState } from 'react';

const CardGenerator = () => {
  const [cardTexts, setCardTexts] = useState('');
  const [responseSpace, setResponseSpace] = useState(30);
  const [cardType, setCardType] = useState('black');
  const [customBgColor, setCustomBgColor] = useState('#6366f1');
  const [customTextColor, setCustomTextColor] = useState('#ffffff');
  const [bottomText, setBottomText] = useState('Track Against Humanity');
  const [iconType, setIconType] = useState('triangle'); // 'warning', 'thinking', 'block', 'emoji'
  const [customEmoji, setCustomEmoji] = useState('🎮');

  const parseCardTexts = () => {
    return cardTexts.split('\n').filter(text => text.trim());
  };

  const getCardColors = () => {
    if (cardType === 'black') return { bg: '#000000', text: '#FFFFFF', border: '#FFFFFF' };
    if (cardType === 'white') return { bg: '#FFFFFF', text: '#000000', border: '#000000' };
    return { bg: customBgColor, text: customTextColor, border: customTextColor };
  };

  const drawIcon = (ctx, x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    switch (iconType) {
      case 'warning':
        // Warning triangle
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + 5);
        ctx.lineTo(x + 5, y + size - 5);
        ctx.lineTo(x + size - 5, y + size - 5);
        ctx.closePath();
        ctx.stroke();
        
        // Exclamation mark
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + size/3);
        ctx.lineTo(x + size/2, y + size * 0.6);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x + size/2, y + size * 0.75, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'thinking':
        // Thought bubble (cloud-like shape)
        const drawCloud = () => {
          ctx.beginPath();
          ctx.arc(x + size * 0.3, y + size * 0.4, size * 0.2, 0, Math.PI * 2);
          ctx.arc(x + size * 0.5, y + size * 0.35, size * 0.25, 0, Math.PI * 2);
          ctx.arc(x + size * 0.7, y + size * 0.4, size * 0.2, 0, Math.PI * 2);
          ctx.arc(x + size * 0.6, y + size * 0.6, size * 0.2, 0, Math.PI * 2);
          ctx.arc(x + size * 0.4, y + size * 0.6, size * 0.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Small bubbles
          ctx.beginPath();
          ctx.arc(x + size * 0.2, y + size * 0.85, size * 0.08, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + size * 0.1, y + size * 0.95, size * 0.05, 0, Math.PI * 2);
          ctx.fill();
        };
        drawCloud();
        break;
        
      case 'block':
        // Blocked/prohibited sign
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2 - 3, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        const angle = Math.PI / 4;
        const lineLength = size * 0.7;
        const centerX = x + size/2;
        const centerY = y + size/2;
        ctx.moveTo(
          centerX - Math.cos(angle) * lineLength/2,
          centerY - Math.sin(angle) * lineLength/2
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * lineLength/2,
          centerY + Math.sin(angle) * lineLength/2
        );
        ctx.stroke();
        break;
        
      case 'emoji':
        ctx.font = `${size}px sans-serif`;
        ctx.fillText(customEmoji, x, y + size - 5);
        break;
    }
  };

  const IconPreview = ({ type, size = 20, color = '#000' }) => {
    const iconToShow = type || iconType;
    const style = { 
      width: size + 'px', 
      height: size + 'px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle'
    };
    
    switch (iconToShow) {
      case 'warning':
        return (
          <div style={style}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 20h20L12 2z" stroke={color} strokeWidth="2" fill="none"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2"/>
              <circle cx="12" cy="17" r="1" fill={color}/>
            </svg>
          </div>
        );
      case 'thinking':
        return (
          <div style={style}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
              <circle cx="8" cy="10" r="3"/>
              <circle cx="12" cy="8" r="3.5"/>
              <circle cx="16" cy="10" r="3"/>
              <circle cx="14" cy="13" r="3"/>
              <circle cx="10" cy="13" r="3"/>
              <circle cx="6" cy="19" r="1.5"/>
              <circle cx="4" cy="22" r="1"/>
            </svg>
          </div>
        );
      case 'block':
        return (
          <div style={style}>
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke={color} strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'emoji':
        return (
          <div style={{ ...style, fontSize: size + 'px', lineHeight: '1' }}>
            {customEmoji}
          </div>
        );
      default:
        return null;
    }
  };

  const downloadCard = (text, index) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 700;
    canvas.height = 1000;
    
    const colors = getCardColors();
    const borderRadius = 20;
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create clipping path for rounded corners
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, borderRadius);
    ctx.clip();
    
    // Background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Inner border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(15, 15, canvas.width - 30, canvas.height - 30, borderRadius - 5);
    ctx.stroke();
    
    // Card text
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // Word wrap function
    const wrapText = (text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY;
    };
    
    // Draw card text
    const textEndY = wrapText(text, 50, 100, 600, 55);
    
    // Logo area
    drawIcon(ctx, 50, canvas.height - 100, 30, colors.text);
    
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colors.text;
    ctx.fillText(bottomText, 95, canvas.height - 75);
    
    ctx.restore();
    
    // Create a new canvas for the final image with transparency
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    
    // Draw the rounded card onto the final canvas
    finalCtx.save();
    finalCtx.beginPath();
    finalCtx.roundRect(0, 0, finalCanvas.width, finalCanvas.height, borderRadius);
    finalCtx.clip();
    finalCtx.drawImage(canvas, 0, 0);
    finalCtx.restore();
    
    // Download
    const link = document.createElement('a');
    const fileName = text
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 10) + '-info-card.png';
    
    link.download = fileName;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
  };

  const downloadAllCards = () => {
    const texts = parseCardTexts();
    texts.forEach((text, index) => {
      setTimeout(() => {
        downloadCard(text, index);
      }, index * 500);
    });
  };

  const CardPreview = ({ text, index }) => {
    const colors = getCardColors();
    const responseHeight = `${responseSpace}%`;
    
    return (
      <div
        style={{
          position: 'relative',
          backgroundColor: colors.bg,
          color: colors.text,
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          width: '320px',
          height: '450px',
          padding: '28px',
          border: `3px solid ${colors.border}`,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        }}
      >
        <div style={{ flex: `${100 - responseSpace}%` }}>
          <p style={{ fontSize: '19px', fontWeight: '700', lineHeight: '1.6', letterSpacing: '-0.01em' }}>
            {text}
          </p>
        </div>
        
        {/* Response area - just empty space */}
        <div style={{ height: responseHeight }} />
        
        {/* Logo/Brand area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconPreview size={20} color={colors.text} />
          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.02em' }}>
            {bottomText}
          </span>
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    title: {
      fontSize: '56px',
      fontWeight: '800',
      marginBottom: '40px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-1px',
    },
    settingsCard: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
      padding: '40px',
      marginBottom: '40px',
    },
    settingsTitle: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '24px',
      color: '#1a202c',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#4a5568',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    textarea: {
      width: '100%',
      height: '140px',
      padding: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      resize: 'vertical',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
      outline: 'none',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      backgroundColor: '#fff',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease',
      outline: 'none',
    },
    range: {
      width: '100%',
      cursor: 'pointer',
      height: '6px',
      borderRadius: '3px',
      background: '#e2e8f0',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '14px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    buttonDisabled: {
      background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    buttonSecondary: {
      marginTop: '16px',
      padding: '10px 20px',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#4a5568',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
    },
    cardContainer: {
      overflowX: 'auto',
      padding: '20px 0',
      WebkitOverflowScrolling: 'touch',
    },
    cardGrid: {
      display: 'flex',
      gap: '32px',
      minWidth: 'fit-content',
      paddingBottom: '20px',
    },
    cardWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    emptyState: {
      textAlign: 'center',
      color: '#718096',
      marginTop: '60px',
      fontSize: '20px',
      fontWeight: '500',
    },
    colorPicker: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    colorInput: {
      width: '60px',
      height: '40px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      padding: '4px',
    },
    iconGrid: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
    },
    iconOption: {
      padding: '8px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      background: '#fff',
      transition: 'all 0.2s ease',
    },
    iconOptionSelected: {
      borderColor: '#667eea',
      backgroundColor: '#f0f4ff',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <h1 style={styles.title}>Track Against Humanity Generator</h1>
        
        <div style={styles.settingsCard}>
          <h2 style={styles.settingsTitle}>Card Settings</h2>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={styles.label}>
              Card Texts (one per line)
            </label>
            <textarea
              value={cardTexts}
              onChange={(e) => setCardTexts(e.target.value)}
              placeholder="I love the smell of _____ in the morning
Life is like a box of _____
The secret to happiness is _____"
              style={styles.textarea}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>
                Card Style
              </label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                style={styles.select}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="black">Classic Black</option>
                <option value="white">Classic White</option>
                <option value="custom">Custom Colors</option>
              </select>
            </div>
            
            {cardType === 'custom' && (
              <div>
                <label style={styles.label}>
                  Custom Colors
                </label>
                <div style={styles.colorPicker}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#718096' }}>Background</label>
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      style={styles.colorInput}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#718096' }}>Text</label>
                    <input
                      type="color"
                      value={customTextColor}
                      onChange={(e) => setCustomTextColor(e.target.value)}
                      style={styles.colorInput}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label style={styles.label}>
                Bottom Text
              </label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Enter custom text"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            
            <div>
              <label style={styles.label}>
                Icon Style
              </label>
              <div style={styles.iconGrid}>
                {['warning', 'thinking', 'block', 'emoji'].map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setIconType(icon)}
                    style={{
                      ...styles.iconOption,
                      ...(iconType === icon ? styles.iconOptionSelected : {}),
                    }}
                    title={icon.charAt(0).toUpperCase() + icon.slice(1)}
                  >
                    <IconPreview type={icon} size={16} color={iconType === icon ? '#667eea' : '#718096'} />
                  </button>
                ))}
              </div>
              {iconType === 'emoji' && (
                <input
                  type="text"
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value.slice(0, 2))}
                  placeholder="Enter emoji"
                  style={{ ...styles.input, marginTop: '8px', fontSize: '20px', textAlign: 'center' }}
                  maxLength="2"
                />
              )}
            </div>
            
            <div>
              <label style={styles.label}>
                Response Space: {responseSpace}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={responseSpace}
                onChange={(e) => setResponseSpace(Number(e.target.value))}
                style={styles.range}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={downloadAllCards}
                disabled={!parseCardTexts().length}
                style={{
                  ...styles.button,
                  ...(parseCardTexts().length === 0 ? styles.buttonDisabled : {}),
                }}
                onMouseEnter={(e) => {
                  if (parseCardTexts().length > 0) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (parseCardTexts().length > 0) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                Download All Cards
              </button>
            </div>
          </div>
        </div>
        
        <div style={styles.cardContainer}>
          <div style={styles.cardGrid}>
            {parseCardTexts().map((text, index) => (
              <div key={index} style={styles.cardWrapper}>
                <CardPreview text={text} index={index} />
                <button
                  onClick={() => downloadCard(text, index)}
                  style={styles.buttonSecondary}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Download This Card
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {parseCardTexts().length === 0 && (
          <div style={styles.emptyState}>
            <p>✨ Enter some card texts above to see previews</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardGenerator;