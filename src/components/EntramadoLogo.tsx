import './EntramadoLogo.css';

export function EntramadoLogo() {
  const letters = 'Entramado'.split('');
  
  // Definir qué letras van por encima y cuáles por debajo para crear el entrelazado
  // Patrón: E(n)t(r)a(m)a(d)o - alternando arriba/abajo para efecto de entrelazado
  const letterPositions: { [key: number]: { zIndex: number; transform: string; hoverY: string } } = {
    0: { zIndex: 5, transform: 'translateY(-4px)', hoverY: '-6px' }, // E - arriba
    1: { zIndex: 2, transform: 'translateY(4px)', hoverY: '6px' }, // n - abajo (pasa por debajo de E)
    2: { zIndex: 6, transform: 'translateY(-3px)', hoverY: '-5px' }, // t - arriba (pasa por encima de n)
    3: { zIndex: 3, transform: 'translateY(3px)', hoverY: '5px' }, // r - abajo (pasa por debajo de t)
    4: { zIndex: 7, transform: 'translateY(-5px)', hoverY: '-7px' }, // a - arriba (pasa por encima de r)
    5: { zIndex: 1, transform: 'translateY(5px)', hoverY: '7px' }, // m - abajo (pasa por debajo de a)
    6: { zIndex: 6, transform: 'translateY(-3px)', hoverY: '-5px' }, // a - arriba (pasa por encima de m)
    7: { zIndex: 3, transform: 'translateY(3px)', hoverY: '5px' }, // d - abajo (pasa por debajo de a)
    8: { zIndex: 5, transform: 'translateY(-2px)', hoverY: '-4px' }, // o - arriba (pasa por encima de d)
  };

  return (
    <h1 className="entramado-logo">
      {letters.map((letter, index) => {
        const position = letterPositions[index] || { zIndex: 2, transform: 'translateY(0px)' };
        const isVowel = /[aeiouAEIOU]/.test(letter);
        
        return (
          <span
            key={index}
            className={`entramado-letter ${isVowel ? 'vowel' : 'consonant'}`}
            style={{
              zIndex: position.zIndex,
              transform: position.transform,
              '--letter-index': index,
              '--hover-y': position.hoverY,
            } as React.CSSProperties}
          >
            {letter}
          </span>
        );
      })}
    </h1>
  );
}

