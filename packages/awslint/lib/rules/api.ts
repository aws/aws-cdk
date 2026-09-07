import type * as reflect from 'jsii-reflect';
import { ConstructReflection } from './construct';
import { CoreTypes } from './core-types';
import { Linter } from '../linter';

const CLASS_ON_PURPOSE_RULE = 'ref-via-interface';
const L2_INTERFACE_ON_PURPOSE_RULE = 'prefer-ref-interface';

// lint all constructs that are not L1 resources
export const apiLinter = new Linter(a => ConstructReflection
  .findAllConstructs(a)
  .filter(c => !CoreTypes.isCfnResource(c.classType)));

apiLinter.add({
  code: CLASS_ON_PURPOSE_RULE,
  message: 'API should use interface (preferably IxxxRef, otherwise Ixxx) and not the concrete class (%s). ' +
    `If this is intentional, add "${ignoreTag(CLASS_ON_PURPOSE_RULE)}" to element's jsdoc`,
  eval: e => {
    visitParameters(e.ctx.classType, {
      visitType: function (type: reflect.TypeReference, docs: reflect.Docs, scope: string): void {
        // allow exclusion of this rule
        if (docHasIgnoreTag(docs, CLASS_ON_PURPOSE_RULE)) {
          return;
        }

        // Assert that all types that reference classes are not resource constructs. Those
        // should be referenced via Interface.
        e.assert(!type.type
          || !type.type.isClassType()
          || !CoreTypes.isResourceClass(type.type)
          // Make an exception for `constructs.Construct`.
          || type.type.fqn === e.ctx.core.baseConstructClassFqn,
        scope,
        type.type?.fqn,
        );
      },
    });
  },
});

apiLinter.add({
  code: L2_INTERFACE_ON_PURPOSE_RULE,
  message: 'API should prefer to use the L1 reference interface (IxxxRef) and not the L2 interface (%s). ' +
    `If this is intentional, add "${ignoreTag(L2_INTERFACE_ON_PURPOSE_RULE)}" to element's jsdoc`,
  eval: e => {
    visitParameters(e.ctx.classType, {
      visitType: function (type: reflect.TypeReference, docs: reflect.Docs, scope: string): void {
        // allow exclusion of this rule
        if (docHasIgnoreTag(docs, L2_INTERFACE_ON_PURPOSE_RULE)) {
          return;
        }

        // Assert that all types that interfaces are not L2 interfaces. This is actually not checking
        // that they ARE Ref interfaces, just that they aren't L2 interfaces (could also be service-
        // specific non-resource interfaces, and those are fine too)
        e.assert(!type.type
          || !type.type.isInterfaceType()
          || type.type.datatype
          || !CoreTypes.isL2Interface(type.type),
        scope,
        type.type?.fqn,
        );
      },
    });
  },
});

function ignoreTag(rule: string) {
  return `[disable-awslint:${rule}]`;
}

function docHasIgnoreTag(docs: reflect.Docs, rule: string) {
  const tag = ignoreTag(rule);
  return docs.summary.includes(tag) || docs.remarks.includes(tag);
}

/**
 * Visit all types in the API of a given type
 *
 * This visits method parameters and members of structs of method parameters.
 */
function visitParameters(root: reflect.Type, visitor: TypeVisitor) {
  const visited = new Set<string>();

  if (root.isClassType()) {
    assertClass(root);
  } else if (root.isInterfaceType()) {
    assertInterface(root);
  } else {
    throw new Error(`invalid type: ${root.toString()}`);
  }

  function assertClass(type: reflect.ClassType): void {
    if (visited.has(type.fqn)) { return; }
    visited.add(type.fqn);

    for (const method of type.allMethods) {
      assertMethod(method);
    }

    if (type.initializer) {
      assertMethod(type.initializer);
    }
  }

  function assertDataType(type: reflect.InterfaceType): void {
    for (const property of type.allProperties) {
      assertProperty(property);
    }
  }

  function assertInterface(type: reflect.InterfaceType): void {
    if (visited.has(type.fqn)) { return; }
    visited.add(type.fqn);

    if (type.datatype) {
      assertDataType(type);
    }

    for (const method of type.allMethods) {
      assertMethod(method);
    }
  }

  function assertProperty(property: reflect.Property) {
    if (property.protected) {
      return;
    }

    const site = property.overrides ? property.overrides : property.parentType;
    assertType(property.type, property.docs, `${site.fqn}.${property.name}`);
  }

  function assertMethod(method: reflect.Callable) {
    if (method.protected) {
      return;
    }

    const site = method.overrides ? method.overrides : method.parentType;
    const scope = `${site.fqn}.${method.name}`;

    let firstMethod: reflect.Callable | undefined = site.isClassType() || site.isInterfaceType()
      ? site.allMethods.find(m => m.name === method.name)
      : undefined;

    if (!firstMethod) {
      firstMethod = method;
    }

    for (const param of firstMethod.parameters) {
      assertType(param.type, param.docs, `${scope}.${param.name}`);
    }

    // note that we do not require that return values will use an interface
  }

  function assertType(type: reflect.TypeReference, docs: reflect.Docs, scope: string): void {
    visitor.visitType(type, docs, scope);

    // And recurse
    if (type.arrayOfType) {
      return assertType(type.arrayOfType, docs, scope);
    }

    if (type.mapOfType) {
      return assertType(type.mapOfType, docs, scope);
    }

    if (type.unionOfTypes) {
      for (const t of type.unionOfTypes) {
        assertType(t, docs, scope);
      }
      return;
    }

    // interfaces are okay
    if (type.type && type.type.isInterfaceType()) {
      return assertInterface(type.type);
    }
  }
}

interface TypeVisitor {
  visitType(type: reflect.TypeReference, docs: reflect.Docs, scope: string): void;
}
