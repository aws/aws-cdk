import { nodeunitShim, Test } from 'nodeunit-shim';
import { AuroraEngineVersion, AuroraMysqlEngineVersion, AuroraPostgresEngineVersion, DatabaseClusterEngine } from '../lib';

nodeunitShim({
  "default parameterGroupFamily for versionless Aurora cluster engine is 'aurora5.6'"(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora5.6');

    test.done();
  },

  "default parameterGroupFamily for versionless Aurora MySQL cluster engine is 'aurora-mysql5.7'"(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora-mysql5.7');

    test.done();
  },

  'default parameterGroupFamily for versionless Aurora PostgreSQL is not defined'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, undefined);

    test.done();
  },

  'cluster parameter group correctly determined for AURORA and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.aurora({
      version: AuroraEngineVersion.VER_1_22_2,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora5.6');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_MYSQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_1,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora-mysql5.7');

    test.done();
  },

  'cluster parameter group correctly determined for AURORA_POSTGRESQL and given version'(test: Test) {
    // GIVEN
    const engine = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_11_6,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    test.equals(family, 'aurora-postgresql11');

    test.done();
  },

  'parameter group family'(test: Test) {
    // the PostgreSQL engine knows about the following major versions: 9.6, 10 and 11

    test.equals(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('8', '8') }).parameterGroupFamily,
      'aurora-postgresql8');

    test.equals(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9', '9') }).parameterGroupFamily,
      'aurora-postgresql9');

    test.equals(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9.7', '9.7') }).parameterGroupFamily,
      'aurora-postgresql9.7');

    test.equals(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9.6', '9.6') }).parameterGroupFamily,
      'aurora-postgresql9.6');
    test.equals(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9.6.1', '9.6') }).parameterGroupFamily,
      'aurora-postgresql9.6');
    test.equals(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('10.0', '10') }).parameterGroupFamily,
      'aurora-postgresql10');

    test.done();
  },

  'supported log types'(test: Test) {
    const mysqlLogTypes = ['error', 'general', 'slowquery', 'audit'];
    test.deepEqual(DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }).supportedLogTypes, mysqlLogTypes);
    test.deepEqual(DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_08_1 }).supportedLogTypes, mysqlLogTypes);
    test.deepEqual(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_9_6_9 }).supportedLogTypes, ['postgresql']);
    test.done();
  },
});