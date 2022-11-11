import { ICdk, CdkCliWrapper, CdkCliWrapperOptions, SynthFastOptions, DestroyOptions, ListOptions, SynthOptions, DeployOptions } from 'cdk-cli-wrapper';
import { IntegSnapshotRunner, IntegTest } from '../lib/runner';
import { DestructiveChange, Diagnostic } from '../lib/workers';

export interface MockCdkMocks {
  deploy?: jest.MockedFn<(options: DeployOptions) => void>;
  synth?: jest.MockedFn<(options: SynthOptions) => void>;
  synthFast?: jest.MockedFn<(options: SynthFastOptions) => void>;
  destroy?: jest.MockedFn<(options: DestroyOptions) => void>;
  list?: jest.MockedFn<(options: ListOptions) => string>;
}

export class MockCdkProvider {
  public readonly cdk: ICdk;
  public readonly mocks: MockCdkMocks = {};

  constructor(options: CdkCliWrapperOptions) {
    this.cdk = new CdkCliWrapper(options);
  }

  public mockDeploy(mock?: MockCdkMocks['deploy']) {
    this.mocks.deploy = mock ?? jest.fn().mockImplementation();
    this.cdk.deploy = this.mocks.deploy;
  }
  public mockSynth(mock?: MockCdkMocks['synth']) {
    this.mocks.synth = mock ?? jest.fn().mockImplementation();
    this.cdk.synth = this.mocks.synth;
  }
  public mockSynthFast(mock?: MockCdkMocks['synthFast']) {
    this.mocks.synthFast = mock ?? jest.fn().mockImplementation();
    this.cdk.synthFast = this.mocks.synthFast;
  }
  public mockDestroy(mock?: MockCdkMocks['destroy']) {
    this.mocks.destroy = mock ?? jest.fn().mockImplementation();
    this.cdk.destroy = this.mocks.destroy;
  }
  public mockList(mock?: MockCdkMocks['list']) {
    this.mocks.list = mock ?? jest.fn().mockImplementation();
    this.cdk.list = this.mocks.list;
  }
  public mockAll(mocks: MockCdkMocks = {}): Required<MockCdkMocks> {
    this.mockDeploy(mocks.deploy);
    this.mockSynth(mocks.synth);
    this.mockSynthFast(mocks.synthFast);
    this.mockDestroy(mocks.destroy);
    this.mockList(mocks.list);

    return this.mocks as Required<MockCdkMocks>;
  }


  /**
   * Run a test of the testSnapshot method
   * @param integTestFile This name is used to determined the expected (committed) snapshot
   * @param actualSnapshot The directory of the snapshot that is used for of the actual (current) app
   * @returns Diagnostics as they would be returned by testSnapshot
   */
  public snapshotTest(integTestFile: string, actualSnapshot?: string): {
    diagnostics: Diagnostic[],
    destructiveChanges: DestructiveChange[]
  } {
    // WHEN
    const integTest = new IntegSnapshotRunner({
      cdk: this.cdk,
      test: new IntegTest({
        fileName: 'test/test-data/' + integTestFile,
        discoveryRoot: 'test/test-data',
      }),
      integOutDir: actualSnapshot ? 'test/test-data/' + actualSnapshot : undefined,
    });
    integTest.actualTests();
    const results = integTest.testSnapshot();

    // THEN
    expect(this.mocks.synthFast).toHaveBeenCalledTimes(2);
    expect(this.mocks.synthFast).toHaveBeenCalledWith({
      env: expect.objectContaining({
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
      }),
      execCmd: ['node', integTestFile],
      output: actualSnapshot ?? `cdk-integ.out.${integTestFile}.snapshot`,
    });

    return results;
  }
}