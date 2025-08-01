import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as sns from '../lib';

describe('SNS Data Protection', () => {
  describe('CustomDataIdentifier', () => {
    test('creates a valid custom data identifier', () => {
      // WHEN
      const customId = new sns.CustomDataIdentifier({
        name: 'ValidIdentifier',
        regex: '[A-Z]{3}-[0-9]{4}',
      });

      // THEN
      expect(customId.name).toEqual('ValidIdentifier');
      expect(customId.regex).toEqual('[A-Z]{3}-[0-9]{4}');
      expect(customId.identifier).toEqual('ValidIdentifier');
    });

    test('throws when name exceeds maximum length', () => {
      // GIVEN
      const tooLongName = 'A'.repeat(129); // 129 chars (max is 128)

      // THEN
      expect(() => {
        new sns.CustomDataIdentifier({
          name: tooLongName,
          regex: '[A-Z]{3}-[0-9]{4}',
        });
      }).toThrow(/Custom data identifier name must be at most 128 characters/);
    });

    test('throws when name has invalid format', () => {
      // THEN
      expect(() => {
        new sns.CustomDataIdentifier({
          name: 'Invalid@Name$',
          regex: '[A-Z]{3}-[0-9]{4}',
        });
      }).toThrow(
        /Custom data identifier name can only contain alphanumeric characters, underscores, and hyphens/,
      );
    });

    test('throws when regex exceeds maximum length', () => {
      // GIVEN
      const tooLongRegex = '[0-9]-'.repeat(70); // 280 chars (max is 200)

      // THEN
      expect(() => {
        new sns.CustomDataIdentifier({
          name: 'ValidName',
          regex: tooLongRegex,
        });
      }).toThrow(/Custom data identifier regex must be at most 200 characters/);
    });

    test('throws when regex has invalid characters', () => {
      // THEN
      expect(() => {
        new sns.CustomDataIdentifier({
          name: 'ValidName',
          regex: 'Invalid~Regex&Characters',
        });
      }).toThrow(
        /Custom data identifier regex can only contain alphanumeric characters and specific symbols/,
      );
    });

    test('throws when name conflicts with managed identifier', () => {
      // THEN
      expect(() => {
        new sns.CustomDataIdentifier({
          name: 'EmailAddress', // conflicts with managed identifier
          regex: '[a-z]+@[a-z]+\\.[a-z]+',
        });
      }).toThrow(
        /Custom data identifier name cannot match a managed data identifier name/,
      );
    });

    test('toJSON returns proper structure', () => {
      // GIVEN
      const customId = new sns.CustomDataIdentifier({
        name: 'CustomId',
        regex: 'CUSTOM-[0-9]{6}',
      });

      // WHEN
      const json = customId.toJSON();

      // THEN
      expect(json).toEqual({
        Name: 'CustomId',
        Regex: 'CUSTOM-[0-9]{6}',
      });
    });
  });

  describe('DataProtectionPolicy', () => {
    test('collects custom data identifiers from statements using flatMap/filter', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // Create custom data identifiers
      const customId1 = new sns.CustomDataIdentifier({
        name: 'CustomId1',
        regex: 'CUST-[0-9]{6}',
      });

      const customId2 = new sns.CustomDataIdentifier({
        name: 'CustomId2',
        regex: 'ID-[A-Z]{3}',
      });

      // Statement with a mix of custom and managed identifiers
      const statements = [
        new sns.DataProtectionPolicyStatement({
          sid: 'Statement1',
          dataDirection: sns.DataDirection.INBOUND,
          dataIdentifiers: [
            customId1,
            sns.PersonalIdentifiers.NAME, // Managed identifier
            customId2,
          ],
          operation: new sns.RedactOperation(),
        }),
      ];

      // WHEN
      const policy = new sns.DataProtectionPolicy({
        name: 'TestPolicy',
        statements,
      });

      // Create topic with the policy
      new sns.Topic(stack, 'Topic', {
        dataProtectionPolicy: policy,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
        DataProtectionPolicy: {
          Configuration: {
            CustomDataIdentifier: [
              {
                Name: 'CustomId1',
                Regex: 'CUST-[0-9]{6}',
              },
              {
                Name: 'CustomId2',
                Regex: 'ID-[A-Z]{3}',
              },
            ],
          },
        },
      });
    });

    test('collects custom data identifiers across multiple statements', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // Create custom data identifiers
      const customId1 = new sns.CustomDataIdentifier({
        name: 'CustomId1',
        regex: 'CUST-[0-9]{6}',
      });

      const customId2 = new sns.CustomDataIdentifier({
        name: 'CustomId2',
        regex: 'ID-[A-Z]{3}',
      });

      const customId3 = new sns.CustomDataIdentifier({
        name: 'CustomId3',
        regex: 'TICKET-[0-9]{5}',
      });

      // Statements with distributed custom identifiers
      const statements = [
        new sns.DataProtectionPolicyStatement({
          sid: 'Statement1',
          dataDirection: sns.DataDirection.INBOUND,
          dataIdentifiers: [
            customId1,
            sns.PersonalIdentifiers.NAME, // Managed identifier
          ],
          operation: new sns.RedactOperation(),
        }),
        new sns.DataProtectionPolicyStatement({
          sid: 'Statement2',
          dataDirection: sns.DataDirection.OUTBOUND,
          dataIdentifiers: [customId2, customId3],
          operation: new sns.MaskOperation(),
        }),
      ];

      // WHEN
      const policy = new sns.DataProtectionPolicy({
        name: 'TestPolicy',
        statements,
      });

      // Create topic with the policy
      new sns.Topic(stack, 'Topic', {
        dataProtectionPolicy: policy,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
        DataProtectionPolicy: {
          Configuration: {
            CustomDataIdentifier: [
              {
                Name: 'CustomId1',
                Regex: 'CUST-[0-9]{6}',
              },
              {
                Name: 'CustomId2',
                Regex: 'ID-[A-Z]{3}',
              },
              {
                Name: 'CustomId3',
                Regex: 'TICKET-[0-9]{5}',
              },
            ],
          },
        },
      });
    });

    test('throws error when exceeding maximum of 10 custom data identifiers', () => {
      // GIVEN
      // Create 11 custom data identifiers (exceeds the limit)
      const identifiers: sns.CustomDataIdentifier[] = [];
      for (let i = 1; i <= 11; i++) {
        identifiers.push(
          new sns.CustomDataIdentifier({
            name: `CustomId${i}`,
            regex: `ID-[A-Z]{${i}}`,
          }),
        );
      }

      // Split across two statements
      const statements = [
        new sns.DataProtectionPolicyStatement({
          sid: 'Statement1',
          dataDirection: sns.DataDirection.INBOUND,
          dataIdentifiers: identifiers.slice(0, 6), // First 6 identifiers
          operation: new sns.RedactOperation(),
        }),
        new sns.DataProtectionPolicyStatement({
          sid: 'Statement2',
          dataDirection: sns.DataDirection.INBOUND,
          dataIdentifiers: identifiers.slice(6), // Remaining 5 identifiers
          operation: new sns.MaskOperation(),
        }),
      ];

      // WHEN creating a policy with too many identifiers
      const policy = new sns.DataProtectionPolicy({
        name: 'TestPolicy',
        statements,
      });

      // THEN expect an error when converting to JSON (this is when validation occurs)
      expect(() => {
        policy.toString(); // This calls toJSON() internally
      }).toThrow(/maximum of 10 custom data identifiers/);
    });

    test('throws error when creating multiple audit statements', () => {
      // GIVEN
      // Create two statements with Audit operations
      const statements = [
        new sns.DataProtectionPolicyStatement({
          sid: 'AuditStatement1',
          dataDirection: sns.DataDirection.INBOUND,
          dataIdentifiers: [sns.PersonalIdentifiers.NAME],
          operation: new sns.AuditOperation({
            sampleRate: 50,
          }),
        }),
        new sns.DataProtectionPolicyStatement({
          sid: 'AuditStatement2',
          dataDirection: sns.DataDirection.OUTBOUND,
          dataIdentifiers: [sns.PersonalIdentifiers.EMAIL_ADDRESS],
          operation: new sns.AuditOperation({
            sampleRate: 75,
          }),
        }),
      ];

      // WHEN/THEN expect error during policy creation
      expect(() => {
        new sns.DataProtectionPolicy({
          name: 'TestPolicy',
          statements,
        });
      }).toThrow(/A data protection policy can only have one audit statement/);
    });
  });
});
