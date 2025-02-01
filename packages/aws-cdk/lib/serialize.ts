import * as fs from 'fs-extra';
import { formatBytes } from './util/bytes';
import * as yaml_cfn from './util/yaml-cfn';

/**
 * Stringify to YAML
 */
export function toYAML(obj: any): string {
  return yaml_cfn.serialize(obj);
}

/**
 * Parse either YAML or JSON
 */
export function deserializeStructure(str: string): any {
  return yaml_cfn.deserialize(str);
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

/**
 * Load a YAML or JSON file from disk
 */
export async function loadStructuredFile(fileName: string) {
  const contents = await fs.readFile(fileName, { encoding: 'utf-8' });
  return deserializeStructure(contents);
}

/**
 * Remove any template elements that we don't want to show users.
 */
export function obscureTemplate(template: any = {}) {
  if (template.Rules) {
    // see https://github.com/aws/aws-cdk/issues/17942
    if (template.Rules.CheckBootstrapVersion) {
      if (Object.keys(template.Rules).length > 1) {
        delete template.Rules.CheckBootstrapVersion;
      } else {
        delete template.Rules;
      }
    }
  }

  return template;
}

/**
 * Detects a buffer that has been converted to a JSON-like object
 * In Node, `Buffer`s have `toJSON()` method that converts the buffer
 * into a JS object that can be JSON stringified.
 * Unfortunately this conversion happens before the replacer is called,
 * so normal means of detecting a `Buffer` objet don't work anymore.
 * @see https://github.com/nodejs/node-v0.x-archive/issues/5110
 */
function isJsonBuffer(value: any): value is {
  type: 'Buffer';
  data: number[];
} {
  return typeof value === 'object'
    && 'type' in value
    && value.type === 'Buffer'
    && 'data' in value
    && Array.isArray(value.data);
}

/**
 * A JSON.stringify() replacer that converts Buffers into a string with information
 * Use this if you plan to print out JSON stringified objects that may contain a Buffer.
 * Without this, large buffers (think: Megabytes) will completely fill up the output
 * and even crash the system.
 */
export function replacerBufferWithInfo(_key: any, value: any): any {
  if (isJsonBuffer(value)) {
    return `<Buffer: ${formatBytes(value.data.length)}>`;
  }
  return value;
}
