import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { RegoEngine, TemplateFile, version } from '../lib';

function writeTemplate(template: Record<string, any>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-test-'));
  const filePath = path.join(dir, 'template.json');
  fs.writeFileSync(filePath, JSON.stringify(template));
  return filePath;
}

describe('ValidationEngine', () => {
  test('reports version', () => {
    expect(version()).toBeDefined();
  });

  test('valid template produces no errors', () => {
    const templatePath = writeTemplate({
      Resources: {
        MyBucket: { Type: 'AWS::S3::Bucket', Properties: {} },
      },
    });

    const engine = new RegoEngine();
    const report = engine.validateStandard(new TemplateFile(templatePath), { severityLevel: 'ERROR' });
    engine.free();

    const errors = report.diagnostics.filter((d: any) => d.severity === 'ERROR' || d.severity === 'FATAL');
    expect(errors).toHaveLength(0);
  });

  test('invalid resource type produces error', () => {
    const templatePath = writeTemplate({
      Resources: {
        Bad: { Type: 'AWS::EC2::Subnt', Properties: {} },
      },
    });

    const engine = new RegoEngine();
    const report = engine.validateStandard(new TemplateFile(templatePath), { severityLevel: 'WARN' });
    engine.free();

    const unknownType = report.diagnostics.find((d: any) => d.message.includes('AWS::EC2::Subnt'));
    expect(unknownType).toBeDefined();
  });

  test('severity levels are valid strings', () => {
    const templatePath = writeTemplate({
      Resources: {
        Bad: { Type: 'AWS::EC2::Subnt', Properties: {} },
      },
    });

    const engine = new RegoEngine();
    const report = engine.validateStandard(new TemplateFile(templatePath), { severityLevel: 'WARN' });
    engine.free();

    for (const d of report.diagnostics) {
      expect(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']).toContain(d.severity);
    }
  });
});
