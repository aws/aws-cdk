import type { IResolvable, ITokenMapper } from '../../core';
import { StringConcat, Tokenization } from '../../core';

export interface Content {
  readonly text: string;
  readonly markers: Record<string, any>;
}

/**
 * Token mapper that transforms token elements into markers. This mapper saves the tokens
 * it maps so that they can be retrieved later by renderData.
 */
class TokenToMarkerMapper implements ITokenMapper {
  markers: Record<string, any>;
  private markerCount: number;

  constructor() {
    this.markers = {};
    this.markerCount = 0;
  }

  mapToken(token: IResolvable) {
    // Derive the marker id from a running counter rather than `Object.keys(this.markers).length`.
    // The latter materializes the full key array on every call, making renderData O(n^2) in the
    // number of tokens. The counter produces identical ids in the same order.
    const newMarker = `<<marker:0xbaba:${this.markerCount++}>>`;
    this.markers[newMarker] = token.toString();
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
    };
  }

  return {
    // Break down the string into its token fragments and replace each token with a marker.
    // Then rejoin the fragments with basic string concatenation.
    text: Tokenization.reverseString(data).mapTokens(tokenMapper).join(new StringConcat()),
    // Return the result markers.
    markers: tokenMapper.markers,
  };
}
