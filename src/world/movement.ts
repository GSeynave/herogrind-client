export function calculateMovementProgress(
  startTime: number,
  endTime: number,
  currentTime: number,
): number {
  return Math.min(
    Math.max((currentTime - startTime) / (endTime - startTime), 0),
    1,
  );
}

export function interpolation(
  start: number,
  end: number,
  progress: number,
): number {
  return start + (end - start) * progress;
}
