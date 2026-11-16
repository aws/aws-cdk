import { assertNoPrototypePollution } from '../../core/test/prototype-pollution';
import { ParameterMapping } from '../lib/parameter-mapping';

test('mapping.custom() does not pollute prototype', () => {
  const mapping = new ParameterMapping();
  assertNoPrototypePollution(() => {
    mapping.custom('__proto__', 'evil');
  });
});
