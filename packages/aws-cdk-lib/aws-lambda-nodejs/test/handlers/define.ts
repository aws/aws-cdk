export function handler() {
  return [
    process.env.KEY,
    process.env.BOOL,
    process.env.NUMBER,
    process.env.STRING,
  ];
}
