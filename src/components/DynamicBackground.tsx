import { useMemo } from 'react';
import { blendColors } from '../lib/colorUtils';

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

    // Eliminar duplicados y obtener colores únicos
    const uniqueColors = Array.from(new Set(allColors));
    
    // Si hay muchos colores, mezclarlos inteligentemente
    let selectedColors: string[] = [];
    
    if (uniqueColors.length <= 6) {
      // Si hay pocos colores, usarlos todos
      selectedColors = uniqueColors;
    } else {
      // Si hay muchos colores, seleccionar los más representativos
      // Agrupar colores similares y tomar representantes
      selectedColors = selectRepresentativeColors(uniqueColors, 8);
    }

    // Mezclar colores adyacentes para transiciones más suaves
    const blendedColors = blendAdjacentColors(selectedColors);

    // Crear múltiples gradientes para un efecto más rico
    const gradientStops = blendedColors
      .map((color, i) => {
        const position = (i / (blendedColors.length - 1)) * 100;
        return `${color} ${Math.max(0, position - 2)}%`;
      })
      .join(', ');

    // Usar un gradiente radial combinado con lineal para más profundidad
    return {
      background: `
        radial-gradient(circle at 20% 50%, ${blendedColors[0]} 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, ${blendedColors[blendedColors.length - 1]} 0%, transparent 50%),
        linear-gradient(135deg, ${gradientStops})
      `,
    };
  }, [colors]);

  return (
    <div style={backgroundStyle} className="min-h-screen transition-all duration-1000 ease-in-out">
      {children}
    </div>
  );
}

function selectRepresentativeColors(colors: string[], maxColors: number): string[] {
  if (colors.length <= maxColors) return colors;

  // Convertir colores a RGB para comparación
  const rgbColors = colors.map(color => hexToRgb(color));
  
  // Seleccionar colores que estén más separados en el espacio de color
  const selected: string[] = [];
  const selectedRgb: { r: number; g: number; b: number }[] = [];
  
  // Empezar con el primer color
  selected.push(colors[0]);
  selectedRgb.push(rgbColors[0]);
  
  while (selected.length < maxColors && selected.length < colors.length) {
    let maxDistance = 0;
    let bestColor = '';
    let bestRgb = { r: 0, g: 0, b: 0 };
    
    for (let i = 0; i < colors.length; i++) {
      if (selected.includes(colors[i])) continue;
      
      // Calcular la distancia mínima a los colores ya seleccionados
      let minDist = Infinity;
      for (const selectedRgbColor of selectedRgb) {
        const dist = colorDistance(rgbColors[i], selectedRgbColor);
        minDist = Math.min(minDist, dist);
      }
      
      if (minDist > maxDistance) {
        maxDistance = minDist;
        bestColor = colors[i];
        bestRgb = rgbColors[i];
      }
    }
    
    if (bestColor) {
      selected.push(bestColor);
      selectedRgb.push(bestRgb);
    } else {
      break;
    }
  }
  
  return selected;
}

function blendAdjacentColors(colors: string[]): string[] {
  if (colors.length <= 2) return colors;
  
  const blended: string[] = [colors[0]];
  
  for (let i = 1; i < colors.length; i++) {
    // Agregar una versión mezclada entre el color anterior y el actual
    const blend = blendColors(colors[i - 1], colors[i]);
    blended.push(blend);
    blended.push(colors[i]);
  }
  
  return blended;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
  // Distancia euclidiana en el espacio RGB
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}
