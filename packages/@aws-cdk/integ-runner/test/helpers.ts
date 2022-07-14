import { ICdk, CdkCliWrapper, CdkCliWrapperOptions, SynthFastOptions, DestroyOptions, ListOptions, SynthOptions, DeployOptions } from 'cdk-cli-wrapper';

export class MockCdkProvider {
  public readonly cdk: ICdk;
  constructor(options: CdkCliWrapperOptions) {
    this.cdk = new CdkCliWrapper(options);
  }

  public mockDeploy(mock?: (options: DeployOptions) => void) {
    this.cdk.deploy = mock ?? jest.fn().mockImplementation();
  }
  public mockSynth(mock?: (options: SynthOptions) => void) {
    this.cdk.synth = mock ?? jest.fn().mockImplementation();
  }
  public mockSynthFast(mock?: (options: SynthFastOptions) => void) {
    this.cdk.synthFast = mock ?? jest.fn().mockImplementation();
  }
  public mockDestroy(mock?: (options: DestroyOptions) => void) {
    this.cdk.destroy = mock ?? jest.fn().mockImplementation();
  }
  public mockList(mock?: (options: ListOptions) => string) {
    this.cdk.list = mock ?? jest.fn().mockImplementation();
  }
}
