import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { GraduationReport } from '../lib/report';

describe('GraduationReport', () => {
  test('hasManualItems reflects whether a manual entry was added', () => {
    const report = new GraduationReport('aws-foo');
    report.info('sources', 'copied stuff');
    report.review('imports', 'rewrote imports');
    report.warn('deprecated', 'has deprecated apis');
    expect(report.hasManualItems).toBe(false);

    report.manual('custom-resources', 'edit config.ts');
    expect(report.hasManualItems).toBe(true);
  });

  test('render groups entries under severity sections', () => {
    const report = new GraduationReport('aws-foo');
    report.manual('lint', 'unfixable thing');
    report.warn('deprecated', 'deprecated api');
    report.review('imports', 'rewrote 3 imports', 'lib/foo.ts');
    report.info('target', 'submodule exists');

    const out = report.render();
    expect(out).toContain('# Graduation report: aws-foo');
    expect(out).toContain('🔴 Manual follow-up required');
    expect(out).toContain('🟡 Warnings');
    expect(out).toContain('🔵 Auto-applied — please review');
    expect(out).toContain('⚪ Informational');
    // File-scoped entries render the path inline.
    expect(out).toContain('`lib/foo.ts`');
  });

  test('renders skipped ("not moved") entries in their own section', () => {
    const report = new GraduationReport('aws-foo');
    report.skipped('sources', 'did not copy 2 generated L1 file(s)');
    const out = report.render();
    expect(out).toContain('⚫ Not moved — intentionally skipped');
    expect(out).toContain('did not copy 2 generated L1 file(s)');
    // A skipped entry is not a manual follow-up.
    expect(report.hasManualItems).toBe(false);
  });

  test('omits empty sections', () => {
    const report = new GraduationReport('aws-foo');
    report.info('target', 'only info');
    const out = report.render();
    expect(out).not.toContain('🔴 Manual follow-up required');
    expect(out).toContain('⚪ Informational');
  });

  test('writeTo writes the report to disk and returns the path', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grad-report-'));
    try {
      const report = new GraduationReport('aws-foo');
      report.review('imports', 'did a thing');
      const file = report.writeTo(dir);
      expect(file).toBe(path.join(dir, 'graduation-report.md'));
      expect(fs.readFileSync(file, 'utf-8')).toContain('did a thing');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
