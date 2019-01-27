import jsiiReflect = require('jsii-reflect');

// tslint:disable:no-console

export function toSchema(type: jsiiReflect.TypeReference): any {
  if (type.primitive !== undefined) {
    switch (type.primitive) {
      case 'date': return { type: 'string', format: 'date-time' };
      case 'json': return { type: 'object' };
      case 'any': return { type: 'object' };
      default: return { type: type.primitive };
    }
  }

  if (type.arrayOfType !== undefined) {
    return {
      type: 'array',
      items: toSchema(type.arrayOfType)
    };
  }

  if (type.mapOfType !== undefined) {
    return {
      type: 'object',
      additionalProperties: toSchema(type.mapOfType),
    };
  }

  if (type.unionOfTypes !== undefined) {
    return {
      anyOf: type.unionOfTypes.filter(x => isSerializableTypeReference(x)).map(toSchema)
    };
  }

  if (type.fqn !== undefined) {
    if (isConstruct(type)) {
      return {
        type: 'object',
        properties: {
          Ref: { type: 'string' }
        }
      };
    }

    const iface = interfaceSchema(type.fqn);
    if (iface) {
      return iface;
    }

    const enm = enumSchema(type.fqn);
    if (enm) {
      return enm;
    }

    const enumLike = enumLikeClassSchema(type.fqn);
    if (enumLike) {
      return enumLike;
    }

    throw new Error(`Unable to represent type '${type.fqn.fqn} in JSON`);
  }
}

function enumSchema(type: jsiiReflect.Type) {
  if (!(type instanceof jsiiReflect.EnumType)) {
    return undefined;
  }

  return {
    enum: type.members.map(m => m.name)
  };
}

function interfaceSchema(type: jsiiReflect.Type) {
  if (!(type instanceof jsiiReflect.InterfaceType)) {
    return undefined;
  }

  const properties: any = {};
  const required = new Array<string>();

  for (const prop of type.getProperties(/* inherit */ true)) {
    if (!isSerializableTypeReference(prop.type) && !isConstruct(prop.type)) {

      // if prop is not serializable but optional, we can still serialize
      // but without this property.
      if (prop.type.optional) {
        console.error(`WARNING: proprety "${prop.name}" omitted from ${type.fqn} because it is not serializable but optional`);
        continue;
      }

      throw new Error(`${prop.name} is not serializable`);
    }

    properties[prop.name] = {
      ...toSchema(prop.type),
      description: prop.docs.docs.comment // ¯\_(ツ)_/¯
    };

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
}

function enumLikeClassSchema(cls: jsiiReflect.Type) {
  if (!(cls instanceof jsiiReflect.ClassType)) {
    return undefined;
  }

  const enumLikeProps = enumLikeClassProperties(cls);
  const enumLikeMethods = enumLikeClassMethods(cls);

  if (enumLikeProps.length === 0 && enumLikeMethods.length === 0) {
    return undefined;
  }

  if (enumLikeProps.length > 0 && enumLikeMethods.length > 0) {
    throw new Error(`Unable to represent enum-like class that has both property members and method members: ${cls.fqn}`);
  }

  const ret = new Array<any>();

  if (enumLikeProps.length > 0) {
    ret.push({ enum: enumLikeProps.map(m => m.name) });
  }

  if (enumLikeMethods.length > 0) {
    ret.push({
      anyOf: enumLikeMethods.map(m => ({
        type: 'object',
        additionalProperties: false,
        properties: {
          [m.name]: methodSchema(m)
        }
      }))
    });
  }

  return { anyOf: ret };
}

function methodSchema(method: jsiiReflect.Method) {
  const properties: any = { };
  const required = new Array<string>();

  for (const p of method.parameters) {
    properties[p.name] = toSchema(p.type);
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

  if (type instanceof jsiiReflect.EnumType) {
    return true;
  }

  if (type instanceof jsiiReflect.InterfaceType) {
    if (type.getMethods(true).length > 0) {
      return false;
    }

    return type.getProperties(true).every(p =>
        isSerializableTypeReference(p.type, errorPrefix)
        || isConstruct(p.type)
        || p.type.optional);
  }

  if (type instanceof jsiiReflect.ClassType) {

    // if this is a class that looks like an enum, we can represent it
    if (isEnumLikeClass(type)) {
      return true;
    }

    // if this is a cosntruct class, we can represent it as a "Ref"
    if (isConstruct(type)) {
      return true;
    }

  }

  if (errorPrefix) {
    console.error(errorPrefix, `${type} is not serializable`);
  }

  return false;
}

//
// move this to jsii!
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