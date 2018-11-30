import Table = require('cli-table');

export function renderTable(cells: string[][], colWidths?: number[]): string {
  const head = cells.splice(0, 1)[0];

  const table = new Table({ head, style: { head: [] }, colWidths });
  table.push(...cells);
  return table.toString();
}
