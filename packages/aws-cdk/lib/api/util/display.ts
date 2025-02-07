// namespace object imports won't work in the bundle for function exports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const wrapAnsi = require('wrap-ansi');

/**
 * A class representing rewritable display lines
 */
export class RewritableBlock {
  private lastHeight = 0;
  private trailingEmptyLines = 0;

  constructor(private readonly stream: NodeJS.WriteStream) {
  }

  public get width() {
    // Might get changed if the user resizes the terminal
    return this.stream.columns;
  }

  public get height() {
    // Might get changed if the user resizes the terminal
    return this.stream.rows;
  }

  public displayLines(lines: string[]) {
    lines = terminalWrap(this.width, expandNewlines(lines));
    lines = lines.slice(0, getMaxBlockHeight(this.height, this.lastHeight, lines));

    this.stream.write(cursorUp(this.lastHeight));
    for (const line of lines) {
      this.stream.write(cll() + line + '\n');
    }

    this.trailingEmptyLines = Math.max(0, this.lastHeight - lines.length);

    // Clear remainder of unwritten lines
    for (let i = 0; i < this.trailingEmptyLines; i++) {
      this.stream.write(cll() + '\n');
    }

    // The block can only ever get bigger
    this.lastHeight = Math.max(this.lastHeight, lines.length);
  }

  public removeEmptyLines() {
    this.stream.write(cursorUp(this.trailingEmptyLines));
  }
}

const ESC = '\u001b';

/*
 * Move cursor up `n` lines. Default is 1
 */
function cursorUp(n: number) {
  n = typeof n === 'number' ? n : 1;
  return n > 0 ? ESC + '[' + n + 'A' : '';
}

/**
 * Clear to end of line
 */
function cll() {
  return ESC + '[K';
}

function terminalWrap(width: number | undefined, lines: string[]) {
  if (width === undefined) { return lines; }

  return lines.flatMap(line => wrapAnsi(line, width - 1, {
    hard: true,
    trim: true,
    wordWrap: false,
  }).split('\n'));
}

/**
 * Make sure there are no hidden newlines in the gin strings
 */
function expandNewlines(lines: string[]): string[] {
  return lines.flatMap(line => line.split('\n'));
}

function getMaxBlockHeight(windowHeight: number | undefined, lastHeight: number, lines: string[]): number {
  if (windowHeight === undefined) { return Math.max(lines.length, lastHeight); }
  return lines.length < windowHeight ? lines.length : windowHeight - 1;
}
