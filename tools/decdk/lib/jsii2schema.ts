import jsiiReflect = require('jsii-reflect');

// tslint:disable:no-console

export function toSchema(type: jsiiReflect.TypeReference): any {
  if (type.primitive !== undefined) {
    switch (type.primitive) {
      case 'date': return { type: 'string', format: 'date-time' };
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
      anyOf: type.unionOfTypes.filter(isSerializableTypeReference).map(toSchema)
    };
  }

  if (type.fqn !== undefined) {
    if (isConstructReference(type)) {
      return {
        type: 'object',
        properties: {
          Ref: {
            type: 'string'
          }
        }
      };
    }

    if (type.fqn instanceof jsiiReflect.InterfaceType) {
      const properties: any = {};
      const required = new Array<string>();

      for (const prop of type.fqn.getProperties(/* inherit */ true)) {

        if (!isSerializableTypeReference(prop.type) && !isConstructReference(prop.type)) {

          // if prop is not serializable but optional, we can pass
          if (prop.type.optional) {
            console.error(`WARNING: ${type.fqn}.${prop.name}: not serializable but optional, so it's omitted`);
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
        title: type.fqn.name,
        additionalProperties: false,
        properties,
        required,
      };
    }

    if (type.fqn instanceof jsiiReflect.EnumType) {
      return {
        enum: type.fqn.members.map(m => m.name)
      };
    }

    throw new Error(`Type '${type.fqn.fqn}' not serializable`);
  }
}

// Must only have properties, all of which are scalars,
// lists or isSerializableInterface types.
export function isSerializableTypeReference(type: jsiiReflect.TypeReference): boolean {
  return type.primitive !== undefined
    || (type.arrayOfType !== undefined && isSerializableTypeReference(type.arrayOfType))
    || (type.mapOfType !== undefined && isSerializableTypeReference(type.mapOfType))
    || (type.fqn !== undefined && isSerializableType(type.fqn))
    || (type.unionOfTypes !== undefined && type.unionOfTypes.some(isSerializableTypeReference));
}

function isSerializableType(type: jsiiReflect.Type): boolean {
  if (type instanceof jsiiReflect.EnumType) {
    return true;
  }

  if (type instanceof jsiiReflect.InterfaceType) {
    return type.getMethods().length === 0
      && type.getProperties().every(p =>
        isSerializableTypeReference(p.type)
        || isConstructReference(p.type)
        || p.type.optional)
      && type.interfaces.every(i => isSerializableType(i));
  }

  return false;
}

export function isConstructReference(t: jsiiReflect.TypeReference): boolean {

  // if it is an interface, it should extend cdk.IConstruct
  if (t.fqn instanceof jsiiReflect.InterfaceType) {
    const base = t.fqn.system.findFqn('@aws-cdk/cdk.IConstruct');
    return t.fqn.interfaces.some(x => x === base);
  }

  // if it is a class, it should extend cdk.Construct
  if (t.fqn instanceof jsiiReflect.ClassType) {
    const base = t.fqn.system.findFqn('@aws-cdk/cdk.Construct');
    return t.fqn.getAncestors().some(x => x === base);
  }

  if (t.arrayOfType) {
    return isConstructReference(t.arrayOfType);
  }

  if (t.mapOfType) {
    return isConstructReference(t.mapOfType);
  }

  if (t.unionOfTypes) {
    return t.unionOfTypes.some(x => isConstructReference(x));
  }

  return false;
}