import * as spec from '@jsii/spec';
import * as reflect from 'jsii-reflect';
import { TypeSystem } from 'jsii-reflect';

interface Assumption {
  readonly type: reflect.Type;
  readonly variableName: string;
}

export class ExampleContext {
  public readonly typeSystem: TypeSystem; // FIXME make this private
  public readonly breaker: Set<string> = new Set();
  public readonly assumptions: Assumption[] = [];
  //private readonly imports: string[] = [];

  constructor(typeSystem: TypeSystem) {
    this.typeSystem = typeSystem;
  }

  public addAssumedVariableDeclaration(type: reflect.Type): string {
    const existing = this.assumptions.find(a => a.type === type);
    if (existing) {
      return existing.variableName;
    }

    // FIXME: Potentially a counter here if we have the same name already
    const variableName = lowercaseFirstLetter(type.name);
    this.assumptions.push({ type, variableName });
    return variableName;
  }
}

export function generateClassAssignment(classType: reflect.ClassType): string | undefined {
  const expression = generateClassExample(classType);
  if (!expression) {
    return undefined;
  }

  return `const ${lowercaseFirstLetter(classType.name)} = ${expression};`;
}

function generateClassExample(classType: reflect.ClassType): string | undefined {
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

function generateClassInstantiationExample(initializer: reflect.Initializer) {
  // FIXME: this should actually return a expression plus assumptions/imports (to be rendered in generateClassAssignment)
  const example = [];
  // eslint-disable-next-line no-console
  console.log(`${initializer.parentType.fqn} could have example`);
  example.push(`new ${initializer.parentType.name}`);
  const exampleContext = new ExampleContext(initializer.system);
  example.push(parenthesize(initializer.parameters.map((p, i) => exampleValueForParameter(exampleContext, p, i)).join(', ')));
  example.unshift(...makeVariableDeclarations(exampleContext.assumptions));
  return example.join('');
}

// FIXME: no need, just one variable for each
function makeVariableDeclarations(assumptions: Assumption[]): string[] {
  return assumptions.map(assumption =>
    `declare const ${assumption.variableName}: ${module(assumption.type).importName}.${assumption.type.name};\n`,
  );
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

function exampleValueForParameter(context: ExampleContext, param: reflect.Parameter, position: number) {
  if (param.name === 'scope' && position === 0) {
    return 'this';
  }

  if (param.name === 'id' && position === 1) {
    return `'My${param.parentType.name}'`;
  }

  return exampleValue(context, param.type, param.name, 0);
}

/**
 * Given a type, generate an example value of that type
 */
function exampleValue(context: ExampleContext, typeReference: reflect.TypeReference, name: string, level: number): string {
  // Process primitive types, base case
  if (typeReference.primitive !== undefined) {
    switch (typeReference.primitive) {
      case spec.PrimitiveType.String: {
        return `'${name}'`;
      }
      case spec.PrimitiveType.Number: {
        return '0';
      }
      case spec.PrimitiveType.Boolean: {
        return 'false';
      }
      case spec.PrimitiveType.Any: {
        return '\'any-value\'';
      }
      default: {
        return '---';
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
    return inArray(exampleValue(context, typeReference.arrayOfType, name, level));
  }

  if (typeReference.mapOfType !== undefined) {
    // FIXME:  This is probably wrong, compare it to the rendering of structs
    return inObject(`\n${tab(level)}${name}Key: ${exampleValue(context, typeReference.mapOfType, name, level+1)}`);
  }

  // Process objects recursively
  if (typeReference.fqn) {
    //console.log('named: ',name, typeReference);
    const fqn = typeReference.fqn;
    // See if we have information on this type in the assembly
    const type = context.typeSystem.findFqn(fqn);

    if (fqn in SPECIAL_TYPE_EXAMPLES) {
      return SPECIAL_TYPE_EXAMPLES[fqn];
    }

    if (type.isEnumType()) {
      // FIXME: Imports?
      return `${type.name}.${type.members[0].name}`;
    }

    // If this is struct and we're not already rendering it (recursion breaker), expand
    if (isStructType(type) && !context.breaker.has(type.fqn)) {
      context.breaker.add(type.fqn);
      const ret = exampleValueForStruct(context, type, level);
      context.breaker.delete(type.fqn);
      return ret;
    }

    // For all other types  we will assume you already have a variable of the appropriate type.
    return context.addAssumedVariableDeclaration(type);
  }

  return 'OH NO';
}

function exampleValueForStruct(context: ExampleContext, struct: reflect.InterfaceType, level: number) {
  if (struct.allProperties.length === 0) {
    return '{ }';
  }

  return [
    '{\n',
    ... (struct.allProperties ?? []).map(p =>
      `${tab(level + 1)}${p.name}: ${exampleValue(context, p.type, p.name, level + 1)},\n`),
    tab(level) + '}',
  ].join('');
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


// function isEmpty(fragment: string): string {
//   let newFragment: string;
//   newFragment = fragment.trim();
//   // eslint-disable-next-line no-console
//   if (newFragment.length === 0) {
//     return '';
//   } else {
//     return fragment;
//   }
// }

function lowercaseFirstLetter(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function tab(level: number): string {
  return '  '.repeat(level);
}

function parenthesize(fragment: string): string {
  return `(${fragment})`;
}

function inObject(fragment: string): string {
  return `{${fragment}}`;
}

function inArray(fragment: string): string {
  return `[${fragment}]`;
}

interface ImportedModule {
  readonly importName: string;
  readonly moduleName: string;
}

function module(type: reflect.Type): ImportedModule {
  // FIXME: Needs to be submodule-aware for v2

  const parts = type.assembly.name.split('/');

  const nonNamespacedPart = parts[1] ?? parts[0];
  return {
    importName: nonNamespacedPart.replace(/^aws-/g, '').replace(/[^a-z0-9_]/g, '_'),
    moduleName: type.assembly.name,
  };
}

// function typeName(fqn: string): string {
//   const type = fqn.split('.');
//   return type[1];
// }

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
