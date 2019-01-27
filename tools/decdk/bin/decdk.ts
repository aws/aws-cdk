import jsiiReflect = require('jsii-reflect');
import { ConstructAndProps, resourceSchema } from '../lib/cfnschema';
import { extendsType, isSerializableTypeReference } from '../lib/jsii2schema';
import { loadTypeSystem } from '../lib/type-system';

// tslint:disable:no-console

async function main() {
  const typeSystem = await loadTypeSystem();

  // Find all constructs for which the props interface
  // (transitively) only consists of JSON primitives or interfaces
  // that consist of JSON primitives
  const constructType = typeSystem.findClass('@aws-cdk/cdk.Construct');
  const constructs = typeSystem.classes.filter(c => extendsType(c, constructType));

  const deconstructs = constructs
    .map(unpackConstruct)
    .filter(c => c && !isCfnResource(c.constructClass)) // filter out L1s
    .filter(c => {
      if (!c) { return false; }

      if (!isSerializableTypeReference(c.propsTypeRef)) {
        console.error();
        console.error(`WARNING: construct ${c.constructClass.fqn} is not serializable`);
        isSerializableTypeReference(c.propsTypeRef, '    > ');
        return false;
      }
      
      return true;
    }) as ConstructAndProps[];

  const baseSchema = require('../cloudformation.schema.json');

  for (const deco of deconstructs) {
    const resource = resourceSchema(deco);
    baseSchema.properties.Resources.patternProperties["^[a-zA-Z0-9]+$"].anyOf.push(resource);
  }

  baseSchema.properties.$schema = {
    type: 'string'
  };

  process.stdout.write(JSON.stringify(baseSchema, undefined, 2));
}

function isCfnResource(klass: jsiiReflect.ClassType) {
  const resource = klass.system.findClass('@aws-cdk/cdk.Resource');
  return extendsType(klass, resource);
}

function unpackConstruct(klass: jsiiReflect.ClassType): ConstructAndProps | undefined {

  if (!klass.initializer || klass.abstract) { return undefined; }
  if (klass.initializer.parameters.length < 3) { return undefined; }

  const propsParam = klass.initializer.parameters[2];
  if (propsParam.type.fqn === undefined) { return undefined; }

  return {
    constructClass: klass,
    propsTypeRef: klass.initializer.parameters[2].type
  };
}

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});