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
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return ['#f8f5f1', '#f5e6d3', '#e8d4c0'];

  ctx.drawImage(img, 0, 0, 100, 100);
  const imageData = ctx.getImageData(0, 0, 100, 100);
  const data = imageData.data;

  const colors: { r: number; g: number; b: number; count: number }[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    const similar = colors.find(
      (c) => Math.abs(c.r - r) < 30 && Math.abs(c.g - g) < 30 && Math.abs(c.b - b) < 30
    );

    if (similar) {
      similar.r = Math.round((similar.r + r) / 2);
      similar.g = Math.round((similar.g + g) / 2);
      similar.b = Math.round((similar.b + b) / 2);
      similar.count++;
    } else if (colors.length < 15) {
      // Aumentar el límite para extraer más colores variados
      colors.push({ r, g, b, count: 1 });
    }
  }

  return colors
    .filter((c) => !isGreyOrDark(c.r, c.g, c.b))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Extraer 5 colores en lugar de 3 para más variedad
    .map((c) => makeLighterModerate(c.r, c.g, c.b));
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
  // Mezclar 60% con blanco - muy claro pero mantiene la esencia del color
  const factor = 0.6; // 60% blanco
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
