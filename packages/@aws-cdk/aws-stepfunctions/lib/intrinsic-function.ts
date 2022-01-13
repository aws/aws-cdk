import { isValidJsonPath } from '.';
import { JsonPathToken } from './json-path';

type arg = number | string | JsonPathToken;


export class IntrinsicFunction {
  public static readonly NULL= 'NULL';

  public static StatesForamt(fmt: string, ...args: arg[]): string {
    const quote = "'";
    const comma = ', ';
    var result: string = quote + fmt + quote + comma;
    args.forEach(arg => {
      if (typeof arg === 'number') {
        result += arg + comma;
      } else if (typeof arg === 'string') {
        if (isValidJsonPath(arg)) {
          result += arg + comma;
        } else {
          result += quote + arg + quote + comma;
        }
      }
    });
    result = result.substring(0, result.length - comma.length);
    return 'States.Format(' + result + ')';
  }

  public static StatesStringToJson(str: string): string {
    return 'States.StringToJson(\'' + str + '\')';
  }

  public static StatesJsonToString(path: string): string {
    if (!isValidJsonPath(path)) {
      throw new Error('Arg of States.JsonToString() must be a JsonPath');
    }
    return 'States.JsonToString(' + path + ')';
  }

  public static StatesArray(...args: arg[]): string {
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
