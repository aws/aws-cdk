import { isListToken, TOKEN_MAP } from "./encoding";
import { RESOLVE_METHOD } from "./token";

/**
 * Returns true if obj is a token (i.e. has the resolve() method or is a string
 * that includes token markers), or it's a listifictaion of a Token string.
 *
 * @param obj The object to test.
 * @deprecated use `Token.unresolved`
 */
export function unresolved(obj: any): boolean {
  if (typeof(obj) === 'string') {
    return TOKEN_MAP.createStringTokenString(obj).test();
  } else if (Array.isArray(obj) && obj.length === 1) {
    return isListToken(obj[0]);
  } else {
    return obj && typeof(obj[RESOLVE_METHOD]) === 'function';
  }
}
