/**
 * Enumeration of metadata types used for tracking analytics in AWS CDK.
 */
export enum MetadataType {
  /**
   * Metadata type for construct properties.
   * This is used to represent properties of CDK constructs.
   */
  CONSTRUCT = 'aws:cdk:analytics:construct',

  /**
   * Metadata type for method properties.
   * This is used to track parameters and details of CDK method calls.
   */
  METHOD = 'aws:cdk:analytics:method',

  /**
   * Metadata type for feature flags.
   * This is used to track analytics related to feature flags in the CDK.
   */
  FEATURE_FLAG = 'aws:cdk:analytics:featureflag',

  /**
   * Metadata type for Mixin use.
   * This is used to track analytics related to CDK Mixins.
   */
  MIXIN = 'aws:cdk:analytics:mixin',
}
