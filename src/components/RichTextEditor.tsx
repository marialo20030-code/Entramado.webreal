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
  Image,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Separator,
  Strikethrough,
  Indent,
  Outdent,
  AlignJustify,
  Columns,
  Layout,
  Sparkles,
  Square,
  Table,
  Link as LinkIcon,
  Maximize2,
  MinusCircle,
  PlusCircle,
  GripVertical
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

const HEADING_OPTIONS = [
  { level: 1, label: 'Título 1', size: '2.5em' },
  { level: 2, label: 'Título 2', size: '2em' },
  { level: 3, label: 'Título 3', size: '1.5em' },
  { level: 4, label: 'Título 4', size: '1.25em' },
  { level: 5, label: 'Título 5', size: '1.1em' },
  { level: 6, label: 'Título 6', size: '1em' },
];

const SPACING_OPTIONS = [
  { value: '0', label: 'Sin espacio' },
  { value: '0.5', label: 'Muy pequeño (0.5em)' },
  { value: '1', label: 'Pequeño (1em)' },
  { value: '1.5', label: 'Mediano (1.5em)' },
  { value: '2', label: 'Grande (2em)' },
  { value: '3', label: 'Muy grande (3em)' },
];

const DIVIDER_STYLES = [
  { name: 'Línea simple', html: '<hr style="margin: 1.5em 0; border: none; border-top: 1px solid #e5e7eb;">' },
  { name: 'Línea gruesa', html: '<hr style="margin: 1.5em 0; border: none; border-top: 3px solid #d1d5db;">' },
  { name: 'Línea punteada', html: '<hr style="margin: 1.5em 0; border: none; border-top: 2px dashed #d1d5db;">' },
  { name: 'Línea con espacio', html: '<div style="margin: 2em 0; text-align: center;"><hr style="border: none; border-top: 1px solid #e5e7eb; width: 50%;"></div>' },
  { name: 'Ornamento', html: '<div style="margin: 2em 0; text-align: center; color: #9ca3af;">❦</div>' },
];

const BLOCK_STYLES = [
  { name: 'Cita destacada', html: '<div style="padding: 20px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-left: 4px solid #6366f1; border-radius: 6px; margin: 1.5em 0; font-style: italic; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"><p style="margin: 0;"></p></div>' },
  { name: 'Callout - Info', html: '<div style="padding: 16px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px; margin: 1em 0;"><strong style="color: #1e40af;">ℹ️ Info:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Callout - Éxito', html: '<div style="padding: 16px; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px; margin: 1em 0;"><strong style="color: #065f46;">✓ Éxito:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Callout - Advertencia', html: '<div style="padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 1em 0;"><strong style="color: #92400e;">⚠️ Advertencia:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Callout - Error', html: '<div style="padding: 16px; background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px; margin: 1em 0;"><strong style="color: #991b1b;">❌ Error:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Nota destacada', html: '<div style="padding: 20px; background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; margin: 1em 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><p style="margin: 0;"></p></div>' },
  { name: 'Caja de código', html: '<div style="padding: 16px; background-color: #1e293b; color: #e2e8f0; border-radius: 6px; margin: 1em 0; font-family: monospace; overflow-x: auto;"><pre style="margin: 0;"><code style="color: inherit;"></code></pre></div>' },
  { name: 'Bloque de definición', html: '<div style="padding: 16px; background-color: #fefcf8; border: 1px solid #e5e7eb; border-radius: 6px; margin: 1em 0;"><p style="margin: 0; font-weight: 600; color: #374151; margin-bottom: 8px;">Término</p><p style="margin: 0; color: #6b7280;"></p></div>' },
  { name: 'Tarjeta con sombra', html: '<div style="padding: 24px; background-color: white; border-radius: 8px; margin: 1.5em 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;"><p style="margin: 0;"></p></div>' },
];

const COLUMN_LAYOUTS = [
  { name: '2 Columnas', cols: 2, icon: Columns },
  { name: '3 Columnas', cols: 3, icon: Columns },
  { name: '4 Columnas', cols: 4, icon: Columns },
  { name: '2/3 - 1/3', cols: [2, 1], icon: Layout },
  { name: '1/3 - 2/3', cols: [1, 2], icon: Layout },
];

const FONT_SIZES = [
  { label: '10px', value: '10px' },
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' },
  { label: '64px', value: '64px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
  { label: '32px', value: '32px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' },
];

const LINE_HEIGHT_OPTIONS = [
  { label: 'Compacto (1.2)', value: '1.2' },
  { label: 'Normal (1.5)', value: '1.5' },
  { label: 'Relajado (1.8)', value: '1.8' },
  { label: 'Espacioso (2.0)', value: '2.0' },
  { label: 'Muy espacioso (2.5)', value: '2.5' },
];

const CONTENT_WIDTH_OPTIONS = [
  { label: 'Narrow (60%)', value: '60%' },
  { label: 'Medium (80%)', value: '80%' },
  { label: 'Wide (100%)', value: '100%' },
];

const BLOCK_STYLES = [
  { name: 'Callout - Info', html: '<div style="padding: 16px; background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px; margin: 1em 0;"><strong>ℹ️ Información:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Callout - Advertencia', html: '<div style="padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 1em 0;"><strong>⚠️ Advertencia:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Callout - Éxito', html: '<div style="padding: 16px; background-color: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px; margin: 1em 0;"><strong>✅ Éxito:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Callout - Error', html: '<div style="padding: 16px; background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px; margin: 1em 0;"><strong>❌ Error:</strong><p style="margin: 8px 0 0 0;"></p></div>' },
  { name: 'Nota destacada', html: '<div style="padding: 20px; background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; margin: 1em 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"><p style="margin: 0;"></p></div>' },
  { name: 'Caja de código', html: '<div style="padding: 16px; background-color: #1e293b; color: #e2e8f0; border-radius: 6px; margin: 1em 0; font-family: monospace; overflow-x: auto;"><pre style="margin: 0;"><code style="color: inherit;"></code></pre></div>' },
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
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showLineHeightMenu, setShowLineHeightMenu] = useState(false);
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showDividerMenu, setShowDividerMenu] = useState(false);
  const [showSpecialBlockMenu, setShowSpecialBlockMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentFont, setCurrentFont] = useState(fontFamily);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);

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

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const heading = document.createElement(`h${level}`);
      if (range.collapsed) {
        heading.innerHTML = '<br>';
      } else {
        heading.innerHTML = range.toString();
        range.deleteContents();
      }
      range.insertNode(heading);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(heading);
      newRange.collapse(false);
      selection.addRange(newRange);
      handleInput();
    }
  };

  const insertBlockquote = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const blockquote = document.createElement('blockquote');
      if (range.collapsed) {
        blockquote.innerHTML = '<p><br></p>';
      } else {
        const contents = range.extractContents();
        blockquote.appendChild(contents);
      }
      range.insertNode(blockquote);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(blockquote);
      newRange.collapse(false);
      selection.addRange(newRange);
      handleInput();
    }
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const code = document.createElement('code');
      if (range.collapsed) {
        code.innerHTML = 'código';
      } else {
        code.innerHTML = range.toString();
        range.deleteContents();
      }
      range.insertNode(code);
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(code);
      newRange.collapse(false);
      selection.addRange(newRange);
      handleInput();
    }
  };

  const insertBlockStyle = (html: string) => {
    insertHTML(html);
    handleInput();
  };

  const applySpacing = (spacing: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let element = range.commonAncestorContainer as HTMLElement;
      if (element.nodeType !== Node.ELEMENT_NODE) {
        element = element.parentElement as HTMLElement;
      }
      
      // Buscar el párrafo o elemento contenedor
      while (element && element !== editorRef.current && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
        element = element.parentElement as HTMLElement;
      }
      
      if (element && element !== editorRef.current) {
        element.style.marginTop = `${spacing}em`;
        element.style.marginBottom = `${spacing}em`;
        handleInput();
      }
    }
  };

  const indentText = () => {
    execCommand('indent');
    handleInput();
  };

  const outdentText = () => {
    execCommand('outdent');
    handleInput();
  };

  const justifyText = () => {
    execCommand('justifyFull');
    handleInput();
  };

  const insertDivider = (dividerStyle?: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = dividerStyle || DIVIDER_STYLES[0].html;
      const divider = tempDiv.firstElementChild as HTMLElement;
      
      range.insertNode(divider);
      
      const newRange = document.createRange();
      newRange.setStartAfter(divider);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      handleInput();
    }
  };

  const insertSpecialBlock = (blockHtml: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blockHtml;
      const block = tempDiv.firstElementChild as HTMLElement;
      
      range.insertNode(block);
      
      // Colocar cursor dentro del bloque
      const newRange = document.createRange();
      const pElement = block.querySelector('p');
      if (pElement) {
        newRange.selectNodeContents(pElement);
        newRange.collapse(false);
      } else {
        newRange.selectNodeContents(block);
        newRange.collapse(false);
      }
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      handleInput();
    }
  };

  const insertColumnLayout = (layout: { cols: number | number[] }) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const container = document.createElement('div');
    container.style.margin = '1.5em 0';
    
    if (Array.isArray(layout.cols)) {
      // Layout asimétrico
      const total = layout.cols.reduce((a, b) => a + b, 0);
      container.style.display = 'grid';
      container.style.gridTemplateColumns = layout.cols.map(c => `${(c / total) * 100}%`).join(' ');
      container.style.gap = '16px';
      
      layout.cols.forEach(() => {
        const col = document.createElement('div');
        col.innerHTML = '<p><br></p>';
        container.appendChild(col);
      });
    } else {
      // Layout simétrico
      container.style.display = 'grid';
      container.style.gridTemplateColumns = `repeat(${layout.cols}, 1fr)`;
      container.style.gap = '16px';
      
      for (let i = 0; i < layout.cols; i++) {
        const col = document.createElement('div');
        col.innerHTML = '<p><br></p>';
        container.appendChild(col);
      }
    }
    
    range.insertNode(container);
    const newRange = document.createRange();
    newRange.selectNodeContents(container.children[0]);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
    handleInput();
  };

  const insertSuperscript = () => {
    execCommand('superscript');
    handleInput();
  };

  const insertSubscript = () => {
    execCommand('subscript');
    handleInput();
  };

  // Funciones avanzadas de formato
  const applyFontSize = (size: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      try {
        document.execCommand('fontSize', false, '7'); // Valor base
        const fontElements = editorRef.current?.querySelectorAll('font[size="7"]');
        fontElements?.forEach(el => {
          const htmlEl = el as HTMLElement;
          htmlEl.removeAttribute('size');
          htmlEl.style.fontSize = size;
        });
      } catch (e) {
        const span = document.createElement('span');
        span.style.fontSize = size;
        try {
          range.surroundContents(span);
        } catch (e2) {
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
      }
    }
    setCurrentFontSize(size);
    setShowSizeMenu(false);
    handleInput();
  };

  const applyLineHeight = (lineHeight: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer as HTMLElement;
    if (element.nodeType !== Node.ELEMENT_NODE) {
      element = element.parentElement as HTMLElement;
    }
    
    while (element && element !== editorRef.current && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'].includes(element.tagName)) {
      element = element.parentElement as HTMLElement;
    }
    
    if (element && element !== editorRef.current) {
      const fontSize = parseFloat(window.getComputedStyle(element).fontSize) || 16;
      element.style.lineHeight = `${parseFloat(lineHeight) * fontSize}px`;
      handleInput();
    }
    setShowLineHeightMenu(false);
  };

  const insertTable = (rows: number = 3, cols: number = 3) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '1em 0';
    table.style.border = '1px solid #e5e7eb';
    
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.style.border = '1px solid #e5e7eb';
        td.style.padding = '8px';
        td.style.minWidth = '50px';
        td.innerHTML = '<br>';
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    
    range.insertNode(table);
    const newRange = document.createRange();
    newRange.selectNodeContents(table.rows[0].cells[0]);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
    handleInput();
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      setLinkText(selectedText);
    } else {
      setLinkText('');
    }
    
    setLinkUrl('');
    setShowLinkMenu(true);
  };

  const confirmLink = () => {
    if (!linkUrl.trim()) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const link = document.createElement('a');
    link.href = linkUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = linkText || linkUrl;
    link.style.color = '#2563eb';
    link.style.textDecoration = 'underline';
    
    if (range.collapsed) {
      range.insertNode(link);
    } else {
      range.deleteContents();
      range.insertNode(link);
    }
    
    const newRange = document.createRange();
    newRange.selectNodeContents(link);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    setShowLinkMenu(false);
    setLinkUrl('');
    setLinkText('');
    handleInput();
  };

  const insertImage = () => {
    if (!imageUrl.trim()) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '1em auto';
    img.style.borderRadius = '4px';
    img.alt = 'Imagen insertada';
    
    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';
    wrapper.style.margin = '1em 0';
    wrapper.appendChild(img);
    
    range.insertNode(wrapper);
    const newRange = document.createRange();
    newRange.setStartAfter(wrapper);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    setShowImageMenu(false);
    setImageUrl('');
    handleInput();
  };

  const insertColumns = (cols: number = 2) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gap = '16px';
    container.style.margin = '1em 0';
    
    for (let i = 0; i < cols; i++) {
      const col = document.createElement('div');
      col.innerHTML = '<p><br></p>';
      container.appendChild(col);
    }
    
    range.insertNode(container);
    const newRange = document.createRange();
    newRange.selectNodeContents(container.children[0]);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
    handleInput();
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
          <ToolbarButton icon={Strikethrough} command="strikeThrough" title="Tachado" />
        </div>

        {/* Superíndice y Subíndice */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <button
            type="button"
            onClick={insertSuperscript}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700"
            title="Superíndice"
          >
            <span className="text-xs font-semibold">x²</span>
          </button>
          <button
            type="button"
            onClick={insertSubscript}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700"
            title="Subíndice"
          >
            <span className="text-xs font-semibold">x₂</span>
          </button>
        </div>

        {/* Encabezados */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowHeadingMenu(!showHeadingMenu);
              setShowColorMenu(false);
              setShowHighlightMenu(false);
              setShowFontMenu(false);
              setShowSpacingMenu(false);
              setShowBlockMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Encabezados"
          >
            <Heading1 size={16} />
          </button>
          <MenuDropdown isOpen={showHeadingMenu} onClose={() => setShowHeadingMenu(false)} className="w-48">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Encabezados</div>
              <div className="space-y-1">
                {HEADING_OPTIONS.map((heading) => {
                  const HeadingIcon = heading.level === 1 ? Heading1 : heading.level === 2 ? Heading2 : Heading3;
                  return (
                    <button
                      key={heading.level}
                      type="button"
                      onClick={() => {
                        insertHeading(heading.level);
                        setShowHeadingMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
                      style={{ fontSize: heading.size }}
                    >
                      <HeadingIcon size={14} />
                      <span>{heading.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </MenuDropdown>
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
              setShowHeadingMenu(false);
              setShowSpacingMenu(false);
              setShowBlockMenu(false);
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
              setShowHeadingMenu(false);
              setShowSpacingMenu(false);
              setShowBlockMenu(false);
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
              setShowHeadingMenu(false);
              setShowSpacingMenu(false);
              setShowBlockMenu(false);
              setShowSizeMenu(false);
              setShowLineHeightMenu(false);
              setShowLinkMenu(false);
              setShowTableMenu(false);
              setShowImageMenu(false);
              setShowLayoutMenu(false);
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

        {/* Divisor con opciones */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowDividerMenu(!showDividerMenu);
              setShowSpecialBlockMenu(false);
              setShowBlockMenu(false);
              setShowLayoutMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Insertar divisor"
          >
            <Minus size={16} />
          </button>
          <MenuDropdown isOpen={showDividerMenu} onClose={() => setShowDividerMenu(false)} className="w-56">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Estilo de divisor</div>
              <div className="space-y-1">
                {DIVIDER_STYLES.map((divider, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      insertDivider(divider.html);
                      setShowDividerMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded transition-colors"
                    dangerouslySetInnerHTML={{ __html: divider.name }}
                  />
                ))}
              </div>
            </div>
          </MenuDropdown>
        </div>

        {/* Bloques especiales */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowSpecialBlockMenu(!showSpecialBlockMenu);
              setShowDividerMenu(false);
              setShowBlockMenu(false);
              setShowLayoutMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Bloques especiales"
          >
            <Sparkles size={16} />
          </button>
          <MenuDropdown isOpen={showSpecialBlockMenu} onClose={() => setShowSpecialBlockMenu(false)} className="w-64 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Bloques especiales</div>
              <div className="space-y-1">
                {BLOCK_STYLES.map((block, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      insertSpecialBlock(block.html);
                      setShowSpecialBlockMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded transition-colors"
                  >
                    {block.name}
                  </button>
                ))}
              </div>
            </div>
          </MenuDropdown>
        </div>

        {/* Layouts y columnas */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowLayoutMenu(!showLayoutMenu);
              setShowDividerMenu(false);
              setShowSpecialBlockMenu(false);
              setShowBlockMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Layouts y columnas"
          >
            <Layout size={16} />
          </button>
          <MenuDropdown isOpen={showLayoutMenu} onClose={() => setShowLayoutMenu(false)} className="w-56">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Disposición</div>
              <div className="space-y-1">
                {COLUMN_LAYOUTS.map((layout, idx) => {
                  const Icon = layout.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        insertColumnLayout(layout);
                        setShowLayoutMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
                    >
                      <Icon size={14} />
                      <span>{layout.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </MenuDropdown>
        </div>

        {/* Bloques especiales */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton 
            icon={Quote} 
            title="Cita" 
            onClick={insertBlockquote}
          />
          <ToolbarButton 
            icon={Code} 
            title="Código inline" 
            onClick={insertCodeBlock}
          />
          <div className="relative menu-dropdown-container">
            <button
              type="button"
              onClick={() => {
                setShowBlockMenu(!showBlockMenu);
                setShowColorMenu(false);
                setShowHighlightMenu(false);
                setShowFontMenu(false);
                setShowSpacingMenu(false);
                setShowHeadingMenu(false);
              }}
              className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
              title="Bloques especiales"
            >
              <Sparkles size={16} />
            </button>
            <MenuDropdown isOpen={showBlockMenu} onClose={() => setShowBlockMenu(false)} className="w-56">
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Bloques especiales</div>
                <div className="space-y-1">
                  {BLOCK_STYLES.map((block, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        insertBlockStyle(block.html);
                        setShowBlockMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded transition-colors"
                    >
                      {block.name}
                    </button>
                  ))}
                </div>
              </div>
            </MenuDropdown>
          </div>
        </div>

        {/* Espaciado */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-1 relative menu-dropdown-container">
          <button
            type="button"
            onClick={() => {
              setShowSpacingMenu(!showSpacingMenu);
              setShowColorMenu(false);
              setShowHighlightMenu(false);
              setShowFontMenu(false);
              setShowBlockMenu(false);
              setShowHeadingMenu(false);
            }}
            className="p-2 rounded hover:bg-gray-300 transition-colors text-gray-700 flex items-center gap-1"
            title="Espaciado"
          >
            <Layout size={16} />
          </button>
          <MenuDropdown isOpen={showSpacingMenu} onClose={() => setShowSpacingMenu(false)} className="w-48">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Espaciado</div>
              <div className="space-y-1">
                {SPACING_OPTIONS.map((spacing) => (
                  <button
                    key={spacing.value}
                    type="button"
                    onClick={() => {
                      applySpacing(spacing.value);
                      setShowSpacingMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 rounded transition-colors"
                  >
                    {spacing.label}
                  </button>
                ))}
              </div>
            </div>
          </MenuDropdown>
        </div>

        {/* Alineación mejorada */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Alinear a la izquierda" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Centrar" />
          <ToolbarButton icon={AlignRight} command="justifyRight" title="Alinear a la derecha" />
          <ToolbarButton icon={AlignJustify} onClick={justifyText} title="Justificar" />
          <ToolbarButton icon={Indent} onClick={indentText} title="Aumentar sangría" />
          <ToolbarButton icon={Outdent} onClick={outdentText} title="Disminuir sangría" />
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
            if (showFontMenu || showColorMenu || showHighlightMenu || showHeadingMenu || showSpacingMenu || showBlockMenu) {
            setTimeout(() => {
              const activeElement = document.activeElement;
                if (!activeElement || !(activeElement as HTMLElement).closest('.menu-dropdown-container')) {
                setShowFontMenu(false);
                  setShowColorMenu(false);
                  setShowHighlightMenu(false);
                  setShowHeadingMenu(false);
                  setShowSpacingMenu(false);
                  setShowBlockMenu(false);
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
