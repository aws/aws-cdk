import { Test } from 'nodeunit';
import { DatabaseClusterEngine } from '../lib';

export = {
  'default cluster parameter group correctly determined for AURORA'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const defaultFamily = engine.parameterGroupFamily();

    // THEN
    test.equals(defaultFamily, 'aurora5.6');

    test.done();
  },

  'default cluster parameter group correctly determined for AURORA_MYSQL'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const defaultFamily = engine.parameterGroupFamily();

    // THEN
    test.equals(defaultFamily, 'aurora-mysql5.7');

    test.done();
  },

  'default cluster parameter group correctly determined for AURORA_POSTGRESQL'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const defaultFamily = engine.parameterGroupFamily();

    // THEN
    test.equals(defaultFamily, 'aurora-postgresql11');

    test.done();
  },

  'default cluster parameter group correctly determined for AURORA and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const defaultFamily = engine.parameterGroupFamily('5.6.mysql_aurora.1.22.2');

    // THEN
    test.equals(defaultFamily, 'aurora5.6');

    test.done();
  },

  'default cluster parameter group correctly determined for AURORA_MYSQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const defaultFamily = engine.parameterGroupFamily('5.7.mysql_aurora.2.07.1');

    // THEN
    test.equals(defaultFamily, 'aurora-mysql5.7');

    test.done();
  },

  'default cluster parameter group correctly determined for AURORA_POSTGRESQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const defaultFamily = engine.parameterGroupFamily('11.6');

    // THEN
    test.equals(defaultFamily, 'aurora-postgresql11');

    test.done();
  }
};
