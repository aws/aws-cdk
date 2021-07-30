import { Match } from '../match';
import { Matcher, MatchResult } from '../matcher';
import { StackInspector } from '../vendored/assert';

export function findResources(inspector: StackInspector, type: string, props: any = {}): { [key: string]: any }[] {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);
  let results: { [key: string]: any }[] = [];

  eachResourceWithType(inspector, type, (resource) => {
    const result = matcher.test(resource);
    if (!result.hasFailed()) {
      results.push(resource);
    }
  });

  return results;
}

export function hasResource(inspector: StackInspector, type: string, props: any): string | void {
  const matcher = Matcher.isMatcher(props) ? props : Match.objectLike(props);
  let closestResult: MatchResult | undefined = undefined;
  let closestResource: { [key: string]: any } | undefined = undefined;
  let count: number = 0;

  let match = false;
  eachResourceWithType(inspector, type, (resource) => {
    if (match) { return; }
    count++;
    const result = matcher.test(resource);
    if (!result.hasFailed()) {
      match = true;
    }
    if (closestResult === undefined || closestResult.failCount > result.failCount) {
      closestResult = result;
      closestResource = resource;
    }
  });

  if (match) {
    return;
  }

  if (closestResult === undefined) {
    return `No resource with type ${type} found`;
  }

  if (!closestResource) {
    throw new Error('unexpected: closestResult is null');
  }

  return [
    `${count} resources with type ${type} found, but none match as expected.`,
    formatMessage(closestResult, closestResource),
  ].join('\n');
}

function eachResourceWithType(
  inspector: StackInspector,
  type: string,
  cb: (resource: {[key: string]: any}) => void): void {

  for (const logicalId of Object.keys(inspector.value.Resources ?? {})) {
    const resource: { [key: string]: any } = inspector.value.Resources[logicalId];
    if (resource.Type === type) {
      cb(resource);
    }
  }
}

function formatMessage(closestResult: MatchResult, closestResource: {}): string {
  return [
    'The closest result is:',
    reindent(JSON.stringify(closestResource, undefined, 2)),
    'with the following mismatches:',
    ...closestResult.toHumanStrings().map(s => `\t${s}`),
  ].join('\n');
}

function reindent(x: string, indent: number = 2): string {
  const pad = ' '.repeat(indent);
  return pad + x.split('\n').join(`\n${pad}`);
}