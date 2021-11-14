import * as spec from '@jsii/spec';
import * as reflect from 'jsii-reflect';
import { TypeSystem } from 'jsii-reflect';

import { Code } from './code';
import { AnyAssumption, Assumption, Import } from './declaration';
import { escapeIdentifier, typeReference } from './module-utils';
import { sortBy } from './utils';

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

export function generateAssignmentStatement(type: reflect.ClassType | reflect.InterfaceType): Code | undefined {
  const context = new ExampleContext(type.system);

  if (type.isClassType()) {
    const expression = exampleValueForClass(context, type, 0);
    if (!expression) { return undefined; }
    return Code.concatAll(
      `const ${lowercaseFirstLetter(type.name)} = `,
      expression,
      ';',
    );
  }

  if (type.isInterfaceType()) {
    const expression = exampleValueForStruct(context, type, 0);
    if (!expression) { return undefined; }

    return Code.concatAll(
      `const ${lowercaseFirstLetter(type.name)}: `,
      typeReference(type),
      ' = ',
      expression,
      ';',
    );
  }

  return undefined;
}

function exampleValueForClass(context: ExampleContext, classType: reflect.ClassType, level: number): Code | undefined {
  const staticFactoryMethods = getStaticFactoryMethods(classType);
  const staticFactoryProperties = getStaticFactoryProperties(classType);
  const initializer = getAccessibleConstructor(classType);

  if (initializer && initializer.parameters.length >= 3) {
    return generateClassInstantiationExample(context, initializer, level);
  }

  if (staticFactoryMethods.length >= 3) {
    return generateStaticFactoryMethodExample(context, staticFactoryMethods[0], level);
  }

  if (staticFactoryProperties.length >= 3) {
    return generateStaticFactoryPropertyExample(staticFactoryProperties[0]);
  }

  if (initializer) {
    return generateClassInstantiationExample(context, initializer, level);
  }

  if (staticFactoryMethods.length >= 1) {
    return generateStaticFactoryMethodExample(context, staticFactoryMethods[0], level);
  }

  if (staticFactoryProperties.length >= 1) {
    return generateStaticFactoryPropertyExample(staticFactoryProperties[0]);
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

function generateClassInstantiationExample(context: ExampleContext, initializer: reflect.Initializer, level: number): Code {
  return Code.concatAll(
    'new ',
    typeReference(initializer.parentType),
    '(',
    parameterList(context, initializer.parameters, level),
    ')',
  );
}

function parameterList(context: ExampleContext, parameters: reflect.Parameter[], level: number) {
  const length = parameters.length;
  return Code.concatAll(
    ...parameters.map((p, i) => {
      if (length - 1 === i) {
        return exampleValueForParameter(context, p, i, level);
      } else {
        return exampleValueForParameter(context, p, i, level).append(', ');
      }
    }),
  );
}

function generateStaticFactoryMethodExample(
  context: ExampleContext,
  staticFactoryMethod: reflect.Method,
  level: number,
) {
  return Code.concatAll(
    typeReference(staticFactoryMethod.parentType),
    '.',
    staticFactoryMethod.name,
    '(',
    parameterList(context, staticFactoryMethod.parameters, level),
    ')',
  );
}

function generateStaticFactoryPropertyExample(staticFactoryProperty: reflect.Property) {
  return Code.concatAll(
    typeReference(staticFactoryProperty.parentType),
    '.',
    staticFactoryProperty.name,
  );
}

/**
 * Generate an example value of the given parameter.
 */
function exampleValueForParameter(context: ExampleContext, param: reflect.Parameter, position: number, level: number): Code {
  if (param.name === 'scope' && position === 0) {
    return new Code('this');
  }

  if (param.name === 'id' && position === 1) {
    return new Code(`'My${param.parentType.name}'`);
  }
  if (param.optional) {
    return new Code('/* all optional props */ ').append(exampleValue(context, param.type, param.name, level));
  }
  return exampleValue(context, param.type, param.name, level);
}

/**
 * Generate an example value of the given type.
 */
function exampleValue(context: ExampleContext, typeRef: reflect.TypeReference, name: string, level: number): Code {
  // Process primitive types, base case
  if (typeRef.primitive !== undefined) {
    switch (typeRef.primitive) {
      case spec.PrimitiveType.String:
        return new Code(`'${name}'`);
      case spec.PrimitiveType.Number:
        return new Code('123');
      case spec.PrimitiveType.Boolean:
        return new Code('false');
      case spec.PrimitiveType.Date:
        return new Code('new Date()');
      default:
        return new Code(name, [new AnyAssumption(name)]);
    }
  }

  // Just pick the first type if it is a union type
  if (typeRef.unionOfTypes !== undefined) {
    const newType = getBaseUnionType(typeRef.unionOfTypes);
    return exampleValue(context, newType, name, level);
  }
  // If its a collection create a collection of one element
  if (typeRef.arrayOfType !== undefined) {
    return Code.concatAll('[', exampleValue(context, typeRef.arrayOfType, name, level), ']');
  }

  if (typeRef.mapOfType !== undefined) {
    return exampleValueForMap(context, typeRef.mapOfType, name, level);
  }

  if (typeRef.fqn) {
    const fqn = typeRef.fqn;
    // See if we have information on this type in the assembly
    const newType = context.typeSystem.findFqn(fqn);

    if (fqn in SPECIAL_TYPE_EXAMPLES) {
      return new Code(SPECIAL_TYPE_EXAMPLES[fqn], [new Import(newType)]);
    }

    if (newType.isEnumType()) {
      return Code.concatAll(
        typeReference(newType),
        '.',
        newType.members[0].name);
    }

    // If this is struct and we're not already rendering it (recursion breaker), expand
    if (isStructType(newType)) {
      if (context.rendered.has(newType.fqn)) {
        // Recursion breaker -- if we go by the default behavior end up saying something like:
        //
        //   const myProperty = {
        //      stringProp: 'stringProp',
        //      deepProp: myProperty,   // <-- value recursion!
        //   };
        //
        // Which TypeScript's type analyzer can't automatically derive a type for. We need to
        // annotate SOMETHING. A simple fix is to use a different variable name so the value
        // isn't self-recursive.

        return addAssumedVariableDeclaration(newType, '_');
      }


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

/**
 * Add an assumption and import for a variable that will be declared as a constant.
 * If the variable is an IXxx Interface, guess a possible implementation of that interface
 * by checking if stripping the I results in an Xxx type that extends IXxx.
 */
function addAssumedVariableDeclaration(type: reflect.Type, suffix = ''): Code {
  let newType = type;
  if (type.isInterfaceType() && !type.datatype) {
    // guess corresponding non-interface type if possible
    newType = guessConcreteType(type);
  }
  const variableName = escapeIdentifier(lowercaseFirstLetter(stripLeadingI(newType.name))) + suffix;
  return new Code(variableName, [new Assumption(newType, variableName), new Import(newType)]);
}

/**
 * Remove a leading 'I' from a name, if it's being followed by another capital letter
 */
function stripLeadingI(name: string) {
  return name.replace(/^I([A-Z])/, '$1');
}

/**
 * This function tries to guess the corresponding type to an IXxx Interface.
 * If it does not find that this type exists, it will return the original type.
 */
function guessConcreteType(type: reflect.InterfaceType): reflect.Type {
  const concreteClassName = type.name.substr(1); // Strip off the leading 'I'

  const parts = type.fqn.split('.');
  parts[parts.length - 1] = concreteClassName;
  const newFqn = parts.join('.');

  const newType = type.system.tryFindFqn(newFqn);
  return newType && newType.extends(type) ? newType : type;
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

  const properties = [...struct.allProperties]; // Make a copy that we can sort
  sortBy(properties, (p) => [p.optional ? 1 : 0, p.name]);

  const renderedProperties = properties.map((p) =>
    Code.concatAll(
      `${tab(level + 1)}${p.name}: `,
      exampleValue(context, p.type, p.name, level + 1),
      ',\n',
    ),
  );

  // Add an empty line between required and optional properties
  for (let i = 0; i < properties.length - 1; i++) {
    if (properties[i].optional !== properties[i + 1].optional) {
      renderedProperties.splice(i + 1, 0, new Code(`\n${tab(level+1)}// the properties below are optional\n`));
      break;
    }
  }

  return Code.concatAll(
    '{\n',
    ...renderedProperties,
    `${tab(level)}}`,
  );
}

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