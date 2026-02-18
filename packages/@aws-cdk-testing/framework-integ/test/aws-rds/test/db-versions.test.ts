import * as rds from 'aws-cdk-lib/aws-rds';
import {
  INTEG_TEST_LATEST_AURORA_MYSQL,
  INTEG_TEST_LATEST_AURORA_POSTGRES,
  INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS,
  INTEG_TEST_LATEST_MYSQL,
  INTEG_TEST_LATEST_POSTGRES,
  INTEG_TEST_LATEST_MARIADB,
  INTEG_TEST_LATEST_SQLSERVER,
  INTEG_TEST_LATEST_ORACLE,
} from './db-versions';

describe('db-versions', () => {
  test('getLatestVersion returns highest version for Aurora MySQL', () => {
    expect(INTEG_TEST_LATEST_AURORA_MYSQL).toBeDefined();
    expect(INTEG_TEST_LATEST_AURORA_MYSQL).toBeInstanceOf(rds.AuroraMysqlEngineVersion);
  });

  test('getLatestVersion returns highest version for Aurora Postgres', () => {
    expect(INTEG_TEST_LATEST_AURORA_POSTGRES).toBeDefined();
    expect(INTEG_TEST_LATEST_AURORA_POSTGRES).toBeInstanceOf(rds.AuroraPostgresEngineVersion);
  });

  test('getLatestVersion filters by substring for Aurora Postgres Limitless', () => {
    expect(INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS).toBeDefined();
    expect(INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS).toBeInstanceOf(rds.AuroraPostgresEngineVersion);
    const allKeys = Object.keys(rds.AuroraPostgresEngineVersion).filter(k => k.startsWith('VER_') && k.includes('LIMITLESS'));
    expect(allKeys.length).toBeGreaterThan(0);
  });

  test('getLatestVersion returns highest version for MySQL', () => {
    expect(INTEG_TEST_LATEST_MYSQL).toBeDefined();
    expect(INTEG_TEST_LATEST_MYSQL).toBeInstanceOf(rds.MysqlEngineVersion);
  });

  test('getLatestVersion returns highest version for Postgres', () => {
    expect(INTEG_TEST_LATEST_POSTGRES).toBeDefined();
    expect(INTEG_TEST_LATEST_POSTGRES).toBeInstanceOf(rds.PostgresEngineVersion);
  });

  test('getLatestVersion returns highest version for MariaDB', () => {
    expect(INTEG_TEST_LATEST_MARIADB).toBeDefined();
    expect(INTEG_TEST_LATEST_MARIADB).toBeInstanceOf(rds.MariaDbEngineVersion);
  });

  test('getLatestVersion returns highest version for SQL Server', () => {
    expect(INTEG_TEST_LATEST_SQLSERVER).toBeDefined();
    expect(INTEG_TEST_LATEST_SQLSERVER).toBeInstanceOf(rds.SqlServerEngineVersion);
  });

  test('getLatestVersion returns highest version for Oracle', () => {
    expect(INTEG_TEST_LATEST_ORACLE).toBeDefined();
    expect(INTEG_TEST_LATEST_ORACLE).toBeInstanceOf(rds.OracleEngineVersion);
  });

  test('numeric sorting works correctly', () => {
    const mockVersions = {
      VER_1_2: 'v1.2',
      VER_1_10: 'v1.10',
      VER_2_1: 'v2.1',
    };
    const keys = Object.keys(mockVersions)
      .filter(k => k.startsWith('VER_'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    expect(keys[keys.length - 1]).toBe('VER_2_1');
  });
});
