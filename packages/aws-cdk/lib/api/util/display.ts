import * as wrapAnsi from 'wrap-ansi';

/**
 * A class representing rewritable display lines
 */
export class RewritableBlock {
  private lastHeight = 0;

  constructor(private readonly stream: NodeJS.WriteStream) {
  }

  public get width() {
    // Might get changed if the user resizes the terminal
    return this.stream.columns;
  }

  public displayLines(lines: string[]) {
    lines = terminalWrap(this.width, expandNewlines(lines));

    this.stream.write(cursorUp(this.lastHeight));
    for (const line of lines) {
      this.stream.write(cll() + line + '\n');
    }
    // Clear remainder of unwritten lines
    for (let i = 0; i < this.lastHeight - lines.length; i++) {
      this.stream.write(cll() + '\n');
    }

    // The block can only ever get bigger
    this.lastHeight = Math.max(this.lastHeight, lines.length);
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

  const ret = new Array<string>();
  for (const line of lines) {
    ret.push(...wrapAnsi(line, width - 1, {
      hard: true,
      trim: true,
      wordWrap: false,
    }).split('\n'));
  }
  return ret;
}

/**
 * Make sure there are no hidden newlines in the gin strings
 */
function expandNewlines(lines: string[]): string[] {
  const ret = new Array<string>();
  for (const line of lines) {
    ret.push(...line.split('\n'));
  }
  return ret;
}