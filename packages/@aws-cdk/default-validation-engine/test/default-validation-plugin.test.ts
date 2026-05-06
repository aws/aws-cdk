import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { DefaultValidationPlugin } from '../lib';

function writeTemplate(template: Record<string, any>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-test-'));
  const filePath = path.join(dir, 'template.json');
  fs.writeFileSync(filePath, JSON.stringify(template));
  return filePath;
}

describe('DefaultValidationPlugin', () => {
  test('reports version', () => {
    const plugin = new DefaultValidationPlugin();
    expect(plugin.version).toBeDefined();
    expect(plugin.name).toBe('default');
  });

  test('valid template passes', () => {
    const templatePath = writeTemplate({
      Resources: {
        MyBucket: {
          Type: 'AWS::S3::Bucket',
          Properties: {},
        },
      },
    });

    const plugin = new DefaultValidationPlugin();
    const report = plugin.validate({ templatePaths: [templatePath] });

    // May have warnings but no fatal/error for a simple valid bucket
    const fatalOrError = report.violations.filter(
      v => v.severity === 'fatal' || v.severity === 'error',
    );
    expect(fatalOrError).toHaveLength(0);
    expect(report.success).toBe(true);
  });

  test('invalid resource type produces error', () => {
    const templatePath = writeTemplate({
      Resources: {
        Bad: {
          Type: 'AWS::EC2::Subnt',
          Properties: {},
        },
      },
    });

    const plugin = new DefaultValidationPlugin();
    const report = plugin.validate({ templatePaths: [templatePath] });

    expect(report.success).toBe(false);
    const unknownType = report.violations.find(v => v.description.includes('AWS::EC2::Subnt'));
    expect(unknownType).toBeDefined();
    expect(unknownType!.ruleName).toMatch(/^E\d+/);
  });

  test('multiple templates are all validated', () => {
    const t1 = writeTemplate({
      Resources: { A: { Type: 'AWS::S3::Bucket', Properties: {} } },
    });
    const t2 = writeTemplate({
      Resources: { B: { Type: 'AWS::EC2::Subnt', Properties: {} } },
    });

    const plugin = new DefaultValidationPlugin();
    const report = plugin.validate({ templatePaths: [t1, t2] });

    expect(report.success).toBe(false);
    // The invalid type from t2 should appear
    expect(report.violations.some(v => v.description.includes('AWS::EC2::Subnt'))).toBe(true);
  });

  test('severity mapping is correct', () => {
    const templatePath = writeTemplate({
      Resources: {
        Bad: { Type: 'AWS::EC2::Subnt', Properties: {} },
      },
    });

    const plugin = new DefaultValidationPlugin();
    const report = plugin.validate({ templatePaths: [templatePath] });

    for (const v of report.violations) {
      expect(['fatal', 'error', 'warning']).toContain(v.severity);
    }
  });
});
