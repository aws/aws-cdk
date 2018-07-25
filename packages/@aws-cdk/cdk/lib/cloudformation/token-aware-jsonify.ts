import { istoken, resolve, Token } from '../core/tokens';
import { FnSub } from './fn';

/**
 * Jsonify a deep structure to a string while preserving tokens
 *
 * Sometimes we have JSON structures that contain CloudFormation intrinsics like
 * { Ref } and { Fn::GetAtt }, but the model requires that we stringify the JSON
 * structure and pass it into the parameter.
 *
 * Doing this makes it so that CloudFormation does not resolve the intrinsics
 * anymore, since it does not look into every string. To resolve this, we
 * stringify into a string and put placeholders in wich we substitute with the
 * resolved references using { Fn::Sub }.
 *
 * Since the result is expected to be a stringified JSON, we need to make sure
 * any textual values resolved from tokens are also stringified, so we also
 * stringify any string values in resolved tokens (for example, "\n" will be
 * replaced by "\\n", quotes will be escaped, etc). This might not be needed (or
 * even could be harmful) for certain tokens (e.g. Fn::GetAtt), but we prefer to
 * make the common case fool-proof, and hope for the best.
 *
 * Will only work correctly for intrinsics that return a string value.
 */
export function tokenAwareJsonify(structure: any): any {
  // Our strategy is as follows:
  //
  // - Find all tokens, replace each of them with a string
  //   token that's highly unlikely to occur naturally.
  //   Attempt deduplication of the same intrinsic into the same
  //   string token.
  // - JSONify the entire structure.
  // - Replace things that LOOK like FnSub references
  //   with the escape string ${!NotSubstituted}.
  // - Replace the special tokens with FnSub references, ${LikeThis}.
  let counter = 0;
  const tokenId: {[key: string]: string} = {};
  const substitutionMap: {[key: string]: any} = {};

  function stringifyStrings(x: any): any {
    if (typeof(x) === 'string') {
      const jsonS = JSON.stringify(x);
      return jsonS.substr(1, jsonS.length - 2); // trim quotes
    }

    if (Array.isArray(x)) {
      return x.map(stringifyStrings);
    }

    if (typeof(x) === 'object') {
      const result: any = {};
      for (const key of Object.keys(x)) {
        result[key] = stringifyStrings(x[key]);
      }

      return result;
    }

    return x;
  }

  function rememberToken(x: Token) {
    // Get a representation of the resolved Token that we can use as a hash key.
    const resolved = resolve(x);
    const reprKey = JSON.stringify(resolved);
    if (!(reprKey in tokenId)) {
      tokenId[reprKey] = `ref${counter}`;
      substitutionMap[tokenId[reprKey]] = stringifyStrings(resolved);
      counter += 1;
    }
    return `<<<TOKEN:${tokenId[reprKey]}>>>`;
  }

  function replaceTokens(x: any): any {
    if (Array.isArray(x)) {
      return x.map(replaceTokens);
    }

    if (typeof x === 'object' && x !== null) {
      if (istoken(x)) {
        // This a token, remember and replace it.
        return rememberToken(x);
      } else {
        // Recurse into regular object
        for (const key of Object.keys(x)) {
          x[key] = replaceTokens(x[key]);
        }
        return x;
      }
    }

    return x;
  }

  structure = replaceTokens(structure);

  let stringified = JSON.stringify(structure);

  if (counter === 0) {
    // No replacements
    return stringified;
  }

  // Escape things that shouldn't be substituted
  // Translate ${Oops} -> ${!Oops}
  stringified = stringified.replace(/\$\{([^}]+)\}/g, '$${!$1}');

  // Now substitute our magic pattern with actual references
  stringified = stringified.replace(/<<<TOKEN:([^>]+)>>>/g, '$${$1}');

  return new FnSub(stringified, substitutionMap);
}
