import { SecretRotationApplication } from '@aws-cdk/aws-secretsmanager';
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
  },

  'parameter group family'(test: Test) {
    // WHEN
    const engine1 = new DatabaseClusterEngine(
      'no-parameter-group-family',
      SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
      SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER);
    const engine2 = new DatabaseClusterEngine(
      'aurora-postgresql',
      SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
      SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
      [
        { engineMajorVersion: '1.0', parameterGroupFamily: 'family-1'},
        { engineMajorVersion: '2.0', parameterGroupFamily: 'family-2' },
      ]);

    // THEN
    test.equals(engine1.parameterGroupFamily(), undefined);
    test.equals(engine1.parameterGroupFamily('1'), undefined);

    test.equals(engine2.parameterGroupFamily('3'), undefined);
    test.equals(engine2.parameterGroupFamily('1'), undefined);
    test.equals(engine2.parameterGroupFamily('1.1'), undefined);
    test.equals(engine2.parameterGroupFamily('1.0'), 'family-1');
    test.equals(engine2.parameterGroupFamily('2.0.2'), 'family-2');

    test.done();
  }
};
