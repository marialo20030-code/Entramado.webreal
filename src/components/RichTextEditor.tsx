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
  Image
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

  // Función para convertir markdown a HTML
  const markdownToHTML = (text: string): string => {
    if (!text || !text.trim()) return '';
    
    let html = text;
    
    // Escapar HTML existente primero (excepto si ya está en formato HTML)
    const hasHTMLTags = /<[^>]+>/.test(html);
    if (!hasHTMLTags) {
      html = html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    
    // Bloques de código (```lang code ```) - primero para evitar que se procesen otros elementos
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
      // No escapar de nuevo si ya tiene HTML
      const codeContent = hasHTMLTags ? code : code
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      
      return `<pre style="background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.5; margin: 12px 0;"><code>${codeContent.trim()}</code></pre>`;
    });
    
    // Dividir en líneas para procesar
    const lines = html.split('\n');
    const result: string[] = [];
    let inCodeBlock = false;
    let inOrderedList = false;
    let inUnorderedList = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Verificar si estamos dentro de un bloque de código
      if (line.includes('<pre>')) inCodeBlock = true;
      if (line.includes('</pre>')) {
        inCodeBlock = false;
        result.push(line);
        continue;
      }
      if (inCodeBlock) {
        result.push(line);
        continue;
      }
      
      // Blockquotes (> text)
      if (/^&gt; (.+)$/.test(line) || /^> (.+)$/.test(line)) {
        line = line.replace(/^(&gt;|>) (.+)$/, '<blockquote style="border-left: 4px solid #ddd; padding-left: 16px; margin: 12px 0; color: #666; font-style: italic;">$2</blockquote>');
        result.push(line);
        continue;
      }
      
      // Títulos
      if (/^### (.+)$/.test(line)) {
        line = line.replace(/^### (.+)$/, '<h3 style="font-size: 1.2em; font-weight: 600; margin: 16px 0 8px 0;">$1</h3>');
        if (inOrderedList) { result.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { result.push('</ul>'); inUnorderedList = false; }
        result.push(line);
        continue;
      }
      if (/^## (.+)$/.test(line)) {
        line = line.replace(/^## (.+)$/, '<h2 style="font-size: 1.5em; font-weight: 600; margin: 20px 0 12px 0;">$1</h2>');
        if (inOrderedList) { result.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { result.push('</ul>'); inUnorderedList = false; }
        result.push(line);
        continue;
      }
      if (/^# (.+)$/.test(line)) {
        line = line.replace(/^# (.+)$/, '<h1 style="font-size: 2em; font-weight: 600; margin: 24px 0 16px 0;">$1</h1>');
        if (inOrderedList) { result.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { result.push('</ul>'); inUnorderedList = false; }
        result.push(line);
        continue;
      }
      
      // Listas ordenadas
      if (/^\d+\. (.+)$/.test(line)) {
        if (!inOrderedList) {
          result.push('<ol style="margin: 12px 0; padding-left: 2em;">');
          inOrderedList = true;
        }
        if (inUnorderedList) {
          result.push('</ul>');
          inUnorderedList = false;
        }
        line = line.replace(/^\d+\. (.+)$/, '<li>$1</li>');
        result.push(line);
        continue;
      }
      
      // Listas no ordenadas
      if (/^[-*] (.+)$/.test(line)) {
        if (!inUnorderedList) {
          result.push('<ul style="margin: 12px 0; padding-left: 2em; list-style-type: disc;">');
          inUnorderedList = true;
        }
        if (inOrderedList) {
          result.push('</ol>');
          inOrderedList = false;
        }
        line = line.replace(/^[-*] (.+)$/, '<li>$1</li>');
        result.push(line);
        continue;
      }
      
      // Cerrar listas si hay línea vacía o cambio de contexto
      if (line.trim() === '') {
        if (inOrderedList) { result.push('</ol>'); inOrderedList = false; }
        if (inUnorderedList) { result.push('</ul>'); inUnorderedList = false; }
        result.push(line);
        continue;
      }
      
      // Si llegamos aquí, es una línea normal
      if (inOrderedList) { result.push('</ol>'); inOrderedList = false; }
      if (inUnorderedList) { result.push('</ul>'); inUnorderedList = false; }
      
      result.push(line);
    }
    
    // Cerrar listas abiertas
    if (inOrderedList) result.push('</ol>');
    if (inUnorderedList) result.push('</ul>');
    
    html = result.join('\n');
    
    // Código inline (`code`) - después de procesar bloques, pero no dentro de <pre>
    html = html.replace(/`([^`\n<]+)`/g, (match, code) => {
      // No procesar si está dentro de un pre
      if (html.substring(0, html.indexOf(match)).includes('<pre')) {
        return match;
      }
      return `<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 0.9em;">${code}</code>`;
    });
    
    // Negritas (**text** o __text__) - primero procesar negritas antes que cursivas
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Cursivas (*text* o _text_) - evitar procesar dentro de código o negritas
    html = html.replace(/\*([^*<]+)\*/g, (match, text) => {
      // No procesar si está dentro de un tag code o pre
      const before = html.substring(0, html.indexOf(match));
      if (before.includes('<code') || before.includes('<pre')) {
        return match;
      }
      return `<em>${text}</em>`;
    });
    html = html.replace(/_([^_<]+)_/g, (match, text) => {
      const before = html.substring(0, html.indexOf(match));
      if (before.includes('<code') || before.includes('<pre')) {
        return match;
      }
      return `<em>${text}</em>`;
    });
    
    // Enlaces [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>');
    
    // Convertir líneas a párrafos si no tienen tags HTML - Con line-height correcto
    const fontSizeNum = parseFloat(fontSize) || 16;
    const lineHeightValue = fontSizeNum * 1.8; // Mismo que las líneas del cuaderno
    
    const finalLines = html.split('\n');
    const finalResult: string[] = [];
    let currentParagraph: string[] = [];
    
    for (const line of finalLines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentParagraph.length > 0) {
          const paraText = currentParagraph.join(' ');
          if (paraText && !paraText.match(/^<[^>]+>/)) {
            finalResult.push(`<p style="margin: 0; padding: 0; line-height: ${lineHeightValue}px !important; min-height: ${lineHeightValue}px;">${paraText}</p>`);
          } else {
            finalResult.push(paraText);
          }
          currentParagraph = [];
        }
        continue;
      }
      
      if (trimmed.match(/^<[^>]+>/) || trimmed.includes('</')) {
        if (currentParagraph.length > 0) {
          finalResult.push(currentParagraph.join(' '));
          currentParagraph = [];
        }
        finalResult.push(trimmed);
      } else {
        currentParagraph.push(trimmed);
      }
    }
    
    if (currentParagraph.length > 0) {
      const paraText = currentParagraph.join(' ');
      if (paraText && !paraText.match(/^<[^>]+>/)) {
        finalResult.push(`<p style="margin: 0; padding: 0; line-height: ${lineHeightValue}px !important; min-height: ${lineHeightValue}px;">${paraText}</p>`);
      } else {
        finalResult.push(paraText);
      }
    }
    
    return finalResult.join('\n');
  };

  // Función para procesar y limpiar HTML pegado - Aplicar line-height correcto para alinearse con las líneas del cuaderno
  const processPastedHTML = (html: string): string => {
    const fontSizeNum = parseFloat(fontSize) || 16;
    const lineHeightValue = fontSizeNum * 1.8; // Mismo cálculo que las líneas del cuaderno
    
    // Crear un elemento temporal para procesar el HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Aplicar line-height a todos los párrafos
    const paragraphs = temp.querySelectorAll('p');
    paragraphs.forEach(p => {
      const currentStyle = p.getAttribute('style') || '';
      p.setAttribute('style', 
        `${currentStyle}; line-height: ${lineHeightValue}px !important; margin: 0; padding: 0; min-height: ${lineHeightValue}px;`
          .replace(/;\s*;/g, ';').trim()
      );
    });
    
    // Aplicar line-height a todos los elementos de lista
    const listItems = temp.querySelectorAll('li');
    listItems.forEach(li => {
      const currentStyle = li.getAttribute('style') || '';
      li.setAttribute('style', 
        `${currentStyle}; line-height: ${lineHeightValue}px !important; margin: 0; padding: 0; min-height: ${lineHeightValue}px;`
          .replace(/;\s*;/g, ';').trim()
      );
    });
    
    // Ajustar márgenes de listas para que sean múltiplos del line-height
    const lists = temp.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const currentStyle = list.getAttribute('style') || '';
      const marginValue = `${lineHeightValue}px`;
      if (list.tagName === 'UL') {
        list.setAttribute('style', 
          `${currentStyle}; margin: ${marginValue} 0; padding-left: 2em; list-style-type: disc;`
            .replace(/;\s*;/g, ';').trim()
        );
      } else {
        list.setAttribute('style', 
          `${currentStyle}; margin: ${marginValue} 0; padding-left: 2em;`
            .replace(/;\s*;/g, ';').trim()
        );
      }
    });
    
    // Preservar bloques de código y pre (mantener su line-height pero ajustar márgenes)
    const codeBlocks = temp.querySelectorAll('pre, code');
    codeBlocks.forEach(block => {
      if (block.tagName === 'PRE') {
        const currentStyle = block.getAttribute('style') || '';
        block.setAttribute('style', 
          `background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; ` +
          `font-family: "Courier New", monospace; font-size: 14px; ` +
          `line-height: ${lineHeightValue}px !important; margin: ${lineHeightValue}px 0;`
        );
      } else if (block.tagName === 'CODE' && block.parentElement?.tagName !== 'PRE') {
        const currentStyle = block.getAttribute('style') || '';
        block.setAttribute('style', 
          `${currentStyle}; background: #f4f4f4; padding: 2px 6px; border-radius: 3px; ` +
          `font-family: monospace; font-size: 0.9em; line-height: ${lineHeightValue}px !important;`
            .replace(/;\s*;/g, ';').trim()
        );
      }
    });
    
    // Preservar blockquotes con line-height correcto
    const blockquotes = temp.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      const currentStyle = quote.getAttribute('style') || '';
      quote.setAttribute('style', 
        `border-left: 4px solid #ddd; padding-left: 16px; margin: ${lineHeightValue}px 0; ` +
        `color: #666; font-style: italic; line-height: ${lineHeightValue}px !important;`
      );
      // Aplicar line-height también a los párrafos dentro del blockquote
      const blockquotePs = quote.querySelectorAll('p');
      blockquotePs.forEach(p => {
        const pStyle = p.getAttribute('style') || '';
        p.setAttribute('style', 
          `${pStyle}; line-height: ${lineHeightValue}px !important; margin: 0;`
            .replace(/;\s*;/g, ';').trim()
        );
      });
    });
    
    // Ajustar títulos con line-height y márgenes correctos
    const headings = temp.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const tagName = heading.tagName.toLowerCase();
      const currentStyle = heading.getAttribute('style') || '';
      let lineHeightHeading = lineHeightValue;
      let marginTop = lineHeightValue;
      let marginBottom = lineHeightValue;
      
      if (tagName === 'h1') {
        lineHeightHeading = lineHeightValue * 2;
        marginTop = lineHeightValue * 2;
      } else if (tagName === 'h2') {
        lineHeightHeading = lineHeightValue * 1.5;
        marginTop = lineHeightValue * 1.5;
      }
      
      heading.setAttribute('style', 
        `${currentStyle}; line-height: ${lineHeightHeading}px !important; ` +
        `margin: ${marginTop}px 0 ${marginBottom}px 0; font-weight: 600;`
          .replace(/;\s*;/g, ';').trim()
      );
    });
    
    // Mantener enlaces
    const links = temp.querySelectorAll('a');
    links.forEach(link => {
      const currentStyle = link.getAttribute('style') || '';
      link.setAttribute('style', 
        `${currentStyle}; color: #2563eb; text-decoration: underline; line-height: ${lineHeightValue}px !important;`
          .replace(/;\s*;/g, ';').trim()
      );
    });
    
    // Aplicar line-height a todos los demás elementos de texto
    const textElements = temp.querySelectorAll('span, div, em, strong, u, del');
    textElements.forEach(el => {
      // Solo aplicar si no tiene un padre que ya tenga line-height aplicado
      if (!el.closest('pre, code, blockquote, h1, h2, h3, h4, h5, h6')) {
        const currentStyle = el.getAttribute('style') || '';
        if (!currentStyle.includes('line-height')) {
          el.setAttribute('style', 
            `${currentStyle}; line-height: ${lineHeightValue}px !important;`
              .replace(/;\s*;/g, ';').trim()
          );
        }
      }
    });
    
    return temp.innerHTML;
  };

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
  
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    const selection = window.getSelection();
    
    if (!selection || !editorRef.current) return;
    
    let html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    
    // Si hay HTML, procesarlo; si no, intentar convertir markdown
    let processedHTML = '';
    
    if (html && html.trim()) {
      processedHTML = processPastedHTML(html);
    } else if (text && text.trim()) {
      // Intentar convertir markdown a HTML
      processedHTML = markdownToHTML(text);
    } else {
      return;
    }
    
    // Insertar el contenido procesado
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = processedHTML;
      const fragment = document.createDocumentFragment();
      
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      
      range.insertNode(fragment);
      
      // Colocar cursor después del contenido insertado
      range.setStartAfter(fragment.lastChild || range.endContainer);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleInput();
    }
  }, [handleInput]);

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

  // Calcular líneas del cuaderno - El line-height debe coincidir EXACTAMENTE con el espaciado de las líneas
  const fontSizeNum = parseFloat(fontSize) || 16;
  const lineHeightMultiplier = 1.8; // Multiplicador para el line-height
  const lineHeight = fontSizeNum * lineHeightMultiplier; // Altura de línea exacta (ej: 16 * 1.8 = 28.8px)

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
        
        {/* Selector de fuente */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowFontMenu(!showFontMenu);
              setShowColorMenu(false);
              setShowHighlightMenu(false);
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
        {/* Líneas horizontales del cuaderno - Solo azules/grises */}
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
            backgroundPosition: '16px 32px',
            backgroundSize: `calc(100% - 32px) ${lineHeight}px`,
                backgroundRepeat: 'repeat-y',
              }}
            />
        
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
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
              isUserTypingRef.current = false;
            }
          }}
          onClick={() => {
            if (showFontMenu || showColorMenu || showHighlightMenu) {
            setTimeout(() => {
              const activeElement = document.activeElement;
                if (!activeElement || !(activeElement as HTMLElement).closest('.menu-dropdown-container')) {
                setShowFontMenu(false);
                  setShowColorMenu(false);
                  setShowHighlightMenu(false);
              }
            }, 100);
            }
          }}
          className="px-16 py-8 focus:outline-none text-gray-900 relative z-10"
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
          line-height: ${lineHeight}px !important;
          min-height: ${lineHeight}px;
        }
        [contenteditable] p:first-child {
          margin-top: 0;
        }
        [contenteditable] p:last-child {
          margin-bottom: 0;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin: ${lineHeight}px 0;
          padding-left: 2em;
        }
        [contenteditable] li {
          margin: 0;
          padding: 0;
          line-height: ${lineHeight}px !important;
          min-height: ${lineHeight}px;
        }
        [contenteditable] pre {
          background: #f4f4f4;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          margin: 12px 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        [contenteditable] code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        [contenteditable] pre code {
          background: transparent;
          padding: 0;
          border-radius: 0;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #ddd;
          padding-left: 16px;
          margin: ${lineHeight}px 0;
          color: #666;
          font-style: italic;
          line-height: ${lineHeight}px !important;
        }
        [contenteditable] blockquote p {
          margin: 0;
          line-height: ${lineHeight}px !important;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: 600;
          margin: ${lineHeight * 2}px 0 ${lineHeight}px 0;
          line-height: ${lineHeight * 2}px !important;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: ${lineHeight * 1.5}px 0 ${lineHeight}px 0;
          line-height: ${lineHeight * 1.5}px !important;
        }
        [contenteditable] h3 {
          font-size: 1.2em;
          font-weight: 600;
          margin: ${lineHeight}px 0 ${lineHeight}px 0;
          line-height: ${lineHeight}px !important;
        }
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }
        [contenteditable] strong {
          font-weight: 600;
        }
        [contenteditable] em {
          font-style: italic;
          line-height: ${lineHeight}px !important;
        }
        [contenteditable] * {
          line-height: ${lineHeight}px !important;
        }
        [contenteditable] pre {
          line-height: ${lineHeight}px !important;
        }
        [contenteditable] code {
          line-height: ${lineHeight}px !important;
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
