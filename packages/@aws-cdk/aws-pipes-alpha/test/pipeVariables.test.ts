import { Token } from 'aws-cdk-lib';
import { DynamicInput } from '../lib';

describe('DynamicInput', () => {
  it('should create a new DynamicInput from event path', () => {
    const dynamicInput = DynamicInput.fromEventPath('$.test.path');
    expect(dynamicInput.toString()).toBe('<$.test.path>');
  });

  it('should throw an error if event path does not start with "$."', () => {
    let expectedError;
    try {
      DynamicInput.fromEventPath('test.path');
    } catch (error) {
      expectedError = error;
    }
    expect(expectedError).toEqual(new Error('jsonPathExpression start with "$."'));
  });

  it('should create a new DynamicInput for pipeArn', () => {
    const dynamicInput = DynamicInput.pipeArn;
    expect(dynamicInput.toString()).toBe('<aws.pipes.pipe-arn>');
  });

  it('should create a new DynamicInput for pipeName', () => {
    const dynamicInput = DynamicInput.pipeName;
    expect(dynamicInput.toString()).toBe('<aws.pipes.pipe-name>');
  });

  it('should create a new DynamicInput for sourceArn', () => {
    const dynamicInput = DynamicInput.sourceArn;
    expect(dynamicInput.toString()).toBe('<aws.pipes.source-arn>');
  });

  it('should create a new DynamicInput for enrichmentArn', () => {
    const dynamicInput = DynamicInput.enrichmentArn;
    expect(dynamicInput.toString()).toBe('<aws.pipes.enrichment-arn>');
  });

  it('should create a new DynamicInput for targetArn', () => {
    const dynamicInput = DynamicInput.targetArn;
    expect(dynamicInput.toString()).toBe('<aws.pipes.target-arn>');
  });

  it('should create a new DynamicInput for eventIngestionTime', () => {
    const dynamicInput = DynamicInput.eventIngestionTime;
    expect(dynamicInput.toString()).toBe('<aws.pipes.event.ingestion-time>');
  });

  it('should create a new DynamicInput for event', () => {
    const dynamicInput = DynamicInput.event;
    expect(dynamicInput.toString()).toBe('<aws.pipes.event>');
  });

  it('should create a new DynamicInput for eventJson', () => {
    const dynamicInput = DynamicInput.eventJson;
    expect(dynamicInput.toString()).toBe('<aws.pipes.event.json>');
  });

  it('should resolve to the value', () => {
    const token = Token.asString('$.test.path');
    const dynamicInput = DynamicInput.fromEventPath(token);
    expect(dynamicInput.resolve({} as any)).toBe('<$.test.path>');
  });

  it('should return a string representation of the value', () => {
    const dynamicInput = DynamicInput.fromEventPath('$.test.path');
    expect(dynamicInput.toString()).toBe('<$.test.path>');
  });

  it('should return a JSON representation of the value', () => {
    const dynamicInput = DynamicInput.fromEventPath('$.test.path');
    expect(dynamicInput.toJSON()).toBe('<$.test.path>');
  });
});
