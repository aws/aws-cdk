import { Property } from 'jsii-reflect';
import { Linter } from '../linter';

const DURATION_FQN = '@aws-cdk/core.Duration';
const DURATION_SUFFIX = /(Days|Milli(?:(?:S|s)econd)?s?|Sec(?:ond)?s?)$/;
const EXCLUDE_ANNOTATION_DURATION_PROP_TYPE = '[disable-awslint:duration-prop-type]';

export const durationsLinter = new Linter(assm => {
  const result = new Array<Property>();
  const generatedClassesPrefix = `${assm.name}.Cfn`;
  for (const type of assm.types) {
    // L1 classes are exempted from this rule, doing basic name matching here...
    if (type.fqn.startsWith(generatedClassesPrefix)) { continue; }
    if (!type.isClassType() && !type.isDataType() && !type.isInterfaceType()) { continue; }
    for (const property of type.allProperties) {
      if (isDurationProperty(property)
          && !property.docs.toString().includes(EXCLUDE_ANNOTATION_DURATION_PROP_TYPE)) {
        result.push(property);
      }
    }
  }
  return result;

  function isDurationProperty(prop: Property): boolean {
    const lowerCaseName = prop.name.toLowerCase();
    // No lookbehind in JS regexes, so excluding "*PerSecond" by hand here...
    return (DURATION_SUFFIX.test(prop.name) && !/PerSecond$/.test(prop.name))
      || lowerCaseName.endsWith('duration')
      || lowerCaseName.endsWith('period')
      || lowerCaseName.endsWith('timeout')
      || lowerCaseName.endsWith('ttl')
      || prop.type.fqn === DURATION_FQN;
  }
});

durationsLinter.add({
  code: 'duration-prop-type',
  message: `property must be typed ${DURATION_FQN}`,
  eval: evaluation => {
    evaluation.assert(evaluation.ctx.type.fqn === DURATION_FQN,
      `${evaluation.ctx.parentType.fqn}.${evaluation.ctx.name}`);
  },
});

durationsLinter.add({
  code: 'duration-prop-name',
  message: 'property must not use time-unit suffix',
  eval: evaluation => {
    evaluation.assert(!DURATION_SUFFIX.test(evaluation.ctx.name),
      `${evaluation.ctx.parentType.fqn}.${evaluation.ctx.name}`,
      `(suggested name: "${evaluation.ctx.name.replace(DURATION_SUFFIX, '')}")`);
  },
});
