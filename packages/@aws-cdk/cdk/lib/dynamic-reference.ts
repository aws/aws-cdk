import { Construct } from "./construct";
import { Token } from "./token";

/**
 * Properties for a Dynamic Reference
 */
export interface DynamicReferenceProps {
  /**
   * The service to retrieve the dynamic reference from
   */
  service: DynamicReferenceService;

  /**
   * The reference key of the dynamic reference
   */
  referenceKey: string;
}

/**
 * References a dynamically retrieved value
 *
 * This is a Construct so that subclasses will (eventually) be able to attach
 * metadata to themselves without having to change call signatures.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
 */
export class DynamicReference extends Construct {
  private _value: string;

  constructor(scope: Construct, id: string, props: DynamicReferenceProps) {
    super(scope, id);

    this._value = this.makeResolveValue(props.service, props.referenceKey);
  }

  /**
   * The value of this dynamic reference
   */
  public get stringValue(): string {
    return this._value;
  }

  /**
   * Make a dynamic reference Token value
   *
   * This is a value (similar to CDK Tokens) that will be substituted by
   * CloudFormation before executing the changeset.
   */
  protected makeResolveValue(service: DynamicReferenceService, referenceKey: string) {
    const resolveString = '{{resolve:' + service + ':' + referenceKey + '}}';

    // We don't strictly need to Tokenize a string here, but we do it anyway to be perfectly
    // clear that DynamicReference.value is unparseable in CDK apps.
    return new Token(resolveString).toString();
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
