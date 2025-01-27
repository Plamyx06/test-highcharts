export function sortSeries(series) {
  return series.sort((a, b) => {
    const sumA = a.data.reduce((sum, value) => sum + value, 0);
    const sumB = b.data.reduce((sum, value) => sum + value, 0);
    return sumB - sumA;
  });
}

export function convertToTWh(value) {
  return Math.round((value / 1_000_000) * 100) / 100;
}
