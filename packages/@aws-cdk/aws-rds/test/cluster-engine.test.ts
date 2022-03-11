import { AuroraEngineVersion, AuroraMysqlEngineVersion, AuroraPostgresEngineVersion, DatabaseClusterEngine } from '../lib';

describe('cluster engine', () => {
  test("default parameterGroupFamily for versionless Aurora cluster engine is 'aurora5.6'", () => {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora5.6');
  });

  test("default parameterGroupFamily for versionless Aurora MySQL cluster engine is 'aurora-mysql5.7'", () => {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_MYSQL;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora-mysql5.7');
  });

  test('default parameterGroupFamily for versionless Aurora PostgreSQL is not defined', () => {
    // GIVEN
    const engine = DatabaseClusterEngine.AURORA_POSTGRESQL;

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual(undefined);
  });

  test('cluster parameter group correctly determined for AURORA and given version', () => {
    // GIVEN
    const engine = DatabaseClusterEngine.aurora({
      version: AuroraEngineVersion.VER_1_22_2,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora5.6');
  });

  test('cluster parameter group correctly determined for AURORA_MYSQL and given version', () => {
    // GIVEN
    const engine = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_1,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora-mysql5.7');
  });

  test('cluster parameter group correctly determined for AURORA_MYSQL and given version 3', () => {
    // GIVEN
    const engine = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_3_01_0,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora-mysql8.0');
  });

  test('cluster parameter group correctly determined for AURORA_POSTGRESQL and given version', () => {
    // GIVEN
    const engine = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_11_6,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora-postgresql11');
  });

  test('parameter group family', () => {
    // the PostgreSQL engine knows about the following major versions: 9.6, 10 and 11

    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('8', '8') }).parameterGroupFamily).toEqual(
      'aurora-postgresql8');

    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9', '9') }).parameterGroupFamily).toEqual(
      'aurora-postgresql9');

    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9.7', '9.7') }).parameterGroupFamily).toEqual(
      'aurora-postgresql9.7');

    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9.6', '9.6') }).parameterGroupFamily).toEqual(
      'aurora-postgresql9.6');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('9.6.1', '9.6') }).parameterGroupFamily).toEqual(
      'aurora-postgresql9.6');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('10.0', '10') }).parameterGroupFamily).toEqual(
      'aurora-postgresql10');
  });

  test('supported log types', () => {
    const mysqlLogTypes = ['error', 'general', 'slowquery', 'audit'];
    expect(DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }).supportedLogTypes).toEqual(mysqlLogTypes);
    expect(DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_08_1 }).supportedLogTypes).toEqual(mysqlLogTypes);
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_9_6_9 }).supportedLogTypes).toEqual(['postgresql']);
  });
});
