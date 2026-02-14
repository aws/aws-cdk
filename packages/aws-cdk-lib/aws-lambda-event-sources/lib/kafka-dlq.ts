import type { DlqDestinationConfig, IEventSourceDlq, IEventSourceMapping, IFunction } from '../../aws-lambda';
import { Token } from '../../core';

/**
 * A Kafka topic dead letter queue destination configuration for a Lambda event source.
 *
 * This destination can only be used with Kafka-based event sources (MSK and self-managed Kafka).
 * When used with other event source types, a validation error will be thrown.
 *
 * ## Kafka URI Format
 *
 * new KafkaDlq('my-topic');
 *
 * ## Topic Naming Requirements
 *
 * Kafka topic names must follow these rules:
 * - Only alphanumeric characters, dots (.), underscores (_), and hyphens (-) are allowed
 * - Cannot be empty
 * - Must be a valid Kafka topic name
 *
 */
export class KafkaDlq implements IEventSourceDlq {
  private readonly topicName: string;

  /**
   * Creates a new Kafka DLQ destination.
   *
   * @throws {TypeError} When the topic name is empty or contains invalid characters
   */
  constructor(topicName: string) {
    if (!Token.isUnresolved(topicName)) {
      if (!topicName || topicName.trim().length === 0) {
        throw new TypeError('Topic name cannot be empty');
      }

      // Validate basic Kafka topic naming rules
      const cleanTopicName = topicName.startsWith('kafka://') ? topicName.substring(8) : topicName;
      if (cleanTopicName.length === 0) {
        throw new TypeError('Topic name cannot be empty after removing kafka:// prefix');
      }

      // Basic validation for Kafka topic names
      if (!/^[a-zA-Z0-9._-]+$/.test(cleanTopicName)) {
        throw new TypeError('Topic name contains invalid characters. Only alphanumeric characters, dots, underscores, and hyphens are allowed');
      }
      this.topicName = topicName.startsWith('kafka://') ? topicName : `kafka://${topicName}`;
    } else {
      this.topicName = topicName;
    }
  }

  /**
   * Returns a destination configuration for the DLQ.
   *
   * The returned configuration is used in the AWS Lambda EventSourceMapping's DestinationConfig
   * to specify where failed records should be sent.
   *
   * @returns The DLQ destination configuration with the properly formatted Kafka URI
   *
   */
  public bind(_target: IEventSourceMapping, _targetHandler: IFunction): DlqDestinationConfig {
    return {
      destination: this.topicName,
    };
  }
}
