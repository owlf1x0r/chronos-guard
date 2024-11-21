export function clearTimeInterval(interval: NodeJS.Timeout | null) {
  if (interval) {
    clearInterval(interval);
  }
}
