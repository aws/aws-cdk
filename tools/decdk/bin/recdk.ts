import cdk = require('@aws-cdk/cdk');
import fs = require('fs-extra');
import reflect = require('jsii-reflect');
import path = require('path');
import YAML = require('yaml');
import { isCfnResource } from '../lib/cfnschema';
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
      throw new Error(`{ Ref } is not supported, use { Fn::GetAtt }`);
    }

    const getAtt = value['Fn::GetAtt'];
    if (getAtt) {
      const [ id, attribute ] = getAtt;
      const res = stack.node.tryFindChild(id);
      if (!res) {
        throw new Error(`Unable to find a resource ${id}`);
      }

      return (res as any)[attribute];
    }

    if (fn.startsWith('Fn::')) {
      throw new Error(`Unsupported intrinsic function ${fn}`);
    }
  }

  // deserialize maps
  if (typeRef.mapOfType) {
    if (typeof(value) !== 'object') {
      throw new Error(`Expecting object for ${key} in ${typeRef}`);
    }

    const out: any = { };
    for (const [ k, v ] of Object.entries(value)) {
      out[k] = deserializeValue(stack, typeRef.mapOfType, `${key}.${k}`, v);
    }

    return out;
  }

  if (typeRef.unionOfTypes) {
    for (const x of typeRef.unionOfTypes) {
      try {
        return deserializeValue(stack, x, key, value);
      } catch (e) {
        continue;
      }
    }

    throw new Error(`Failed to deserialize union`);
  }

  // if this is an interface, deserialize each property
  if (typeRef.fqn instanceof reflect.InterfaceType) {
    const out: any = { };
    for (const prop of typeRef.fqn.getProperties(true)) {
      const propValue = value[prop.name];
      if (!propValue) {
        if (!prop.type.optional) {
          throw new Error(`Missing required property ${key}.${prop.name} in ${typeRef}`);
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