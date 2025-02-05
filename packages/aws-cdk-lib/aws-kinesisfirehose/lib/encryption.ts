import { StreamEncryptionType } from './delivery-stream';
import { IKey } from '../../aws-kms';

/**
 * Represents server-side encryption for a Kinesis Firehose Delivery Stream.
 */
export abstract class StreamEncryption {
  /**
   * No server-side encryption is configured.
   */
  public static unencrypted(): StreamEncryption {
    return new (class extends StreamEncryption {
    }) (StreamEncryptionType.UNENCRYPTED);
  }

  /**
   * Configure server-side encryption using an AWS owned key.
   */
  public static awsOwnedKey(): StreamEncryption {
    return new (class extends StreamEncryption {
    }) (StreamEncryptionType.AWS_OWNED);
  }

  /**
   * Configure server-side encryption using customer managed keys.
   *
   * @param encryptionKey the KMS key for the delivery stream.
   */
  public static customerManagedKey(encryptionKey?: IKey): StreamEncryption {
    return new (class extends StreamEncryption {

    }) (StreamEncryptionType.CUSTOMER_MANAGED, encryptionKey);
  }

  /**
   * Constructor for StreamEncryption.
   *
   * @param type The type of server-side encryption for the Kinesis Firehose delivery stream.
   * @param encryptionKey Optional KMS key used for customer managed encryption.
   */
  private constructor (
    public readonly type: StreamEncryptionType,
    public readonly encryptionKey?: IKey) {}
}
