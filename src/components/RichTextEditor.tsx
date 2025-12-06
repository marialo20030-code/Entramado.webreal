import { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Type, 
  List,
  ListOrdered,
  Palette,
  Highlighter,
  Minus,
  Smile,
  Image,
  Shapes,
  Square,
  Circle,
  Triangle
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
}

const FONT_OPTIONS = [
  { name: 'Inter', value: '"Inter", "Segoe UI", system-ui, sans-serif', label: 'Inter (Formal)' },
  { name: 'Roboto', value: '"Roboto", "Helvetica Neue", Arial, sans-serif', label: 'Roboto' },
  { name: 'Georgia', value: '"Georgia", "Times New Roman", serif', label: 'Georgia' },
  { name: 'Merriweather', value: '"Merriweather", Georgia, serif', label: 'Merriweather' },
  { name: 'Lato', value: '"Lato", sans-serif', label: 'Lato' },
  { name: 'Playfair Display', value: '"Playfair Display", serif', label: 'Playfair Display' },
];

const TEXT_COLORS = [
  { name: 'Negro', value: '#2c2416' },
  { name: 'Gris oscuro', value: '#4b5563' },
  { name: 'Gris', value: '#6b7280' },
  { name: 'Rojo', value: '#dc2626' },
  { name: 'Naranja', value: '#ea580c' },
  { name: 'Amarillo', value: '#ca8a04' },
  { name: 'Verde', value: '#16a34a' },
  { name: 'Azul', value: '#2563eb' },
  { name: 'Índigo', value: '#4f46e5' },
  { name: 'Violeta', value: '#7c3aed' },
  { name: 'Rosa', value: '#db2777' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Amarillo', value: '#fef08a' },
  { name: 'Verde', value: '#bbf7d0' },
  { name: 'Azul', value: '#bfdbfe' },
  { name: 'Rosa', value: '#fce7f3' },
  { name: 'Naranja', value: '#fed7aa' },
  { name: 'Rojo', value: '#fecaca' },
  { name: 'Violeta', value: '#e9d5ff' },
];

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
  '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '💪', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟',
  '🤘', '👌', '👈', '👉', '👆', '👇', '☝️', '👏', '🙌', '🤲',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '⭐', '🌟', '✨', '💫', '💥', '💢', '💯', '🔥', '🎉', '🎊',
];

const SHAPES = [
  { name: 'Círculo', html: '<span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background-color: #2563eb; vertical-align: middle;"></span>' },
  { name: 'Cuadrado', html: '<span style="display: inline-block; width: 20px; height: 20px; background-color: #2563eb; vertical-align: middle;"></span>' },
  { name: 'Triángulo', html: '<span style="display: inline-block; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid #2563eb; vertical-align: middle;"></span>' },
  { name: 'Rombo', html: '<span style="display: inline-block; width: 20px; height: 20px; background-color: #2563eb; transform: rotate(45deg); vertical-align: middle;"></span>' },
  { name: 'Estrella', html: '<span style="font-size: 20px; vertical-align: middle;">★</span>' },
  { name: 'Corazón', html: '<span style="font-size: 20px; vertical-align: middle; color: #dc2626;">♥</span>' },
];

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Escribe tu contenido aquí...',
  fontFamily = '"Inter", "Segoe UI", system-ui, sans-serif',
  fontSize = '16px',
  textColor = '#2c2416'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUserTypingRef = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [currentFont, setCurrentFont] = useState(fontFamily);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isUserTypingRef.current) {
      const selection = window.getSelection();
      let savedRange: Range | null = null;
      
      if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
        savedRange = selection.getRangeAt(0).cloneRange();
      }
      
      editorRef.current.innerHTML = value || '';
      
      if (savedRange && editorRef.current) {
        try {
          const newSelection = window.getSelection();
          if (newSelection) {
            const newRange = document.createRange();
            newRange.selectNodeContents(editorRef.current);
            newRange.collapse(false);
            newSelection.removeAllRanges();
            newSelection.addRange(newRange);
          }
        } catch (e) {
          editorRef.current.focus();
        }
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUserTypingRef.current = true;
      onChange(editorRef.current.innerHTML);
      
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 100);
      
      if (document.activeElement !== editorRef.current) {
        editorRef.current.focus();
      }
    }
  }, [onChange]);

  const execCommand = (command: string, value?: string | boolean) => {
    document.execCommand(command, false, value as string);
    editorRef.current?.focus();
    handleInput();
  };

  const insertHTML = (html: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const fragment = document.createDocumentFragment();
      
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      
      range.insertNode(fragment);
      
      // Colocar cursor después del elemento insertado
      range.setStartAfter(fragment.lastChild || range.endContainer);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleInput();
    }
  };

  const applyTextColor = (color: string) => {
    execCommand('foreColor', color);
    setShowColorMenu(false);
  };

  const applyHighlight = (color: string) => {
    execCommand('hiliteColor', color);
    setShowHighlightMenu(false);
  };

  const insertEmoji = (emoji: string) => {
    insertHTML(emoji);
    setShowEmojiMenu(false);
  };

  const insertShape = (shape: { name: string; html: string }) => {
    insertHTML(shape.html);
    setShowShapeMenu(false);
  };

  const createList = (ordered: boolean) => {
    if (ordered) {
      execCommand('insertOrderedList');
    } else {
      execCommand('insertUnorderedList');
    }
  };

  const insertDivider = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const hr = document.createElement('hr');
      hr.style.margin = '1.5em 0';
      hr.style.border = 'none';
      hr.style.borderTop = '2px solid #e5e7eb';
      
      range.insertNode(hr);
      
      const newRange = document.createRange();
      newRange.setStartAfter(hr);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      handleInput();
    }
  };

  const changeFontFamily = (font: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.style.fontFamily = font;
        const allElements = editorRef.current.querySelectorAll('*');
        allElements.forEach(el => {
          const htmlEl = el as HTMLElement;
          if (!htmlEl.style.fontFamily) {
            htmlEl.style.fontFamily = font;
          }
        });
      }
    } else {
      const range = selection.getRangeAt(0);
      
      if (!range.collapsed) {
        try {
          document.execCommand('fontName', false, font);
        } catch (e) {
          try {
            const span = document.createElement('span');
            span.style.fontFamily = font;
            range.surroundContents(span);
          } catch (e2) {
            console.error('Error applying font:', e2);
          }
        }
      } else {
        try {
          document.execCommand('fontName', false, font);
          const marker = document.createTextNode('\u200B');
          range.insertNode(marker);
          range.setStartAfter(marker);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          console.error('Error applying font:', e);
        }
      }
    }
    
    setCurrentFont(font);
    setShowFontMenu(false);
    editorRef.current?.focus();
    handleInput();
  };

  const isActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };

  const ToolbarButton = ({ 
    icon: Icon, 
    command, 
    title, 
    value,
    onClick,
    active
  }: { 
    icon: any; 
    command?: string; 
    title: string; 
    value?: string | boolean;
    onClick?: () => void;
    active?: boolean;
  }) => {
    const isActiveState = command ? isActive(command) : active || false;
    return (
      <button
        type="button"
        onClick={() => {
          if (onClick) {
            onClick();
          } else if (command) {
            execCommand(command, value as string);
          }
        }}
        className={`p-2 rounded hover:bg-gray-300 transition-colors ${
          isActiveState ? 'bg-gray-300 text-gray-900' : 'text-gray-700'
        }`}
        title={title}
      >
        <Icon size={18} />
      </button>
    );
  };

  const MenuDropdown = ({ 
    isOpen, 
    onClose, 
    children, 
    className = '' 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode;
    className?: string;
  }) => {
    useEffect(() => {
      if (isOpen) {
        const handleClickOutside = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          if (!target.closest('.menu-dropdown-container')) {
            onClose();
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 ${className}`}>
        {children}
      </div>
    );
  };

  // Calcular líneas del cuaderno
  const fontSizeNum = parseFloat(fontSize) || 16;
  const lineHeight = fontSizeNum * 1.8; // Altura de línea
  const lineSpacing = 8; // Espacio entre líneas

  return (
    <div className="w-full">
      {/* Toolbar mejorado */}
      <div className="flex items-center gap-1 p-2 bg-[#fafafa] border-b border-gray-300 flex-wrap sticky top-0 z-10">
        {/* Formato básico */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton icon={Bold} command="bold" title="Negrita (Ctrl+B)" />
          <ToolbarButton icon={Italic} command="italic" title="Cursiva (Ctrl+I)" />
          <ToolbarButton icon={Underline} command="underline" title="Subrayado (Ctrl+U)" />
        </div>

        {/* Listas */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton 
            icon={List} 
            title="Lista sin orden" 
            onClick={() => createList(false)}
            active={isActive('insertUnorderedList')}
          />
          <ToolbarButton 
            icon={ListOrdered} 
            title="Lista ordenada" 
            onClick={() => createList(true)}
            active={isActive('insertOrderedList')}
          />
        </div>
        
        {/* Color de texto */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowColorMenu(!showColorMenu);
              setShowHighlightMenu(false);
              setShowFontMenu(false);
              setShowEmojiMenu(false);
              setShowShapeMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Color de texto"
          >
            <Palette size={16} />
          </button>
          <MenuDropdown isOpen={showColorMenu} onClose={() => setShowColorMenu(false)} className="w-48">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Color de texto</div>
              <div className="grid grid-cols-6 gap-2">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyTextColor(color.value)}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </MenuDropdown>
        </div>

        {/* Subrayado con color (highlight) */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowHighlightMenu(!showHighlightMenu);
              setShowColorMenu(false);
              setShowFontMenu(false);
              setShowEmojiMenu(false);
              setShowShapeMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Resaltar texto"
          >
            <Highlighter size={16} />
          </button>
          <MenuDropdown isOpen={showHighlightMenu} onClose={() => setShowHighlightMenu(false)} className="w-48">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Color de resaltado</div>
              <div className="grid grid-cols-6 gap-2">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => applyHighlight(color.value)}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </MenuDropdown>
        </div>

        {/* Emojis */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowEmojiMenu(!showEmojiMenu);
              setShowColorMenu(false);
              setShowHighlightMenu(false);
              setShowFontMenu(false);
              setShowShapeMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Insertar emoji"
          >
            <Smile size={16} />
          </button>
          <MenuDropdown isOpen={showEmojiMenu} onClose={() => setShowEmojiMenu(false)} className="w-64 max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Emojis</div>
              <div className="grid grid-cols-10 gap-1">
                {EMOJIS.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-2 text-lg hover:bg-gray-100 rounded transition-colors"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </MenuDropdown>
        </div>

        {/* Formas/Shapes */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowShapeMenu(!showShapeMenu);
              setShowColorMenu(false);
              setShowHighlightMenu(false);
              setShowFontMenu(false);
              setShowEmojiMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Insertar formas"
          >
            <Shapes size={16} />
          </button>
          <MenuDropdown isOpen={showShapeMenu} onClose={() => setShowShapeMenu(false)} className="w-48">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Formas</div>
              <div className="space-y-1">
                {SHAPES.map((shape, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertShape(shape)}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
                    dangerouslySetInnerHTML={{ __html: `${shape.html} ${shape.name}` }}
                  />
                ))}
              </div>
            </div>
          </MenuDropdown>
        </div>
        
        {/* Selector de fuente */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowFontMenu(!showFontMenu);
              setShowColorMenu(false);
              setShowHighlightMenu(false);
              setShowEmojiMenu(false);
              setShowShapeMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Fuente"
          >
            <Type size={16} />
            <span className="text-xs">Aa</span>
          </button>
          <MenuDropdown isOpen={showFontMenu} onClose={() => setShowFontMenu(false)} className="w-48 max-h-60 overflow-y-auto">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                type="button"
                onClick={() => changeFontFamily(font.value)}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-100 transition-colors ${
                  currentFont === font.value ? 'bg-gray-100 font-semibold' : ''
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </button>
            ))}
          </MenuDropdown>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton 
            icon={Minus} 
            title="Insertar divisor" 
            onClick={insertDivider}
          />
        </div>

        {/* Alineación */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Alinear a la izquierda" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Centrar" />
          <ToolbarButton icon={AlignRight} command="justifyRight" title="Alinear a la derecha" />
        </div>
      </div>

      {/* Editor - Estilo CUADERNO con líneas horizontales realistas */}
      <div className="relative bg-[#fefefe]" style={{ minHeight: '800px' }}>
        {/* Margen izquierdo del cuaderno */}
        <div 
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: '48px',
            background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, #ff6b6b 23px, #ff6b6b 24px)',
            opacity: 0.3,
            pointerEvents: 'none'
          }}
        />
        
        {/* Líneas horizontales del cuaderno - MUY REALISTAS */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent ${lineHeight - 1}px,
              #d1d5db ${lineHeight - 1}px,
              #d1d5db ${lineHeight}px
            )`,
            backgroundPosition: '48px 32px',
            backgroundSize: `calc(100% - 48px) ${lineHeight}px`,
            backgroundRepeat: 'repeat-y',
          }}
        />
        
        {/* Línea vertical del margen */}
        <div 
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: '48px',
            width: '1px',
            background: '#fbbf24',
            opacity: 0.4
          }}
        />
        
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={(e) => {
            isUserTypingRef.current = true;
            if (e.key === 'Enter') {
              setTimeout(() => {
                isUserTypingRef.current = false;
              }, 200);
            }
            if (e.ctrlKey || e.metaKey) {
              if (e.key === 'b') {
                e.preventDefault();
                execCommand('bold');
              } else if (e.key === 'i') {
                e.preventDefault();
                execCommand('italic');
              } else if (e.key === 'u') {
                e.preventDefault();
                execCommand('underline');
              }
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            if (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest('.menu-dropdown-container')) {
              setIsFocused(false);
              setShowFontMenu(false);
              setShowColorMenu(false);
              setShowHighlightMenu(false);
              setShowEmojiMenu(false);
              setShowShapeMenu(false);
              isUserTypingRef.current = false;
            }
          }}
          onClick={() => {
            if (showFontMenu || showColorMenu || showHighlightMenu || showEmojiMenu || showShapeMenu) {
              setTimeout(() => {
                const activeElement = document.activeElement;
                if (!activeElement || !(activeElement as HTMLElement).closest('.menu-dropdown-container')) {
                  setShowFontMenu(false);
                  setShowColorMenu(false);
                  setShowHighlightMenu(false);
                  setShowEmojiMenu(false);
                  setShowShapeMenu(false);
                }
              }, 100);
            }
          }}
          className="pl-20 pr-16 py-8 focus:outline-none text-gray-900 relative z-10"
          style={{
            fontFamily: currentFont || fontFamily,
            fontSize: fontSize,
            lineHeight: `${lineHeight}px`,
            backgroundColor: 'transparent',
            color: textColor,
            minHeight: '800px',
            caretColor: textColor || '#2c2416',
          }}
          data-placeholder={isFocused ? '' : placeholder}
          suppressContentEditableWarning={true}
        />
      </div>
      
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #a8a095;
          pointer-events: none;
          font-style: italic;
        }
        [contenteditable] {
          outline: none;
          caret-color: #2c2416 !important;
        }
        [contenteditable]:focus {
          caret-color: #2c2416 !important;
        }
        [contenteditable]:focus * {
          caret-color: #2c2416 !important;
        }
        [contenteditable] * {
          caret-color: inherit !important;
        }
        [contenteditable] p {
          margin: 0;
          padding: 0;
          line-height: ${lineHeight}px;
        }
        [contenteditable] p:first-child {
          margin-top: 0;
        }
        [contenteditable] p:last-child {
          margin-bottom: 0;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.8em 0;
          padding-left: 2em;
        }
        [contenteditable] li {
          margin: 0.3em 0;
          line-height: ${lineHeight}px;
        }
        [contenteditable] strong {
          font-weight: 700 !important;
        }
        [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] u {
          text-decoration: underline;
        }
        [contenteditable] hr {
          margin: 1.5em 0;
          border: none;
          border-top: 2px solid #e5e7eb;
        }
        [contenteditable] mark {
          background-color: #fef08a;
          padding: 2px 4px;
          border-radius: 2px;
        }
        [contenteditable] span[style*="display: inline-block"] {
          margin: 0 4px;
        }
      `}</style>
    </div>
  );
}
