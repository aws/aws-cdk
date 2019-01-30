import jsiiReflect = require('jsii-reflect');

// tslint:disable:no-console

const showWarnings = false;

export function schemaForTypeReference(type: jsiiReflect.TypeReference, definitions: { [fqn: string]: any }): any {

  const prim = schemaForPrimitive(type);
  if (prim) {
    return prim;
  }

  const arr = schemaForArray(type, definitions);
  if (arr) {
    return arr;
  }

  const map = schemaForMap(type, definitions);
  if (map) {
    return map;
  }

  const union = schemaForUnion(type, definitions);
  if (union) {
    return union;
  }

  const constructRef = schemaForConstructRef(type);
  if (constructRef) {
    return constructRef;
  }

  const iface = schemaForInterface(type.fqn, definitions);
  if (iface) {
    return iface;
  }

  const enm = schemaForEnum(type.fqn);
  if (enm) {
    return enm;
  }

  const enumLike = schemaForEnumLikeClass(type.fqn, definitions);
  if (enumLike) {
    return enumLike;
  }

  const cls = schemaForType(type.fqn, definitions);
  if (cls) {
    return cls;
  }

  warning(`cannot serialize ${type}`);

  return undefined;
}

export function schemaForType(type: jsiiReflect.Type | undefined, definitions: { [fqn: string]: any }) {
  if (!type) {
    return undefined;
  }

  return definitionOf(definitions, type.fqn, () => {
    const anyOf = new Array<any>();

    for (const x of allImplementationsOfType(type)) {
      const enumLike = schemaForEnumLikeClass(x, definitions);
      if (enumLike) {
        anyOf.push(enumLike);
      }

      if (x.initializer) {
        const methd = methodSchema(x.initializer, definitions);
        if (methd) {
          anyOf.push({
            type: 'object',
            additionalProperties: false,
            properties: {
              [x.name]: methd
            }
          });
        }
      }
    }

    if (anyOf.length === 0) {
      return undefined;
    }

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

function schemaForMap(type: jsiiReflect.TypeReference, definitions: { [fqn: string]: any }) {
  if (!type.mapOfType) {
    return undefined;
  }

  const s = schemaForTypeReference(type.mapOfType, definitions);
  if (!s) {
    return undefined;
  }

  return {
    type: 'object',
    additionalProperties: s
  };
}

function schemaForArray(type: jsiiReflect.TypeReference, definitions: { [fqn: string]: any }) {
  if (!type.arrayOfType) {
    return undefined;
  }

  const s = schemaForTypeReference(type.arrayOfType, definitions);
  if (!s) {
    return undefined;
  }

  return {
    type: 'array',
    items: schemaForTypeReference(type.arrayOfType, definitions)
  };
}

function schemaForPrimitive(type: jsiiReflect.TypeReference): any {
  if (!type.primitive) {
    return undefined;
  }

  switch (type.primitive) {
    case 'date': return { type: 'string', format: 'date-time' };
    case 'json': return { type: 'object' };
    case 'any': return { type: 'object' };
    default: return { type: type.primitive };
  }
}

function schemaForUnion(type: jsiiReflect.TypeReference, definitions: { [fqn: string]: any }): any {
  if (!type.unionOfTypes) {
    return undefined;
  }

  const anyOf = type.unionOfTypes
    .filter(x => isSerializableTypeReference(x))
    .map(x => schemaForTypeReference(x, definitions))
    .filter(x => x);

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

const definitionStack = new Array<string>();

export function definitionOf(definitions: { [fqn: string]: any }, fqn: string, schema: () => any) {
  const originalFqn = fqn;
  fqn = fqn.replace('/', '.');

  if (!(fqn in definitions)) {
    if (definitionStack.includes(fqn)) {
      warning('cyclic definition:', fqn);
      return undefined;
    }

    definitionStack.push(fqn);

    try {
      const s = schema();
      if (!s) {
        warning(fqn);
        return undefined;
      }

      s.comment = originalFqn;

      definitions[fqn] = s;
    } finally {
      definitionStack.pop();
    }
  }

  return { $ref: `#/definitions/${fqn}` };
}

function schemaForInterface(type: jsiiReflect.Type | undefined, definitions: { [fqn: string]: any }) {
  if (!type || !(type instanceof jsiiReflect.InterfaceType)) {
    return undefined;
  }

  if (!isSerializableInterface(type)) {
    return undefined;
  }

  return definitionOf(definitions, type.fqn, () => {
    const properties: any = {};
    const required = new Array<string>();

    for (const prop of type.getProperties(/* inherit */ true)) {

      const schema = schemaForTypeReference(prop.type, definitions);
      if (!schema) {
        // if prop is not serializable but optional, we can still serialize
        // but without this property.
        if (prop.type.optional) {
          warning(`proprety "${prop.name}" omitted from ${type.fqn} because it is not serializable but optional`);
          continue;
        }

        return undefined;
      }

      properties[prop.name] = schema;

      const docstring = prop.docs.docs.comment;
      if (docstring) {
        properties[prop.name].description = docstring;
      }

      if (!prop.type.optional) {
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

function schemaForEnumLikeClass(type: jsiiReflect.Type | undefined, definitions: { [fqn: string]: any }) {
  if (!type || !(type instanceof jsiiReflect.ClassType)) {
    return undefined;
  }

  return definitionOf(definitions, type.fqn, () => {
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
      const s = methodSchema(method, definitions);
      if (!s) {
        continue;
      }

      anyOf.push({
        type: 'object',
        additionalProperties: false,
        properties: {
          [method.name]: methodSchema(method, definitions)
        }
      });
    }

    if (anyOf.length === 0) {
      return undefined;
    }

    return { anyOf };
  });
}

function methodSchema(method: jsiiReflect.Method, definitions: { [fqn: string]: any }) {
  const fqn = `${method.parentType.fqn}.${method.name}`;

  return definitionOf(definitions, fqn, () => {
    const properties: any = { };
    const required = new Array<string>();

    for (const p of method.parameters) {
      const param = schemaForTypeReference(p.type, definitions);

      // bail out - can't serialize a required parameter, so we can't serialize the method
      if (!param && !p.type.optional) {
        warning(`cannot serialize method ${fqn} because parameter ${p.name} cannot be serialized`);
        return undefined;
      }

      properties[p.name] = param;

      if (!p.type.optional) {
        required.push(p.name);
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

// Must only have properties, all of which are scalars,
// lists or isSerializableInterface types.
export function isSerializableTypeReference(type: jsiiReflect.TypeReference, errorPrefix?: string): boolean {
  return type.primitive !== undefined
    || (type.arrayOfType !== undefined && isSerializableTypeReference(type.arrayOfType, errorPrefix))
    || (type.mapOfType !== undefined && isSerializableTypeReference(type.mapOfType, errorPrefix))
    || (type.fqn !== undefined && isSerializableType(type.fqn, errorPrefix))
    || (type.unionOfTypes !== undefined && type.unionOfTypes.some(x => isSerializableTypeReference(x, errorPrefix)));
}

function isSerializableType(type: jsiiReflect.Type, errorPrefix?: string): boolean {

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

  // if this is a cosntruct class, we can represent it as a "Ref"
  if (isConstruct(type)) {
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

  if (type.getMethods(true).length > 0) {
    return false;
  }

  return type.getProperties(true).every(p =>
      isSerializableTypeReference(p.type, errorPrefix)
      || isConstruct(p.type)
      || p.type.optional);
}

function isEnum(type: jsiiReflect.Type): type is jsiiReflect.EnumType {
  return type instanceof jsiiReflect.EnumType;
}

//
// move this to jsii?
//

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
  return cls.getMethods(true).filter(m => m.static && m.returns && m.returns.fqn && extendsType(m.returns.fqn, cls));
}

export function enumLikeClassProperties(cls: jsiiReflect.ClassType) {
  return cls.getProperties(true).filter(p => p.static && p.type.fqn && extendsType(p.type.fqn, cls));
}

export function extendsType(derived: jsiiReflect.Type, base: jsiiReflect.Type) {
  if (derived === base) {
    return true;
  }

  if (derived instanceof jsiiReflect.InterfaceType && base instanceof jsiiReflect.InterfaceType) {
    return derived.interfaces.some(x => x === base);
  }

  if (derived instanceof jsiiReflect.ClassType && base instanceof jsiiReflect.ClassType) {
    return derived.getAncestors().some(x => x === base);
  }

  return false;
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

    if (typeOrTypeRef.fqn) {
      type = typeOrTypeRef.fqn;
    } else {
      return false;
    }
  }

  // if it is an interface, it should extend cdk.IConstruct
  if (type instanceof jsiiReflect.InterfaceType) {
    return extendsType(type, type.system.findFqn('@aws-cdk/cdk.IConstruct'));
  }

  // if it is a class, it should extend cdk.Construct
  if (type instanceof jsiiReflect.ClassType) {
    return extendsType(type, type.system.findFqn('@aws-cdk/cdk.Construct'));
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
  return base.system.classes.filter(x => extendsType(x, base));
}

function allImplementations(base: jsiiReflect.InterfaceType) {
  return base.system.classes.filter(x => x.getInterfaces().some(i => extendsType(i, base)));
}

function warning(...args: any[]) {
  if (showWarnings) {
    console.error('WARNING:', ...args);
  }
}