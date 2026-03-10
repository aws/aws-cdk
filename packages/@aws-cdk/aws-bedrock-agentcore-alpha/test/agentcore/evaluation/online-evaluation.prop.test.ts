/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as fc from 'fast-check';
import {
  OnlineEvaluationConfig,
  EvaluatorReference,
  DataSourceConfig,
  BuiltinEvaluator,
  FilterOperator,
} from '../../../lib';
import {
  validateConfigName,
  validateDescription,
  validateEvaluators,
  validateSamplingPercentage,
  validateFilters,
  validateSessionTimeout,
} from '../../../lib/evaluation/validation-helpers';

const ALL_BUILTIN_EVALUATORS = [
  BuiltinEvaluator.HELPFULNESS,
  BuiltinEvaluator.CORRECTNESS,
  BuiltinEvaluator.FAITHFULNESS,
  BuiltinEvaluator.HARMFULNESS,
  BuiltinEvaluator.STEREOTYPING,
  BuiltinEvaluator.REFUSAL,
  BuiltinEvaluator.GOAL_SUCCESS_RATE,
  BuiltinEvaluator.TOOL_SELECTION_ACCURACY,
  BuiltinEvaluator.TOOL_PARAMETER_ACCURACY,
  BuiltinEvaluator.COHERENCE,
  BuiltinEvaluator.RESPONSE_RELEVANCE,
  BuiltinEvaluator.CONCISENESS,
  BuiltinEvaluator.INSTRUCTION_FOLLOWING,
];

const ALL_FILTER_OPERATORS = [
  FilterOperator.EQUALS,
  FilterOperator.NOT_EQUALS,
  FilterOperator.GREATER_THAN,
  FilterOperator.LESS_THAN,
  FilterOperator.GREATER_THAN_OR_EQUAL,
  FilterOperator.LESS_THAN_OR_EQUAL,
  FilterOperator.CONTAINS,
  FilterOperator.NOT_CONTAINS,
];

// Arbitrary: valid config name matching ^[a-zA-Z][a-zA-Z0-9_]{0,47}$
const arbValidConfigName = fc.tuple(
  fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), { minLength: 1, maxLength: 1 }),
  fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('')), { minLength: 0, maxLength: 47 }),
).map(([first, rest]) => first + rest);

// Arbitrary: valid evaluators array (1-10 entries)
const arbEvaluators = fc.shuffledSubarray(ALL_BUILTIN_EVALUATORS, { minLength: 1, maxLength: 10 })
  .map(evals => evals.map(e => EvaluatorReference.builtin(e)));

// Arbitrary: valid sampling percentage [0.01, 100]
const arbSamplingPercentage = fc.double({ min: 0.01, max: 100, noNaN: true });

// Arbitrary: valid session timeout [1, 1440]
const arbSessionTimeout = fc.integer({ min: 1, max: 1440 });

// Arbitrary: valid description (0-200 chars)
const arbDescription = fc.string({ minLength: 1, maxLength: 200 });

// Arbitrary: valid filter config (0-5 filters)
const arbFilterValue = fc.oneof(
  fc.string({ minLength: 1, maxLength: 50 }),
  fc.double({ min: -1000, max: 1000, noNaN: true }),
  fc.boolean(),
);

const arbFilter = fc.record({
  key: fc.string({ minLength: 1, maxLength: 50 }),
  operator: fc.constantFrom(...ALL_FILTER_OPERATORS),
  value: arbFilterValue,
});

const arbFilters = fc.array(arbFilter, { minLength: 0, maxLength: 5 });

// Arbitrary: Record<string,string> tags
const arbTags = fc.dictionary(
  fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  fc.string({ minLength: 0, maxLength: 100 }),
  { minKeys: 0, maxKeys: 10 },
);

describe('OnlineEvaluationConfig Property-Based Tests', () => {
  /**
   * Property 1: L2 to L1 prop mapping round-trip
   *
   * For any valid OnlineEvaluationProps, synthesizing the stack should produce an
   * AWS::BedrockAgentCore::OnlineEvaluationConfig resource whose properties match the L2 inputs.
   *
   * **Validates: Requirements 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 6.1**
   */
  test('Property 1: L2 to L1 prop mapping round-trip', () => {
    fc.assert(
      fc.property(
        arbValidConfigName,
        arbEvaluators,
        arbSamplingPercentage,
        arbSessionTimeout,
        fc.option(arbDescription, { nil: undefined }),
        fc.option(arbTags, { nil: undefined }),
        fc.option(arbFilters, { nil: undefined }),
        (configName, evaluators, samplingPercentage, sessionTimeoutMinutes, description, tags, filters) => {
          const app = new App();
          const stack = new Stack(app, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
          });

          new OnlineEvaluationConfig(stack, 'Eval', {
            configName,
            evaluators,
            dataSource: DataSourceConfig.fromCloudWatchLogs({
              logGroupNames: ['/aws/bedrock-agentcore/agent'],
              serviceNames: ['agent.default'],
            }),
            samplingPercentage,
            sessionTimeoutMinutes,
            description,
            tags,
            filters,
          });

          const template = Template.fromStack(stack);
          const resources = template.findResources('AWS::BedrockAgentCore::OnlineEvaluationConfig');
          const resourceKeys = Object.keys(resources);
          expect(resourceKeys).toHaveLength(1);

          const props = resources[resourceKeys[0]].Properties;

          // Verify configName mapping
          expect(props.OnlineEvaluationConfigName).toBe(configName);

          // Verify evaluators mapping
          expect(props.Evaluators).toHaveLength(evaluators.length);
          for (let i = 0; i < evaluators.length; i++) {
            expect(props.Evaluators[i].EvaluatorId).toBe(evaluators[i].evaluatorId);
          }

          // Verify data source mapping
          expect(props.DataSourceConfig.CloudWatchLogs.LogGroupNames).toEqual(['/aws/bedrock-agentcore/agent']);
          expect(props.DataSourceConfig.CloudWatchLogs.ServiceNames).toEqual(['agent.default']);

          // Verify execution role ARN is present
          expect(props.EvaluationExecutionRoleArn).toBeDefined();

          // Verify rule mapping
          expect(props.Rule.SamplingConfig.SamplingPercentage).toBe(samplingPercentage);
          expect(props.Rule.SessionConfig.SessionTimeoutMinutes).toBe(sessionTimeoutMinutes);

          // Verify filters if provided
          if (filters && filters.length > 0) {
            expect(props.Rule.Filters).toHaveLength(filters.length);
          }

          // Verify description if provided
          if (description !== undefined) {
            expect(props.Description).toBe(description);
          }

          // Verify tags if provided
          if (tags !== undefined && Object.keys(tags).length > 0) {
            const expectedTags = Object.entries(tags).map(([key, value]) => ({ Key: key, Value: value }));
            expect(props.Tags).toEqual(expect.arrayContaining(expectedTags));
          }
        },
      ),
    );
  });

  /**
   * Property 2: Tag conversion preserves all entries
   *
   * For any Record<string, string> tags input with N entries, the converted Array<CfnTag>
   * should have exactly N elements, and for every key-value pair in the input record,
   * there should be a corresponding { Key, Value } object in the output array.
   *
   * **Validates: Requirements 6.1**
   */
  test('Property 2: Tag conversion preserves all entries', () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          fc.string({ minLength: 0, maxLength: 100 }),
          { minKeys: 1, maxKeys: 20 },
        ),
        (tags) => {
          const app = new App();
          const stack = new Stack(app, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
          });

          new OnlineEvaluationConfig(stack, 'Eval', {
            configName: 'tag_test',
            evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
            dataSource: DataSourceConfig.fromCloudWatchLogs({
              logGroupNames: ['/aws/log-group'],
              serviceNames: ['service'],
            }),
            tags,
          });

          const template = Template.fromStack(stack);
          const resources = template.findResources('AWS::BedrockAgentCore::OnlineEvaluationConfig');
          const props = resources[Object.keys(resources)[0]].Properties;

          const inputEntries = Object.entries(tags);
          // The template tags include both explicit tags and any CDK-added tags
          // Filter to only the tags we explicitly set
          const templateTags: Array<{ Key: string; Value: string }> = props.Tags || [];

          for (const [key, value] of inputEntries) {
            expect(templateTags).toEqual(
              expect.arrayContaining([{ Key: key, Value: value }]),
            );
          }

          // Verify count: at least N tags from our input (CDK may add more)
          expect(templateTags.length).toBeGreaterThanOrEqual(inputEntries.length);
        },
      ),
    );
  });

  /**
   * Property 3: Numeric range validation rejects out-of-bounds values
   *
   * For any number outside the valid range [0.01, 100] for samplingPercentage,
   * or outside [1, 1440] for sessionTimeoutMinutes, the corresponding validation
   * function should return a non-empty error array.
   *
   * **Validates: Requirements 9.3, 9.5**
   */
  test('Property 3: Numeric range validation rejects out-of-bounds values', () => {
    // Sampling percentage out of bounds
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ min: -1e10, max: 0.009, noNaN: true }),
          fc.double({ min: 100.001, max: 1e10, noNaN: true }),
        ),
        (percentage) => {
          const errors = validateSamplingPercentage(percentage);
          expect(errors.length).toBeGreaterThan(0);
        },
      ),
    );

    // Session timeout out of bounds
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: -1000, max: 0 }),
          fc.integer({ min: 1441, max: 100000 }),
        ),
        (timeout) => {
          const errors = validateSessionTimeout(timeout);
          expect(errors.length).toBeGreaterThan(0);
        },
      ),
    );
  });

  /**
   * Property 4: Config name validation rejects invalid patterns
   *
   * For any string that does not match ^[a-zA-Z][a-zA-Z0-9_]{0,47}$, validateConfigName
   * should return a non-empty error array. Conversely, for any string that matches the
   * pattern, it should return an empty array.
   *
   * **Validates: Requirements 9.1**
   */
  test('Property 4: Config name validation rejects invalid patterns', () => {
    const validPattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;

    // Invalid names should be rejected
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => !validPattern.test(s)),
        (name) => {
          const errors = validateConfigName(name);
          expect(errors.length).toBeGreaterThan(0);
        },
      ),
    );

    // Valid names should be accepted
    fc.assert(
      fc.property(
        arbValidConfigName,
        (name) => {
          const errors = validateConfigName(name);
          expect(errors).toHaveLength(0);
        },
      ),
    );
  });

  /**
   * Property 5: Array count validation rejects out-of-bounds lengths
   *
   * For any evaluators array with length outside [1, 10], validateEvaluators should return
   * a non-empty error array. For any filters array with length greater than 5,
   * validateFilters should return a non-empty error array. For any description string
   * longer than 200 characters, validateDescription should return a non-empty error array.
   *
   * **Validates: Requirements 9.2, 9.4, 9.6**
   */
  test('Property 5: Array count validation rejects out-of-bounds lengths', () => {
    // Empty evaluators
    fc.assert(
      fc.property(fc.constant([]), (evaluators) => {
        const errors = validateEvaluators(evaluators);
        expect(errors.length).toBeGreaterThan(0);
      }),
    );

    // Too many evaluators (11-20)
    fc.assert(
      fc.property(
        fc.integer({ min: 11, max: 20 }),
        (count) => {
          const evaluators = Array(count).fill({ evaluatorId: 'Builtin.Helpfulness' });
          const errors = validateEvaluators(evaluators);
          expect(errors.length).toBeGreaterThan(0);
        },
      ),
    );

    // Too many filters (6-20)
    fc.assert(
      fc.property(
        fc.integer({ min: 6, max: 20 }),
        (count) => {
          const filters = Array(count).fill({
            key: 'test',
            operator: FilterOperator.EQUALS,
            value: 'value',
          });
          const errors = validateFilters(filters);
          expect(errors.length).toBeGreaterThan(0);
        },
      ),
    );

    // Description too long (201-500 chars)
    fc.assert(
      fc.property(
        fc.integer({ min: 201, max: 500 }),
        (length) => {
          const description = 'a'.repeat(length);
          const errors = validateDescription(description);
          expect(errors.length).toBeGreaterThan(0);
        },
      ),
    );
  });

  /**
   * Property 6: Filter value formatting preserves type
   *
   * For any filter value (string, number, or boolean), formatFilterValue should produce
   * an object with exactly one key (StringValue, DoubleValue, or BooleanValue respectively)
   * whose value equals the input.
   *
   * **Validates: Requirements 1.7**
   */
  test('Property 6: Filter value formatting preserves type', () => {
    // Test string filter values
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (value) => {
          const app = new App();
          const stack = new Stack(app, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
          });

          new OnlineEvaluationConfig(stack, 'Eval', {
            configName: 'filter_test',
            evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
            dataSource: DataSourceConfig.fromCloudWatchLogs({
              logGroupNames: ['/aws/log-group'],
              serviceNames: ['service'],
            }),
            filters: [{ key: 'testKey', operator: FilterOperator.EQUALS, value }],
          });

          const template = Template.fromStack(stack);
          const resources = template.findResources('AWS::BedrockAgentCore::OnlineEvaluationConfig');
          const props = resources[Object.keys(resources)[0]].Properties;
          const filterValue = props.Rule.Filters[0].Value;

          expect(filterValue).toEqual({ StringValue: value });
        },
      ),
    );

    // Test number filter values
    fc.assert(
      fc.property(
        fc.double({ min: -1e6, max: 1e6, noNaN: true }),
        (value) => {
          const app = new App();
          const stack = new Stack(app, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
          });

          new OnlineEvaluationConfig(stack, 'Eval', {
            configName: 'filter_test',
            evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
            dataSource: DataSourceConfig.fromCloudWatchLogs({
              logGroupNames: ['/aws/log-group'],
              serviceNames: ['service'],
            }),
            filters: [{ key: 'testKey', operator: FilterOperator.EQUALS, value }],
          });

          const template = Template.fromStack(stack);
          const resources = template.findResources('AWS::BedrockAgentCore::OnlineEvaluationConfig');
          const props = resources[Object.keys(resources)[0]].Properties;
          const filterValue = props.Rule.Filters[0].Value;

          expect(filterValue).toEqual({ DoubleValue: value });
        },
      ),
    );

    // Test boolean filter values
    fc.assert(
      fc.property(
        fc.boolean(),
        (value) => {
          const app = new App();
          const stack = new Stack(app, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
          });

          new OnlineEvaluationConfig(stack, 'Eval', {
            configName: 'filter_test',
            evaluators: [EvaluatorReference.builtin(BuiltinEvaluator.HELPFULNESS)],
            dataSource: DataSourceConfig.fromCloudWatchLogs({
              logGroupNames: ['/aws/log-group'],
              serviceNames: ['service'],
            }),
            filters: [{ key: 'testKey', operator: FilterOperator.EQUALS, value }],
          });

          const template = Template.fromStack(stack);
          const resources = template.findResources('AWS::BedrockAgentCore::OnlineEvaluationConfig');
          const props = resources[Object.keys(resources)[0]].Properties;
          const filterValue = props.Rule.Filters[0].Value;

          expect(filterValue).toEqual({ BooleanValue: value });
        },
      ),
    );
  });
});
