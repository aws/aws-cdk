import { StackInspector } from '../vendored/assert';
import { formatFailure, matchSection } from './section';

// Partial type for CloudFormation Resource
type Resource = {
  Type: string;
  Properties?: {};
}

export function findResources(inspector: StackInspector, type: string, props: any = {}): { [key: string]: { [key: string]: any } } {
  const section: { [key: string] : Resource } = inspector.value.Resources;
  const result = matchSection(filterType(section, type), props);

  if (!result.match) {
    return {};
  }

  return result.matches;
}

export function hasResource(inspector: StackInspector, type: string, props: any, addProperties?: boolean): string | void {
  const section: { [key: string]: Resource } = inspector.value.Resources;
  const result = matchSection(addProperties ? addEmptyProperties(filterType(section, type)) : filterType(section, type), props);

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

function addEmptyProperties(sections: { [key: string]: Resource}): { [key: string]: Resource } {
  Object.keys(sections).map((key) => {
    if (!sections[key].Properties) {
      sections[key].Properties = {};
    }
  });
  return sections;
}

function filterType(section: { [key: string]: Resource }, type: string): { [key: string]: Resource } {
  return Object.entries(section ?? {})
    .filter(([_, v]) => v.Type === type)
    .reduce((agg, [k, v]) => { return { ...agg, [k]: v }; }, {});
}