export async function extractColorsFromImage(imageSrc: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const colors = getAverageColors(img);
      resolve(colors);
    };
    img.onerror = () => {
      resolve(['#f8f5f1', '#f5e6d3', '#e8d4c0']);
    };
    img.src = imageSrc;
  });
}

export async function extractImageAspectRatio(imageSrc: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      resolve(img.width / img.height);
    };
    img.onerror = () => {
      resolve(1);
    };
    img.src = imageSrc;
  });
}

function getAverageColors(img: HTMLImageElement): string[] {
  const canvas = document.createElement('canvas');
  // Aumentar el tamaño del canvas para mejor precisión
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return ['#f8f5f1', '#f5e6d3', '#e8d4c0'];

  ctx.drawImage(img, 0, 0, 200, 200);
  const imageData = ctx.getImageData(0, 0, 200, 200);
  const data = imageData.data;

  // Usar un mapa de colores más preciso
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();

  // Muestrear píxeles de manera más inteligente (cada 4 píxeles para mejor rendimiento)
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    // Crear una clave más precisa para agrupar colores similares
    const key = `${Math.floor(r / 20)}-${Math.floor(g / 20)}-${Math.floor(b / 20)}`;
    
    const existing = colorMap.get(key);
    if (existing) {
      existing.r = Math.round((existing.r * existing.count + r) / (existing.count + 1));
      existing.g = Math.round((existing.g * existing.count + g) / (existing.count + 1));
      existing.b = Math.round((existing.b * existing.count + b) / (existing.count + 1));
      existing.count++;
    } else {
      colorMap.set(key, { r, g, b, count: 1 });
    }
  }

  const colors = Array.from(colorMap.values());

  // Filtrar y seleccionar los mejores colores
  return colors
    .filter((c) => !isGreyOrDark(c.r, c.g, c.b))
    .filter((c) => {
      // Filtrar colores muy saturados o muy apagados
      const saturation = getSaturation(c.r, c.g, c.b);
      const brightness = (c.r + c.g + c.b) / 3;
      return saturation > 0.1 && brightness > 50 && brightness < 240;
    })
    .sort((a, b) => {
      // Priorizar colores más frecuentes y más saturados
      const satA = getSaturation(a.r, a.g, a.b);
      const satB = getSaturation(b.r, b.g, b.b);
      return (b.count * satB) - (a.count * satA);
    })
    .slice(0, 8) // Extraer hasta 8 colores para más variedad
    .map((c) => makeLighterModerate(c.r, c.g, c.b));
}

function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function isGreyOrDark(r: number, g: number, b: number): boolean {
  const isGrey = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20;
  const isDark = r < 80 && g < 80 && b < 80;
  
  // Filtrar tonos marrones (cuando r y g son similares y mayores que b)
  const isBrown = (
    Math.abs(r - g) < 40 && // r y g son similares
    r > b + 30 && // r es mayor que b
    g > b + 30 && // g es mayor que b
    r > 100 && g > 80 && b < 120 // rango de marrones
  );
  
  return isGrey || isDark || isBrown;
}

function makeLighterModerate(r: number, g: number, b: number): string {
  // Mezclar con blanco de manera más inteligente según el brillo original
  const brightness = (r + g + b) / 3;
  let factor = 0.5; // Factor base
  
  // Si el color es muy oscuro, usar más blanco
  if (brightness < 100) {
    factor = 0.7;
  } 
  // Si el color es muy claro, usar menos blanco
  else if (brightness > 200) {
    factor = 0.3;
  }
  
  const newR = Math.round(r + (255 - r) * factor);
  const newG = Math.round(g + (255 - g) * factor);
  const newB = Math.round(b + (255 - b) * factor);
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function toHex(n: number): string {
  const hex = n.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function getLighterColor(color: string): string {
  const hex = color.replace('#', '');
  const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + 60);
  const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + 60);
  const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + 60);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getDarkerColor(color: string): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - 80);
  const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - 80);
  const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - 80);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function harmonizeColors(colors: string[], count: number = 3): string[] {
  if (colors.length === 0) return ['#f8f5f1', '#f5e6d3', '#e8d4c0'];

  const result = [colors[0]];
  const variations = [
    (c: string) => getLighterColor(c),
    (c: string) => getDarkerColor(c),
  ];

  for (const variation of variations) {
    if (result.length < count && colors.length > 0) {
      result.push(variation(colors[0]));
    }
  }

  return result.slice(0, count);
}

export function blendColors(color1: string, color2: string): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r = Math.round((parseInt(hex1.slice(0, 2), 16) + parseInt(hex2.slice(0, 2), 16)) / 2);
  const g = Math.round((parseInt(hex1.slice(2, 4), 16) + parseInt(hex2.slice(2, 4), 16)) / 2);
  const b = Math.round((parseInt(hex1.slice(4, 6), 16) + parseInt(hex2.slice(4, 6), 16)) / 2);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
