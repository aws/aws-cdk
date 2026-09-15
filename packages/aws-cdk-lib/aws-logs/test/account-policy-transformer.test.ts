import { Template } from '../../assertions';
import { Stack } from '../../core';
import {
  AccountPolicy,
  AccountPolicyDocument,
  JsonMutatorProcessor,
  JsonMutatorType,
  OCSFSourceType,
  OCSFVersion,
  ParserProcessor,
  ParserProcessorType,
  VendedLogParser,
  VendedLogType,
} from '../lib';

describe('account policy - transformer', () => {
  test('trivial instantiation with an ADD_KEYS processor', () => {
    // GIVEN
    const stack = new Stack();
    const processor = new JsonMutatorProcessor({
      type: JsonMutatorType.ADD_KEYS,
      addKeysOptions: {
        entries: [{ key: 'account', value: '123456789012' }],
      },
    });

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.transformer({
        processors: [processor],
      }),
    });

    // THEN: unlike the log-group-level Transformer construct, the account-level
    // policyDocument keeps the processor's own raw camelCase shape — only the top-level
    // processor name gets rewritten (and only for the four irregular acronym names).
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyName: 'MyAccountPolicy',
      PolicyType: 'TRANSFORMER_POLICY',
      PolicyDocument: JSON.stringify([{
        addKeys: {
          entries: [{ overwriteIfExists: false, key: 'account', value: '123456789012' }],
        },
      }]),
    });
  });

  test('an OCSF parser gets the irregular top-level acronym without touching nested fields (regression test)', () => {
    // GIVEN
    const stack = new Stack();
    const processor = new ParserProcessor({
      type: ParserProcessorType.OCSF,
      parseToOCSFOptions: {
        eventSource: OCSFSourceType.VPC_FLOW,
        ocsfVersion: OCSFVersion.V1_1,
      },
    });

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.transformer({
        processors: [processor],
      }),
    });

    // THEN: the top-level key gets the irregular parseToOCSF spelling, but nested fields
    // (source, eventSource, ocsfVersion) stay exactly as _render() produced them — a real
    // PutAccountPolicy call confirmed that PascalCasing a nested field is silently dropped
    // rather than rejected, so this would otherwise fail silently instead of loudly.
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyDocument: JSON.stringify([{
        parseToOCSF: {
          source: '@message',
          eventSource: 'VPCFlow',
          ocsfVersion: 'V1.1',
        },
      }]),
    });
  });

  // Every VendedLogType and non-OCSF ParserProcessorType is covered here (OCSF has its own
  // regression test above), so that PROCESSOR_KEY_OVERRIDES staying in sync with the acronym
  // processor names in transformer.ts is enforced: a newly added acronym-bearing processor
  // that isn't added to the override map would fail here instead of silently producing a
  // document CloudWatch Logs rejects.
  test.each([
    [VendedLogType.VPC, 'parseVPC'],
    [VendedLogType.WAF, 'parseWAF'],
    [VendedLogType.CLOUDFRONT, 'parseCloudfront'],
    [VendedLogType.ROUTE53, 'parseRoute53'],
    [VendedLogType.POSTGRES, 'parsePostgres'],
  ])('vended log parser for %s renders as %s', (logType, expectedKey) => {
    // GIVEN
    const stack = new Stack();
    const processor = new VendedLogParser({ logType });

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.transformer({
        processors: [processor],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      PolicyDocument: JSON.stringify([{ [expectedKey]: {} }]),
    });
  });

  test.each([
    [ParserProcessorType.JSON, 'parseJSON'],
    [ParserProcessorType.KEY_VALUE, 'parseKeyValue'],
    [ParserProcessorType.CSV, 'csv'],
    [ParserProcessorType.GROK, 'grok'],
  ])('%s parser processor renders as %s', (type, expectedKey) => {
    // GIVEN
    const stack = new Stack();
    const processor = new ParserProcessor(
      type === ParserProcessorType.GROK
        ? { type, grokOptions: { match: '%{COMMONAPACHELOG}' } }
        : { type },
    );

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.transformer({
        processors: [processor],
      }),
    });

    // THEN
    const template = Template.fromStack(stack).findResources('AWS::Logs::AccountPolicy');
    const [resource] = Object.values(template);
    const [renderedProcessor] = JSON.parse(resource.Properties.PolicyDocument);
    expect(Object.keys(renderedProcessor)).toEqual([expectedKey]);
  });

  test('logGroupNamePrefix is rendered as a selectionCriteria expression', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new AccountPolicy(stack, 'AccountPolicy', {
      policyName: 'MyAccountPolicy',
      policy: AccountPolicyDocument.transformer({
        processors: [new VendedLogParser({ logType: VendedLogType.VPC })],
        logGroupNamePrefix: 'my-log',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::AccountPolicy', {
      SelectionCriteria: 'LogGroupNamePrefix = "my-log"',
    });
  });

  test('logGroupNamePrefix and selectionCriteria cannot both be specified', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => {
      new AccountPolicy(stack, 'AccountPolicy', {
        policyName: 'MyAccountPolicy',
        policy: AccountPolicyDocument.transformer({
          processors: [new VendedLogParser({ logType: VendedLogType.VPC })],
          logGroupNamePrefix: 'my-log',
          selectionCriteria: 'LogGroupNamePrefix = "other"',
        }),
      });
    }).toThrow('logGroupNamePrefix and selectionCriteria cannot both be specified');
  });
});
