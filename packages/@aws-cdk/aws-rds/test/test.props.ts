import { Test } from 'nodeunit';
import { DatabaseClusterEngine } from '../lib';

export = {
  'cluster parameter group correctly determined for AURORA'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora5.6');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_MYSQL'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora-mysql5.7');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_POSTGRESQL'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora-postgresql11');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const family = engine.withVersion('5.6.mysql_aurora.1.22.2').parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora5.6');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_MYSQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const family = engine.withVersion('5.7.mysql_aurora.2.07.1').parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora-mysql5.7');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_POSTGRESQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const family = engine.withVersion('11.6').parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora-postgresql11');

    test.done();
  },

  'parameter group family'(test: Test) {
    const postgres = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // the PostgreSQL engine knows about the following major versions: 9.6, 10 and 11

    test.throws(() => {
      postgres.withVersion('8');
    }, /No parameter group family found for database engine aurora-postgresql with version 8/);

    test.throws(() => {
      postgres.withVersion('9');
    }, /No parameter group family found for database engine aurora-postgresql with version 9/);

    test.throws(() => {
      postgres.withVersion('9.7');
    }, /No parameter group family found for database engine aurora-postgresql with version 9\.7/);

    test.equals(postgres.withVersion('9.6').parameterGroupFamily, 'aurora-postgresql9.6');
    test.equals(postgres.withVersion('9.6.1').parameterGroupFamily, 'aurora-postgresql9.6');
    test.equals(postgres.withVersion('10.0').parameterGroupFamily, 'aurora-postgresql10');

    test.done();
  },
};
