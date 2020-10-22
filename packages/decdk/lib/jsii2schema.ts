import * as jsiiReflect from 'jsii-reflect';
import * as util from 'util';

/* eslint-disable no-console */

export class SchemaContext {
  public static root(definitions?: { [fqn: string]: any }): SchemaContext {
    return new SchemaContext(undefined, undefined, definitions);
  }

  public readonly definitions: { [fqn: string]: any };
  public readonly path: string;
  public readonly children = new Array<SchemaContext>();
  public readonly name: string;
  public readonly root: boolean;
  public readonly warnings = new Array<string>();
  public readonly errors = new Array<string>();

  private readonly definitionStack: string[];

  private constructor(name?: string, parent?: SchemaContext, definitions?: { [fqn: string]: any }) {
    this.name = name || '';
    if (parent) {
      this.root = false;
      parent.children.push(this);
      this.definitions = parent.definitions;
      this.path = parent.path + '/' + this.name;
      this.definitionStack = parent.definitionStack;
    } else {
      this.root = true;
      this.definitions = definitions || { };
      this.path = this.name || '';
      this.definitionStack = new Array<string>();
    }
  }

  public child(type: string, name: string): SchemaContext {
    return new SchemaContext(`[${type} "${name}"]`, this);
  }

  public get hasWarningsOrErrors(): boolean {
    return this.warnings.length > 0 || this.errors.length > 0 || this.children.some(child => child.hasWarningsOrErrors);
  }

  public warning(format: any, ...args: any[]) {
    this.warnings.push(util.format(format, ...args));
  }

  public error(format: any, ...args: any[]) {
    this.errors.push(util.format(format, ...args));
  }

  public findDefinition(ref: string) {
    const [ , , id ] = ref.split('/');
    return this.definitions[id];
  }

  public define(fqn: string, schema: () => any) {
    const originalFqn = fqn;
    fqn = fqn.replace('/', '.');

    if (!(fqn in this.definitions)) {
      if (this.definitionStack.includes(fqn)) {
        this.error(`cyclic definition of ${fqn}`);
        return undefined;
      }

      this.definitionStack.push(fqn);

      try {
        const s = schema();
        if (!s) {
          this.error('cannot schematize');
          return undefined;
        }

        s.comment = originalFqn;

        this.definitions[fqn] = s;
      } finally {
        this.definitionStack.pop();
      }
    }

    return { $ref: `#/definitions/${fqn}` };
  }
}

export function schemaForTypeReference(type: jsiiReflect.TypeReference, ctx: SchemaContext): any {

  const prim = schemaForPrimitive(type);
  if (prim) {
    return prim;
  }

  const arr = schemaForArray(type, ctx);
  if (arr) {
    return arr;
  }

  const map = schemaForMap(type, ctx);
  if (map) {
    return map;
  }

  const union = schemaForUnion(type, ctx);
  if (union) {
    return union;
  }

  const constructRef = schemaForConstructRef(type);
  if (constructRef) {
    return constructRef;
  }

  const iface = schemaForInterface(type.type, ctx);
  if (iface) {
    return iface;
  }

  const enm = schemaForEnum(type.type);
  if (enm) {
    return enm;
  }

  const enumLike = schemaForEnumLikeClass(type.type, ctx);
  if (enumLike) {
    return enumLike;
  }

  const cls = schemaForPolymorphic(type.type, ctx);
  if (cls) {
    return cls;
  }

  if (!ctx.hasWarningsOrErrors) {
    ctx.error(`didn't match any schematizable shape`);
  }

  return undefined;
}

export function schemaForPolymorphic(type: jsiiReflect.Type | undefined, ctx: SchemaContext) {
  if (!type) {
    return undefined;
  }

  ctx = ctx.child('polymorphic', type.fqn);

  const anyOf = new Array<any>();

  const parentctx = ctx;

  for (const x of allImplementationsOfType(type)) {

    ctx = parentctx.child('impl', x.fqn);

    const enumLike = schemaForEnumLikeClass(x, ctx);
    if (enumLike) {
      anyOf.push(enumLike);
    }

    if (x.initializer) {
      const methd = methodSchema(x.initializer, ctx);
      if (methd) {
        anyOf.push({
          type: 'object',
          additionalProperties: false,
          properties: {
            [x.fqn]: methd
          }
        });
      }
    }
  }

  if (anyOf.length === 0) {
    return undefined;
  }

  return ctx.define(type.fqn, () => {
    return { anyOf };
  });
}

function schemaForEnum(type: jsiiReflect.Type | undefined) {
  if (!type || !(type instanceof jsiiReflect.EnumType)) {
    return undefined;
  }

  return {
    enum: type.members.map(m => m.name)
  };
}

function schemaForMap(type: jsiiReflect.TypeReference, ctx: SchemaContext) {
  ctx = ctx.child('map', type.toString());

  if (!type.mapOfType) {
    return undefined;
  }

  const s = schemaForTypeReference(type.mapOfType, ctx);
  if (!s) {
    return undefined;
  }

  return {
    type: 'object',
    additionalProperties: s
  };
}

function schemaForArray(type: jsiiReflect.TypeReference, ctx: SchemaContext) {
  ctx = ctx.child('array', type.toString());

  if (!type.arrayOfType) {
    return undefined;
  }

  const s = schemaForTypeReference(type.arrayOfType, ctx);
  if (!s) {
    return undefined;
  }

  return {
    type: 'array',
    items: schemaForTypeReference(type.arrayOfType, ctx)
  };
}

function schemaForPrimitive(type: jsiiReflect.TypeReference): any {
  if (!type.primitive) {
    return undefined;
  }

  switch (type.primitive) {
    case 'date': return { type: 'string', format: 'date-time' };
    case 'json': return { type: 'object' };
    case 'any': return { }; // this means "any"
    default: return { type: type.primitive };
  }
}

function schemaForUnion(type: jsiiReflect.TypeReference, ctx: SchemaContext): any {
  ctx = ctx.child('union', type.toString());

  if (!type.unionOfTypes) {
    return undefined;
  }

  const anyOf = type.unionOfTypes
    .map(x => schemaForTypeReference(x, ctx))
    .filter(x => x); // filter failed schemas

  if (anyOf.length === 0) {
    return undefined;
  }

  return { anyOf };
}

function schemaForConstructRef(type: jsiiReflect.TypeReference) {
  if (!isConstruct(type)) {
    return undefined;
  }

  return {
    type: 'object',
    properties: {
      Ref: { type: 'string' }
    }
  };
}

export function schemaForInterface(type: jsiiReflect.Type | undefined, ctx: SchemaContext) {
  if (!type || !(type instanceof jsiiReflect.InterfaceType)) {
    return undefined; // skip
  }

  if (type.allMethods.length > 0) {
    return undefined;
  }

  ctx = ctx.child('interface', type.fqn);

  const ifctx = ctx;

  return ctx.define(type.fqn, () => {
    const properties: any = {};
    const required = new Array<string>();

    for (const prop of type.allProperties) {

      ctx = ifctx.child(prop.optional ? 'optional' : 'required' + ' property', prop.name);

      const schema = schemaForTypeReference(prop.type, ctx);
      if (!schema) {
        // if prop is not serializable but optional, we can still serialize
        // but without this property.
        if (prop.optional) {
          ctx.warning(`optional proprety omitted because it cannot be schematized`);
          continue;
        }

        // error
        ctx.error('property cannot be schematized');
        return undefined;
      }

      properties[prop.name] = schema;

      const docstring = prop.docs.toString();
      if (docstring) {
        properties[prop.name].description = docstring;
      }

      if (!prop.optional) {
        required.push(prop.name);
      }
    }

    return {
      type: 'object',
      title: type.name,
      additionalProperties: false,
      properties,
      required: required.length > 0 ? required : undefined,
    };
  });
}

function schemaForEnumLikeClass(type: jsiiReflect.Type | undefined, ctx: SchemaContext) {
  if (type) {
    ctx = ctx.child('enum-like', type.toString());
  }

  if (!type || !(type instanceof jsiiReflect.ClassType)) {
    return undefined;
  }

  const enumLikeProps = enumLikeClassProperties(type);
  const enumLikeMethods = enumLikeClassMethods(type);

  if (enumLikeProps.length === 0 && enumLikeMethods.length === 0) {
    return undefined;
  }

  const anyOf = new Array<any>();

  if (enumLikeProps.length > 0) {
    anyOf.push({ enum: enumLikeProps.map(m => m.name) });
  }

  for (const method of enumLikeMethods) {
    const s = methodSchema(method, ctx);
    if (!s) {
      continue;
    }

    anyOf.push({
      type: 'object',
      additionalProperties: false,
      properties: {
        [method.name]: methodSchema(method, ctx)
      }
    });
  }

  if (anyOf.length === 0) {
    return undefined;
  }

  return ctx.define(type.fqn, () => {
    return { anyOf };
  });
}

function methodSchema(method: jsiiReflect.Callable, ctx: SchemaContext) {
  ctx = ctx.child('method', method.name);

  const fqn = `${method.parentType.fqn}.${method.name}`;

  const methodctx = ctx;

  return ctx.define(fqn, () => {
    const properties: any = { };
    const required = new Array<string>();

    const addProperty = (prop: jsiiReflect.Property | jsiiReflect.Parameter): void => {
      const param = schemaForTypeReference(prop.type, ctx);

      // bail out - can't serialize a required parameter, so we can't serialize the method
      if (!param && !prop.optional) {
        ctx.error(`cannot schematize method because parameter cannot be schematized`);
        return undefined;
      }

      properties[prop.name] = param;

      if (!prop.optional) {
        required.push(prop.name);
      }
    };

    for (let i = 0; i < method.parameters.length; ++i) {
      const p = method.parameters[i];
      methodctx.child('param', p.name);

      // if this is the last parameter and it's a data type, treat as keyword arguments
      if (i === method.parameters.length - 1 && isDataType(p.type.type)) {
        const kwargs = schemaForInterface(p.type.type, ctx);
        if (kwargs) {
          for (const prop of p.type.type.allProperties) {
            addProperty(prop);
          }
        }
      } else {
        addProperty(p);
      }
    }

    return {
      type: 'object',
      properties,
      additionalProperties: false,
      required: required.length > 0 ? required : undefined
    };
  });
}

export function isDataType(t: jsiiReflect.Type | undefined): t is jsiiReflect.InterfaceType {
  if (!t) {
    return false;
  }
  return t instanceof jsiiReflect.InterfaceType && (t as any).spec.datatype;
}

// Must only have properties, all of which are scalars,
// lists or isSerializableInterface types.
export function isSerializableTypeReference(type: jsiiReflect.TypeReference, errorPrefix?: string): boolean {

  if (type.primitive) {
    return true;
  }

  if (type.arrayOfType) {
    return isSerializableTypeReference(type.arrayOfType, errorPrefix);
  }

  if (type.mapOfType) {
    return isSerializableTypeReference(type.mapOfType, errorPrefix);
  }

  if (type.type) {
    return isSerializableType(type.type, errorPrefix);
  }

  if (type.unionOfTypes) {
    return type.unionOfTypes.some(x => isSerializableTypeReference(x, errorPrefix));
  }

  return false;
}

function isSerializableType(type: jsiiReflect.Type, errorPrefix?: string): boolean {
  // if this is a cosntruct class, we can represent it as a "Ref"
  if (isConstruct(type)) {
    return true;
  }

  if (isEnum(type)) {
    return true;
  }

  if (isSerializableInterface(type)) {
    return true;
  }

  // if this is a class that looks like an enum, we can represent it
  if (isEnumLikeClass(type)) {
    return true;
  }

  if (allImplementationsOfType(type).length > 0) {
    return true;
  }

  if (errorPrefix) {
    console.error(errorPrefix, `${type} is not serializable`);
  }

  return false;
}

export function isSerializableInterface(type: jsiiReflect.Type | undefined, errorPrefix?: string): type is jsiiReflect.InterfaceType {
  if (!type || !(type instanceof jsiiReflect.InterfaceType)) {
    return false;
  }

  if (type.allMethods.length > 0) {
    return false;
  }

  return type.allProperties.every(p =>
      isSerializableTypeReference(p.type, errorPrefix)
      || isConstruct(p.type)
      || p.optional);
}

function isEnum(type: jsiiReflect.Type): type is jsiiReflect.EnumType {
  return type instanceof jsiiReflect.EnumType;
}

export function isEnumLikeClass(cls: jsiiReflect.Type | undefined): cls is jsiiReflect.ClassType {
  if (!cls) {
    return false;
  }

  if (!(cls instanceof jsiiReflect.ClassType)) {
    return false;
  }
  return enumLikeClassMethods(cls).length > 0
    || enumLikeClassProperties(cls).length > 0;
}

export function enumLikeClassMethods(cls: jsiiReflect.ClassType) {
  return cls.allMethods.filter(m => m.static && m.returns && m.returns.type.type && m.returns.type.type.extends(cls));
}

export function enumLikeClassProperties(cls: jsiiReflect.ClassType) {
  return cls.allProperties.filter(p => p.static && p.type.type && p.type.type.extends(cls));
}

export function isConstruct(typeOrTypeRef: jsiiReflect.TypeReference | jsiiReflect.Type): boolean {
  let type: jsiiReflect.Type;

  if (typeOrTypeRef instanceof jsiiReflect.Type) {
    type = typeOrTypeRef;
  } else {
    if (typeOrTypeRef.arrayOfType) {
      return isConstruct(typeOrTypeRef.arrayOfType);
    }

    if (typeOrTypeRef.mapOfType) {
      return isConstruct(typeOrTypeRef.mapOfType);
    }

    if (typeOrTypeRef.unionOfTypes) {
      return typeOrTypeRef.unionOfTypes.some(x => isConstruct(x));
    }

    if (typeOrTypeRef.type) {
      type = typeOrTypeRef.type;
    } else {
      return false;
    }
  }

  // if it is an interface, it should extend constructs.IConstruct
  if (type instanceof jsiiReflect.InterfaceType) {
    const constructIface = type.system.findFqn('constructs.IConstruct');
    return type.extends(constructIface);
  }

  // if it is a class, it should extend constructs.Construct
  if (type instanceof jsiiReflect.ClassType) {
    const constructClass = type.system.findFqn('constructs.Construct');
    return type.extends(constructClass);
  }

  return false;
}

function allImplementationsOfType(type: jsiiReflect.Type) {
  if (type instanceof jsiiReflect.ClassType) {
    return allSubclasses(type).filter(x => !x.abstract);
  }

  if (type instanceof jsiiReflect.InterfaceType) {
    return allImplementations(type).filter(x => !x.abstract);
  }

  throw new Error(`Must either be a class or an interface`);
}

function allSubclasses(base: jsiiReflect.ClassType) {
  return base.system.classes.filter(x => x.extends(base));
}

function allImplementations(base: jsiiReflect.InterfaceType) {
  return base.system.classes.filter(x => x.getInterfaces(true).some(i => i.extends(base)));
}
