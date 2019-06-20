import YAML = require('yaml');

// tslint:disable-next-line: no-var-requires
const yamlTypes = require('yaml/types');

/**
 * Stringify to YAML
 */
export function toYAML(obj: any): string {
  const oldFold = yamlTypes.strOptions.fold.lineWidth;
  try {
    yamlTypes.strOptions.fold.lineWidth = 0;
    return YAML.stringify(obj, { schema: 'yaml-1.1' });
  } finally {
    yamlTypes.strOptions.fold.lineWidth = oldFold;
  }
}

/**
 * Parse YAML
 */
export function fromYAML(str: string): any {
    return YAML.parse(str, { schema: 'yaml-1.1' });
}

/**
 * Parse either YAML or JSON
 */
export function deserializeStructure(str: string) {
  try {
    return fromYAML(str);
  } catch (e) {
    // This shouldn't really ever happen I think, but it's the code we had so I'm leaving it.
    return JSON.parse(str);
  }
}

/**
 * Serialize to either YAML or JSON
 */
export function serializeStructure(object: any, json: boolean) {
  if (json) {
    return JSON.stringify(object, undefined, 2);
  } else {
    return toYAML(object);
  }
}
