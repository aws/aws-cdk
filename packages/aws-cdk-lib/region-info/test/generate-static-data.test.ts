import { generateAdotArn, generateAdotArnMap } from '../build-tools/generate-static-data';

describe('generateAdotArn', () => {
  it('should generate correct ARN for x86_64 architecture', () => {
    const result = generateAdotArn(
      'us-west-2',
      'x86_64',
      'aws-otel-collector',
      '0-84-0',
      '1',
    );
    expect(result).toBe(
      'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-84-0:1',
    );
  });

  it('should generate correct ARN for arm64 architecture', () => {
    const result = generateAdotArn(
      'us-east-1',
      'arm64',
      'aws-otel-collector',
      '0-82-0',
      '1',
    );
    expect(result).toBe(
      'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-82-0:1',
    );
  });
});

describe('generateAdotArnMap', () => {
  const testVersions: [string, string, string][] = [
    ['0.84.0', '0-84-0', '1'],
    ['0.84.0-2', '0-84-0', '2'],
    ['0.82.0', '0-82-0', '2'],
  ];
  const testRegions = ['us-west-2', 'us-east-1'];
  const layerName = 'aws-otel-collector';

  it('should generate correct structure', () => {
    const result = generateAdotArnMap(layerName, testVersions, testRegions);

    // Check top level structure
    expect(Object.keys(result)).toEqual(['0.84.0', '0.84.0-2', '0.82.0']);
    expect(Object.keys(result['0.84.0'])).toEqual(['x86_64', 'arm64']);
    expect(Object.keys(result['0.84.0'].x86_64)).toEqual(['us-west-2', 'us-east-1']);
  });

  it('should generate correct ARNs for all combinations', () => {
    const result = generateAdotArnMap(layerName, testVersions, testRegions);

    // Check specific ARN values
    expect(result['0.84.0'].x86_64['us-west-2']).toBe(
      'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-84-0:1',
    );
    expect(result['0.84.0-2'].x86_64['us-west-2']).toBe(
      'arn:aws:lambda:us-west-2:901920570463:layer:aws-otel-collector-amd64-ver-0-84-0:2',
    );
    expect(result['0.82.0'].arm64['us-east-1']).toBe(
      'arn:aws:lambda:us-east-1:901920570463:layer:aws-otel-collector-arm64-ver-0-82-0:2',
    );
  });

  it('should handle empty regions array', () => {
    const result = generateAdotArnMap(layerName, testVersions, []);
    expect(result['0.84.0'].x86_64).toEqual({});
    expect(result['0.84.0'].arm64).toEqual({});
  });

  it('should handle empty versions array', () => {
    const result = generateAdotArnMap(layerName, [], testRegions);
    expect(Object.keys(result)).toHaveLength(0);
  });
});
