import { Stack } from '@aws-cdk/core';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

export interface Content {
  readonly text: string;
  readonly markers: Record<string, any>;
}

/**
 * Renders the given string data as deployable content with markers substituted
 * for all "Ref" and "Fn::GetAtt" objects.
 *
 * @param scope Construct scope
 * @param data The input data
 * @returns The markered text (`text`) and a map that maps marker names to their
 * values (`markers`).
 */
export function renderData(scope: Construct, data: string): Content {
  const obj = Stack.of(scope).resolve(data);
  if (typeof(obj) === 'string') {
    return { text: obj, markers: {} };
  }

  if (typeof(obj) !== 'object') {
    throw new Error(`Unexpected: after resolve() data must either be a string or a CloudFormation intrinsic. Got: ${JSON.stringify(obj)}`);
  }

  let markerIndex = 0;
  const markers: Record<string, FnJoinPart> = {};
  const result = new Array<string>();
  const fnJoin: FnJoin | undefined = obj['Fn::Join'];

  if (fnJoin) {
    const sep = fnJoin[0];
    const parts = fnJoin[1];

    if (sep !== '') {
      throw new Error(`Unexpected "Fn::Join", expecting separator to be an empty string but got "${sep}"`);
    }

    for (const part of parts) {
      if (typeof (part) === 'string') {
        result.push(part);
        continue;
      }

      if (typeof (part) === 'object') {
        addMarker(part);
        continue;
      }

      throw new Error(`Unexpected "Fn::Join" part, expecting string or object but got ${typeof (part)}`);
    }

  } else if (obj.Ref || obj['Fn::GetAtt']) {
    addMarker(obj);
  } else {
    throw new Error('Unexpected: Expecting `resolve()` to return "Fn::Join", "Ref" or "Fn::GetAtt"');
  }

  function addMarker(part: Ref | GetAtt) {
    const keys = Object.keys(part);
    if (keys.length !== 1 || (keys[0] != 'Ref' && keys[0] != 'Fn::GetAtt')) {
      throw new Error(`Invalid CloudFormation reference. "Ref" or "Fn::GetAtt". Got ${JSON.stringify(part)}`);
    }

    const marker = `<<marker:0xbaba:${markerIndex++}>>`;
    result.push(marker);
    markers[marker] = part;
  }

  return { text: result.join(''), markers };
}

type FnJoin = [string, FnJoinPart[]];
type FnJoinPart = string | Ref | GetAtt;
type Ref = { Ref: string };
type GetAtt = { 'Fn::GetAtt': [string, string] };