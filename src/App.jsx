import React, { useState, useEffect, useRef } from 'react';


const CardGenerator = () => {
  const [cardTexts, setCardTexts] = useState('');
  const [responseSpace, setResponseSpace] = useState(30);
  const [cardType, setCardType] = useState('black');
  const [customBgColor, setCustomBgColor] = useState('#6366f1');
  const [customTextColor, setCustomTextColor] = useState('#ffffff');
  const [bottomText, setBottomText] = useState('Track Against Humanity');
  const [iconType, setIconType] = useState('triangle');
  const [customEmoji, setCustomEmoji] = useState('🎮');
  const [isExpanded, setIsExpanded] = useState(false);

  const parseCardTexts = () => {
    return cardTexts.split('\n').filter(text => text.trim());
  };

  const getCardColors = () => {
    if (cardType === 'black') return { bg: '#000000', text: '#FFFFFF', border: '#FFFFFF' };
    if (cardType === 'white') return { bg: '#FFFFFF', text: '#000000', border: '#000000' };
    return { bg: customBgColor, text: customTextColor, border: customTextColor };
  };

  // Auto-expand when user starts typing
  useEffect(() => {
    const hasCards = parseCardTexts().length > 0;
    setIsExpanded(hasCards);
  }, [cardTexts]);

  const drawIcon = (ctx, x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    switch (iconType) {
      case 'warning':
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + 5);
        ctx.lineTo(x + 5, y + size - 5);
        ctx.lineTo(x + size - 5, y + size - 5);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + size/2, y + size/3);
        ctx.lineTo(x + size/2, y + size * 0.6);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x + size/2, y + size * 0.75, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'thinking':
        const drawCloud = () => {
          ctx.beginPath();
          ctx.arc(x + size * 0.3, y + size * 0.4, size * 0.2, 0, Math.PI * 2);
          ctx.arc(x + size * 0.5, y + size * 0.35, size * 0.25, 0, Math.PI * 2);
          ctx.arc(x + size * 0.7, y + size * 0.4, size * 0.2, 0, Math.PI * 2);
          ctx.arc(x + size * 0.6, y + size * 0.6, size * 0.2, 0, Math.PI * 2);
          ctx.arc(x + size * 0.4, y + size * 0.6, size * 0.2, 0, Math.PI * 2);
          ctx.fill();
          
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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, borderRadius);
    ctx.clip();
    
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(15, 15, canvas.width - 30, canvas.height - 30, borderRadius - 5);
    ctx.stroke();
    
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
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
    
    const textEndY = wrapText(text, 50, 100, 600, 55);
    
    drawIcon(ctx, 50, canvas.height - 100, 30, colors.text);
    
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = colors.text;
    ctx.fillText(bottomText, 95, canvas.height - 75);
    
    ctx.restore();
    
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    
    finalCtx.save();
    finalCtx.beginPath();
    finalCtx.roundRect(0, 0, finalCanvas.width, finalCanvas.height, borderRadius);
    finalCtx.clip();
    finalCtx.drawImage(canvas, 0, 0);
    finalCtx.restore();
    
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
        
        <div style={{ height: responseHeight }} />
        
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
      background: '#ffffff',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
    hero: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '80px 20px 60px',
      textAlign: 'center',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    },
    heroContent: {
      maxWidth: '800px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      fontWeight: '800',
      marginBottom: '24px',
      letterSpacing: '-0.03em',
      lineHeight: '1.2',
      background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
      fontWeight: '400',
      opacity: '0.9',
      lineHeight: '1.6',
      marginBottom: '40px',
      color: '#e2e8f0',
    },
    appContainer: {
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
    },
    appContainerExpanded: {
      minHeight: '100vh',
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    settingsCard: {
      backgroundColor: '#fff',
      borderRadius: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      marginBottom: '40px',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0',
    },
    settingsTitle: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '32px',
      color: '#0f172a',
      letterSpacing: '-0.02em',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#475569',
      letterSpacing: '0.01em',
    },
    textarea: {
      width: '100%',
      height: '140px',
      padding: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '15px',
      resize: 'vertical',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      outline: 'none',
      backgroundColor: '#f8fafc',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '15px',
      backgroundColor: '#f8fafc',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '32px',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '15px',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23475569\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '16px',
      paddingRight: '40px',
    },
    range: {
      width: '100%',
      cursor: 'pointer',
      height: '6px',
      borderRadius: '3px',
      background: '#e2e8f0',
      outline: 'none',
      WebkitAppearance: 'none',
      appearance: 'none',
    },
    button: {
      width: '100%',
      padding: '16px 28px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    },
    buttonDisabled: {
      background: 'linear-gradient(135deg, #cbd5e0 0%, #94a3b8 100%)',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    buttonSecondary: {
    marginTop: '16px',
      padding: '12px 24px',
      background: '#fff',
      color: '#475569',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
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
      scrollbarWidth: 'thin',
      scrollbarColor: '#cbd5e0 transparent',
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
      color: '#64748b',
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
      borderRadius: '12px',
      cursor: 'pointer',
      padding: '4px',
      background: '#f8fafc',
    },
    iconGrid: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
    },
    iconOption: {
      padding: '10px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      cursor: 'pointer',
      background: '#f8fafc',
      transition: 'all 0.2s ease',
    },
    iconOptionSelected: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff',
    },
    contentSection: {
      padding: '100px 20px',
      borderTop: '1px solid #e2e8f0',
    },
    contentMaxWidth: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
      fontWeight: '700',
      marginBottom: '32px',
      color: '#0f172a',
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
    },
    sectionText: {
      fontSize: '1.125rem',
      lineHeight: '1.8',
      color: '#475569',
      marginBottom: '24px',
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      marginTop: '60px',
    },
    featureCard: {
      padding: '40px',
      background: '#fff',
      borderRadius: '24px',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    },
    featureIcon: {
      fontSize: '48px',
      marginBottom: '24px',
    },
    featureTitle: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#0f172a',
      letterSpacing: '-0.01em',
    },
    featureText: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#475569',
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Create Engaging Retro Cards in Seconds</h1>
          <p style={styles.subtitle}>
            Transform your retrospectives with custom Cards Against Humanity-style prompts. 
            Perfect for breaking the ice, sparking discussions, and making team meetings more fun and productive.
          </p>
        </div>
      </section>

      {/* App Section */}
      <section style={{
        ...styles.appContainer,
        ...(isExpanded ? styles.appContainerExpanded : { })
      }}>
        <div style={styles.maxWidth}>
          <div style={styles.settingsCard}>
            <h2 style={styles.settingsTitle}>Start Creating Your Retro Cards</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={styles.label}>
                Card Prompts (one per line)
              </label>
              <textarea
                value={cardTexts}
                onChange={(e) => setCardTexts(e.target.value)}
                placeholder="Our biggest win this sprint was _____
The team's superpower is _____
If our project was a movie, it would be _____"
                style={{
                  ...styles.textarea,
                  marginBottom: '48px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  if (parseCardTexts().length > 0) {
                    setIsExpanded(true);
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  if (parseCardTexts().length === 0) {
                    setIsExpanded(false);
                  }
                }}
              />
            </div>
            
            {isExpanded && (
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
            )}
          </div>
          
          {parseCardTexts().length > 0 && (
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
          )}
          
          {parseCardTexts().length === 0 && !isExpanded && (
            <div style={styles.emptyState}>
              <p>✨ Start typing your retro prompts above to see card previews</p>
            </div>
          )}
        </div>
      </section>

      {/* Content Sections for SEO */}
      <section style={styles.contentSection}>
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Why Use Custom Retro Cards?</h2>
          <p style={styles.sectionText}>
            Traditional retrospectives can sometimes feel repetitive or fail to engage all team members. 
            By introducing custom retro cards inspired by Cards Against Humanity's format, you create 
            a playful atmosphere that encourages honest feedback and creative thinking.
          </p>
          <p style={styles.sectionText}>
            These cards work as conversation starters, helping teams break through communication barriers 
            and discuss both successes and challenges in a fun, non-threatening way. The fill-in-the-blank 
            format makes it easy for everyone to participate, regardless of their communication style.
          </p>
        </div>
      </section>

      <section style={{ ...styles.contentSection, background: '#f7fafc' }}>
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Perfect for Every Retro Format</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🚀</div>
              <h3 style={styles.featureTitle}>Sprint Retrospectives</h3>
              <p style={styles.featureText}>
                Create cards that help teams reflect on sprint achievements, blockers, and improvements. 
                Examples: "Our MVP of the sprint was _____" or "The biggest surprise this sprint was _____"
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎯</div>
              <h3 style={styles.featureTitle}>Project Post-Mortems</h3>
              <p style={styles.featureText}>
                Design thoughtful prompts for deeper project analysis. Try: "If we could redo one thing, 
                it would be _____" or "The unsung hero of this project was _____"
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🌟</div>
              <h3 style={styles.featureTitle}>Team Building</h3>
              <p style={styles.featureText}>
                Foster team bonding with lighthearted prompts. Use: "Our team's secret weapon is _____" 
                or "If our team had a theme song, it would be _____"
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>How to Run an Engaging Card-Based Retro</h2>
          <p style={styles.sectionText}>
            <strong>1. Prepare Your Cards:</strong> Create 5-10 prompts tailored to your team's current 
            situation. Mix serious reflection questions with lighter, fun prompts to maintain energy.
          </p>
          <p style={styles.sectionText}>
            <strong>2. Set the Stage:</strong> Print the cards or share them digitally. Explain that 
            this is a safe space for honest feedback wrapped in a fun format.
          </p>
          <p style={styles.sectionText}>
            <strong>3. Facilitate Discussion:</strong> Have team members take turns drawing cards and 
            completing the prompts. Encourage elaboration and group discussion on each response.
          </p>
          <p style={styles.sectionText}>
            <strong>4. Capture Insights:</strong> Document key themes and action items that emerge from 
            the card discussions. The playful format often reveals deeper insights than traditional formats.
          </p>
        </div>
      </section>

      <section style={{ ...styles.contentSection, background: '#f7fafc' }}>
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Customization Options</h2>
          <p style={styles.sectionText}>
            Our retro card generator offers complete customization to match your team's style and needs:
          </p>
          <ul style={{ ...styles.sectionText, paddingLeft: '24px' }}>
            <li>Choose between classic black cards, white cards, or create custom color schemes</li>
            <li>Add your team or company name to brand the cards</li>
            <li>Select from different icon styles or add custom emojis</li>
            <li>Adjust the response space for longer or shorter answers</li>
            <li>Download individual cards or entire sets for printing or digital sharing</li>
          </ul>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Start Creating Better Retros Today</h2>
          <p style={styles.sectionText}>
            Ready to transform your team retrospectives? Simply start typing your prompts in the 
            generator above, customize the appearance to match your team's personality, and download 
            your cards. Whether you're facilitating remote or in-person retros, these cards will help 
            create memorable, productive sessions that your team will actually look forward to.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CardGenerator;