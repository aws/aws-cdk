import { TypeReference, isPrimitiveTypeReference, PrimitiveType, isCollectionTypeReference } from '@jsii/spec';
import { Linter } from '../linter';
import { Attribute, ResourceReflection } from './resource';

export const attributesLinter = new Linter(a => {
  const result = new Array<AttributeReflection>();
  for (const resource of ResourceReflection.findAll(a)) {
    for (const attr of resource.attributes) {
      result.push(new AttributeReflection(resource, attr));
    }
  }
  return result;
});

class AttributeReflection {
  public readonly fqn: string;

  constructor(public readonly resource: ResourceReflection, public readonly attr: Attribute) {
    this.fqn = resource.fqn + '.' + attr.property.name;
  }
}

attributesLinter.add({
  code: 'attribute-readonly',
  message: 'attribute property must be readonly',
  eval: e => {
    e.assert(e.ctx.attr.property.immutable, e.ctx.fqn);
  },
});

attributesLinter.add({
  code: 'attribute-tag',
  message: 'attribute properties must have an "@attribute" doctag on: ',
  eval: e => {
    const tag = e.ctx.attr.property.docs.customTag('attribute');
    e.assert(tag, e.ctx.fqn, `${e.ctx.attr.property.parentType.fqn}.${e.ctx.attr.property.name}`);
  },
});

attributesLinter.add({
  code: 'attribute-type',
  message: 'attribute property type must be string, number or string[]',
  eval: e => {
    const type = e.ctx.attr.property.type.spec;
    e.assert(isString(type) || isNumber(type) || isStringArray(type), e.ctx.fqn);
  },
});

function isString(type: TypeReference | undefined): boolean {
  return isPrimitiveTypeReference(type) && type.primitive === PrimitiveType.String;
}

function isNumber(type: TypeReference | undefined): boolean {
  return isPrimitiveTypeReference(type) && type.primitive === PrimitiveType.Number;
}

function isStringArray(type: TypeReference | undefined): boolean {
  return isCollectionTypeReference(type) && isString(type.collection.elementtype);
}
