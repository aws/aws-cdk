import { Match, Matcher } from '..';
import { AbsentMatch } from './matchers/absent';
import { formatFailure, matchSection } from './section';
import { Resource, Template } from './template';

export function findResources(template: Template, type: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section = template.Resources ?? {};
  const result = matchSection(filterType(section, type), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasResource(template: Template, type: string, props: any): string | void {
  const section = template.Resources ?? {};
  const result = matchSection(filterType(section, type), props);
  if (result.match) {
    return;
  }

  if (result.closestResult === undefined) {
    return `No resource with type ${type} found`;
  }

  return [
    `Template has ${result.analyzedCount} resources with type ${type}, but none match as expected.`,
    formatFailure(result.closestResult),
  ].join('\n');
}

export function hasResourceProperties(template: Template, type: string, props: any): string | void {
  // amended needs to be a deep copy to avoid modifying the template.
  let amended = JSON.parse(JSON.stringify(template));

  // special case to exclude AbsentMatch because adding an empty Properties object will affect its evaluation.
  if (!Matcher.isMatcher(props) || !(props instanceof AbsentMatch)) {
    amended = addEmptyProperties(amended);
  }

  return hasResource(amended, type, Match.objectLike({
    Properties: props,
  }));
}

export function countResources(template: Template, type: string): number {
  const section = template.Resources ?? {};
  const types = filterType(section, type);

  return Object.entries(types).length;
}

function addEmptyProperties(template: Template): Template {
  let section = template.Resources ?? {};

  Object.keys(section).map((key) => {
    if (!section[key].hasOwnProperty('Properties')) {
      section[key].Properties = {};
    }
  });

  return template;
}

function filterType(section: { [key: string]: Resource }, type: string): { [key: string]: Resource } {
  return Object.entries(section ?? {})
    .filter(([_, v]) => v.Type === type)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}