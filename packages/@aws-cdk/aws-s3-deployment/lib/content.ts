import { Stack } from '@aws-cdk/core';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

export interface Content {
  readonly text: string;
  readonly markers: Record<string, any>;
}

export function renderContent(scope: Construct, content: string): Content {
  const obj = Stack.of(scope).resolve(content);
  if (typeof obj === 'string') {
    return { text: obj, markers: {} };
  }

  const markers: Record<string, FnJoinPart> = {};
  const result = new Array<string>();
  let markerIndex = 0;

  if (obj['Fn::Join']) {
    const fnJoin: FnJoin = obj['Fn::Join'];
    if (fnJoin[0] !== '') {
      throw new Error('Unexpected join, expecting separator to be ""');
    }

    for (const part of fnJoin[1]) {
      if (typeof (part) === 'string') {
        result.push(part);
        continue;
      }

      if (typeof (part) === 'object') {
        const keys: string[] = Object.keys(part);
        if (keys.length !== 1) {
          throw new Error('Invalid object');
        }
        createMarker(part);
      }
    }
  } else if (obj.Ref) {
    createMarker(obj);
  } else {
    throw new Error('Unexpected resolved value. Expecting Fn::Join or Ref');
  }

  function createMarker(part: Ref | GetAtt) {
    if ('Ref' in part || 'Fn::GetAtt' in part) {
      const marker = `<<marker:0xbaba:${markerIndex++}>>`;
      result.push(marker);
      markers[marker] = part;
    } else {
      throw new Error('Invalid object');
    }
  }

  return { text: result.join(''), markers };
}

type FnJoin = [string, FnJoinPart[]];
type FnJoinPart = string | Ref | GetAtt;
type Ref = { Ref: string };
type GetAtt = { 'Fn::GetAtt': [string, string] };