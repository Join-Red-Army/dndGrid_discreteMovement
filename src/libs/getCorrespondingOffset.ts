 /**
  * Находит в массиве offsetLeft или offsetTop колонки или ряда, над которыми находится переданная координата.
  * @param point X или Y координата
  * @param coords Массив оффсетов
*/

export const getCorrespondingOffset = (point: number, coords: number[]): number => {
  const result = coords.find((num, i) => {
    if (i === 0 && point < num ) return true;

    const nextNum = coords[i + 1] ?? null;
    if (nextNum === null) return true;

    return (num <= point && point < nextNum);
  });
  return result ?? 0;
};
