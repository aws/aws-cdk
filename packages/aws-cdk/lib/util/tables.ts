import Table = require('cli-table');

export interface RenderTableOptions {
  colWidths?: number[];
}

export function renderTable(cells: string[][], options: RenderTableOptions = {}): string {
  const head = cells.splice(0, 1)[0];

  const table = new Table({ head, style: { head: [] }, colWidths: options.colWidths });
  table.push(...cells);
  return table.toString();
}
