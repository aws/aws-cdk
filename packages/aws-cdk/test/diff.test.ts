import * as cxapi from '@aws-cdk/cx-api';
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
  },
  {
    stackName: 'C',
    depends: ['A'],
    template: { resource: 'C'},
    metadata: {
      '/resource': [
        {
          type: cxapi.ERROR_METADATA_KEY,
          data: 'this is an error'
        }
      ]
    }
  }]
});

const appStacks = new AppStacks({
  configuration: new Configuration(),
  aws: new SDK(),
  synthesizer: async () => FIXED_RESULT,
});

test('diff can diff multiple stacks', async () => {
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
  expect(plainTextOutput).toContain('Stack A');
  expect(plainTextOutput).toContain('Stack B');

  expect(exitCode).toBe(0);
});

test('exits with 1 with diffs and fail set to true', async () => {
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
    stackNames: ['A'],
    stream: buffer,
    fail: true
  });

  // THEN
  expect(exitCode).toBe(1);
});

test('throws an error during diffs on stack with error metadata', async () => {
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
  try {
    const exitCode = await toolkit.diff({
      stackNames: ['C'],
      stream: buffer
    });

    // THEN
    expect(exitCode).toBe(1);
  } catch (e) {
    expect(e.toString()).toContain('Found errors');
  }
});

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
