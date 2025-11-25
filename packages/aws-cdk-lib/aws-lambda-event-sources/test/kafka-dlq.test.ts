import { Template } from '../../assertions';
import * as cdk from '../../core';
import * as sources from '../lib';

describe('KafkaDlq', () => {
  describe('constructor', () => {
    test('creates destination with topic name', () => {
      const dlq = new sources.KafkaDlq('my-topic');
      expect(dlq).toBeDefined();
    });

    test('adds kafka:// prefix when not present', () => {
      const dlq = new sources.KafkaDlq('my-topic');
      const config = dlq.bind({} as any, {} as any);
      expect(config.destination).toBe('kafka://my-topic');
    });

    test('does not duplicate kafka:// prefix', () => {
      const dlq = new sources.KafkaDlq('kafka://my-topic');
      const config = dlq.bind({} as any, {} as any);
      expect(config.destination).toBe('kafka://my-topic');
    });

    test('throws error for empty topic name', () => {
      expect(() => new sources.KafkaDlq('')).toThrow('Topic name cannot be empty');
    });

    test('throws error for whitespace-only topic name', () => {
      expect(() => new sources.KafkaDlq('   ')).toThrow('Topic name cannot be empty');
    });

    test('throws error for empty topic name after removing kafka:// prefix', () => {
      expect(() => new sources.KafkaDlq('kafka://')).toThrow('Topic name cannot be empty after removing kafka:// prefix');
    });

    test('throws error for invalid characters in topic name', () => {
      expect(() => new sources.KafkaDlq('invalid@topic')).toThrow('Topic name contains invalid characters');
      expect(() => new sources.KafkaDlq('invalid#topic')).toThrow('Topic name contains invalid characters');
      expect(() => new sources.KafkaDlq('invalid topic')).toThrow('Topic name contains invalid characters');
    });

    test('accepts valid topic names with allowed characters', () => {
      expect(() => new sources.KafkaDlq('valid-topic')).not.toThrow();
      expect(() => new sources.KafkaDlq('valid_topic')).not.toThrow();
      expect(() => new sources.KafkaDlq('valid.topic')).not.toThrow();
      expect(() => new sources.KafkaDlq('ValidTopic123')).not.toThrow();
    });

    test('appends token as is without validation or prefix', () => {
      const stack = new cdk.Stack();
      const token = cdk.Fn.ref('MyTopicParameter');

      const dlq = new sources.KafkaDlq(token);
      const config = dlq.bind({} as any, {} as any);

      expect(cdk.Token.isUnresolved(config.destination)).toBe(true);
    });
  });

  describe('bind method', () => {
    test('returns correct DlqDestinationConfig', () => {
      const dlq = new sources.KafkaDlq('test-topic');
      const config = dlq.bind({} as any, {} as any);

      expect(config).toEqual({
        destination: 'kafka://test-topic',
      });
    });

    test('preserves kafka:// prefix in destination', () => {
      const dlq = new sources.KafkaDlq('kafka://existing-prefix-topic');
      const config = dlq.bind({} as any, {} as any);

      expect(config.destination).toBe('kafka://existing-prefix-topic');
    });

    test('handles topic names with dots and underscores', () => {
      const dlq = new sources.KafkaDlq('my.complex_topic-name');
      const config = dlq.bind({} as any, {} as any);

      expect(config.destination).toBe('kafka://my.complex_topic-name');
    });
  });
});
