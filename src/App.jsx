import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import templates from './templates.json';

const CardGenerator = () => {
  const [cardTexts, setCardTexts] = useState(() => {
    const saved = localStorage.getItem('cardTexts');
    return saved || '';
  });
  const [responseSpace, setResponseSpace] = useState(30);
  const [cardType, setCardType] = useState(() => {
    const saved = localStorage.getItem('cardType');
    return saved || 'black';
  });
  const [customBgColor, setCustomBgColor] = useState(() => {
    const saved = localStorage.getItem('customBgColor');
    return saved || '#6366f1';
  });
  const [customTextColor, setCustomTextColor] = useState(() => {
    const saved = localStorage.getItem('customTextColor');
    return saved || '#ffffff';
  });
  const [bottomText, setBottomText] = useState(() => {
    const saved = localStorage.getItem('bottomText');
    return saved || 'Track Against Humanity';
  });
  const [iconType, setIconType] = useState(() => {
    const saved = localStorage.getItem('iconType');
    return saved || 'triangle';
  });
  const [customEmoji, setCustomEmoji] = useState(() => {
    const saved = localStorage.getItem('customEmoji');
    return saved || '🎮';
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return Number(saved) || 19;
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [customTemplates, setCustomTemplates] = useState(() => {
    const saved = localStorage.getItem('customTemplates');
    return saved ? JSON.parse(saved) : [];
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    localStorage.setItem('cardTexts', cardTexts);
    localStorage.setItem('cardType', cardType);
    localStorage.setItem('customBgColor', customBgColor);
    localStorage.setItem('customTextColor', customTextColor);
    localStorage.setItem('bottomText', bottomText);
    localStorage.setItem('iconType', iconType);
    localStorage.setItem('customEmoji', customEmoji);
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
  }, [cardTexts, cardType, customBgColor, customTextColor, bottomText, iconType, customEmoji, fontSize, customTemplates]);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCategory = (categoryIndex) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const PresetsModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      opacity: showPresetsModal ? 1 : 0,
      visibility: showPresetsModal ? 'visible' : 'hidden',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'hidden',
        transform: showPresetsModal ? 'scale(1)' : 'scale(0.9)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a202c'
          }}>
            Templates
          </h2>
          <button
            onClick={() => setShowPresetsModal(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          maxHeight: 'calc(80vh - 90px)'
        }}>
          {/* My Templates Section */}
          {customTemplates.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>My Templates</h3>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {customTemplates.map((template) => (
                  <div
                    key={template.id}
                    style={{
                      position: 'relative',
                      padding: '16px',
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {template.icon === 'emoji' ? (
                          <span style={{ fontSize: '20px' }}>{template.emoji}</span>
                        ) : (
                          <IconPreview type={template.icon} size={20} color="#4a5568" />
                        )}
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#2d3748'
                        }}>{template.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomTemplate(template.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          opacity: 0.6,
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#718096',
                      marginBottom: '12px'
                    }}>
                      {template.phrases.length} cards
                    </div>
                    <button
                      onClick={() => loadCustomTemplate(template)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                      }}
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preset Templates Section */}
          <div>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#2d3748'
            }}>Preset Templates</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {templates.categories.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleCategory(categoryIndex)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: 'none',
                      borderBottom: expandedCategories[categoryIndex] ? '1px solid #e2e8f0' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      background: expandedCategories[categoryIndex] ? '#f8fafc' : '#fff'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = expandedCategories[categoryIndex] ? '#f8fafc' : '#fff';
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{category.emoji}</span>
                    <h3 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a202c',
                      flex: 1,
                      textAlign: 'left'
                    }}>{category.name}</h3>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{
                        transform: expandedCategories[categoryIndex] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="#4a5568"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div style={{
                    maxHeight: expandedCategories[categoryIndex] ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    padding: expandedCategories[categoryIndex] ? '16px' : '0 16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {category.templates.map((template, templateIndex) => (
                        <button
                          key={templateIndex}
                          onClick={() => {
                            loadTemplate(categoryIndex, templateIndex);
                            setShowPresetsModal(false);
                          }}
                          style={{
                            padding: '12px',
                            background: selectedCategory === categoryIndex && selectedTemplate === templateIndex
                              ? '#eff6ff'
                              : '#f8fafc',
                            border: '1px solid',
                            borderColor: selectedCategory === categoryIndex && selectedTemplate === templateIndex
                              ? '#bfdbfe'
                              : '#e2e8f0',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '14px',
                            color: '#4a5568',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#eff6ff';
                            e.currentTarget.style.borderColor = '#bfdbfe';
                          }}
                          onMouseLeave={(e) => {
                            if (!(selectedCategory === categoryIndex && selectedTemplate === templateIndex)) {
                              e.currentTarget.style.background = '#f8fafc';
                              e.currentTarget.style.borderColor = '#e2e8f0';
                            }
                          }}
                        >
                          {template.icon === 'emoji' ? (
                            <span style={{ fontSize: '16px' }}>{template.emoji}</span>
                          ) : (
                            <IconPreview 
                              type={template.icon} 
                              size={16} 
                              color={selectedCategory === categoryIndex && selectedTemplate === templateIndex ? '#3b82f6' : '#4a5568'}
                            />
                          )}
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const loadTemplate = (categoryIndex, templateIndex) => {
    const template = templates.categories[categoryIndex].templates[templateIndex];
    setCardTexts(template.phrases.join('\n'));
    if (template.icon) {
      setIconType(template.icon);
      if (template.icon === 'emoji' && template.emoji) {
        setCustomEmoji(template.emoji);
      }
    }
    setSelectedCategory(categoryIndex);
    setSelectedTemplate(templateIndex);
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: true
    }));
  };

  const parseCardTexts = () => {
    return cardTexts.split('\n').filter(text => text.trim());
  };

  const getCardColors = () => {
    if (cardType === 'black') return { bg: '#000000', text: '#FFFFFF', border: '#FFFFFF' };
    if (cardType === 'white') return { bg: '#FFFFFF', text: '#000000', border: '#000000' };
    
    // Función para ajustar el brillo del color
    const adjustBrightness = (hex, percent) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = (num >> 16) + percent;
      const g = ((num >> 8) & 0x00FF) + percent;
      const b = (num & 0x00FF) + percent;
      
      const newR = Math.min(255, Math.max(0, r));
      const newG = Math.min(255, Math.max(0, g));
      const newB = Math.min(255, Math.max(0, b));
      
      return '#' + (newB | (newG << 8) | (newR << 16)).toString(16).padStart(6, '0');
    };

    // Función para generar un color complementario
    const getComplementaryColor = (hex) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const comp = 0xFFFFFF ^ num;
      return '#' + comp.toString(16).padStart(6, '0');
    };

    // Generar colores para el gradiente
    const brighterColor = adjustBrightness(customBgColor, 40);
    const darkerColor = adjustBrightness(customBgColor, -20);
    const complementary = getComplementaryColor(customBgColor);
    
    const gradientAngle = '135deg';
    const gradient = `linear-gradient(${gradientAngle}, ${brighterColor} 0%, ${darkerColor} 100%)`;

    return { 
      bg: gradient, 
      text: customTextColor,
      border: customTextColor,
      complementary
    };
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

  const CardPreview = ({ text, index, forExport = false }) => {
    const colors = getCardColors();
    const responseHeight = `${responseSpace}%`;
    const cardRef = useRef(null);
    
    const cardStyle = {
      position: 'relative',
      background: colors.bg,
      color: colors.text,
      borderRadius: forExport ? '20px' : '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      width: forExport ? '700px' : '320px',
      height: forExport ? '1000px' : '450px',
      padding: forExport ? '28px 50px' : '28px',
      border: `${forExport ? '6px' : '3px'} solid ${colors.border}`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      cursor: forExport ? 'default' : 'pointer',
    };

    const textStyle = {
      fontSize: forExport ? `${fontSize * 2.2}px` : `${fontSize}px`,
      fontWeight: '700',
      lineHeight: '1.6',
      letterSpacing: '-0.01em'
    };

    const bottomTextStyle = {
      fontSize: forExport ? '22px' : '11px',
      fontWeight: '700',
      letterSpacing: '0.02em'
    };

    return (
      <div ref={cardRef} style={cardStyle}>
        <div style={{ flex: `${100 - responseSpace}%` }}>
          <p style={textStyle}>
            {text}
          </p>
        </div>
        
        <div style={{ height: responseHeight }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
          <IconPreview size={forExport ? 30 : 20} color={colors.text} />
          <span style={bottomTextStyle}>
            {bottomText}
          </span>
        </div>
      </div>
    );
  };

  const downloadCard = async (text, index) => {
    // Crear un contenedor temporal para la tarjeta de exportación
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    // Renderizar el componente en el contenedor temporal
    const root = createRoot(tempContainer);
    root.render(<CardPreview text={text} index={index} forExport={true} />);

    // Esperar a que el DOM se actualice
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(tempContainer.firstChild, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });

      const link = document.createElement('a');
      const fileName = text
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 10) + '-info-card.png';

      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al generar la imagen:', error);
    } finally {
      // Limpiar
      root.unmount();
      document.body.removeChild(tempContainer);
    }
  };

  const downloadAllCards = () => {
    const texts = parseCardTexts();
    texts.forEach((text, index) => {
      setTimeout(() => {
        downloadCard(text, index);
      }, index * 1000); // Aumentado el delay para dar más tiempo entre capturas
    });
  };

  const saveCurrentAsTemplate = () => {
    const templateName = prompt('Enter a name for this template:');
    if (templateName) {
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        icon: iconType,
        emoji: iconType === 'emoji' ? customEmoji : null,
        phrases: parseCardTexts(),
        style: {
          type: cardType,
          bgColor: customBgColor,
          textColor: customTextColor,
          bottomText,
          fontSize
        }
      };
      setCustomTemplates(prev => [...prev, newTemplate]);
    }
  };

  const loadCustomTemplate = (template) => {
    setCardTexts(template.phrases.join('\n'));
    setIconType(template.icon);
    if (template.icon === 'emoji' && template.emoji) {
      setCustomEmoji(template.emoji);
    }
    setCardType(template.style.type);
    setCustomBgColor(template.style.bgColor);
    setCustomTextColor(template.style.textColor);
    setBottomText(template.style.bottomText);
    setFontSize(template.style.fontSize);
    setShowPresetsModal(false);
  };

  const deleteCustomTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  const Blob = ({ color, style, path }) => (
    <div style={{
      position: 'absolute',
      transition: 'transform 0.1s ease-out',
      ...style
    }}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'blur(1px)',
          opacity: 0.7,
          width: '100%',
          height: '100%'
        }}
      >
        <path
          fill={color}
          d={path}
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );

  const DecorativeShape = ({ color, style }) => (
    <div style={{
      position: 'absolute',
      background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
      borderRadius: '50%',
      filter: 'blur(60px)',
      transition: 'transform 0.1s ease-out',
      ...style
    }} />
  );

  const FloatingShape = ({ style }) => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }, []);

    return (
      <div
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          borderRadius: '8px',
          transform: `rotate(${rotation}deg)`,
          opacity: 0.1,
          transition: 'all 0.3s ease',
          animation: 'float 6s ease-in-out infinite',
          ...style,
        }}
      />
    );
  };

  const WavePattern = ({ color = '#3b82f6', style }) => (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100px',
        overflow: 'hidden',
        ...style,
      }}
    >
    </div>
  );

  const GradientCircle = ({ color = '#3b82f6', style }) => (
    <div
      style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${color}20 0%, ${color}05 70%, transparent 100%)`,
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        ...style,
      }}
    />
  );

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
      minHeight: 'auto',
      paddingBottom: '40px'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    settingsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      marginBottom: '40px',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
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
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      },
      '&:active': {
        transform: 'translateY(1px)',
        boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)',
      },
    },
    buttonDisabled: {
      background: 'linear-gradient(135deg, #cbd5e0 0%, #94a3b8 100%)',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    buttonSecondary: {
      marginTop: '16px',
      padding: '12px 24px',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#475569',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      '&:hover': {
        background: '#fff',
        borderColor: '#cbd5e0',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      },
      '&:active': {
        transform: 'translateY(1px)',
        boxShadow: 'none',
      },
    },
    cardContainer: {
      overflowX: 'auto',
      padding: '20px 0',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'thin',
      scrollbarColor: '#cbd5e0 transparent',
      maxHeight: '800px',
      overflowY: 'auto'
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
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      '&:nth-child(even)': {
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      },
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
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
        borderColor: '#bfdbfe',
      },
      '&:hover::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%)',
        pointerEvents: 'none',
      },
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
    featureHighlight: {
      padding: '32px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)',
      },
      '&:hover::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%)',
        pointerEvents: 'none',
      },
    },
    guideStep: {
      padding: '24px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
      },
      '&:hover::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%)',
        pointerEvents: 'none',
      },
    },
    guideTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '16px',
    },
    guideText: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#4a5568',
    },
    customizationCard: {
      padding: '32px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
      },
      '&:hover::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%)',
        pointerEvents: 'none',
      },
    },
    customizationTitle: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '20px',
    },
    customizationList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      '& li': {
        padding: '8px 0',
        color: '#4a5568',
        display: 'flex',
        alignItems: 'center',
        '&:before': {
          content: '"✓"',
          marginRight: '12px',
          color: '#3b82f6',
          fontWeight: 'bold',
        },
      },
    },
  };

  // Agregar estilos de animación global
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
      }
      100% {
        transform: translateY(0px) rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);

  return (
    <div style={styles.container}>
      <PresetsModal />
      {/* Hero Section */}
      <section style={styles.hero}>
        <DecorativeShape 
          color="#6366f1"
          style={{
            width: '600px',
            height: '600px',
            top: '-200px',
            right: '-200px',
            transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.02}deg)`,
          }}
        />
        <Blob
          color="#8b5cf640"
          style={{
            width: '500px',
            height: '500px',
            top: '10%',
            left: '-100px',
            transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * 0.03}deg)`,
          }}
          path="M47.7,-51.1C58.9,-34.9,63.3,-17.4,62.1,-1.2C60.9,15,54.1,30,42.9,39.4C31.7,48.8,15.8,52.6,-1.9,54.5C-19.7,56.4,-39.4,56.4,-51.1,47C-62.8,37.6,-66.5,18.8,-63.1,2.5C-59.6,-13.8,-49,-27.7,-37.3,-43.9C-25.7,-60.1,-12.8,-78.7,2.3,-81C17.4,-83.3,34.8,-69.3,47.7,-51.1Z"
        />
        <FloatingShape 
          style={{
            top: '20%',
            right: '15%',
            transform: `rotate(${45 + scrollY * 0.1}deg)`,
          }}
        />
        <FloatingShape 
          style={{
            bottom: '30%',
            left: '10%',
            transform: `rotate(${-45 + scrollY * 0.1}deg)`,
          }}
        />
        <WavePattern 
          style={{
            bottom: 0,
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Elevate Your Retrospectives with Custom Cards</h1>
          <p style={styles.subtitle}>
            Transform team discussions into engaging experiences with our Cards Against Humanity-inspired generator. 
            Create powerful conversation starters that spark meaningful insights and make retrospectives memorable.
          </p>
        </div>
      </section>

      {/* Feature Highlights Section - Before App */}
      <section style={{
        ...styles.contentSection,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        paddingTop: '60px',
        paddingBottom: '60px',
      }}>
        <FloatingShape 
          style={{
            top: '10%',
            right: '5%',
            transform: 'rotate(30deg)',
          }}
        />
        <FloatingShape 
          style={{
            bottom: '15%',
            left: '8%',
            transform: 'rotate(-15deg)',
          }}
        />
        <div style={styles.contentMaxWidth}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            textAlign: 'center',
          }}>
            <div style={styles.featureHighlight}>
              <span style={{ fontSize: '32px' }}>🎯</span>
              <h3 style={styles.featureTitle}>Purposeful Prompts</h3>
              <p style={styles.featureText}>
                Carefully crafted templates for sprint reviews, team building, and innovation sessions
              </p>
            </div>
            <div style={styles.featureHighlight}>
              <span style={{ fontSize: '32px' }}>✨</span>
              <h3 style={styles.featureTitle}>Beautiful Design</h3>
              <p style={styles.featureText}>
                Professional-grade cards with customizable colors, fonts, and themes
              </p>
            </div>
            <div style={styles.featureHighlight}>
              <span style={{ fontSize: '32px' }}>💾</span>
              <h3 style={styles.featureTitle}>Save & Reuse</h3>
              <p style={styles.featureText}>
                Create and save your custom templates for future sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section style={{
        ...styles.appContainer,
        ...(isExpanded ? styles.appContainerExpanded : {})
      }}>
        <div style={styles.maxWidth}>
          <div style={styles.settingsCard}>
            <h2 style={styles.settingsTitle}>Design Your Cards</h2>
            
            <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>
                  Card Prompts (one per line)
                </label>
                <textarea
                  value={cardTexts}
                  onChange={(e) => setCardTexts(e.target.value)}
                  placeholder="Our biggest achievement this sprint was _____
The unexpected challenge we overcame was _____
If our team dynamic was a movie genre, it would be _____"
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

                <div>
                  <label style={styles.label}>
                    Use Template
                  </label>
                  <button
                    onClick={() => setShowPresetsModal(true)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#fff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#4a5568',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>📝</span>
                    Choose from preset templates
                  </button>
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
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title={icon.charAt(0).toUpperCase() + icon.slice(1)}
                      >
                        <IconPreview 
                          type={icon} 
                          size={16} 
                          color={iconType === icon ? '#3b82f6' : '#718096'} 
                        />
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
                    Font Size
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="range"
                      min="14"
                      max="32"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      style={{
                        ...styles.range,
                        flex: 1
                      }}
                    />
                    <span style={{ 
                      fontSize: '14px',
                      color: '#64748b',
                      minWidth: '40px',
                      textAlign: 'right'
                    }}>
                      {fontSize}px
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  gap: '16px',
                  gridColumn: '1 / -1'  // Hace que ocupe todo el ancho
                }}>
                  <button
                    onClick={downloadAllCards}
                    disabled={!parseCardTexts().length}
                    style={{
                      ...styles.button,
                      flex: '1',
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

                  <button
                    onClick={saveCurrentAsTemplate}
                    disabled={!parseCardTexts().length}
                    style={{
                      padding: '16px 28px',
                      background: '#fff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: parseCardTexts().length ? 'pointer' : 'not-allowed',
                      color: parseCardTexts().length ? '#4a5568' : '#a0aec0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      flex: '1'
                    }}
                    onMouseEnter={(e) => {
                      if (parseCardTexts().length) {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#cbd5e0';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (parseCardTexts().length) {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>💾</span>
                    Save as Template
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
                    <div
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      <CardPreview text={text} index={index} />
                    </div>
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

      {/* Value Proposition Section */}
      <section style={{
        ...styles.contentSection,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <GradientCircle
          color="#3b82f6"
          style={{
            top: '-150px',
            right: '-150px',
            transform: `scale(${1 + scrollY * 0.001})`,
          }}
        />
        <GradientCircle
          color="#8b5cf6"
          style={{
            bottom: '-100px',
            left: '-100px',
            transform: `scale(${1 + scrollY * 0.001})`,
          }}
        />
        <FloatingShape 
          style={{
            top: '20%',
            right: '10%',
            transform: `rotate(${20 + scrollY * 0.05}deg)`,
          }}
        />
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Transform Team Discussions</h2>
          <p style={styles.sectionText}>
            Traditional retrospectives often struggle to maintain engagement and generate honest feedback. 
            Our Cards Against Humanity-inspired format creates a safe space for open communication through 
            creative and thought-provoking prompts.
          </p>
          <p style={styles.sectionText}>
            By combining professional facilitation techniques with an engaging card format, teams naturally 
            open up about both successes and challenges. The fill-in-the-blank structure makes it easy for 
            everyone to participate, regardless of their communication style.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section style={{
        ...styles.contentSection,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <WavePattern 
          style={{
            top: 0,
            transform: 'rotate(180deg)',
          }}
        />
        <WavePattern 
          style={{
            bottom: 0,
          }}
        />
        <GradientCircle
          color="#6366f1"
          style={{
            top: '30%',
            right: '5%',
            transform: `scale(${1 + scrollY * 0.001})`,
          }}
        />
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Versatile Applications</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Sprint Retrospectives</h3>
              <p style={styles.featureText}>
                Generate insightful discussions about sprint outcomes, team dynamics, and process improvements. 
                Perfect for Scrum and Agile teams looking to enhance their retrospective sessions.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🤝</div>
              <h3 style={styles.featureTitle}>Team Building</h3>
              <p style={styles.featureText}>
                Create memorable ice-breakers and team bonding activities. Build stronger connections 
                through shared experiences and storytelling.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💡</div>
              <h3 style={styles.featureTitle}>Innovation Workshops</h3>
              <p style={styles.featureText}>
                Spark creative thinking and generate innovative ideas. Break through conventional thinking 
                patterns with unexpected prompts and perspectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section style={{
        ...styles.contentSection,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <FloatingShape 
          style={{
            top: '15%',
            left: '5%',
            transform: `rotate(${-15 + scrollY * 0.05}deg)`,
          }}
        />
        <FloatingShape 
          style={{
            bottom: '20%',
            right: '8%',
            transform: `rotate(${30 + scrollY * 0.05}deg)`,
          }}
        />
        <GradientCircle
          color="#3b82f6"
          style={{
            bottom: '-150px',
            right: '-150px',
            transform: `scale(${1 + scrollY * 0.001})`,
          }}
        />
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Facilitate Effective Sessions</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginTop: '40px'
          }}>
            <div style={styles.guideStep}>
              <h3 style={styles.guideTitle}>1. Preparation</h3>
              <p style={styles.guideText}>
                Select or create 5-10 targeted prompts for your session's objectives. 
                Mix reflection questions with creative prompts to maintain energy and engagement.
              </p>
            </div>
            <div style={styles.guideStep}>
              <h3 style={styles.guideTitle}>2. Facilitation</h3>
              <p style={styles.guideText}>
                Guide participants through each prompt, allowing time for individual reflection 
                before group discussion. Create a safe space for honest sharing.
              </p>
            </div>
            <div style={styles.guideStep}>
              <h3 style={styles.guideTitle}>3. Action Items</h3>
              <p style={styles.guideText}>
                Capture key insights and convert discussions into actionable improvements. 
                Document patterns and themes that emerge from the responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Options */}
      <section style={{
        ...styles.contentSection,
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <WavePattern 
          style={{
            top: 0,
            transform: 'rotate(180deg)',
          }}
        />
        <GradientCircle
          color="#8b5cf6"
          style={{
            top: '20%',
            left: '10%',
            transform: `scale(${1 + scrollY * 0.001})`,
          }}
        />
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Professional Customization</h2>
          <div style={styles.featureGrid}>
            <div style={styles.customizationCard}>
              <h3 style={styles.customizationTitle}>Visual Design</h3>
              <ul style={styles.customizationList}>
                <li>Classic black or white cards</li>
                <li>Custom color schemes</li>
                <li>Gradient backgrounds</li>
                <li>Professional typography</li>
              </ul>
            </div>
            <div style={styles.customizationCard}>
              <h3 style={styles.customizationTitle}>Branding</h3>
              <ul style={styles.customizationList}>
                <li>Company name integration</li>
                <li>Custom icons and emojis</li>
                <li>Team-specific templates</li>
                <li>Saved configurations</li>
              </ul>
            </div>
            <div style={styles.customizationCard}>
              <h3 style={styles.customizationTitle}>Export Options</h3>
              <ul style={styles.customizationList}>
                <li>High-resolution PNG export</li>
                <li>Individual or batch download</li>
                <li>Print-ready format</li>
                <li>Digital sharing capability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        ...styles.contentSection,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <DecorativeShape 
          color="#6366f1"
          style={{
            width: '400px',
            height: '400px',
            bottom: '-200px',
            right: '-200px',
            transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.02}deg)`,
          }}
        />
        <Blob
          color="#8b5cf640"
          style={{
            width: '300px',
            height: '300px',
            top: '20%',
            left: '-100px',
            transform: `translateY(${scrollY * -0.05}px) rotate(${scrollY * 0.02}deg)`,
          }}
          path="M47.7,-51.1C58.9,-34.9,63.3,-17.4,62.1,-1.2C60.9,15,54.1,30,42.9,39.4C31.7,48.8,15.8,52.6,-1.9,54.5C-19.7,56.4,-39.4,56.4,-51.1,47C-62.8,37.6,-66.5,18.8,-63.1,2.5C-59.6,-13.8,-49,-27.7,-37.3,-43.9C-25.7,-60.1,-12.8,-78.7,2.3,-81C17.4,-83.3,34.8,-69.3,47.7,-51.1Z"
        />
        <div style={styles.contentMaxWidth}>
          <h2 style={styles.sectionTitle}>Start Creating Impactful Retrospectives</h2>
          <p style={styles.sectionText}>
            Whether you're facilitating remote or in-person sessions, our card generator helps create 
            memorable retrospectives that teams actually look forward to. Begin with our templates or 
            create your own custom cards to match your team's unique culture and objectives.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40px'
          }}>
            <button
              onClick={() => document.querySelector('textarea').focus()}
              style={{
                ...styles.button,
                maxWidth: '300px',
                margin: '0 auto'
              }}
            >
              Create Your First Card
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CardGenerator;