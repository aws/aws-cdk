import * as rds from 'aws-cdk-lib/aws-rds';

export const INTEG_TEST_LATEST_AURORA_MYSQL = rds.AuroraMysqlEngineVersion.VER_3_11_1;
export const INTEG_TEST_LATEST_AURORA_POSTGRES = rds.AuroraPostgresEngineVersion.VER_17_6;
export const INTEG_TEST_LATEST_AURORA_POSTGRES_LIMITLESS = rds.AuroraPostgresEngineVersion.VER_16_9_LIMITLESS;
export const INTEG_TEST_LATEST_MYSQL = rds.MysqlEngineVersion.VER_8_4_7;
export const INTEG_TEST_LATEST_POSTGRES = rds.PostgresEngineVersion.VER_18_1;
export const INTEG_TEST_LATEST_MARIADB = rds.MariaDbEngineVersion.VER_11_8_5;
export const INTEG_TEST_LATEST_SQLSERVER = rds.SqlServerEngineVersion.VER_15;
export const INTEG_TEST_LATEST_ORACLE = rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1;
