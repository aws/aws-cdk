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
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('13.21', '13') }).parameterGroupFamily).toEqual(
      'aurora-postgresql13');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('14.18', '14') }).parameterGroupFamily).toEqual(
      'aurora-postgresql14');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('15.13', '15') }).parameterGroupFamily).toEqual(
      'aurora-postgresql15');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('16.9', '16') }).parameterGroupFamily).toEqual(
      'aurora-postgresql16');
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.of('17.5', '17') }).parameterGroupFamily).toEqual(
      'aurora-postgresql17');
  });

  test('supported log types', () => {
    const mysqlLogTypes = ['error', 'general', 'slowquery', 'audit', 'instance', 'iam-db-auth-error'];
    expect(DatabaseClusterEngine.aurora({ version: AuroraEngineVersion.VER_1_22_2 }).supportedLogTypes).toEqual(mysqlLogTypes);
    expect(DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_2_12_3 }).supportedLogTypes).toEqual(mysqlLogTypes);
    expect(DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_16_3 }).supportedLogTypes).toEqual(['postgresql', 'iam-db-auth-error', 'instance']);
  });

  test('AuroraMysqlEngineVersion.of() determines default combineImportAndExportRoles', () => {
    expect(AuroraMysqlEngineVersion.of('5.7.mysql_aurora.2.12.3', '5.7')._combineImportAndExportRoles).toEqual(false);
    expect(AuroraMysqlEngineVersion.of('5.7.mysql_aurora.2.12.3')._combineImportAndExportRoles).toEqual(false);
    expect(AuroraMysqlEngineVersion.of('8.0.mysql_aurora.3.07.1', '8.0')._combineImportAndExportRoles).toEqual(true);
  });

  test('AuroraMysqlEngineVersion.of() determines serverlessV2AutoPauseSupported', () => {
    expect(AuroraMysqlEngineVersion.of('5.7.mysql_aurora.2.12.3', '5.7')._serverlessV2AutoPauseSupported).toEqual(false);
    expect(AuroraMysqlEngineVersion.of('8.0.mysql_aurora.3.07.1', '8.0')._serverlessV2AutoPauseSupported).toEqual(false);
    expect(AuroraMysqlEngineVersion.of('8.0.mysql_aurora.3.08.1', '8.0')._serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraMysqlEngineVersion.of('8.0.mysql_aurora.3.10.0', '8.0')._serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraMysqlEngineVersion.of('8.4.mysql_aurora.4.00.0', '8.4')._serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraMysqlEngineVersion.of('10.0.mysql_aurora.x.xx.x', '10.0')._serverlessV2AutoPauseSupported).toEqual(true);
  });

  test('AuroraPostgresEngineVersion.of() determines serverlessV2AutoPauseSupported', () => {
    expect(AuroraPostgresEngineVersion.of('12.99', '12')._features.serverlessV2AutoPauseSupported).toEqual(false);
    expect(AuroraPostgresEngineVersion.of('13.14', '13')._features.serverlessV2AutoPauseSupported).toEqual(false);
    expect(AuroraPostgresEngineVersion.of('13.15', '13')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('14.11', '14')._features.serverlessV2AutoPauseSupported).toEqual(false);
    expect(AuroraPostgresEngineVersion.of('14.12', '14')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('15.6', '15')._features.serverlessV2AutoPauseSupported).toEqual(false);
    expect(AuroraPostgresEngineVersion.of('15.7', '15')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('15.10', '15')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('16.2', '16')._features.serverlessV2AutoPauseSupported).toEqual(false);
    expect(AuroraPostgresEngineVersion.of('16.3', '16')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('16.10', '16')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('16.6-limitless', '16')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('17.4', '17')._features.serverlessV2AutoPauseSupported).toEqual(true);
    expect(AuroraPostgresEngineVersion.of('18.0', '18')._features.serverlessV2AutoPauseSupported).toEqual(true);
  });

  test('cluster parameter group correctly determined for AURORA_POSTGRESQL and given version', () => {
    // GIVEN
    const engine_VER_13_20 = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_13_20,
    });
    const engine_VER_14_3 = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_14_3,
    });
    const engine_VER_15_12 = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_15_12,
    });
    const engine_VER_16_3 = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_16_3,
    });
    const engine_VER_17_2 = DatabaseClusterEngine.auroraPostgres({
      version: AuroraPostgresEngineVersion.VER_17_2,
    });

    // THEN
    expect(engine_VER_13_20.parameterGroupFamily).toEqual('aurora-postgresql13');
    expect(engine_VER_14_3.parameterGroupFamily).toEqual('aurora-postgresql14');
    expect(engine_VER_15_12.parameterGroupFamily).toEqual('aurora-postgresql15');
    expect(engine_VER_16_3.parameterGroupFamily).toEqual('aurora-postgresql16');
    expect(engine_VER_17_2.parameterGroupFamily).toEqual('aurora-postgresql17');
  });

  testDeprecated.each([
    AuroraEngineVersion.VER_1_22_2,
    AuroraEngineVersion.VER_1_22_3,
    AuroraEngineVersion.VER_1_22_4,
    AuroraEngineVersion.VER_1_22_5,
    AuroraEngineVersion.VER_1_23_0,
    AuroraEngineVersion.VER_1_23_1,
    AuroraEngineVersion.VER_1_23_2,
    AuroraEngineVersion.VER_1_23_3,
    AuroraEngineVersion.VER_1_23_4,
  ])('cluster parameter group correctly determined for AURORA_MYSQL 1.x and given version $auroraFullVersion', (version: AuroraEngineVersion) => {
    // GIVEN
    const engine_ver = DatabaseClusterEngine.aurora({ version });

    // THEN
    expect(engine_ver.parameterGroupFamily).toEqual('aurora5.6');
  });

  test.each([
    AuroraMysqlEngineVersion.VER_2_02_3,
    AuroraMysqlEngineVersion.VER_2_03_2,
    AuroraMysqlEngineVersion.VER_2_03_3,
    AuroraMysqlEngineVersion.VER_2_03_4,
    AuroraMysqlEngineVersion.VER_2_04_0,
    AuroraMysqlEngineVersion.VER_2_04_1,
    AuroraMysqlEngineVersion.VER_2_04_2,
    AuroraMysqlEngineVersion.VER_2_04_3,
    AuroraMysqlEngineVersion.VER_2_04_4,
    AuroraMysqlEngineVersion.VER_2_04_5,
    AuroraMysqlEngineVersion.VER_2_04_6,
    AuroraMysqlEngineVersion.VER_2_04_7,
    AuroraMysqlEngineVersion.VER_2_04_8,
    AuroraMysqlEngineVersion.VER_2_04_9,
    AuroraMysqlEngineVersion.VER_2_05_0,
    AuroraMysqlEngineVersion.VER_2_05_1,
    AuroraMysqlEngineVersion.VER_2_06_0,
    AuroraMysqlEngineVersion.VER_2_07_0,
    AuroraMysqlEngineVersion.VER_2_07_1,
    AuroraMysqlEngineVersion.VER_2_07_2,
    AuroraMysqlEngineVersion.VER_2_07_3,
    AuroraMysqlEngineVersion.VER_2_07_4,
    AuroraMysqlEngineVersion.VER_2_07_5,
    AuroraMysqlEngineVersion.VER_2_07_6,
    AuroraMysqlEngineVersion.VER_2_07_7,
    AuroraMysqlEngineVersion.VER_2_07_8,
    AuroraMysqlEngineVersion.VER_2_07_9,
    AuroraMysqlEngineVersion.VER_2_07_10,
    AuroraMysqlEngineVersion.VER_2_08_0,
    AuroraMysqlEngineVersion.VER_2_08_1,
    AuroraMysqlEngineVersion.VER_2_08_2,
    AuroraMysqlEngineVersion.VER_2_08_3,
    AuroraMysqlEngineVersion.VER_2_08_4,
    AuroraMysqlEngineVersion.VER_2_09_0,
    AuroraMysqlEngineVersion.VER_2_09_1,
    AuroraMysqlEngineVersion.VER_2_09_2,
    AuroraMysqlEngineVersion.VER_2_09_3,
    AuroraMysqlEngineVersion.VER_2_10_0,
    AuroraMysqlEngineVersion.VER_2_10_1,
    AuroraMysqlEngineVersion.VER_2_10_2,
    AuroraMysqlEngineVersion.VER_2_10_3,
    AuroraMysqlEngineVersion.VER_2_11_0,
    AuroraMysqlEngineVersion.VER_2_11_1,
    AuroraMysqlEngineVersion.VER_2_11_2,
    AuroraMysqlEngineVersion.VER_2_11_3,
    AuroraMysqlEngineVersion.VER_2_11_4,
    AuroraMysqlEngineVersion.VER_2_11_5,
    AuroraMysqlEngineVersion.VER_2_11_6,
    AuroraMysqlEngineVersion.VER_2_12_0,
    AuroraMysqlEngineVersion.VER_2_12_1,
    AuroraMysqlEngineVersion.VER_2_12_2,
    AuroraMysqlEngineVersion.VER_2_12_3,
    AuroraMysqlEngineVersion.VER_2_12_4,
    AuroraMysqlEngineVersion.VER_2_12_5,
  ])('cluster parameter group correctly determined for AURORA_MYSQL 2.x and given version $auroraMysqlFullVersion', (version: AuroraMysqlEngineVersion) => {
    // GIVEN
    const engine_ver = DatabaseClusterEngine.auroraMysql({ version });

    // THEN
    expect(engine_ver.parameterGroupFamily).toEqual('aurora-mysql5.7');
  });

  test.each([
    AuroraMysqlEngineVersion.VER_3_01_0,
    AuroraMysqlEngineVersion.VER_3_01_1,
    AuroraMysqlEngineVersion.VER_3_02_0,
    AuroraMysqlEngineVersion.VER_3_02_1,
    AuroraMysqlEngineVersion.VER_3_02_2,
    AuroraMysqlEngineVersion.VER_3_02_3,
    AuroraMysqlEngineVersion.VER_3_03_0,
    AuroraMysqlEngineVersion.VER_3_03_1,
    AuroraMysqlEngineVersion.VER_3_03_2,
    AuroraMysqlEngineVersion.VER_3_03_3,
    AuroraMysqlEngineVersion.VER_3_04_0,
    AuroraMysqlEngineVersion.VER_3_04_1,
    AuroraMysqlEngineVersion.VER_3_04_2,
    AuroraMysqlEngineVersion.VER_3_04_3,
    AuroraMysqlEngineVersion.VER_3_04_4,
    AuroraMysqlEngineVersion.VER_3_04_6,
    AuroraMysqlEngineVersion.VER_3_05_0,
    AuroraMysqlEngineVersion.VER_3_05_1,
    AuroraMysqlEngineVersion.VER_3_05_2,
    AuroraMysqlEngineVersion.VER_3_06_0,
    AuroraMysqlEngineVersion.VER_3_06_1,
    AuroraMysqlEngineVersion.VER_3_07_0,
    AuroraMysqlEngineVersion.VER_3_07_1,
    AuroraMysqlEngineVersion.VER_3_08_0,
    AuroraMysqlEngineVersion.VER_3_08_1,
    AuroraMysqlEngineVersion.VER_3_08_2,
    AuroraMysqlEngineVersion.VER_3_09_0,
    AuroraMysqlEngineVersion.VER_3_10_0,
    AuroraMysqlEngineVersion.VER_3_10_1,
    AuroraMysqlEngineVersion.VER_3_10_2,
    AuroraMysqlEngineVersion.VER_3_10_3,
    AuroraMysqlEngineVersion.VER_3_11_0,
    AuroraMysqlEngineVersion.VER_3_11_1,
    AuroraMysqlEngineVersion.VER_3_12_0,
  ])('cluster parameter group correctly determined for AURORA_MYSQL 3.x and given version $auroraMysqlFullVersion', (version: AuroraMysqlEngineVersion) => {
    // GIVEN
    const engine_ver = DatabaseClusterEngine.auroraMysql({ version });

    // THEN
    expect(engine_ver.parameterGroupFamily).toEqual('aurora-mysql8.0');
  });
});
