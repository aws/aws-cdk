import { Stability } from '@jsii/spec';
import * as reflect from 'jsii-reflect';
import { CoreTypes } from './core-types';
import { Linter } from '../linter';

type DocsLinterContext = {
  readonly assembly: reflect.Assembly;
  readonly errorKey: string;
} & ({ readonly kind: 'type'; documentable: reflect.Type }
| { readonly kind: 'interface-property'; containingType: reflect.InterfaceType; documentable: reflect.Property }
| { readonly kind: 'class-property'; containingType: reflect.ClassType; documentable: reflect.Property }
| { readonly kind: 'method'; containingType: reflect.ReferenceType; documentable: reflect.Method }
| { readonly kind: 'enum-member'; containingType: reflect.EnumType; documentable: reflect.EnumMember }
);

export const docsLinter = new Linter<DocsLinterContext>(assembly => {
  return [
    ...flatMap(assembly.classes, classType => [
      { assembly, kind: 'type', documentable: classType, errorKey: classType.fqn },
      ...classType.ownProperties.map(property => ({ assembly, kind: 'class-property', containingType: classType, documentable: property, errorKey: `${classType.fqn}.${property.name}` })),
      ...classType.ownMethods.map(method => ({ assembly, kind: 'method', containingType: classType, documentable: method, errorKey: `${classType.fqn}.${method.name}` })),
    ]),
    ...flatMap(assembly.interfaces, interfaceType => [
      { assembly, kind: 'type', documentable: interfaceType, errorKey: interfaceType.fqn },
      ...interfaceType.ownProperties.map(property => ({ assembly, kind: 'interface-property', containingType: interfaceType, documentable: property, errorKey: `${interfaceType.fqn}.${property.name}` })),
      ...interfaceType.ownMethods.map(method => ({ assembly, kind: 'method', containingType: interfaceType, documentable: method, errorKey: `${interfaceType.fqn}.${method.name}` })),
    ]),
    ...flatMap(assembly.enums, enumType => [
      { assembly, kind: 'type', documentable: enumType, errorKey: enumType.fqn },
      ...enumType.members.map(member => ({ assembly, kind: 'enum-member', containingType: enumType, documentable: member, errorKey: `${enumType.fqn}.${member.name}` })),
    ]),
  ] as DocsLinterContext[];
});

docsLinter.add({
  code: 'docs-public-apis',
  message: 'Public API element must have a docstring',
  eval: e => {
    if (!isPublic(e.ctx)) { return; }
    // this rule does not apply to L1 constructs
    if (isCfnType(e.ctx)) { return; }

    if (!e.ctx.documentable.docs.summary) {
      e.assert(e.ctx.documentable.docs.summary, e.ctx.errorKey);
    }
  },
});

docsLinter.add({
  code: 'props-default-doc',
  message: 'Optional property must have @default documentation',
  eval: e => {
    if (e.ctx.kind !== 'interface-property') { return; }
    if (!e.ctx.containingType.isDataType()) { return; }
    // this rule does not apply to L1 constructs
    if (CoreTypes.isCfnType(e.ctx.containingType)) { return; }

    const property = e.ctx.documentable;
    e.assert(!property.optional || property.docs.docs.default !== undefined, e.ctx.errorKey);
  },
});

docsLinter.add({
  code: 'props-no-undefined-default',
  message: '\'@default undefined\' is not helpful. Users will know the VALUE is literally \'undefined\' if they don\'t specify it, but what is the BEHAVIOR if they do so?',
  eval: e => {
    if (e.ctx.kind !== 'interface-property') { return; }
    if (!e.ctx.containingType.isDataType()) { return; }

    const property = e.ctx.documentable;
    e.assert(property.docs.docs.default !== 'undefined', e.ctx.errorKey);
  },
});

docsLinter.add({
  code: 'no-experimental-apis',
  message: 'The use of @experimental in not allowed',
  eval: e => {
    if (!isPublic(e.ctx)) { return; }
    // technically we should ban the use of @experimental in the codebase. Since jsii marks all symbols
    // of experimental modules as experimental we can't.
    if (isModuleExperimental(e.ctx.assembly)) {
      return;
    }
    const sym = e.ctx.documentable;
    e.assert(sym.docs.docs.stability !== Stability.Experimental, e.ctx.errorKey);
  },
});

function isPublic(ctx: DocsLinterContext) {
  switch (ctx.kind) {
    case 'class-property':
    case 'interface-property':
    case 'method':
      return !ctx.documentable.protected;

    case 'enum-member':
    case 'type':
      return true;
  }
}

function isCfnType(ctx: DocsLinterContext) {
  switch (ctx.kind) {
    case 'class-property':
    case 'interface-property':
    case 'method':
    case 'enum-member':
      return CoreTypes.isCfnType(ctx.containingType);

    case 'type':
      return CoreTypes.isCfnType(ctx.documentable);
  }
}

function isModuleExperimental(assembly: reflect.Assembly) {
  return assembly.spec.docs?.stability === Stability.Experimental;
}

function flatMap<T, U>(array: readonly T[], callbackfn: (value: T, index: number, array: readonly T[]) => U[]): U[] {
  return Array.prototype.concat(...array.map(callbackfn));
}
