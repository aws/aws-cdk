import { Test } from 'nodeunit';
import * as rds from '../lib';

export = {
  'default parameterGroupFamily for versionless MariaDB instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.MARIADB;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless MySQL instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.MYSQL;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless PostgreSQL instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.POSTGRES;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  "default parameterGroupFamily for versionless Oracle SE instance engine is 'oracle-se-11.2'"(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE;

    const family = engine.parameterGroupFamily;

    test.equals(family, 'oracle-se-11.2');

    test.done();
  },

  "default parameterGroupFamily for versionless Oracle SE 1 instance engine is 'oracle-se1-11.2'"(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE1;

    const family = engine.parameterGroupFamily;

    test.equals(family, 'oracle-se1-11.2');

    test.done();
  },

  'default parameterGroupFamily for versionless Oracle SE 2 instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_SE2;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless Oracle EE instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.ORACLE_EE;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server SE instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_SE;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server EX instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_EX;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server Web instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_WEB;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },

  'default parameterGroupFamily for versionless SQL Server EE instance engine is not defined'(test: Test) {
    const engine = rds.DatabaseInstanceEngine.SQL_SERVER_EE;

    const family = engine.parameterGroupFamily;

    test.equals(family, undefined);

    test.done();
  },
};
