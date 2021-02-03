import * as colors from 'colors/safe';
import * as stringWidth from 'string-width';
import * as table from 'table';

/**
 * Render a two-dimensional array to a visually attractive table
 *
 * First row is considered the table header.
 */
export function formatTable(cells: string[][], columns: number | undefined): string {
  return table.table(cells, {
    border: TABLE_BORDER_CHARACTERS,
    columns: buildColumnConfig(columns !== undefined ? calculcateColumnWidths(cells, columns) : undefined),
    drawHorizontalLine: (line) => {
      // Numbering like this: [line 0] [header = row[0]] [line 1] [row 1] [line 2] [content 2] [line 3]
      return (line < 2 || line === cells.length) || lineBetween(cells[line - 1], cells[line]);
    },
  }).trimRight();
}

/**
 * Whether we should draw a line between two rows
 *
 * Draw horizontal line if 2nd column values are different.
 */
function lineBetween(rowA: string[], rowB: string[]) {
  return rowA[1] !== rowB[1];
}

function buildColumnConfig(widths: number[] | undefined): { [index: number]: table.TableColumns } | undefined {
  if (widths === undefined) { return undefined; }

  const ret: { [index: number]: table.TableColumns } = {};
  widths.forEach((width, i) => {
    ret[i] = { width };

    if (width === undefined) {
      delete ret[i].width;
    }
  });

  return ret;
}

/**
 * Calculate column widths given a terminal width
 *
 * We do this by calculating a fair share for every column. Extra width smaller
 * than the fair share is evenly distributed over all columns that exceed their
 * fair share.
 */
function calculcateColumnWidths(rows: string[][], terminalWidth: number): number[] {
  // The terminal is sometimes reported to be 0. Also if the terminal is VERY narrow,
  // just assume a reasonable minimum size.
  terminalWidth = Math.max(terminalWidth, 40);

  // use 'string-width' to not count ANSI chars as actual character width
  const columns = rows[0].map((_, i) => Math.max(...rows.map(row => stringWidth(String(row[i])))));

  // If we have no terminal width, do nothing
  const contentWidth = terminalWidth - 2 - columns.length * 3;

  // If we don't exceed the terminal width, do nothing
  if (sum(columns) <= contentWidth) { return columns; }

  const fairShare = Math.min(contentWidth / columns.length);
  const smallColumns = columns.filter(w => w < fairShare);

  let distributableWidth = contentWidth - sum(smallColumns);
  const fairDistributable = Math.floor(distributableWidth / (columns.length - smallColumns.length));

  const ret = new Array<number>();
  for (const requestedWidth of columns) {
    if (requestedWidth < fairShare) {
      // Small column gets what they want
      ret.push(requestedWidth);
    } else {
      // Last column gets all remaining, otherwise get fair redist share
      const width = distributableWidth < 2 * fairDistributable ? distributableWidth : fairDistributable;
      ret.push(width);
      distributableWidth -= width;
    }
  }

  return ret;
}

function sum(xs: number[]): number {
  let total = 0;
  for (const x of xs) {
    total += x;
  }
  return total;
}

// What color the table is going to be
const tableColor = colors.gray;

// Unicode table characters with a color
const TABLE_BORDER_CHARACTERS = {
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
  joinJoin: tableColor('┼'),
};
