import cdk = require('@aws-cdk/cdk');
import fs = require('fs-extra');
import reflect = require('jsii-reflect');
import path = require('path');
import YAML = require('yaml');
import { isCfnResource } from '../lib/cfnschema';
import { isConstructReference } from '../lib/jsii2schema';
import { loadTypeSystem } from '../lib/type-system';

// tslint:disable:no-console

async function main() {
  const args = require('yargs')
    .usage('$0 <filename>', 'Hydrate a deconstruct file', (yargs: any) => {
      yargs.positional('filename', { type: 'string', required: true });
    })
    .parse();

  const typeSystem = await loadTypeSystem();

  const str = await fs.readFile(args.filename!, { encoding: 'utf-8' });
  const template = YAML.parse(str, { schema: 'yaml-1.1' });

  const filenameWithoutExtension = path.parse(args.filename!).name.replace('.', '-');

  // Create App and Stack to root replaced constructs under:w
  const app = new cdk.App();
  const stack = new cdk.Stack(app, filenameWithoutExtension);

  // Replace every resource that starts with CDK::
  for (const [logicalId, resourceProps] of Object.entries(template.Resources || {})) {
    const rprops: any = resourceProps;
    if (!rprops.Type) {
      throw new Error('Resource is missing type: ' + JSON.stringify(resourceProps));
    }

    if (isCfnResource(rprops.Type)) {
      continue;
    }

    const typeInfo = typeSystem.findFqn(rprops.Type + 'Props');
    const typeRef = new reflect.TypeReference(typeSystem, typeInfo);
    const Ctor = resolveType(rprops.Type);
    new Ctor(stack, logicalId, deserializeValue(stack, typeRef, 'Properties', rprops.Properties || { }));
    delete template.Resources[logicalId];
  }

  delete template.$schema;

  // Add an Include construct with what's left of the template
  new cdk.Include(stack, 'Include', { template });

  // replace all "Fn::GetAtt" with tokens that resolve correctly both for
  // constructs and raw resources.
  processReferences(stack);

  app.run();
}

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});

function resolveType(fqn: string) {
  const [ mod, ...className ] = fqn.split('.');
  const module = require(mod);
  return module[className.join('.')];
}

function deserializeValue(stack: cdk.Stack, typeRef: reflect.TypeReference, key: string, value: any): any {
  // console.error('====== deserializer ===================');
  // console.error(`type: ${typeRef}`);
  // console.error(`value: ${JSON.stringify(value, undefined, 2)}`);
  // console.error('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`');

  if (value === undefined) {
    if (typeRef.optional) {
      return undefined;
    }

    throw new Error(`Missing required value for ${key} in ${typeRef}`);
  }

  // deserialize arrays
  if (typeRef.arrayOfType) {
    if (!Array.isArray(value)) {
      throw new Error(`Expecting array for ${key} in ${typeRef}`);
    }

    return value.map((x, i) => deserializeValue(stack, typeRef.arrayOfType!, `${key}[${i}]`, x));
  }

  // resolve references
  if (typeof(value) === 'object' && Object.keys(value).length === 1) {
    const fn = Object.keys(value)[0];

    if (fn === 'Ref') {
      if (isConstructReference(typeRef)) {
        return deconstructRef(stack, value.Ref);
      }

      throw new Error(`{ Ref } is not supported, use { Fn::GetAtt }`);
    }

    const getAtt = value['Fn::GetAtt'];
    if (getAtt) {
      // we only support strings at the moment since we are returning a stringied token.
      if (typeRef.primitive !== 'string') {
        throw new Error(`Fn::GetAtt can only be used for string primitives and ${key} is ${typeRef}`);
      }

      const [ id, attribute ] = getAtt;

      // return a lazy value, so we only try to find after all constructs
      // have been added to the stack.
      return deconstructGetAtt(stack, id, attribute);
    }

    if (fn.startsWith('Fn::')) {
      throw new Error(`Unsupported intrinsic function ${fn}`);
    }
  }

  // deserialize maps
  if (typeRef.mapOfType) {
    if (typeof(value) !== 'object') {
      throw new ValidationError(`Expecting object for ${key} in ${typeRef}`);
    }

    const out: any = { };
    for (const [ k, v ] of Object.entries(value)) {
      out[k] = deserializeValue(stack, typeRef.mapOfType, `${key}.${k}`, v);
    }

    return out;
  }

  if (typeRef.unionOfTypes) {
    const errors = new Array<any>();
    for (const x of typeRef.unionOfTypes) {
      try {
        return deserializeValue(stack, x, key, value);
      } catch (e) {
        if (!(e instanceof ValidationError)) {
          throw e;
        }
        errors.push(e);
        continue;
      }
    }

    throw new ValidationError(`Failed to deserialize union. Errors: \n  ${errors.map(e => e.message).join('\n  ')}`);
  }

  // if this is an interface, deserialize each property
  if (typeRef.fqn instanceof reflect.InterfaceType) {
    const out: any = { };
    for (const prop of typeRef.fqn.getProperties(true)) {
      const propValue = value[prop.name];
      if (!propValue) {
        if (!prop.type.optional) {
          throw new ValidationError(`Missing required property ${key}.${prop.name} in ${typeRef}`);
        }
        continue;
      }

      out[prop.name] = deserializeValue(stack, prop.type, `${key}.${prop.name}`, propValue);
    }

    return out;
  }

  // if this is an enum type, use the name to dereference
  if (typeRef.fqn instanceof reflect.EnumType) {
    const enumType = resolveType(typeRef.fqn.fqn);
    return enumType[value];
  }

  // primitives
  return value;
}

/**
 * Returns a lazy string that includes a deconstructed Fn::GetAt to a certain
 * resource or construct.
 *
 * If `id` points to a CDK construct, the resolved value will be the value returned by
 * the property `attribute`. If `id` points to a "raw" resource, the resolved value will be
 * an `Fn::GetAtt`.
 */
function deconstructGetAtt(stack: cdk.Stack, id: string, attribute: string) {
  new cdk.Token(() => {
    const res = stack.node.tryFindChild(id);
    if (!res) {
      const include = stack.node.tryFindChild('Include') as cdk.Include;
      if (!include) {
        throw new Error(`Unexpected - "Include" should be in the stack at this point`);
      }

      const raw = (include.template as any).Resources[id];
      if (!raw) {
        throw new Error(`Unable to find a resource ${id}`);
      }

      // just leak
      return { "Fn::GetAtt": [ id, attribute ] };
    }
    return (res as any)[attribute];
  }).toString();
}

function deconstructRef(stack: cdk.Stack, id: string) {
  const child = stack.node.tryFindChild(id);
  if (!child) {
    throw new Error(`Construct with ID ${id} not found (it must be defined before it is referenced)`);
  }
  return child;
}

function processReferences(stack: cdk.Stack) {
  const include = stack.node.findChild('Include') as cdk.Include;
  if (!include) {
    throw new Error('Unexpected');
  }

  process(include.template as any);

  function process(value: any): any {
    if (typeof(value) === 'object' && Object.keys(value).length === 1 && Object.keys(value)[0] === 'Fn::GetAtt') {
      const [ id, attribute ] = value['Fn::GetAtt'];
      return deconstructGetAtt(stack, id, attribute);
    }

    if (Array.isArray(value)) {
      return value.map(x => process(x));
    }

    if (typeof(value) === 'object') {
      for (const [ k, v ] of Object.entries(value)) {
        value[k] = process(v);
      }
      return value;
    }

    return value;
  }
}

class ValidationError extends Error { }