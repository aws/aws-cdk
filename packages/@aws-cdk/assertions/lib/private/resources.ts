import { AbsentMatch } from './matchers/absent';
import { formatAllMismatches, matchSection, formatSectionMatchFailure } from './section';
import { Resource, Template } from './template';
import { Match, Matcher } from '..';

export function findResources(template: Template, type: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section = template.Resources ?? {};
  const result = matchSection(filterType(section, type), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function allResources(template: Template, type: string, props: any): string | void {
  const section = template.Resources ?? {};
  const result = matchSection(filterType(section, type), props);
  if (result.match) {
    const matchCount = Object.keys(result.matches).length;
    if (result.analyzedCount > matchCount) {
      return [
        `Template has ${result.analyzedCount} resource(s) with type ${type}, but only ${matchCount} match as expected.`,
        formatAllMismatches(result.analyzed, result.matches),
      ].join('\n');
    }
  } else {
    return [
      `Template has ${result.analyzedCount} resource(s) with type ${type}, but none match as expected.`,
      formatAllMismatches(result.analyzed),
    ].join('\n');
  }
}

export function allResourcesProperties(template: Template, type: string, props: any): string | void {
  let amended = template;

  // special case to exclude AbsentMatch because adding an empty Properties object will affect its evaluation.
  if (!Matcher.isMatcher(props) || !(props instanceof AbsentMatch)) {
    // amended needs to be a deep copy to avoid modifying the template.
    amended = JSON.parse(JSON.stringify(template));
    amended = addEmptyProperties(amended);
  }

  return allResources(amended, type, Match.objectLike({
    Properties: props,
  }));

}


export function hasResource(template: Template, type: string, props: any): string | void {
  const section = template.Resources ?? {};
  const result = matchSection(filterType(section, type), props);
  if (result.match) {
    return;
  }

  return formatSectionMatchFailure(`resources with type ${type}`, result);
}

export function hasResourceProperties(template: Template, type: string, props: any): string | void {
  let amended = template;

  // special case to exclude AbsentMatch because adding an empty Properties object will affect its evaluation.
  if (!Matcher.isMatcher(props) || !(props instanceof AbsentMatch)) {
    // amended needs to be a deep copy to avoid modifying the template.
    amended = JSON.parse(JSON.stringify(template));
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

export function countResourcesProperties(template: Template, type: string, props: any): number {
  let amended = template;

  // special case to exclude AbsentMatch because adding an empty Properties object will affect its evaluation.
  if (!Matcher.isMatcher(props) || !(props instanceof AbsentMatch)) {
    // amended needs to be a deep copy to avoid modifying the template.
    amended = JSON.parse(JSON.stringify(template));
    amended = addEmptyProperties(amended);
  }

  const section = amended.Resources ?? {};
  const result = matchSection(filterType(section, type), Match.objectLike({
    Properties: props,
  }));

  if (result.match) {
    return Object.keys(result.matches).length;
  }
  return 0;
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