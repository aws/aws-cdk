import { istoken, resolve, Token } from '../core/tokens';
import { FnSub } from './fn';

/**
 * Jsonify a deep structure to a string while preserving tokens
 *
 * Sometimes we have JSON structures that contain CloudFormation
 * intrinsics like { Ref } and { Fn::GetAtt }, but the model requires
 * that we stringify the JSON structure and pass it into the parameter.
 *
 * Doing this makes it so that CloudFormation does not resolve the intrinsics
 * anymore, since it does not look into every string. To resolve this,
 * we stringify into a string and put placeholders in wich we substitute
 * with the resolved references using { Fn::Sub }.
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

  function rememberToken(x: Token) {
    // Get a representation of the resolved Token that we can use as a hash key.
    const reprKey = JSON.stringify(resolve(x));
    if (!(reprKey in tokenId)) {
      tokenId[reprKey] = `ref${counter}`;
      substitutionMap[tokenId[reprKey]] = x;
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
