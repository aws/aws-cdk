import * as reflect from 'jsii-reflect';
import { ConstructReflection } from './construct';
import { CoreTypes } from './core-types';
import { Linter } from '../linter';

const EXCLUDE_ANNOTATION_REF_VIA_INTERFACE =
  '[disable-awslint:ref-via-interface]';

const EXCLUDE_ANNOTATION_REF_VIA_REF_INTERFACE =
  '[disable-awslint:ref-via-ref-interface]';

// lint all constructs that are not L1 resources
export const apiLinter = new Linter((a) =>
  ConstructReflection.findAllConstructs(a).filter(
    (c) => !CoreTypes.isCfnResource(c.classType),
  ),
);

apiLinter.add({
  code: 'ref-via-ref-interface',
  message:
    'API should use reference interfaces and not construct interface (%s). ' +
    `If this is intentional, add "${EXCLUDE_ANNOTATION_REF_VIA_REF_INTERFACE}" to element's jsdoc`,
  eval: (e) => {
    const cls = e.ctx.classType;
    visitClass(cls, {
      // Any interfaces should be `ICfnAbc`
      assertInterfaceType: (type, docs, scope) => {
        // Receiving a generic construct is allowed
        if (type.fqn === 'constructs.IConstruct') {
          return;
        }

        // allow exclusion of this rule
        if (
          docs.summary.includes(EXCLUDE_ANNOTATION_REF_VIA_REF_INTERFACE) ||
          docs.remarks.includes(EXCLUDE_ANNOTATION_REF_VIA_REF_INTERFACE)
        ) {
          return;
        }

        e.assert(type.name.startsWith('ICfn'), scope, type.fqn);
      },
    });
  },
});

apiLinter.add({
  code: 'ref-via-interface',
  message:
    'API should use interface and not the concrete class (%s). ' +
    `If this is intentional, add "${EXCLUDE_ANNOTATION_REF_VIA_INTERFACE}" to element's jsdoc`,
  eval: (e) => {
    const cls = e.ctx.classType;
    visitClass(cls, {
      // classes are okay as long as they are not resource constructs
      assertClassType: (type, docs, scope) => {
        if (!CoreTypes.isResourceClass(type)) {
          return;
        }

        if (type.fqn === e.ctx.core.constructClass.fqn) {
          return;
        }

        // allow exclusion of this rule
        if (
          docs.summary.includes(EXCLUDE_ANNOTATION_REF_VIA_INTERFACE) ||
          docs.remarks.includes(EXCLUDE_ANNOTATION_REF_VIA_INTERFACE)
        ) {
          return;
        }

        e.assert(false, scope, type.fqn);
      },
    });
  },
});

function visitClass(
  cls: reflect.ClassType,
  assertions: {
    assertClassType?: (
      type: reflect.ClassType,
      docs: reflect.Docs,
      scope: string
    ) => void;
    assertInterfaceType?: (
      type: reflect.InterfaceType,
      docs: reflect.Docs,
      scope: string
    ) => void;
  } = {},
) {
  const visited = new Set<string>();

  _visitClass(cls);

  function _visitClass(type: reflect.ClassType): void {
    if (visited.has(type.fqn)) {
      return;
    }
    visited.add(type.fqn);

    for (const method of type.allMethods) {
      visitMethod(method);
    }

    if (type.initializer) {
      visitMethod(type.initializer);
    }
  }

  function visitDataType(type: reflect.InterfaceType): void {
    for (const property of type.allProperties) {
      visitProperty(property);
    }
  }

  function visitInterface(
    type: reflect.InterfaceType,
    docs: reflect.Docs,
    scope: string,
  ): void {
    if (visited.has(type.fqn)) {
      return;
    }
    visited.add(type.fqn);

    if (type.datatype) {
      visitDataType(type);
    } else if (assertions.assertInterfaceType) {
      assertions.assertInterfaceType(type, docs, scope);
    }

    for (const method of type.allMethods) {
      visitMethod(method);
    }
  }

  function visitProperty(property: reflect.Property) {
    if (property.protected) {
      return;
    }

    const site = property.overrides ? property.overrides : property.parentType;
    visitType(property.type, property.docs, `${site.fqn}.${property.name}`);
  }

  function visitMethod(method: reflect.Callable) {
    if (method.protected) {
      return;
    }

    const site = method.overrides ? method.overrides : method.parentType;
    const scope = `${site.fqn}.${method.name}`;

    let firstMethod: reflect.Callable | undefined =
      site.isClassType() || site.isInterfaceType()
        ? site.allMethods.find((m) => m.name === method.name)
        : undefined;

    if (!firstMethod) {
      firstMethod = method;
    }

    for (const param of firstMethod.parameters) {
      visitType(param.type, param.docs, `${scope}.${param.name}`);
    }

    // note that we do not require that return values will use an interface
  }

  function visitType(
    type: reflect.TypeReference,
    docs: reflect.Docs,
    scope: string,
  ): void {
    if (type.primitive) {
      return;
    }

    if (type.void) {
      return;
    }

    if (type.arrayOfType) {
      return visitType(type.arrayOfType, docs, scope);
    }

    if (type.mapOfType) {
      return visitType(type.mapOfType, docs, scope);
    }

    if (type.unionOfTypes) {
      for (const t of type.unionOfTypes) {
        visitType(t, docs, scope);
      }
      return;
    }

    // interfaces are okay
    if (type.type && type.type.isInterfaceType()) {
      return visitInterface(type.type, docs, scope);
    }

    // enums are okay
    if (type.type && type.type.isEnumType()) {
      return;
    }

    // classes are okay as long as they are not resource constructs
    if (type.type && type.type.isClassType()) {
      if (assertions.assertClassType) {
        assertions.assertClassType(type.type, docs, scope);
      }
      return;
    }

    throw new Error(`invalid type reference: ${type.toString()}`);
  }
}
