export function renderEnvironmentVariables(vars: { [name: string]: string }) {
  return Object.entries(vars).map(([name, value]) => ({ name, value }));
}
