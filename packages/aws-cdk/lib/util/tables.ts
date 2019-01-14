import colors = require('colors/safe');
import table = require('table');

export interface RenderTableOptions {
  colWidths?: number[];
}

export function renderTable(cells: string[][], options: RenderTableOptions = {}): string {
  const columns: {[col: number]: table.ColumnConfig} = {};

  if (options.colWidths) {
    options.colWidths.forEach((width, i) => {
      columns[i] = { width, useWordWrap: true } as any; // @types doesn't have this type
    });
  }

  return table.table(cells, {
    border: TABLE_BORDER_CHARACTERS,
    columns,
  }).trimRight();
}

// What color the table is going to be
const tableColor = colors.gray;

// Unicode table characters with a color
const TABLE_BORDER_CHARACTERS =  {
  topBody: tableColor('─'),
  topJoin: tableColor('┬'),
  topLeft: tableColor('┌'),
  topRight: tableColor('┐'),
  bottomBody: tableColor('─'),
  bottomJoin: tableColor('┴'),
  bottomLeft: tableColor('└'),
  bottomRight: tableColor('┘'),
  bodyLeft: tableColor('│'),
  bodyRight: tableColor('│'),
  bodyJoin: tableColor('│'),
  joinBody: tableColor('─'),
  joinLeft: tableColor('├'),
  joinRight: tableColor('┤'),
  joinJoin: tableColor('┼')
};