export default function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number,
) {
  let timer: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
