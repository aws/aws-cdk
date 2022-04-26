import { Assembly, SourceLocation, Type, TypeReference } from 'jsii-reflect';
import { Linter } from '../linter';

export const noUnusedTypeLinter = new Linter(assm => {
  // Only care about AWS Construct Library here...
  if (!assm.name.startsWith('@aws-cdk/aws-')) {
    return [];
  }
  const usedTypes = _collectUsedTypes(assm);
  const generatedFqnPrefix = `${assm.name}.Cfn`;
  return assm.types.filter(type => !type.isClassType())
    .filter(type => !type.fqn.startsWith(generatedFqnPrefix))
    .map(inspectedType => ({ inspectedType, usedTypes }));
});

noUnusedTypeLinter.add({
  code: 'no-unused-type',
  message: 'type or enum is not used by exported classes',
  eval: evaluation => {
    evaluation.assert(evaluation.ctx.usedTypes.has(evaluation.ctx.inspectedType.fqn),
      evaluation.ctx.inspectedType.fqn,
      _formatLocation(evaluation.ctx.inspectedType.locationInModule));
  },
});

function _collectUsedTypes(assm: Assembly): Set<string> {
  const result = new Set<string>();
  assm.types.filter(type => type.isClassType())
    .forEach(_visitType);
  return result;

  function _visitType(type: Type) {
    if (typeof type === 'string') {
      const resolvedType = assm.tryFindType(type);
      if (!resolvedType) {
        return;
      }
      type = resolvedType;
    }
    if (result.has(type.fqn)) { return; }
    result.add(type.fqn);

    // Nothing else to do for enums
    if (type.isEnumType()) { return; }

    if (type.isClassType()) {
      if (type.base) { _visitType(type.base); }
      if (type.initializer) {
        for (const param of type.initializer.parameters) {
          _visitTypeRef(param.type);
        }
      }
    }
    if (type.isClassType() || type.isInterfaceType()) {
      type.interfaces.forEach(_visitType);
      for (const prop of type.ownProperties) {
        _visitTypeRef(prop.type);
      }
      for (const meth of type.ownMethods) {
        _visitTypeRef(meth.returns.type);
        for (const param of meth.parameters) {
          _visitTypeRef(param.type);
        }
      }
    }
  }

  function _visitTypeRef(typeRef: TypeReference) {
    if (typeRef.fqn) {
      const type = assm.tryFindType(typeRef.fqn);
      if (type) { _visitType(type); }
    } else if (typeRef.arrayOfType) {
      _visitTypeRef(typeRef.arrayOfType);
    } else if (typeRef.mapOfType) {
      _visitTypeRef(typeRef.mapOfType);
    } else if (typeRef.unionOfTypes) {
      typeRef.unionOfTypes.forEach(_visitTypeRef);
    }
  }
}

function _formatLocation(location: SourceLocation | undefined): string | undefined {
  if (!location) { return undefined; }
  return `(declared at ${location.filename}:${location.line})`;
}
