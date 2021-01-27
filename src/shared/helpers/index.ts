export * from './dateformat';

export function splice(idx: number, mms: number, arr: any[]) {
  const newArr = [...arr];
  const spliced = newArr.splice(idx, mms);
  return spliced;
}

export function flatMap(f: Function, xs: any[]) {
  return xs.reduce((r, x) => r.concat(f(x)), []);
}
