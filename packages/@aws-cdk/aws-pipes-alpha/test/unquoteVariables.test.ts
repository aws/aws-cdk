import { PipeVariable } from '../lib';
import { unquote } from '../lib/unquote';

describe('unquote', () => {
  it('should not unquote normal values', () => {
    const stringValue = JSON.stringify({
      pipeName: 'some-name',
    });

    const result = unquote(stringValue);

    expect(result).toBe('{"pipeName":"some-name"}');

  });

  it('should unquote single variables', () => {
    const stringValue = JSON.stringify({
      pipeName: PipeVariable.NAME,
    });

    const result = unquote(stringValue);

    expect(result).toBe('{"pipeName":<aws.pipes.pipe-name>}');

  });

  it('should unquote multiple variables', () => {
    const stringValue = JSON.stringify({
      pipeName: PipeVariable.NAME,
      pipeArn: PipeVariable.ARN,
    });

    const result = unquote(stringValue);

    expect(result).toBe('{"pipeName":<aws.pipes.pipe-name>,"pipeArn":<aws.pipes.pipe-arn>}');

  });

  it('should unquote single event path expression', () => {
    const stringValue = JSON.stringify({
      pipeName: '<$.foo.bar>',
    });

    const result = unquote(stringValue);

    expect(result).toBe('{"pipeName":<$.foo.bar>}');

  });

  it('should unquote multiple event path expressions', () => {
    const stringValue = JSON.stringify({
      pipeName: '<$.foo.bar>',
      second: '<$.foo.baz>',
    });

    const result = unquote(stringValue);

    expect(result).toBe('{"pipeName":<$.foo.bar>,"second":<$.foo.baz>}');

  });

  it('should unquote variables and event path expressions', () => {
    const stringValue = JSON.stringify({
      pipeName: '<$.foo.bar>',
      second: '<$.foo.baz>',
    });

    const result = unquote(stringValue);

    expect(result).toBe('{"pipeName":<$.foo.bar>,"second":<$.foo.baz>}');
  });

});
