import { Template } from '../../assertions';
import * as secretsmanager from '../../aws-secretsmanager';
import { Stack } from '../../core';
import { DatabaseSecret, CONNECTION_STRING_TEMPLATES } from '../lib';

describe('connection string', () => {
  describe('connectionStringFromJson on ISecret', () => {
    test('generates Fn::Sub with dynamic references for MySQL template', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'admin',
        dbname: 'mydb',
      });

      // WHEN
      const connectionString = secret.connectionStringFromJson(
        'mysql://${username}:${password}@${host}:${port}/${dbname}',
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toEqual({
        'Fn::Sub': [
          'mysql://${username}:${password}@${host}:${port}/${dbname}',
          {
            username: {
              'Fn::Join': [
                '',
                [
                  '{{resolve:secretsmanager:',
                  { Ref: 'SecretA720EF05' },
                  ':SecretString:username::}}',
                ],
              ],
            },
            password: {
              'Fn::Join': [
                '',
                [
                  '{{resolve:secretsmanager:',
                  { Ref: 'SecretA720EF05' },
                  ':SecretString:password::}}',
                ],
              ],
            },
            host: {
              'Fn::Join': [
                '',
                [
                  '{{resolve:secretsmanager:',
                  { Ref: 'SecretA720EF05' },
                  ':SecretString:host::}}',
                ],
              ],
            },
            port: {
              'Fn::Join': [
                '',
                [
                  '{{resolve:secretsmanager:',
                  { Ref: 'SecretA720EF05' },
                  ':SecretString:port::}}',
                ],
              ],
            },
            dbname: {
              'Fn::Join': [
                '',
                [
                  '{{resolve:secretsmanager:',
                  { Ref: 'SecretA720EF05' },
                  ':SecretString:dbname::}}',
                ],
              ],
            },
          },
        ],
      });
    });

    test('generates Fn::Sub with dynamic references for PostgreSQL template', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'postgres',
        dbname: 'testdb',
      });

      // WHEN
      const connectionString = secret.connectionStringFromJson(
        CONNECTION_STRING_TEMPLATES.POSTGRES,
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][0]).toEqual('postgresql://${username}:${password}@${host}:${port}/${dbname}');
    });

    test('generates Fn::Sub with dynamic references for SQL Server template', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'sa',
        dbname: 'master',
      });

      // WHEN
      const connectionString = secret.connectionStringFromJson(
        CONNECTION_STRING_TEMPLATES.SQLSERVER,
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][0]).toEqual('sqlserver://${host}:${port};database=${dbname};user=${username};password=${password}');
    });

    test('generates Fn::Sub with dynamic references for Oracle template', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'system',
        dbname: 'ORCL',
      });

      // WHEN
      const connectionString = secret.connectionStringFromJson(
        CONNECTION_STRING_TEMPLATES.ORACLE,
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][0]).toEqual('oracle://${username}:${password}@${host}:${port}/${dbname}');
    });

    test('generates Fn::Sub with dynamic references for MariaDB template', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'root',
        dbname: 'testdb',
      });

      // WHEN
      const connectionString = secret.connectionStringFromJson(
        CONNECTION_STRING_TEMPLATES.MARIADB,
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][0]).toEqual('mysql://${username}:${password}@${host}:${port}/${dbname}');
    });

    test('supports custom template with query parameters', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'postgres',
        dbname: 'testdb',
      });

      // WHEN
      const connectionString = secret.connectionStringFromJson(
        'postgresql://${username}:${password}@${host}:${port}/${dbname}?sslmode=require&connect_timeout=10',
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][0]).toContain('sslmode=require');
      expect(resolved['Fn::Sub'][0]).toContain('connect_timeout=10');
    });

    test('supports template with subset of fields', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'admin',
      });

      // WHEN
      const connectionString = secret.connectionStringFromJson(
        '${username}:${password}@${host}:${port}',
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][1]).toHaveProperty('username');
      expect(resolved['Fn::Sub'][1]).toHaveProperty('password');
      expect(resolved['Fn::Sub'][1]).toHaveProperty('host');
      expect(resolved['Fn::Sub'][1]).toHaveProperty('port');
      expect(resolved['Fn::Sub'][1]).not.toHaveProperty('dbname');
    });

    test('throws error for empty template', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'admin',
      });

      // WHEN / THEN
      expect(() => {
        secret.connectionStringFromJson('');
      }).toThrow('Connection string template cannot be empty');
    });

    test('throws error for template with no placeholders', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'admin',
      });

      // WHEN / THEN
      expect(() => {
        secret.connectionStringFromJson('mysql://localhost:3306/mydb');
      }).toThrow('Connection string template must contain at least one placeholder');
    });

    test('works with imported secret', () => {
      // GIVEN
      const stack = new Stack();
      const secret = secretsmanager.Secret.fromSecretCompleteArn(
        stack,
        'ImportedSecret',
        'arn:aws:secretsmanager:us-east-1:123456789012:secret:MySecret-AbCdEf',
      );

      // WHEN
      // Note: connectionStringFromJson is optional on ISecret interface for backward compatibility,
      // but all built-in implementations (via SecretBase) provide it
      const connectionString = secret.connectionStringFromJson!(
        'mysql://${username}:${password}@${host}:${port}/${dbname}',
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
    });
  });

  describe('connectionString convenience method on DatabaseSecret', () => {
    test('delegates to connectionStringFromJson', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'admin',
        dbname: 'mydb',
      });

      // WHEN
      const connectionString = secret.connectionString(CONNECTION_STRING_TEMPLATES.MYSQL);

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][0]).toEqual('mysql://${username}:${password}@${host}:${port}/${dbname}');
    });

    test('supports custom template', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'postgres',
        dbname: 'testdb',
      });

      // WHEN
      const connectionString = secret.connectionString(
        'postgresql://${username}:${password}@${host}:${port}/${dbname}?sslmode=require',
      );

      // THEN
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(resolved['Fn::Sub'][0]).toContain('sslmode=require');
    });
  });

  describe('CONNECTION_STRING_TEMPLATES', () => {
    test('provides MySQL template', () => {
      expect(CONNECTION_STRING_TEMPLATES.MYSQL).toEqual(
        'mysql://${username}:${password}@${host}:${port}/${dbname}',
      );
    });

    test('provides PostgreSQL template', () => {
      expect(CONNECTION_STRING_TEMPLATES.POSTGRES).toEqual(
        'postgresql://${username}:${password}@${host}:${port}/${dbname}',
      );
    });

    test('provides MariaDB template', () => {
      expect(CONNECTION_STRING_TEMPLATES.MARIADB).toEqual(
        'mysql://${username}:${password}@${host}:${port}/${dbname}',
      );
    });

    test('provides SQL Server template', () => {
      expect(CONNECTION_STRING_TEMPLATES.SQLSERVER).toEqual(
        'sqlserver://${host}:${port};database=${dbname};user=${username};password=${password}',
      );
    });

    test('provides Oracle template', () => {
      expect(CONNECTION_STRING_TEMPLATES.ORACLE).toEqual(
        'oracle://${username}:${password}@${host}:${port}/${dbname}',
      );
    });
  });

  describe('CloudFormation template validation', () => {
    test('does not modify CloudFormation template structure', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'admin',
        dbname: 'mydb',
      });

      // WHEN
      secret.connectionString(CONNECTION_STRING_TEMPLATES.MYSQL);

      // THEN - Verify the secret resource itself is unchanged
      Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', {
        GenerateSecretString: {
          GenerateStringKey: 'password',
          PasswordLength: 30,
          SecretStringTemplate: '{"username":"admin","dbname":"mydb"}',
        },
      });

      // Verify no additional resources are created
      Template.fromStack(stack).resourceCountIs('AWS::SecretsManager::Secret', 1);
    });

    test('connection string can be used in ECS environment variable', () => {
      // GIVEN
      const stack = new Stack();
      const secret = new DatabaseSecret(stack, 'Secret', {
        username: 'admin',
        dbname: 'mydb',
      });

      // WHEN
      const connectionString = secret.connectionString(CONNECTION_STRING_TEMPLATES.MYSQL);

      // THEN - Verify it produces a valid CloudFormation value
      const resolved = stack.resolve(connectionString.unsafeUnwrap());
      expect(resolved).toHaveProperty('Fn::Sub');
      expect(Array.isArray(resolved['Fn::Sub'])).toBe(true);
      expect(resolved['Fn::Sub']).toHaveLength(2);
    });
  });
});
