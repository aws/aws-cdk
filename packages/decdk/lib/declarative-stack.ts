import * as cdk from '@aws-cdk/core';
import * as reflect from 'jsii-reflect';
import * as jsonschema from 'jsonschema';
import { renderFullSchema } from './cdk-schema';
import { isConstruct, isDataType, isEnumLikeClass, isSerializableInterface, SchemaContext, schemaForPolymorphic } from './jsii2schema';

export interface DeclarativeStackProps extends cdk.StackProps {
  typeSystem: reflect.TypeSystem;
  template: any;
  workingDirectory?: string;
}

export class DeclarativeStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: DeclarativeStackProps) {
    super(scope, id);

    const typeSystem = props.typeSystem;
    const template = props.template;

    const schema = renderFullSchema(typeSystem);

    const result = jsonschema.validate(template, schema);
    if (!result.valid) {
      throw new ValidationError('Schema validation errors:\n  ' + result.errors.map(e => `"${e.property}" ${e.message}`).join('\n  '));
    }

    // Replace every resource that starts with CDK::
    for (const [logicalId, resourceProps] of Object.entries(template.Resources || {})) {
      const rprops: any = resourceProps;
      if (!rprops.Type) {
        throw new Error('Resource is missing type: ' + JSON.stringify(resourceProps));
      }

      if (isCfnResourceType(rprops.Type)) {
        continue;
      }

      const typeInfo = typeSystem.findFqn(rprops.Type + 'Props');
      const typeRef = new reflect.TypeReference(typeSystem, typeInfo);
      const Ctor = resolveType(rprops.Type);

      // Changing working directory if needed, such that relative paths in the template are resolved relative to the
      // template's location, and not to the current process' CWD.
      _cwd(props.workingDirectory, () =>
        new Ctor(this, logicalId, deserializeValue(this, typeRef, true, 'Properties', rprops.Properties)));

      delete template.Resources[logicalId];
    }

    delete template.$schema;

    // Add an Include construct with what's left of the template
    new cdk.CfnInclude(this, 'Include', { template });

    // replace all "Fn::GetAtt" with tokens that resolve correctly both for
    // constructs and raw resources.
    processReferences(this);
  }
}

function resolveType(fqn: string) {
  const [ mod, ...className ] = fqn.split('.');
  const module = require(mod);
  return module[className.join('.')];
}

function tryResolveIntrinsic(value: any) {
  if (Object.keys(value).length !== 1) {
    return undefined;
  }

  const name = Object.keys(value)[0];
  const val = value[name];
  return { name, val };
}

function tryResolveRef(value: any) {
  const fn = tryResolveIntrinsic(value);
  if (!fn) {
    return undefined;
  }

  if (fn.name !== 'Ref') {
    return undefined;
  }

  return fn.val;
}

function tryResolveGetAtt(value: any) {
  const fn = tryResolveIntrinsic(value);
  if (!fn || fn.name !== 'Fn::GetAtt') {
    return undefined;
  }

  return fn.val;
}

function deserializeValue(stack: cdk.Stack, typeRef: reflect.TypeReference, optional: boolean, key: string, value: any): any {
  // console.error('====== deserializer ===================');
  // console.error(`type: ${typeRef}`);
  // console.error(`value: ${JSON.stringify(value, undefined, 2)}`);
  // console.error('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`');

  if (value === undefined) {
    if (optional) {
      return undefined;
    }

    throw new Error(`Missing required value for ${key} in ${typeRef}`);
  }

  // deserialize arrays
  if (typeRef.arrayOfType) {
    if (!Array.isArray(value)) {
      throw new Error(`Expecting array for ${key} in ${typeRef}`);
    }

    return value.map((x, i) => deserializeValue(stack, typeRef.arrayOfType!, false, `${key}[${i}]`, x));
  }

  const asRef = tryResolveRef(value);
  if (asRef) {
    if (isConstruct(typeRef)) {
      return findConstruct(stack, value.Ref);
    }

    throw new Error(
      `{ Ref } can only be used when a construct type is expected and this is ${typeRef}. ` +
      `Use { Fn::GetAtt } to represent specific resource attributes`);
  }

  const getAtt = tryResolveGetAtt(value);
  if (getAtt) {
    const [ logical, attr ] = getAtt;

    if (isConstruct(typeRef)) {
      const obj: any = findConstruct(stack, logical);
      return obj[attr];
    }

    if (typeRef.primitive === 'string') {
      // return a lazy value, so we only try to find after all constructs
      // have been added to the stack.
      return deconstructGetAtt(stack, logical, attr);
    }

    throw new Error(`Fn::GetAtt can only be used for string primitives and ${key} is ${typeRef}`);
  }

  // deserialize maps
  if (typeRef.mapOfType) {
    if (typeof(value) !== 'object') {
      throw new ValidationError(`Expecting object for ${key} in ${typeRef}`);
    }

    const out: any = { };
    for (const [ k, v ] of Object.entries(value)) {
      out[k] = deserializeValue(stack, typeRef.mapOfType, false, `${key}.${k}`, v);
    }

    return out;
  }

  if (typeRef.unionOfTypes) {
    const errors = new Array<any>();
    for (const x of typeRef.unionOfTypes) {
      try {
        return deserializeValue(stack, x, optional, key, value);
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

  const enm = deconstructEnum(stack, typeRef, key, value);
  if (enm) {
    return enm;
  }

  // if this is an interface, deserialize each property
  const ifc = deconstructInterface(stack, typeRef, key, value);
  if (ifc) {
    return ifc;
  }

  // if this is an enum type, use the name to dereference
  if (typeRef.type instanceof reflect.EnumType) {
    const enumType = resolveType(typeRef.type.fqn);
    return enumType[value];
  }

  if (typeRef.primitive) {
    return value;
  }

  const enumLike = deconstructEnumLike(stack, typeRef, value);
  if (enumLike) {
    return enumLike;
  }

  const asType = deconstructType(stack, typeRef, value);
  if (asType) {
    return asType;
  }

  throw new Error(`Unable to deconstruct "${JSON.stringify(value)}" for type ref ${typeRef}`);
}

function deconstructEnum(_stack: cdk.Stack, typeRef: reflect.TypeReference, _key: string, value: any) {
  if (!(typeRef.type instanceof reflect.EnumType)) {
    return undefined;
  }

  const enumType = resolveType(typeRef.type.fqn);
  return enumType[value];
}

function deconstructInterface(stack: cdk.Stack, typeRef: reflect.TypeReference, key: string, value: any) {
  if (!isSerializableInterface(typeRef.type)) {
    return undefined;
  }

  const out: any = { };
  for (const prop of typeRef.type.allProperties) {
    const propValue = value[prop.name];
    if (!propValue) {
      if (!prop.optional) {
        throw new ValidationError(`Missing required property ${key}.${prop.name} in ${typeRef}`);
      }
      continue;
    }

    out[prop.name] = deserializeValue(stack, prop.type, prop.optional, `${key}.${prop.name}`, propValue);
  }

  return out;
}

function deconstructEnumLike(stack: cdk.Stack, typeRef: reflect.TypeReference, value: any) {
  if (!isEnumLikeClass(typeRef.type)) {
    return undefined;
  }

  // if the value is a string, we deconstruct it as a static property
  if (typeof(value) === 'string') {
    return deconstructStaticProperty(typeRef.type, value);
  }

  // if the value is an object, we deconstruct it as a static method
  if (typeof(value) === 'object' && !Array.isArray(value)) {
    return deconstructStaticMethod(stack, typeRef.type, value);
  }

  throw new Error(`Invalid value for enum-like class ${typeRef.fqn}: ${JSON.stringify(value)}`);
}

function deconstructType(stack: cdk.Stack, typeRef: reflect.TypeReference, value: any) {
  const schemaDefs: any = {};
  const ctx = SchemaContext.root(schemaDefs);
  const schemaRef = schemaForPolymorphic(typeRef.type, ctx);
  if (!schemaRef) {
    return undefined;
  }

  const def = findDefinition(schemaDefs, schemaRef.$ref);

  const keys = Object.keys(value);
  if (keys.length !== 1) {
    throw new ValidationError(`Cannot parse class type ${typeRef} with value ${value}`);
  }

  const className = keys[0];

  // now we need to check if it's an enum or a normal class
  const schema = def.anyOf.find((x: any) => x.properties && x.properties[className]);
  if (!schema) {
    throw new ValidationError(`Cannot find schema for ${className}`);
  }

  const def2 = findDefinition(schemaDefs, schema.properties[className].$ref);
  const methodFqn = def2.comment;

  const parts = methodFqn.split('.');
  const last = parts[parts.length - 1];
  if (last !== '<initializer>') {
    throw new Error(`Expectring an initializer`);
  }

  const classFqn = parts.slice(0, parts.length - 1).join('.');
  const method = typeRef.system.findClass(classFqn).initializer;
  if (!method) {
    throw new Error(`Cannot find the initializer for ${classFqn}`);
  }

  return invokeMethod(stack, method, value[className]);
}

function findDefinition(defs: any, $ref: string) {
  const k = $ref.split('/').slice(2).join('/');
  return defs[k];
}

function deconstructStaticProperty(typeRef: reflect.ClassType, value: string) {
  const typeClass = resolveType(typeRef.fqn);
  return typeClass[value];
}

function deconstructStaticMethod(stack: cdk.Stack, typeRef: reflect.ClassType, value: any) {
  const methods = typeRef.allMethods.filter(m => m.static);
  const members = methods.map(x => x.name);

  if (typeof(value) === 'object') {
    const entries: Array<[ string, any ]> = Object.entries(value);
    if (entries.length !== 1) {
      throw new Error(`Value for enum-like class ${typeRef.fqn} must be an object with a single key (one of: ${members.join(',')})`);
    }

    const [ methodName, args ] = entries[0];
    const method = methods.find(m => m.name === methodName);
    if (!method) {
      throw new Error(`Invalid member "${methodName}" for enum-like class ${typeRef.fqn}. Options: ${members.join(',')}`);
    }

    if (typeof(args) !== 'object') {
      throw new Error(`Expecting enum-like member ${methodName} to be an object for enum-like class ${typeRef.fqn}`);
    }

    return invokeMethod(stack, method, args);
  }
}

function invokeMethod(stack: cdk.Stack, method: reflect.Callable, parameters: any) {
  const typeClass = resolveType(method.parentType.fqn);
  const args = new Array<any>();

  for (let i = 0; i < method.parameters.length; ++i) {
    const p = method.parameters[i];

    // kwargs: if this is the last argument and a data type, flatten (treat as keyword args)
    if (i === method.parameters.length - 1 && isDataType(p.type.type)) {
      // we pass in all parameters are the value, and the positional arguments will be ignored since
      // we are promised there are no conflicts
      const kwargs = deserializeValue(stack, p.type, p.optional, p.name, parameters);
      args.push(kwargs);
    } else {
      const val = parameters[p.name];
      if (val === undefined && !p.optional) {
        throw new Error(`Missing required parameter '${p.name}' for ${method.parentType.fqn}.${method.name}`);
      }

      if (val !== undefined) {
        args.push(deserializeValue(stack, p.type, p.optional, p.name, val));
      }
    }
  }

  if (reflect.Initializer.isInitializer(method)) {
    return new typeClass(...args);
  }

  const methodFn: (...args: any[]) => any = typeClass[method.name];
  if (!methodFn) {
    throw new Error(`Cannot find method named ${method.name} in ${typeClass.fqn}`);
  }

  return methodFn.apply(typeClass, args);
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
  return cdk.Lazy.string({ produce: () => {
    const res = stack.node.tryFindChild(id);
    if (!res) {
      const include = stack.node.tryFindChild('Include') as cdk.CfnInclude;
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
  }});
}

function findConstruct(stack: cdk.Stack, id: string) {
  const child = stack.node.tryFindChild(id);
  if (!child) {
    throw new Error(`Construct with ID ${id} not found (it must be defined before it is referenced)`);
  }
  return child;
}

function processReferences(stack: cdk.Stack) {
  const include = stack.node.findChild('Include') as cdk.CfnInclude;
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

function isCfnResourceType(resourceType: string) {
  return resourceType.includes('::');
}

class ValidationError extends Error { }

function _cwd<T>(workDir: string | undefined, cb: () => T): T {
  if (!workDir) { return cb(); }
  const prevWd = process.cwd();
  try {
    process.chdir(workDir);
    return cb();
  } finally {
    process.chdir(prevWd);
  }
}
