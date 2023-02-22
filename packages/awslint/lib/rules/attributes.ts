import { Attribute, ResourceReflection } from './resource';
import { Linter } from '../linter';

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
