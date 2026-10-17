import * as rds from 'aws-cdk-lib/aws-rds';

/**
 * Extracts the full version string from an engine version object.
 */
function getFullVersion(version: unknown): string {
  if (typeof version !== 'object' || version === null) {
    throw new Error('Invalid version object');
  }

  for (const key of Object.keys(version)) {
    if (key.endsWith('FullVersion')) {
      return (version as Record<string, string>)[key];
    }
  }

  throw new Error('No FullVersion property found');
}

/**
 * Extracts the latest version from an engine version class by sorting keys
 * based on their actual version strings and returning the highest one.
 */
function getLatestVersion<T extends object>(versionClass: T, substring?: string) {
  const keys = (Object.keys(versionClass) as Array<keyof T>)
    .filter(key => typeof versionClass[key] !== 'function')
    .filter(key => !substring || String(key).includes(substring));

  keys.sort((a, b) => {
    const fullVersionA = getFullVersion(versionClass[a]);
    const fullVersionB = getFullVersion(versionClass[b]);
    return fullVersionA.localeCompare(fullVersionB, undefined, { numeric: true });
  });

  return versionClass[keys[keys.length - 1]] as Exclude<T[keyof T], Function>;
}

export const INTEG_TEST_LATEST_AURORA_MYSQL = getLatestVersion(rds.AuroraMysqlEngineVersion);
export const INTEG_TEST_LATEST_AURORA_POSTGRES = getLatestVersion(rds.AuroraPostgresEngineVersion);
export const INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS = getLatestVersion(rds.AuroraPostgresEngineVersion, 'LIMITLESS');
export const INTEG_TEST_LATEST_MYSQL = getLatestVersion(rds.MysqlEngineVersion);
export const INTEG_TEST_LATEST_POSTGRES = getLatestVersion(rds.PostgresEngineVersion);
export const INTEG_TEST_LATEST_MARIADB = getLatestVersion(rds.MariaDbEngineVersion);
export const INTEG_TEST_LATEST_SQLSERVER = getLatestVersion(rds.SqlServerEngineVersion);
export const INTEG_TEST_LATEST_ORACLE = getLatestVersion(rds.OracleEngineVersion);
