import { isValidJsonPath } from '.';

type arg = number | string;

/**
 * Create intrinsic functions string from each args
 *
 * @see
 * https://states-language.net/spec.html#appendix-b
 */
export class IntrinsicFunction {
  /**
   * Special string value for null argument
   */
  public static readonly NULL= 'NULL';

  /**
   * Create States.Format() string from args
   */
  public static statesForamt(fmt: string, ...args: arg[]): string {
    const quote = "'";
    const comma = ', ';
    var result: string = quote + fmt + quote + comma;
    args.forEach(arg => {
      if (typeof arg === 'number') {
        result += arg + comma;
      } else if (typeof arg === 'string') {
        if (arg == this.NULL) {
          result += 'null' + comma;
        } else if (isValidJsonPath(arg)) {
          result += arg + comma;
        } else {
          result += quote + arg + quote + comma;
        }
      }
    });
    result = result.substring(0, result.length - comma.length);
    return 'States.Format(' + result + ')';
  }

  /**
   * Create States.StringToJson() string from args
   */
  public static statesStringToJson(str: string): string {
    return 'States.StringToJson(\'' + str + '\')';
  }

  /**
   * Create States.JsonToString() string from args
   */
  public static statesJsonToString(path: string): string {
    if (!isValidJsonPath(path)) {
      throw new Error('Arg of States.JsonToString() must be a JsonPath');
    }
    return 'States.JsonToString(' + path + ')';
  }

  /**
   * Create States.Array() string from an arg
   * The arg must be a JsonPath
   */
  public static statesArray(...args: arg[]): string {
    const quote = "'";
    const comma = ', ';
    var result: string = '';
    args.forEach(arg => {
      if (typeof arg === 'number') {
        result += arg + comma;
      } else if (typeof arg === 'string') {
        if (arg == this.NULL) {
          result += 'null' + comma;
        } else if (isValidJsonPath(arg)) {
          result += arg + comma;
        } else {
          result += quote + arg + quote + comma;
        }
      }
    });
    result = result.substring(0, result.length - comma.length);
    return 'States.Array(' + result + ')';
  }
}
