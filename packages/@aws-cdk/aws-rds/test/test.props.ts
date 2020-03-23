import { Test } from 'nodeunit';
import { DatabaseClusterEngine } from '../lib';

export = {
  'cluster parameter group correctly determined for AURORA'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const family = engine.parameterGroupFamily();

    // THEN
    test.equals(family, 'aurora5.6');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_MYSQL'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const family = engine.parameterGroupFamily();

    // THEN
    test.equals(family, 'aurora-mysql5.7');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_POSTGRESQL'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const family = engine.parameterGroupFamily();

    // THEN
    test.equals(family, 'aurora-postgresql11');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const family = engine.parameterGroupFamily('5.6.mysql_aurora.1.22.2');

    // THEN
    test.equals(family, 'aurora5.6');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_MYSQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const family = engine.parameterGroupFamily('5.7.mysql_aurora.2.07.1');

    // THEN
    test.equals(family, 'aurora-mysql5.7');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_POSTGRESQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const family = engine.parameterGroupFamily('11.6');

    // THEN
    test.equals(family, 'aurora-postgresql11');

    test.done();
  }
};
