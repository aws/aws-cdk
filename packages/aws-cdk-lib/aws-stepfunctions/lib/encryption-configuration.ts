/**
 * Base class for creating an EncryptionConfiguration for either state machines or activities.
 */
export abstract class EncryptionConfiguration {
  /**
   * Encryption option for the state machine or activity. Can be either CUSTOMER_MANAGED_KMS_KEY or AWS_OWNED_KEY.
   */
  type: string;
  constructor(type: string) {
    this.type = type;
  }
}
