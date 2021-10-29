import * as spec from '@jsii/spec';
import * as reflect from 'jsii-reflect';
import { TypeSystem } from 'jsii-reflect';

import { Assumption, Code } from './code';

export class ExampleContext {
  private readonly _typeSystem: TypeSystem;
  private readonly _rendered: Set<string> = new Set();
  private readonly _assumptions: Assumption[] = [];
  //private readonly imports: string[] = [];

  constructor(typeSystem: TypeSystem) {
    this._typeSystem = typeSystem;
  }

  public get typeSystem() {
    return this._typeSystem;
  }

  public get rendered() {
    return this._rendered;
  }

  public get assumptions() {
    return this._assumptions;
  }

  public addAssumedVariableDeclaration(type: reflect.Type): Code {
    // FIXME: Potentially a counter here if we have the same name already
    const variableName = lowercaseFirstLetter(type.name);
    return new Code(variableName, [{ type, variableName }]);
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
  if (staticFactoryMethods.length > 0) {
    return generateStaticFactoryMethodExample(classType, staticFactoryMethods[0]);
  }

  const staticFactoryProperties = getStaticFactoryProperties(classType);
  if (staticFactoryProperties.length > 0) {
    return generateStaticFactoryPropertyExample(classType, staticFactoryProperties[0]);
  }

  const initializer = getAccessibleConstructor(classType);
  if (initializer) {
    return generateClassInstantiationExample(initializer);
  }

  return undefined;
}

function getAccessibleConstructor(classType: reflect.ClassType): reflect.Initializer | undefined {
  if (classType.abstract || !classType.initializer || classType.initializer.protected) {
    return undefined;
  }
  return classType.initializer;
}

function generateClassInstantiationExample(initializer: reflect.Initializer): Code {
  const exampleContext = new ExampleContext(initializer.system);

  return Code.concatAll(
    `new ${initializer.parentType.name}`,
    '(',
    ...(initializer.parameters.map((p, i, params) => {
      if (params.length -1 === i) {
        return exampleValueForParameter(exampleContext, p, i);
      } else {
        return exampleValueForParameter(exampleContext, p, i).append(', ');
      }
    })),
    ')',
  );
  // example.append(
  //   '(',
  //   initializer.parameters.map((p, i) => exampleValueForParameter(exampleContext, p, i)).join(', '),
  //   ')',
  // );
  //example.unshift(...makeVariableDeclarations(exampleContext.assumptions));
  //return example;
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

function generateStaticFactoryMethodExample(_classType: reflect.ClassType, _staticFactoryMethods: reflect.Method) {
  return undefined;
}

function generateStaticFactoryPropertyExample(_classType: reflect.ClassType, _staticFactoryProperties: reflect.Property) {
  return undefined;
}

function exampleValueForParameter(context: ExampleContext, param: reflect.Parameter, position: number): Code {
  if (param.name === 'scope' && position === 0) {
    return new Code('this');
  }

  if (param.name === 'id' && position === 1) {
    return new Code(`'My${param.parentType.name}'`);
  }

  return exampleValue(context, param.type, param.name, 0);
}

/**
 * Given a type, generate an example value of that type
 */
function exampleValue(context: ExampleContext, typeReference: reflect.TypeReference, name: string, level: number): Code {
  // Process primitive types, base case
  if (typeReference.primitive !== undefined) {
    switch (typeReference.primitive) {
      case spec.PrimitiveType.String: {
        return new Code(`'${name}'`);
      }
      case spec.PrimitiveType.Number: {
        return new Code('0');
      }
      case spec.PrimitiveType.Boolean: {
        return new Code('false');
      }
      case spec.PrimitiveType.Any: {
        return new Code('\'any-value\'');
      }
      default: {
        return new Code('---');
      }
    }
  }

  // Just pick the first type if it is a union type
  if (typeReference.unionOfTypes !== undefined) {
    // TODO: which element should get picked?
    for (const newType of typeReference.unionOfTypes) {
      if (newType.fqn?.endsWith('.IResolvable')) {
        continue;
      }
      return exampleValue(context, newType, name, level);
    }
    const newType = typeReference.unionOfTypes[0];
    return exampleValue(context, newType, name, level);
  }
  // If its a collection create a collection of one element
  if (typeReference.arrayOfType !== undefined) {
    return Code.concatAll('[', exampleValue(context, typeReference.arrayOfType, name, level), ']');
  }

  if (typeReference.mapOfType !== undefined) {
    return exampleValueForMap(context, typeReference.mapOfType, name, level);
  }

  // Process objects recursively
  if (typeReference.fqn) {
    //console.log('named: ',name, typeReference);
    const fqn = typeReference.fqn;
    // See if we have information on this type in the assembly
    const type = context.typeSystem.findFqn(fqn);

    if (fqn in SPECIAL_TYPE_EXAMPLES) {
      return new Code(SPECIAL_TYPE_EXAMPLES[fqn]);
    }

    if (type.isEnumType()) {
      // FIXME: Imports?
      return new Code(`${type.name}.${type.members[0].name}`);
    }

    // If this is struct and we're not already rendering it (recursion breaker), expand
    if (isStructType(type) && !context.rendered.has(type.fqn)) {
      context.rendered.add(type.fqn);
      const ret = exampleValueForStruct(context, type, level);
      context.rendered.delete(type.fqn);
      return ret;
    }

    // For all other types  we will assume you already have a variable of the appropriate type.
    return context.addAssumedVariableDeclaration(type);
  }

  return new Code('OH NO');
}

function exampleValueForMap(context: ExampleContext, map: reflect.TypeReference, name: string, level: number): Code {
  return Code.concatAll(
    '{\n',
    new Code(`${tab(level + 1)}${name}Key: `).append(exampleValue(context, map, name, level + 1)).append(',\n'),
    `${tab(level)}}`,
  );
}

function exampleValueForStruct(context: ExampleContext, struct: reflect.InterfaceType, level: number): Code {
  if (struct.allProperties.length === 0) {
    return new Code('{ }');
  }
  return Code.concatAll(
    '{\n',
    ...(struct.allProperties ?? []).map(p =>
      new Code(`${tab(level + 1)}${p.name}: `).append(exampleValue(context, p.type, p.name, level + 1)).append(',\n'),
    ),
    `${tab(level)}}`,
  );
}

/**
 * Special types that have a standard way of coming up with an example value
 *
 * FIXME: We will need to generate imports for these as well. Whoopsie :D
 */
const SPECIAL_TYPE_EXAMPLES: Record<string, string> = {
  '@aws-cdk/core.Duration': 'Duration.minutes(30)',
  'aws-cdk-lib.Duration': 'Duration.minutes(30)',
};

function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function tab(level: number): string {
  return '  '.repeat(level);
}

function extendsRef(subtype: reflect.ClassType, supertypeRef: reflect.TypeReference) {
  if (!supertypeRef.fqn) {
    // Not a named type, can never extend
    return false;
  }

  const superType = subtype.system.findFqn(supertypeRef.fqn);
  return subtype.extends(superType);
}

/**
 * Returns whether the given type represents a struct
 */
function isStructType(type: reflect.Type): type is reflect.InterfaceType {
  return type.isInterfaceType() && type.datatype;
}
