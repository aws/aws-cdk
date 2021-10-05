import { Matcher } from '..';
import { formatFailure, matchSection } from './section';
import { Resource, Template } from './template';

export function findResources(template: Template, type: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section = template.Resources;
  const result = matchSection(filterType(section, type), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasResource(template: Template, type: string, props: any): string | void {
  const section = template.Resources;
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
  let amended = template; //JSON.parse(JSON.stringify(template));
  if (!Matcher.isMatcher(props)) {
    amended = addEmptyProperties(template);
  }
  return hasResource(amended, type, props);
}

export function countResources(template: Template, type: string): number {
  const section = template.Resources;
  const types = filterType(section, type);

  return Object.entries(types).length;
}

function addEmptyProperties(template: Template): Template {
  let resources = template.Resources;
  console.log(template);
  Object.keys(resources).map((key) => {
    if (!resources[key].hasOwnProperty('Properties')) {
      console.log('here');
      resources[key].Properties = {};
    }
  });
  console.log(template);
  return template;
}

function filterType(section: { [key: string]: Resource }, type: string): { [key: string]: Resource } {
  return Object.entries(section ?? {})
    .filter(([_, v]) => v.Type === type)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}