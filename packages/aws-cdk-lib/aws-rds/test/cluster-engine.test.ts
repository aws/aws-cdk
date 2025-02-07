import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { AuroraEngineVersion, AuroraMysqlEngineVersion, AuroraPostgresEngineVersion, DatabaseClusterEngine } from '../lib';

describe('cluster engine', () => {
  testDeprecated("default parameterGroupFamily for versionless Aurora cluster engine is 'aurora5.6'", () => {
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

  testDeprecated('cluster parameter group correctly determined for AURORA and given version', () => {
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
      version: AuroraMysqlEngineVersion.VER_2_12_3,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora-mysql5.7');
  });

  test('cluster parameter group correctly determined for AURORA_MYSQL and given version 3', () => {
    // GIVEN
    const engine = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_3_07_1,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora-mysql8.0');
  });

  test('cluster parameter group correctly determined for AURORA_POSTGRESQL and given version', () => {
    // GIVEN
    const engine = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_16_3,
    });

    // WHEN
    const family = engine.parameterGroupFamily;

    // THEN
    expect(family).toEqual('aurora-postgresql16');
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
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('14.3', '14') }).parameterGroupFamily).toEqual(
      'aurora-postgresql14');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('15.7', '15') }).parameterGroupFamily).toEqual(
      'aurora-postgresql15');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('16.3', '16') }).parameterGroupFamily).toEqual(
      'aurora-postgresql16');
  });

  test('supported log types', () => {
    const mysqlLogTypes = ['error', 'general', 'slowquery', 'audit'];
    expect(DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }).supportedLogTypes).toEqual(mysqlLogTypes);
    expect(DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_12_3 }).supportedLogTypes).toEqual(mysqlLogTypes);
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_16_3 }).supportedLogTypes).toEqual(['postgresql']);
  });

  test('cluster parameter group correctly determined for AURORA_POSTGRESQL 14 (and other) and given version', () => {
    // GIVEN
    const engine_VER_14_3 = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_14_3,
    });
    const engine_ver_1_22_3 = DatabaseClusterEngine.aurora({
      version: AuroraEngineVersion.VER_1_22_3,
    });
    const engine_ver_1_22_4 = DatabaseClusterEngine.aurora({
      version: AuroraEngineVersion.VER_1_22_4,
    });
    const engine_ver_1_22_5 = DatabaseClusterEngine.aurora({
      version: AuroraEngineVersion.VER_1_22_5,
    });
    const engine_ver_2_7_3 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_3,
    });
    const engine_ver_2_7_4 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_4,
    });
    const engine_ver_2_7_5 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_5,
    });
    const engine_ver_2_7_6 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_6,
    });
    const engine_ver_2_7_7 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_7,
    });
    const engine_ver_2_7_8 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_07_8,
    });
    const engine_ver_2_8_3 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_08_3,
    });
    const engine_ver_2_8_4 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_08_4,
    });
    const engine_ver_2_11_3 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_2_11_3,
    });
    const engine_ver_3_07_1 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_3_07_1,
    });
    const engine_ver_3_08_0 = DatabaseClusterEngine.auroraMysql({
      version: AuroraMysqlEngineVersion.VER_3_08_0,
    });

    // THEN
    expect(engine_VER_14_3.parameterGroupFamily).toEqual('aurora-postgresql14');
    expect(engine_ver_1_22_3.parameterGroupFamily).toEqual('aurora5.6');
    expect(engine_ver_1_22_4.parameterGroupFamily).toEqual('aurora5.6');
    expect(engine_ver_1_22_5.parameterGroupFamily).toEqual('aurora5.6');
    expect(engine_ver_2_7_3.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_7_4.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_7_5.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_7_6.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_7_7.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_7_8.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_8_3.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_8_4.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_2_11_3.parameterGroupFamily).toEqual('aurora-mysql5.7');
    expect(engine_ver_3_07_1.parameterGroupFamily).toEqual('aurora-mysql8.0');
    expect(engine_ver_3_08_0.parameterGroupFamily).toEqual('aurora-mysql8.0');
  });
});
