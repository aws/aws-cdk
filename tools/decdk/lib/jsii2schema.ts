import jsiiReflect = require('jsii-reflect');

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
    if (type.fqn instanceof jsiiReflect.InterfaceType) {
      const properties: any = {};
      const required = new Array<string>();

      for (const prop of type.fqn.getProperties(/* inherit */ true)) {

        if (!isSerializableTypeReference(prop.type)) {
          // if prop is not serializable but optional, we can pass
          if (prop.type.optional) {
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
    && type.getProperties().every(p => p.type.optional || isSerializableTypeReference(p.type))
    && type.interfaces.every(i => isSerializableType(i));
  }

  return false;
}
