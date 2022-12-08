import { EnumDefinition } from '../../schema-parser';
import { CM2 } from '../../cm2';
import { toCamelCase } from '../camel';
import { objLit } from '../../value';
import { jsVal } from '../../well-known-values';
import { Hint } from './hint';

export function enumHint(enm: EnumDefinition): Hint {
  const code = new CM2('x.ts');

  const varName = toCamelCase(enm.name);

  code.openBlock(`new Enum(root, '${enm.name}').define(${varName} =>`);

  code.line(`${varName}.schemaRef(`, jsVal(enm.schemaLocation), `);`);

  for (const mem of enm.members) {
    code.line(`${varName}.addMember(`, objLit({
      name: jsVal(mem),
      cloudFormationString: jsVal(mem),
      summary: jsVal(''),
    }), ');');
  }

  code.unindent();
  code.line('})');

  return {
    schemaRef: enm.schemaLocation,
    suggestion: code.render(),
  };
}
