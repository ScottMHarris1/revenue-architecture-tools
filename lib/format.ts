export function formatMoney(v: number) {
  return `$${Math.round(v).toLocaleString()}`;
}

export function formatRatio(v: number) {
  return `${v.toFixed(1)}:1`;
}

export function formatROAS(v: number) {
  return `${v.toFixed(2)}x`;
}
