import { EncryptionConfiguration } from './encryption-configuration';

const AWS_OWNED_KEY = 'AWS_OWNED_KEY';

/**
 * Define a new AwsOwnedEncryptionConfiguration
 */
export class AwsOwnedEncryptionConfiguration extends EncryptionConfiguration {
  constructor() {
    super(AWS_OWNED_KEY);
  }
}
