import * as path from 'path';
import { checkConsumer, formatDiagnostics } from '@aws-cdk/cdk-build-tools';

/**
 * Consumer code compiled against the published declarations with `strict` and
 * `exactOptionalPropertyTypes`. Needs a build: it reads the emitted `.d.ts` files.
 *
 * `cdk-build` already type-checks the declarations themselves; these tests cover
 * how consumers use them.
 */
const PACKAGE_DIR = path.resolve(__dirname, '..', '..');

function compile(code: string, exactOptionalPropertyTypes = true): string {
  return formatDiagnostics(checkConsumer(PACKAGE_DIR, code, { skipLibCheck: true, exactOptionalPropertyTypes }), PACKAGE_DIR);
}

describe('exactOptionalPropertyTypes', () => {
  test('L2 classes can be passed where their interface is expected (#19077, #37600, #37995)', () => {
    expect(compile(`
      import { App, Stack } from 'aws-cdk-lib';
      import * as apigateway from 'aws-cdk-lib/aws-apigateway';
      import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
      import * as ec2 from 'aws-cdk-lib/aws-ec2';

      const stack = new Stack(new App(), 'Stack');
      function useVpc(_vpc: ec2.IVpc) {}
      useVpc(new ec2.Vpc(stack, 'Vpc'));
      const api: apigateway.IRestApi = new apigateway.RestApi(stack, 'Api');
      const widgets: cloudwatch.IWidget[] = [new cloudwatch.GraphWidget({})];
    `)).toEqual('');
  });

  // Allowing `undefined` on a member must not break code written against the narrower type
  test.each([true, false])('existing implementations and getter overrides still compile (flag %p)', (exactOptionalPropertyTypes) => {
    expect(compile(`
      import * as pipelines from 'aws-cdk-lib/pipelines';

      class Producer implements pipelines.IFileSetProducer {
        public readonly primaryOutput?: pipelines.FileSet;
      }

      class MyStep extends pipelines.Step {
        public get primaryOutput(): pipelines.FileSet | undefined { return undefined; }
      }
    `, exactOptionalPropertyTypes)).toEqual('');
  });
});
