import type { IResolvable, ITokenMapper } from '../../../core';
import { StringConcat, Token, Tokenization } from '../../../core';
import { MarkerEncoding } from '../marker-encoding';

export interface Content {
  readonly text: string;
  readonly markers: Record<string, any>;
  readonly markerEncodings: Record<string, MarkerEncoding>;
}

/**
 * Token mapper that transforms token elements into markers. This mapper saves the tokens
 * it maps so that they can be retrieved later by renderData.
 */
class TokenToMarkerMapper implements ITokenMapper {
  markers: Record<string, any>;
  markerEncodings: Record<string, MarkerEncoding>;

  constructor() {
    this.markers = {};
    this.markerEncodings = {};
  }

  mapToken(token: IResolvable) {
    const newMarker = `<<marker:0xbaba:${Object.keys(this.markers).length}>>`;

    if (MARKER_VALUE in token) {
      const hint = token as MarkerEncodingHint;
      this.markerEncodings[newMarker] = hint.encoding;
      this.markers[newMarker] = hint.wrapped;
    } else {
      this.markers[newMarker] = token;
    }

    return newMarker;
  }
}

/**
 * Renders the given string data as deployable content with markers substituted
 * for all tokens.
 *
 * @param data The input data
 * @returns The markered text (`text`) and a map that maps marker names to their
 * values (`markers`).
 */
export function renderData(data: string): Content {
  const tokenMapper = new TokenToMarkerMapper();

  // Handle empty string case explicitly to avoid StringConcat.join(undefined, undefined)
  if (data === '') {
    return {
      text: '',
      markers: {},
      markerEncodings: {},
    };
  }

  return {
    // Break down the string into its token fragments and replace each token with a marker.
    // Then rejoin the fragments with basic string concatenation.
    text: Tokenization.reverseString(data).mapTokens(tokenMapper).join(new StringConcat()),
    // Return the result markers.
    markers: tokenMapper.markers,
    markerEncodings: tokenMapper.markerEncodings,
  };
}

/**
 * Return a copy of the data structure with Tokens replaced with type-hinted versions of them.
 *
 * Replace the Tokens with new Tokens of the right type such that:
 *
 * - The type of the returned token is such that `JSON.stringify()` will put quotes where we
 *   expected them and not put quotes where we don't expect them.
 * - The Token itself can occasionally need an encoding hint to ensure it is rendered correctly
 *   by the custom resource. If that happens, we will return a special type of Token that carries the encoding hint,
 *   which `renderData()` will later recognize and handle appropriately.
 *
 * `stringEncoding` is the default encoding for strings; undefined means no special encoding is applied (and
 * the run-time encoding depends on the default). Otherwise, every string token gets an encoding applied.
 */
export function typeHintTokens(obj: any, stringEncoding: MarkerEncoding | undefined): any {
  // Straight up strings and numbers are returned as-is.
  // The Tokenized value will sit in the `JSON.stringify()` output in the right quoted
  // or unquoted spot.
  if (typeof obj === 'string') {
    return stringEncoding && Token.isUnresolved(obj)
      ? Token.asNumber(new MarkerEncodingHint(obj, stringEncoding))
      : obj;
  }

  if (typeof obj === 'number') {
    return obj;
  }

  // Any other type of unresolved token (list token, or another IResolvable), treat as an
  // unquoted full JSON value.
  if (Token.isUnresolved(obj)) {
    return Token.asNumber(new MarkerEncodingHint(obj, MarkerEncoding.JSON_VALUE));
  }

  if (Array.isArray(obj)) {
    return obj.map(v => typeHintTokens(v, stringEncoding));
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        // As JSON keys are always strings, keys are assumed to be either regular strings or string tokens.
        // Therefore, there is no need to escape it in the case that it is a list token.
        return [key, typeHintTokens(value, stringEncoding)];
      }),
    );
  }

  return obj;
}

const MARKER_VALUE = Symbol.for('@aws-cdk/aws-s3-deployment.MarkerValue');

class MarkerEncodingHint implements IResolvable {
  public readonly [MARKER_VALUE] = true;
  public readonly creationStack: string[] = [];
  constructor(public readonly wrapped: any, public readonly encoding: MarkerEncoding) {}
  public resolve() { return this.wrapped; }
  public toString() { return Token.asString(this); }
}
