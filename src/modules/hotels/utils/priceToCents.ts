export function PriceToCents(value: string | number): number {
  if (!value) return 0;

  if (typeof value === 'number') {
    return Math.round(value * 100);
  }

  let sanitized = value.replace(/[^\d.,-]/g, '');

  const lastComma = sanitized.lastIndexOf(',');
  const lastDot = sanitized.lastIndexOf('.');

  let decimalSeparator: string = '';
  if (lastComma > lastDot) {
    decimalSeparator = ',';
  } else if (lastDot > lastComma) {
    decimalSeparator = '.';
  }

  if (decimalSeparator) {
    if (decimalSeparator === '.') {
      sanitized = sanitized.replace(/,/g, '');
    } else {
      sanitized = sanitized.replace(/\./g, '').replace(',', '.');
    }
  }

  const numberValue = parseFloat(sanitized);
  if (isNaN(numberValue)) {
    throw new Error(`Valor inválido: ${value}`);
  }

  return Math.round(numberValue * 100);
}
