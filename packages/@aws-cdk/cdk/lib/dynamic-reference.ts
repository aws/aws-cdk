import { Token } from "./token";

/**
 * Properties for a Dynamic Reference
 */
export interface DynamicReferenceProps {
  /**
   * The service to retrieve the dynamic reference from
   */
  readonly service: DynamicReferenceService;

  /**
   * The reference key of the dynamic reference
   */
  readonly referenceKey: string;
}

/**
 * References a dynamically retrieved value
 *
 * This is a Construct so that subclasses will (eventually) be able to attach
 * metadata to themselves without having to change call signatures.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
export class DynamicReference extends Token {
  constructor(service: DynamicReferenceService, key: string) {
    super(() => '{{resolve:' + service + ':' + key + '}}');
  }
}

/**
 * The service to retrieve the dynamic reference from
 */
export enum DynamicReferenceService {
  /**
   * Plaintext value stored in AWS Systems Manager Parameter Store
   */
  Ssm = 'ssm',

  /**
   * Secure string stored in AWS Systems Manager Parameter Store
   */
  SsmSecure = 'ssm-secure',

  /**
   * Secret stored in AWS Secrets Manager
   */
  SecretsManager = 'secretsmanager',
}
