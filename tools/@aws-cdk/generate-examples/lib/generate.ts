import * as spec from '@jsii/spec';
import * as reflect from 'jsii-reflect';
import { TypeSystem } from 'jsii-reflect';

import { AnyAssumption, Assumption, Code, Import, module } from './code';

/**
 * Special types that have a standard way of coming up with an example value
 */
const SPECIAL_TYPE_EXAMPLES: Record<string, string> = {
  '@aws-cdk/core.Duration': 'cdk.Duration.minutes(30)',
  'aws-cdk-lib.Duration': 'cdk.Duration.minutes(30)',
};

/**
 * Context on the example that we are building.
 * This object persists throughout the recursive call
 * and provides the function with the same information
 * on the typesystem and which types have already been
 * rendered. This helps to prevent infinite recursion.
 */
class ExampleContext {
  private readonly _typeSystem: TypeSystem;
  private readonly _rendered: Set<string> = new Set();

  constructor(typeSystem: TypeSystem) {
    this._typeSystem = typeSystem;
  }

  public get typeSystem() {
    return this._typeSystem;
  }

  public get rendered() {
    return this._rendered;
  }
}

export function generateClassAssignment(classType: reflect.ClassType): string | undefined {
  const expression = generateClassExample(classType);
  if (!expression) {
    return undefined;
  }
  const code = Code.concatAll(
    `const ${lowercaseFirstLetter(classType.name)} = `,
    expression,
    ';',
  );
  return code.toString();
}

function generateClassExample(classType: reflect.ClassType): Code | undefined {
  const staticFactoryMethods = getStaticFactoryMethods(classType);
  const staticFactoryProperties = getStaticFactoryProperties(classType);
  const initializer = getAccessibleConstructor(classType);

  if (initializer && initializer.parameters.length >= 3) {
    return generateClassInstantiationExample(initializer);
  }

  if (staticFactoryMethods.length >= 3) {
    return generateStaticFactoryMethodExample(classType, staticFactoryMethods[0]);
  }

  if (staticFactoryProperties.length >= 3) {
    return generateStaticFactoryPropertyExample(classType, staticFactoryProperties[0]);
  }

  if (initializer) {
    return generateClassInstantiationExample(initializer);
  }

  if (staticFactoryMethods.length >= 1) {
    return generateStaticFactoryMethodExample(classType, staticFactoryMethods[0]);
  }

  if (staticFactoryProperties.length >= 1) {
    return generateStaticFactoryPropertyExample(classType, staticFactoryProperties[0]);
  }

  return undefined;
}

function getAccessibleConstructor(classType: reflect.ClassType): reflect.Initializer | undefined {
  if (classType.abstract || !classType.initializer || classType.initializer.protected) {
    return undefined;
  }
  return classType.initializer;
}

/**
 * Return the list of static methods on classtype that return either classtype or a supertype of classtype.
 */
function getStaticFactoryMethods(classType: reflect.ClassType): reflect.Method[] {
  return classType.allMethods.filter(method =>
    method.static && extendsRef(classType, method.returns.type),
  );
}

/**
 * Return the list of static methods on classtype that return either classtype or a supertype of classtype.
 */
function getStaticFactoryProperties(classType: reflect.ClassType): reflect.Property[] {
  return classType.allProperties.filter(prop =>
    prop.static && extendsRef(classType, prop.type),
  );
}

function generateClassInstantiationExample(initializer: reflect.Initializer): Code {
  const exampleContext = new ExampleContext(initializer.system);
  const length = initializer.parameters.length;
  return Code.concatAll(
    new Code(`new ${module(initializer.parentType).importName}.`, [new Import(initializer.parentType)]),
    initializer.parentType.name,
    '(',
    ...(initializer.parameters.map((p, i) => {
      if (length - 1 === i) {
        return exampleValueForParameter(exampleContext, p, i);
      } else {
        return exampleValueForParameter(exampleContext, p, i).append(', ');
      }
    })),
    ')',
  );
}

function generateStaticFactoryMethodExample(classType: reflect.ClassType, staticFactoryMethod: reflect.Method) {
  const exampleContext = new ExampleContext(staticFactoryMethod.system);
  const length = staticFactoryMethod.parameters.length;
  return Code.concatAll(
    new Code(`STATIC METHOD: ${module(classType).importName}.`),
    staticFactoryMethod.parentType.name,
    '.',
    staticFactoryMethod.name,
    '(',
    ...(staticFactoryMethod.parameters.map((p, i) => {
      if (length - 1 === i) {
        return exampleValueForParameter(exampleContext, p, i);
      } else {
        return exampleValueForParameter(exampleContext, p, i).append(', ');
      }
    })),
    ')',
  );
}

function generateStaticFactoryPropertyExample(classType: reflect.ClassType, staticFactoryProperty: reflect.Property) {
  return Code.concatAll(
    new Code(`STATIC PROP: ${module(classType).importName}.`),
    staticFactoryProperty.parentType.name,
    '.',
    staticFactoryProperty.name,
  );
}

/**
 * Generate an example value of the given parameter.
 */
function exampleValueForParameter(context: ExampleContext, param: reflect.Parameter, position: number): Code {
  if (param.name === 'scope' && position === 0) {
    return new Code('this');
  }

  if (param.name === 'id' && position === 1) {
    return new Code(`'My${param.parentType.name}'`);
  }
  // FIXME: render optionality here too
  if (param.optional) {
    return exampleValue(context, param.type, param.name, 0).inject(' // optional', { afterFirstInstanceOf: '{' });
  }
  return exampleValue(context, param.type, param.name, 0);
}

/**
 * Generate an example value of the given type.
 */
function exampleValue(context: ExampleContext, typeReference: reflect.TypeReference, name: string, level: number): Code {
  // Process primitive types, base case
  if (typeReference.primitive !== undefined) {
    switch (typeReference.primitive) {
      case spec.PrimitiveType.String: {
        return new Code(`'${name}'`);
      }
      case spec.PrimitiveType.Number: {
        return new Code('123');
      }
      case spec.PrimitiveType.Boolean: {
        return new Code('false');
      }
      case spec.PrimitiveType.Any: {
        // FIXME: add declaration with type any.
        return new Code('anyValue', [new AnyAssumption('anyValue')]);
      }
      default: {
        return new Code('---');
      }
    }
  }

  // Just pick the first type if it is a union type
  if (typeReference.unionOfTypes !== undefined) {
    // FIXME: which element should get picked?
    const newType = getBaseUnionType(typeReference.unionOfTypes);
    return exampleValue(context, newType, name, level);
  }
  // If its a collection create a collection of one element
  if (typeReference.arrayOfType !== undefined) {
    return Code.concatAll('[', exampleValue(context, typeReference.arrayOfType, name, level), ']');
  }

  if (typeReference.mapOfType !== undefined) {
    return exampleValueForMap(context, typeReference.mapOfType, name, level);
  }

  if (typeReference.fqn) {
    const fqn = typeReference.fqn;
    // See if we have information on this type in the assembly
    const newType = context.typeSystem.findFqn(fqn);

    if (fqn in SPECIAL_TYPE_EXAMPLES) {
      return new Code(SPECIAL_TYPE_EXAMPLES[fqn], [new Import(newType)]);
    }

    if (newType.isEnumType()) {
      return new Code(`${newType.name}.${newType.members[0].name}`, [new Import(newType)]);
    }

    // If this is struct and we're not already rendering it (recursion breaker), expand
    if (isStructType(newType) && !context.rendered.has(newType.fqn)) {
      context.rendered.add(newType.fqn);
      const ret = exampleValueForStruct(context, newType, level);
      context.rendered.delete(newType.fqn);
      return ret;
    }

    // For all other types  we will assume you already have a variable of the appropriate type.
    return addAssumedVariableDeclaration(newType);
  }

  throw new Error('If this happens, then reflect.typeRefernce must have a new value');
}

function getBaseUnionType(types: reflect.TypeReference[]): reflect.TypeReference {
  for (const newType of types) {
    if (newType.fqn?.endsWith('.IResolvable')) {
      continue;
    }
    return newType;
  }
  return types[0];
}

function addAssumedVariableDeclaration(type: reflect.Type): Code {
  let newType = type;
  if (type.isInterfaceType()) {
    // find corresponding non-interface type if possible
    newType = findCorrespondingType(type);
  }
  const variableName = lowercaseFirstLetter(newType.name);
  return new Code(variableName, [new Assumption(newType, variableName), new Import(newType)]);
}

/**
 * This function tries to guess the corresponding type to an IXxx Interface.
 * If it does not find that this type exists, it will return the original type.
 */
function findCorrespondingType(type: reflect.Type): reflect.Type {
  const [start, end] = type.fqn.split('.');
  if (end.length > 2 && end[0] === 'I' && end[1] === end[1].toUpperCase()) {
    const newFqn = start + '.' + end.substr(1);
    // eslint-disable-next-line no-console
    console.log('newFqn ', newFqn);
    const newType = type.system.tryFindFqn(newFqn);
    if (newType) { return newType; }
  }
  return type;
}

/**
 * Helper function to generate an example value for a map.
 */
function exampleValueForMap(context: ExampleContext, map: reflect.TypeReference, name: string, level: number): Code {
  return Code.concatAll(
    '{\n',
    new Code(`${tab(level + 1)}${name}Key: `).append(exampleValue(context, map, name, level + 1)).append(',\n'),
    `${tab(level)}}`,
  );
}

/**
 * Helper function to generate an example value for a struct.
 */
function exampleValueForStruct(context: ExampleContext, struct: reflect.InterfaceType, level: number): Code {
  if (struct.allProperties.length === 0) {
    return new Code('{ }');
  }
  return Code.concatAll(
    '{\n',
    ...(struct.allProperties ?? []).map((p) => {
      return new Code(`${tab(level + 1)}${p.name}: `).append(
        removeOptional(
          addOptional(
            exampleValue(context, p.type, p.name, level + 1),
            p.optional,
          ).append(
            `,${optionalComment(p.optional)}\n`,
          ),
        ),
      );
    }),
    `${tab(level)}}`,
  );
}

function addOptional(code: Code, optional: boolean ): Code {
  if (optional && code.code.indexOf('{\n') !== -1) {
    return code.inject(' // optional', { afterFirstInstanceOf: '{' });
  }
  return code;
}

function removeOptional(code: Code): Code {
  const i = Math.max(code.code.lastIndexOf('}, // optional'), code.code.lastIndexOf('], // optional'));
  const j = Math.max(code.code.lastIndexOf('},'), code.code.lastIndexOf('],'));
  if (i !== -1 && i===j) {
    return code.remove({ afterLastInstanceOf: ' //' }).append('\n');
  }
  return code;
}

function optionalComment(optional: boolean) {
  return optional ? ' // optional' : '';
}

// /**
//  * Adds a comment if the given boolean is true, does nothing otherwise.
//  */
// function optionalComment(context: ExampleContext, property: reflect.Property): string {
//   let typeRef = property.type;
//   if (property.type.unionOfTypes !== undefined) {
//     typeRef = getBaseUnionType(property.type.unionOfTypes);
//   }
//   if (property.type.arrayOfType !== undefined) {
//     typeRef = property.type.arrayOfType;
//   }
//   if (typeRef.fqn) {
//     const type = context.typeSystem.findFqn(typeRef.fqn);
//     if (isStructType(type) || property.type.mapOfType !== undefined) {
//       // eslint-disable-next-line no-console
//       console.log('ISSTRUCTTYPE');
//       return property.optional ? ' // zoinks' : '';
//     }
//   }
//   return property.optional ? ' // optional' : '';
// }

/**
 * Returns whether the given type represents a struct
 */
function isStructType(type: reflect.Type): type is reflect.InterfaceType {
  return type.isInterfaceType() && type.datatype;
}

function extendsRef(subtype: reflect.ClassType, supertypeRef: reflect.TypeReference): boolean {
  if (!supertypeRef.fqn) {
    // Not a named type, can never extend
    return false;
  }

  const superType = subtype.system.findFqn(supertypeRef.fqn);
  return subtype.extends(superType);
}

function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function tab(level: number): string {
  return '  '.repeat(level);
}