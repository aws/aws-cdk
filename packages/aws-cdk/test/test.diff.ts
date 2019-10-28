import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import { Writable } from 'stream';
import { NodeStringDecoder, StringDecoder  } from 'string_decoder';
import { DeployStackOptions, DeployStackResult } from '../lib';
import { AppStacks } from '../lib/api/cxapp/stacks';
import { IDeploymentTarget, Template } from '../lib/api/deployment-target';
import { SDK } from '../lib/api/util/sdk';
import { CdkToolkit } from '../lib/cdk-toolkit';
import { Configuration } from '../lib/settings';
import { testAssembly } from './util';

const FIXED_RESULT = testAssembly({
  stacks: [{
    stackName: 'A',
    template: { resource: 'A' },
  },
  {
    stackName: 'B',
    depends: ['A'],
    template: { resource: 'B' },
  }]
});

const appStacks = new AppStacks({
  configuration: new Configuration(),
  aws: new SDK(),
  synthesizer: async () => FIXED_RESULT,
});

export = {
  async 'diff can diff multiple stacks'(test: Test) {
    // GIVEN
    const provisioner: IDeploymentTarget = {
      async readCurrentTemplate(_stack: cxapi.CloudFormationStackArtifact): Promise<Template> {
        return {};
      },
      async deployStack(_options: DeployStackOptions): Promise<DeployStackResult> {
        return { noOp: true, outputs: {}, stackArn: ''};
      }
    };
    const toolkit = new CdkToolkit({ appStacks, provisioner });
    const buffer = new StringWritable();

    // WHEN
    const exitCode = await toolkit.diff({
      stackNames: ['B'],
      stream: buffer
    });

    // THEN
    const plainTextOutput = buffer.data.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
    test.ok(plainTextOutput.indexOf('Stack A') > -1, `Did not contain "Stack A": ${plainTextOutput}`);
    test.ok(plainTextOutput.indexOf('Stack B') > -1, `Did not contain "Stack B": ${plainTextOutput}`);

    test.equals(1, exitCode);

    test.done();
  },
};

class StringWritable extends Writable {
  public data: string;
  private readonly _decoder: NodeStringDecoder;

  constructor(options: any = {}) {
    super(options);
    this._decoder = new StringDecoder(options && options.defaultEncoding);
    this.data = '';
  }

  public _write(chunk: any, encoding: string, callback: (error?: Error | undefined) => void) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }

  public _final(callback: (error?: Error | null) => void) {
    this.data += this._decoder.end();
    callback();
  }
}
