import { Token } from '../../core';

export interface Content {
  readonly text: string;
  readonly markers: Record<string, any>;
}

/**
 * Renders the given string data as deployable content with markers substituted
 * for all "Ref" and "Fn::GetAtt" objects.
 *
 * @param data The input data
 * @returns The markered text (`text`) and a map that maps marker names to their
 * values (`markers`).
 */
export function renderData(data: string): Content {
  return Token.isUnresolved(data) ? {
    text: '<<marker:0xbaba:0>>',
    markers: {
      '<<marker:0xbaba:0>>': data,
    },
  } : { text: data, markers: {} };
}
