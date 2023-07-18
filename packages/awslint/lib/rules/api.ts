import * as reflect from 'jsii-reflect';
import { ConstructReflection } from './construct';
import { CoreTypes } from './core-types';
import { Linter } from '../linter';

const EXCLUDE_ANNOTATION_REF_VIA_INTERFACE = '[disable-awslint:ref-via-interface]';

// lint all constructs that are not L1 resources
export const apiLinter = new Linter(a => ConstructReflection
  .findAllConstructs(a)
  .filter(c => !CoreTypes.isCfnResource(c.classType)));

apiLinter.add({
  code: 'ref-via-interface',
  message: 'API should use interface and not the concrete class (%s). ' +
    `If this is intentional, add "${EXCLUDE_ANNOTATION_REF_VIA_INTERFACE}" to element's jsdoc`,
  eval: e => {
    const cls = e.ctx.classType;
    const visited = new Set<string>();

    assertClass(cls);

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
      if (type.primitive) {
        return;
      }

      if (type.void) {
        return;
      }

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

      // enums are okay
      if (type.type && type.type.isEnumType()) {
        return;
      }

      // classes are okay as long as they are not resource constructs
      if (type.type && type.type.isClassType()) {
        if (!CoreTypes.isResourceClass(type.type)) {
          return;
        }

        if (type.type.fqn === e.ctx.core.constructClass.fqn) {
          return;
        }

        // allow exclusion of this rule
        if (docs.summary.includes(EXCLUDE_ANNOTATION_REF_VIA_INTERFACE) || docs.remarks.includes(EXCLUDE_ANNOTATION_REF_VIA_INTERFACE)) {
          return;
        }

        e.assert(false, scope, type.type.fqn);
        return;
      }

      throw new Error(`invalid type reference: ${type.toString()}`);
    }
  },
});
