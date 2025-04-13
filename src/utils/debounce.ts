export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F, 
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};
