import { useState, useEffect } from 'react';

interface BlockEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function BlockEditor({ value, onChange, placeholder = 'Escribe tu contenido aquí...' }: BlockEditorProps) {
  const fontSizeNum = 16;
  const lineHeightMultiplier = 1.8;
  const lineHeight = fontSizeNum * lineHeightMultiplier;
  const [htmlValue, setHtmlValue] = useState(value || '');

  useEffect(() => {
    setHtmlValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setHtmlValue(newValue);
    // Convertir texto plano a HTML básico
    const html = newValue
      .split('\n')
      .map(line => line.trim() ? `<p>${line}</p>` : '<p><br></p>')
      .join('');
    onChange(html || '<p></p>');
  };

  // Extraer texto plano del HTML para mostrar en textarea
  const getPlainText = (html: string) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="w-full relative" style={{ minHeight: '600px' }}>
      {/* Fondo tipo cuaderno */}
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
          zIndex: 0,
        }}
      />
      
      {/* Editor de texto simple */}
      <div className="relative z-10 p-8" style={{ paddingLeft: '48px' }}>
        <textarea
          value={getPlainText(htmlValue)}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none border-none outline-none text-[#2c2416]"
          style={{
            fontSize: `${fontSizeNum}px`,
            lineHeight: `${lineHeight}px`,
            fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
            minHeight: '600px',
            width: '100%',
          }}
        />
      </div>

      {/* Placeholder visual cuando está vacío */}
      {!htmlValue && (
        <div
          className="absolute top-8 left-16 pointer-events-none text-gray-400 italic z-20"
          style={{
            fontSize: '16px',
            lineHeight: `${lineHeight}px`,
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}
