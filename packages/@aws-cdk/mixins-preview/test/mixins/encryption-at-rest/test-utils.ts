/**
 * Test utilities and common fixtures for encryption-at-rest mixin tests.
 *
 * This module provides reusable test helpers for testing encryption-at-rest
 * mixins across all supported AWS services.
 */

import { App, Stack } from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
import type { IMixin } from '../../../lib/core';

/**
 * Test context containing common test fixtures.
 */
export interface TestContext {
  /** The CDK App instance */
  app: App;
  /** The CDK Stack instance */
  stack: Stack;
  /** A KMS key for testing customer-managed encryption */
  kmsKey: kms.Key;
  /** The CloudFormation template for assertions */
  template: () => Template;
}

/**
 * Creates a fresh test context with common fixtures.
 *
 * @returns A TestContext with app, stack, and KMS key
 */
export function createTestContext(): TestContext {
  const app = new App();
  const stack = new Stack(app, 'TestStack');
  const kmsKey = new kms.Key(stack, 'TestKey');

  return {
    app,
    stack,
    kmsKey,
    template: () => Template.fromStack(stack),
  };
}

/**
 * A non-CfnResource construct for testing mixin support checks.
 */
export class NonCfnConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

/**
 * Test helper to verify a mixin supports a specific construct type.
 *
 * @param mixin The mixin to test
 * @param construct The construct to check support for
 * @returns true if the mixin supports the construct
 */
export function expectMixinSupports(mixin: IMixin, construct: Construct): boolean {
  return mixin.supports(construct);
}

/**
 * Test helper to verify a mixin does not support a construct.
 *
 * @param mixin The mixin to test
 * @param construct The construct to check
 * @returns true if the mixin does NOT support the construct
 */
export function expectMixinDoesNotSupport(mixin: IMixin, construct: Construct): boolean {
  return !mixin.supports(construct);
}

/**
 * Encryption test categories based on KMS support.
 */
export enum EncryptionCategory {
  /** Services with optional KMS support (default encryption without KMS, enhanced with KMS) */
  STANDARD_KMS_SUPPORT = 'STANDARD_KMS_SUPPORT',
  /** Services where KMS key is mandatory for encryption */
  KMS_REQUIRED = 'KMS_REQUIRED',
  /** Services that don't support customer-managed KMS keys */
  NO_KMS_SUPPORT = 'NO_KMS_SUPPORT',
}

/**
 * Resource types that require a KMS key (mixin returns undefined without key).
 */
export const KMS_REQUIRED_RESOURCES = [
  'AWS::AppIntegrations::DataIntegration',
  'AWS::AppRunner::Service',
  'AWS::Kinesis::Stream',
] as const;

/**
 * Resource types that don't support customer-managed KMS keys.
 */
export const NO_KMS_SUPPORT_RESOURCES = [
  'AWS::AppSync::ApiCache',
  'AWS::DAX::Cluster',
  'AWS::DataSync::LocationEFS',
  'AWS::DynamoDB::GlobalTable',
  'AWS::EC2::Instance',
  'AWS::Glue::SecurityConfiguration',
  'AWS::IoTSiteWise::Asset',
  'AWS::IoTSiteWise::AssetModel',
  'AWS::MediaConnect::FlowEntitlement',
  'AWS::MediaConnect::FlowOutput',
  'AWS::RDS::GlobalCluster',
] as const;

/**
 * Determines the encryption category for a given resource type.
 *
 * @param resourceType The CloudFormation resource type
 * @returns The encryption category for the resource
 */
export function getEncryptionCategory(resourceType: string): EncryptionCategory {
  if ((KMS_REQUIRED_RESOURCES as readonly string[]).includes(resourceType)) {
    return EncryptionCategory.KMS_REQUIRED;
  }
  if ((NO_KMS_SUPPORT_RESOURCES as readonly string[]).includes(resourceType)) {
    return EncryptionCategory.NO_KMS_SUPPORT;
  }
  return EncryptionCategory.STANDARD_KMS_SUPPORT;
}

/**
 * Common test assertions for encryption-at-rest mixins.
 */
export const EncryptionTestAssertions = {
  /**
   * Asserts that a mixin supports a CfnResource construct.
   */
  supportsCfnResource: (mixin: IMixin, construct: Construct) => {
    expect(mixin.supports(construct)).toBe(true);
  },

  /**
   * Asserts that a mixin does not support a non-CfnResource construct.
   */
  doesNotSupportNonCfnResource: (mixin: IMixin, stack: Stack) => {
    const nonCfn = new NonCfnConstruct(stack, 'NonCfn');
    expect(mixin.supports(nonCfn)).toBe(false);
  },

  /**
   * Asserts that applying a mixin does not throw.
   */
  appliesWithoutError: (mixin: IMixin, construct: Construct) => {
    expect(() => mixin.applyTo(construct)).not.toThrow();
  },
};
