let id = 0;

export function generate_id(): string {
  return `id=${id++}`;
}

export function range(min: number, max: number) {
  let distance = max - min;
  return min + Math.ceil(Math.random() * distance);
}
