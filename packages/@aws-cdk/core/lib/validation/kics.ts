import * as fs from 'fs';
import * as path from 'path';
import { sync } from 'cross-spawn';
import { IValidationPlugin, ValidationContext } from './validation';

// NOTE: This class will eventually move out to a separate repository, but we're
// keeping it here for now to make it easier to iterate on.

/**
 * TODO docs
 */
export class KicsValidationPlugin implements IValidationPlugin {
  name: string = 'KICS';

  isReady(): boolean {
    // TODO Check if docker is installed
    return true;
  }

  /**
   * TODO docs
   */
  validate(context: ValidationContext) {
    const templatePath = context.stack.templateFullPath;
    const [templateFolder, templateFileName] = this.splitPathAndFile(templatePath);

    const flags = [
      'run',
      '-t',
      `-v "${templateFolder}:/path"`,
      'checkmarx/kics:latest',
      'scan',
      `-p /path/${templateFileName}`,
      '-o "/path/"',
      '--ci',
      '--report-formats "json"',
    ];

    // eslint-disable-next-line no-console
    console.log(flags.join(' '));

    // TODO This is not working yet. When I run the command directly in the
    // terminal it works, but here I'm getting a docker error regarding the
    // volume name.
    const { status, output } = sync('docker', flags, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    // eslint-disable-next-line no-console
    console.log('status: ', status);

    // eslint-disable-next-line no-console
    console.log('stdout: ', output);

    const foo = fs.readFileSync(path.join(templateFolder, 'results.json'), { encoding: 'utf-8' });

    const results = JSON.parse(foo);

    results.queries.forEach((query: any) => {
      query.files.forEach((file: any) => {
        context.report.addViolation({
          fix: 'N/A',
          recommendation: query.description,
          ruleName: query.query_name,
          violatingResource: {
            resourceName: file.resource_name,
            templatePath: file.file_name,
            locations: [file.search_key],
          },
        });
      });
    });

    context.report.submit(status == 0 ? 'success' : 'failure');
  }

  splitPathAndFile(templatePath: string): [any, any] {
    const templateFolder = path.dirname(templatePath);
    const templateFileName = path.basename(templatePath);
    return [templateFolder, templateFileName];
  }
}