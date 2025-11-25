import { useMemo } from 'react';

interface DynamicBackgroundProps {
  colors: { [postId: string]: string[] };
  children: React.ReactNode;
}

export function DynamicBackground({ colors, children }: DynamicBackgroundProps) {
  const backgroundStyle = useMemo(() => {
    const allColors = Object.values(colors).flat().filter(Boolean);

    if (allColors.length === 0) {
      return {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #f0f4f8 50%, #e9f0f7 100%)',
      };
    }

    const uniqueColors = [...new Set(allColors)];
    // Usar más colores para un degradado más colorido y variado
    const selectedColors = uniqueColors.slice(0, 8);

    const gradientStops = selectedColors
      .map((color, i) => {
        const position = (i / (selectedColors.length - 1)) * 100;
        return `${color} ${position}%`;
      })
      .join(', ');

    return {
      background: `linear-gradient(135deg, ${gradientStops})`,
    };
  }, [colors]);

  return (
    <div style={backgroundStyle} className="min-h-screen transition-all duration-1000 ease-in-out">
      {children}
    </div>
  );
}
