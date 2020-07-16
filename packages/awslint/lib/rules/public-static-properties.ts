import { Property } from 'jsii-reflect';
import { Linter } from '../linter';

const UPPER_SNAKE_CASE_ALLOWED_PATTERN = new RegExp('^[A-Z0-9][A-Z0-9_]*[A-Z0-9]+$');

export const publicStaticPropertiesLinter = new Linter(assembly => {
  const result = new Array<Property>();
  for (const c of assembly.classes) {
    for (const property of c.allProperties) {
      if (property.const && property.static) {
        result.push(property);
      }
    }
  }
  return result;
});

publicStaticPropertiesLinter.add({
  code: 'public-static-props-all-caps',
  message: 'public static properties must be named using ALL_CAPS',
  eval: e => {
    const name = e.ctx.name;
    e.assert(UPPER_SNAKE_CASE_ALLOWED_PATTERN.test(name), `${e.ctx.parentType.fqn}.${name}`);
  },
});