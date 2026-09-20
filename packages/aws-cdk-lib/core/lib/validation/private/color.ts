/**
 * Functions for colorized output
 */

export abstract class Col {
  public static readonly RED = '31';
  public static readonly ORANGE = '38;5;208';
  public static readonly YELLOW = '33';
  public static readonly BLUE = '34';
  public static readonly BOLD = '1';
  public static readonly UNDERLINE = '4';
  public static readonly GREY = '90';
}

export abstract class Colorize {
  public static red(str: string): string {
    return Colorize.colorize(Col.RED, str);
  }

  public static orange(str: string): string {
    return Colorize.colorize(Col.ORANGE, str);
  }

  public static yellow(str: string): string {
    return Colorize.colorize(Col.YELLOW, str);
  }

  public static blue(str: string): string {
    return Colorize.colorize(Col.BLUE, str);
  }

  public static grey(str: string): string {
    return Colorize.colorize(Col.GREY, str);
  }

  public static bold(str: string): string {
    return Colorize.colorize(Col.BOLD, str);
  }

  public static underline(str: string): string {
    return Colorize.colorize(Col.UNDERLINE, str);
  }

  public static colorize(col: string, str: string): string {
    if (process.env.FORCE_COLOR === '0' || process.env.NO_COLOR || !process.stdout.isTTY || !process.stderr.isTTY) {
      return str;
    }

    return `\x1b[${col}m${str}\x1b[0m`;
  }
}
