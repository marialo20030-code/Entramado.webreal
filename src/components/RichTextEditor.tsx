import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

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
  const [currentFont, setCurrentFont] = useState(fontFamily);

  useEffect(() => {
    // Solo actualizar si el usuario no está escribiendo activamente
    // Esto evita que se pierda el cursor cuando se presiona Enter
    if (editorRef.current && value !== editorRef.current.innerHTML && !isUserTypingRef.current) {
      // Guardar la selección actual antes de actualizar
      const selection = window.getSelection();
      let savedRange: Range | null = null;
      
      if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
        savedRange = selection.getRangeAt(0).cloneRange();
      }
      
      // Actualizar el contenido
      editorRef.current.innerHTML = value || '';
      
      // Restaurar la selección después de actualizar
      if (savedRange && editorRef.current) {
        try {
          const newSelection = window.getSelection();
          if (newSelection) {
            // Intentar restaurar la selección al final del contenido
            const newRange = document.createRange();
            newRange.selectNodeContents(editorRef.current);
            newRange.collapse(false);
            newSelection.removeAllRanges();
            newSelection.addRange(newRange);
          }
        } catch (e) {
          // Si falla, simplemente poner el foco en el editor
          editorRef.current.focus();
        }
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isUserTypingRef.current = true;
      onChange(editorRef.current.innerHTML);
      
      // Resetear la bandera después de un breve delay
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 100);
      
      // Mantener el foco
      if (document.activeElement !== editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const changeFontFamily = (font: string) => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      // Si no hay selección, aplicar al texto completo
      if (editorRef.current) {
        editorRef.current.style.fontFamily = font;
        // Aplicar a todos los elementos dentro que no tengan su propia fuente
        const allElements = editorRef.current.querySelectorAll('*');
        allElements.forEach(el => {
          const htmlEl = el as HTMLElement;
          if (!htmlEl.style.fontFamily) {
            htmlEl.style.fontFamily = font;
          }
        });
      }
    } else {
      // Aplicar solo a la selección o al siguiente texto
      const range = selection.getRangeAt(0);
      
      if (!range.collapsed) {
        // Hay texto seleccionado - aplicar estilo
        try {
          // Intentar usar execCommand primero (más compatible)
          document.execCommand('fontName', false, font);
        } catch (e) {
          // Si falla, usar span
          try {
            const span = document.createElement('span');
            span.style.fontFamily = font;
            range.surroundContents(span);
          } catch (e2) {
            console.error('Error applying font:', e2);
          }
        }
      } else {
        // Solo cursor - aplicar al siguiente texto que se escriba
        try {
          document.execCommand('fontName', false, font);
          // Insertar un marcador invisible para mantener el estilo
          const marker = document.createTextNode('\u200B'); // Zero-width space
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
    value 
  }: { 
    icon: any; 
    command: string; 
    title: string; 
    value?: string;
  }) => {
    const active = isActive(command);
    return (
      <button
        type="button"
        onClick={() => execCommand(command, value)}
        className={`p-2 rounded hover:bg-gray-300 transition-colors ${
          active ? 'bg-gray-300 text-gray-900' : 'text-gray-700'
        }`}
        title={title}
      >
        <Icon size={18} />
      </button>
    );
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-[#fafafa] border-b border-gray-300 flex-wrap sticky top-0 z-10">
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton icon={Bold} command="bold" title="Negrita (Ctrl+B)" />
          <ToolbarButton icon={Italic} command="italic" title="Cursiva (Ctrl+I)" />
          <ToolbarButton icon={Underline} command="underline" title="Subrayado (Ctrl+U)" />
        </div>
        
        {/* Selector de fuente */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative">
          <button
            type="button"
            onClick={() => {
              setShowFontMenu(!showFontMenu);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Fuente"
          >
            <Type size={16} />
            <span className="text-xs">Aa</span>
          </button>
          {showFontMenu && (
            <div className="font-menu-container absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-48 max-h-60 overflow-y-auto">
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
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton icon={List} command="insertUnorderedList" title="Lista con viñetas" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Lista numerada" />
        </div>
        <div className="flex items-center gap-1">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Alinear a la izquierda" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Centrar" />
          <ToolbarButton icon={AlignRight} command="justifyRight" title="Alinear a la derecha" />
        </div>
      </div>

      {/* Editor - estilo papel con líneas alineadas */}
      <div className="relative">
        {/* Fondo con líneas rayadas que coinciden con el texto */}
        {(() => {
          const fontSizeNum = parseFloat(fontSize) || 16;
          const lineHeightNum = 1.8;
          const lineHeight = fontSizeNum * lineHeightNum;
          const paddingLeft = 64; // px-16 = 64px
          const paddingTop = 32; // py-8 = 32px
          // El offset vertical debe dejar espacio en blanco al inicio
          // Agregamos una línea completa de altura para que haya espacio antes de la primera línea rayada
          const verticalOffset = paddingTop + lineHeight; // Espacio en blanco antes de la primera línea
          
          return (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${lineHeight - 1}px, #d1d5db ${lineHeight - 1}px, #d1d5db ${lineHeight}px)`,
                backgroundPosition: `${paddingLeft}px ${verticalOffset}px`,
                backgroundSize: `calc(100% - ${paddingLeft * 2}px) ${lineHeight}px`,
                backgroundRepeat: 'repeat-y',
                opacity: 0.35
              }}
            />
          );
        })()}
        
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={(e) => {
            // Marcar que el usuario está escribiendo cuando presiona teclas
            isUserTypingRef.current = true;
            // Permitir que Enter funcione normalmente
            if (e.key === 'Enter') {
              // El navegador manejará el Enter, solo necesitamos asegurar que el cursor se mantenga
              setTimeout(() => {
                isUserTypingRef.current = false;
              }, 200);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            // No cerrar el menú si se hace clic en él
            if (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest('.font-menu-container')) {
              setIsFocused(false);
              setShowFontMenu(false);
              isUserTypingRef.current = false;
            }
          }}
          onClick={() => {
            // Cerrar el menú solo si se hace clic fuera de él
            if (!showFontMenu) return;
            setTimeout(() => {
              const activeElement = document.activeElement;
              if (!activeElement || !(activeElement as HTMLElement).closest('.font-menu-container')) {
                setShowFontMenu(false);
              }
            }, 100);
          }}
          className="px-16 py-8 focus:outline-none text-gray-900 relative z-0"
          style={{
            fontFamily: currentFont || fontFamily,
            fontSize: fontSize,
            lineHeight: '1.8',
            backgroundColor: 'transparent',
            color: textColor,
            minHeight: '600px',
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
          line-height: 1.8;
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
        [contenteditable] strong {
          font-weight: 600;
        }
        [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

