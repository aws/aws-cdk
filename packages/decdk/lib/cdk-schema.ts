import colors = require('colors/safe');
import jsiiReflect = require('jsii-reflect');
import { extendsType, SchemaContext, schemaForTypeReference } from '../lib/jsii2schema';

// tslint:disable:no-console

export interface RenderSchemaOptions {
  warnings?: boolean;

  /**
   * Use colors when printing ouput.
   * @default true if tty is enabled
   */
  colors?: boolean;
}

export function renderFullSchema(typeSystem: jsiiReflect.TypeSystem, options: RenderSchemaOptions = { }) {
  if (!process.stdin.isTTY || options.colors === false) {
    colors.disable();
  }

  // Find all constructs for which the props interface
  // (transitively) only consists of JSON primitives or interfaces
  // that consist of JSON primitives
  const constructType = typeSystem.findClass('@aws-cdk/cdk.Construct');
  const constructs = typeSystem.classes.filter(c => extendsType(c, constructType));

  const deconstructs = constructs
    .map(unpackConstruct)
    .filter(c => c && !isCfnResource(c.constructClass)) as ConstructAndProps[];

  const output = require('../cloudformation.schema.json');

  const ctx = SchemaContext.root(output.definitions);

  for (const deco of deconstructs) {
    const resource = schemaForResource(deco, ctx);
    if (resource) {
      output.properties.Resources.patternProperties["^[a-zA-Z0-9]+$"].anyOf.push(resource);
    }
  }

  output.properties.$schema = {
    type: 'string'
  };

  if (options.warnings) {
    printWarnings(ctx);
  }

  return output;
}

function printWarnings(node: SchemaContext, indent = '') {
  if (!node.hasWarningsOrErrors) {
    return;
  }

  console.error(indent + node.name);

  for (const warning of node.warnings) {
    console.error(colors.yellow(indent + '  ' + warning));
  }

  for (const error of node.errors) {
    console.error(colors.red(indent + '  ' + error));
  }

  if (!node.root) {
    indent += '  ';
  }

  for (const child of node.children) {
    printWarnings(child, indent);
  }
}

export function schemaForResource(construct: ConstructAndProps, ctx: SchemaContext) {
  ctx = ctx.child('resource', construct.constructClass.fqn);

  const propsSchema = schemaForTypeReference(construct.propsTypeRef, ctx);
  if (!propsSchema) {
    return undefined;
  }

  return ctx.define(construct.constructClass.fqn, () => {
    return {
      additionalProperties: false,
      properties: {
        Properties: propsSchema,
        Type: {
          enum: [ construct.constructClass.fqn ],
          type: "string"
        }
      }
    };
  });
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

export interface ConstructAndProps {
  constructClass: jsiiReflect.ClassType;
  propsTypeRef: jsiiReflect.TypeReference;
}
