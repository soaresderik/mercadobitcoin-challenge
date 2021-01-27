export function addDays(date: Date, days: number) {
  const wrap = new Date(date);
  return new Date(wrap.setDate(wrap.getDate() + days));
}

export function subDays(date: Date, days: number) {
  return addDays(date, -days);
}

export function unixDate(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export function jsDate(unix: number) {
  return new Date(unix * 1000);
}

export function diffDays(to: Date, from: Date) {
  const oneDay = 24 * 60 * 60 * 1000;

  return Math.round(Math.abs((to.getTime() - from.getTime()) / oneDay));
}
