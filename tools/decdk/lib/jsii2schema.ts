import jsiiReflect = require('jsii-reflect');

export function toSchema(type: jsiiReflect.TypeReference): any {
  if (type.primitive !== undefined) {
    if (type.primitive === 'date') {
      return { type: 'string', format: 'date-time' };
    }
    return { type: type.primitive };
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
      anyOf: type.unionOfTypes.filter(isSerializableType).map(toSchema)
    };
  }

  if (type.fqn !== undefined) {
    const iface = type.system.findInterface(type.fqn.fqn);

    const properties: any = {};
    const required = new Array<string>();
    iface.getProperties().forEach(prop => {
      properties[prop.name] = {
        ...toSchema(prop.type),
        description: prop.docs.docs.comment // ¯\_(ツ)_/¯
      };

      if (!prop.type.optional) {
        required.push(prop.name);
      }
    });

    return {
      type: 'object',
      title: iface.name,
      additionalProperties: false,
      properties,
      required,
    };
  }

  // return type.primitive !== undefined
  //   || (type.arrayOfType !== undefined && isSerializableType(type.arrayOfType, typeSystem))
  //   || (type.mapOfType !== undefined && isSerializableType(type.mapOfType, typeSystem))
  //   || (type.fqn !== undefined && isSerializableInterface(type.fqn.fqn, typeSystem));

}

// Must only have properties, all of which are scalars,
// lists or isSerializableInterface types.
export function isSerializableType(type: jsiiReflect.TypeReference): boolean {
  return type.primitive !== undefined
    || (type.arrayOfType !== undefined && isSerializableType(type.arrayOfType))
    || (type.mapOfType !== undefined && isSerializableType(type.mapOfType))
    || (type.fqn !== undefined && isSerializableInterface(type.fqn))
    || (type.unionOfTypes !== undefined && type.unionOfTypes.some(isSerializableType));
}

function isSerializableInterface(type: jsiiReflect.Type): boolean {
  if (type === undefined || !(type instanceof jsiiReflect.InterfaceType)) { return false; }

  return type.getMethods().length === 0
    && type.getProperties().every(p => isSerializableType(p.type));
}
