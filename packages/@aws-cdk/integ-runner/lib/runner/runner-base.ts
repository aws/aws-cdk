import * as path from 'path';
import { TestCase, DefaultCdkOptions } from '@aws-cdk/cloud-assembly-schema';
import { AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY, TARGET_PARTITIONS, NEW_PROJECT_CONTEXT } from '@aws-cdk/cx-api';
import { CdkCliWrapper, ICdk } from 'cdk-cli-wrapper';
import * as fs from 'fs-extra';
import { IntegTestSuite, LegacyIntegTestSuite } from './integ-test-suite';
import { IntegTest } from './integration-tests';
import { AssemblyManifestReader, ManifestTrace } from './private/cloud-assembly';
import { flatten } from '../utils';
import { DestructiveChange } from '../workers/common';

const DESTRUCTIVE_CHANGES = '!!DESTRUCTIVE_CHANGES:';

/**
 * Options for creating an integration test runner
 */
export interface IntegRunnerOptions {
  /**
   * Information about the test to run
   */
  readonly test: IntegTest;

  /**
   * The AWS profile to use when invoking the CDK CLI
   *
   * @default - no profile is passed, the default profile is used
   */
  readonly profile?: string;

  /**
   * Additional environment variables that will be available
   * to the CDK CLI
   *
   * @default - no additional environment variables
   */
  readonly env?: { [name: string]: string },

  /**
   * tmp cdk.out directory
   *
   * @default - directory will be `cdk-integ.out.${testName}`
   */
  readonly integOutDir?: string,

  /**
   * Instance of the CDK CLI to use
   *
   * @default - CdkCliWrapper
   */
  readonly cdk?: ICdk;

  /**
   * Show output from running integration tests
   *
   * @default false
   */
  readonly showOutput?: boolean;
}

/**
 * The different components of a test name
 */
/**
 * Represents an Integration test runner
 */
export abstract class IntegRunner {
  /**
   * The directory where the snapshot will be stored
   */
  public readonly snapshotDir: string;

  /**
   * An instance of the CDK  CLI
   */
  public readonly cdk: ICdk;

  /**
   * Pretty name of the test
   */
  public readonly testName: string;

  /**
   * The value used in the '--app' CLI parameter
   *
   * Path to the integ test source file, relative to `this.directory`.
   */
  protected readonly cdkApp: string;

  /**
   * The path where the `cdk.context.json` file
   * will be created
   */
  protected readonly cdkContextPath: string;

  /**
   * The test suite from the existing snapshot
   */
  protected readonly expectedTestSuite?: IntegTestSuite | LegacyIntegTestSuite;

  /**
   * The test suite from the new "actual" snapshot
   */
  protected readonly actualTestSuite: IntegTestSuite | LegacyIntegTestSuite;

  /**
   * The working directory that the integration tests will be
   * executed from
   */
  protected readonly directory: string;

  /**
   * The test to run
   */
  protected readonly test: IntegTest;

  /**
   * Default options to pass to the CDK CLI
   */
  protected readonly defaultArgs: DefaultCdkOptions = {
    pathMetadata: false,
    assetMetadata: false,
    versionReporting: false,
  }

  /**
   * The directory where the CDK will be synthed to
   *
   * Relative to cwd.
   */
  protected readonly cdkOutDir: string;

  protected readonly profile?: string;

  protected _destructiveChanges?: DestructiveChange[];
  private legacyContext?: Record<string, any>;
  protected isLegacyTest?: boolean;

  constructor(options: IntegRunnerOptions) {
    this.test = options.test;
    this.directory = this.test.directory;
    this.testName = this.test.testName;
    this.snapshotDir = this.test.snapshotDir;
    this.cdkContextPath = path.join(this.directory, 'cdk.context.json');

    this.cdk = options.cdk ?? new CdkCliWrapper({
      directory: this.directory,
      showOutput: options.showOutput,
      env: {
        ...options.env,
      },
    });
    this.cdkOutDir = options.integOutDir ?? this.test.temporaryOutputDir;

    const testRunCommand = this.test.appCommand;
    this.cdkApp = testRunCommand.replace('{filePath}', path.relative(this.directory, this.test.fileName));

    this.profile = options.profile;
    if (this.hasSnapshot()) {
      this.expectedTestSuite = this.loadManifest();
    }
    this.actualTestSuite = this.generateActualSnapshot();
  }

  /**
   * Return the list of expected (i.e. existing) test cases for this integration test
   */
  public expectedTests(): { [testName: string]: TestCase } | undefined {
    return this.expectedTestSuite?.testSuite;
  }

  /**
   * Return the list of actual (i.e. new) test cases for this integration test
   */
  public actualTests(): { [testName: string]: TestCase } | undefined {
    return this.actualTestSuite.testSuite;
  }

  /**
   * Generate a new "actual" snapshot which will be compared to the
   * existing "expected" snapshot
   * This will synth and then load the integration test manifest
   */
  public generateActualSnapshot(): IntegTestSuite | LegacyIntegTestSuite {
    this.cdk.synthFast({
      execCmd: this.cdkApp.split(' '),
      env: {
        ...DEFAULT_SYNTH_OPTIONS.env,
        // we don't know the "actual" context yet (this method is what generates it) so just
        // use the "expected" context. This is only run in order to read the manifest
        CDK_CONTEXT_JSON: JSON.stringify(this.getContext(this.expectedTestSuite?.synthContext)),
      },
      output: path.relative(this.directory, this.cdkOutDir),
    });
    const manifest = this.loadManifest(this.cdkOutDir);
    // after we load the manifest remove the tmp snapshot
    // so that it doesn't mess up the real snapshot created later
    this.cleanup();
    return manifest;
  }

  /**
   * Returns true if a snapshot already exists for this test
   */
  public hasSnapshot(): boolean {
    return fs.existsSync(this.snapshotDir);
  }

  /**
   * Load the integ manifest which contains information
   * on how to execute the tests
   * First we try and load the manifest from the integ manifest (i.e. integ.json)
   * from the cloud assembly. If it doesn't exist, then we fallback to the
   * "legacy mode" and create a manifest from pragma
   */
  protected loadManifest(dir?: string): IntegTestSuite | LegacyIntegTestSuite {
    try {
      const testSuite = IntegTestSuite.fromPath(dir ?? this.snapshotDir);
      return testSuite;
    } catch {
      const testCases = LegacyIntegTestSuite.fromLegacy({
        cdk: this.cdk,
        testName: this.test.normalizedTestName,
        integSourceFilePath: this.test.fileName,
        listOptions: {
          ...this.defaultArgs,
          all: true,
          app: this.cdkApp,
          profile: this.profile,
          output: path.relative(this.directory, this.cdkOutDir),
        },
      });
      this.legacyContext = LegacyIntegTestSuite.getPragmaContext(this.test.fileName);
      this.isLegacyTest = true;
      return testCases;
    }
  }

  protected cleanup(): void {
    const cdkOutPath = this.cdkOutDir;
    if (fs.existsSync(cdkOutPath)) {
      fs.removeSync(cdkOutPath);
    }
  }

  /**
   * If there are any destructive changes to a stack then this will record
   * those in the manifest.json file
   */
  private renderTraceData(): ManifestTrace {
    const traceData: ManifestTrace = new Map();
    const destructiveChanges = this._destructiveChanges ?? [];
    destructiveChanges.forEach(change => {
      const trace = traceData.get(change.stackName);
      if (trace) {
        trace.set(change.logicalId, `${DESTRUCTIVE_CHANGES} ${change.impact}`);
      } else {
        traceData.set(change.stackName, new Map([
          [change.logicalId, `${DESTRUCTIVE_CHANGES} ${change.impact}`],
        ]));
      }
    });
    return traceData;
  }

  /**
   * In cases where we do not want to retain the assets,
   * for example, if the assets are very large.
   *
   * Since it is possible to disable the update workflow for individual test
   * cases, this needs to first get a list of stacks that have the update workflow
   * disabled and then delete assets that relate to that stack. It does that
   * by reading the asset manifest for the stack and deleting the asset source
   */
  protected removeAssetsFromSnapshot(): void {
    const stacks = this.actualTestSuite.getStacksWithoutUpdateWorkflow() ?? [];
    const manifest = AssemblyManifestReader.fromPath(this.snapshotDir);
    const assets = flatten(stacks.map(stack => {
      return manifest.getAssetLocationsForStack(stack) ?? [];
    }));

    assets.forEach(asset => {
      const fileName = path.join(this.snapshotDir, asset);
      if (fs.existsSync(fileName)) {
        if (fs.lstatSync(fileName).isDirectory()) {
          fs.removeSync(fileName);
        } else {
          fs.unlinkSync(fileName);
        }
      }
    });
  }

  /**
   * Remove the asset cache (.cache/) files from the snapshot.
   * These are a cache of the asset zips, but we are fine with
   * re-zipping on deploy
   */
  protected removeAssetsCacheFromSnapshot(): void {
    const files = fs.readdirSync(this.snapshotDir);
    files.forEach(file => {
      const fileName = path.join(this.snapshotDir, file);
      if (fs.lstatSync(fileName).isDirectory() && file === '.cache') {
        fs.emptyDirSync(fileName);
        fs.rmdirSync(fileName);
      }
    });
  }

  /**
   * Create the new snapshot.
   *
   * If lookups are enabled, then we need create the snapshot by synthing again
   * with the dummy context so that each time the test is run on different machines
   * (and with different context/env) the diff will not change.
   *
   * If lookups are disabled (which means the stack is env agnostic) then just copy
   * the assembly that was output by the deployment
   */
  protected createSnapshot(): void {
    if (fs.existsSync(this.snapshotDir)) {
      fs.removeSync(this.snapshotDir);
    }

    // if lookups are enabled then we need to synth again
    // using dummy context and save that as the snapshot
    if (this.actualTestSuite.enableLookups) {
      this.cdk.synthFast({
        execCmd: this.cdkApp.split(' '),
        env: {
          ...DEFAULT_SYNTH_OPTIONS.env,
          CDK_CONTEXT_JSON: JSON.stringify(this.getContext(DEFAULT_SYNTH_OPTIONS.context)),
        },
        output: path.relative(this.directory, this.snapshotDir),
      });
    } else {
      fs.moveSync(this.cdkOutDir, this.snapshotDir, { overwrite: true });
    }

    this.cleanupSnapshot();
  }

  /**
   * Perform some cleanup steps after the snapshot is created
   * Anytime the snapshot needs to be modified after creation
   * the logic should live here.
   */
  private cleanupSnapshot(): void {
    if (fs.existsSync(this.snapshotDir)) {
      this.removeAssetsFromSnapshot();
      this.removeAssetsCacheFromSnapshot();
      const assembly = AssemblyManifestReader.fromPath(this.snapshotDir);
      assembly.cleanManifest();
      assembly.recordTrace(this.renderTraceData());
    }

    // if this is a legacy test then create an integ manifest
    // in the snapshot directory which can be used for the
    // update workflow. Save any legacyContext as well so that it can be read
    // the next time
    if (this.actualTestSuite.type === 'legacy-test-suite') {
      (this.actualTestSuite as LegacyIntegTestSuite).saveManifest(this.snapshotDir, this.legacyContext);
    }
  }

  protected getContext(additionalContext?: Record<string, any>): Record<string, any> {
    return {
      ...NEW_PROJECT_CONTEXT,
      ...this.legacyContext,
      ...additionalContext,

      // We originally had PLANNED to set this to ['aws', 'aws-cn'], but due to a programming mistake
      // it was set to everything. In this PR, set it to everything to not mess up all the snapshots.
      [TARGET_PARTITIONS]: undefined,

      /* ---------------- THE FUTURE LIVES BELOW----------------------------
      // Restricting to these target partitions makes most service principals synthesize to
      // `service.${URL_SUFFIX}`, which is technically *incorrect* (it's only `amazonaws.com`
      // or `amazonaws.com.cn`, never UrlSuffix for any of the restricted regions) but it's what
      // most existing integ tests contain, and we want to disturb as few as possible.
      // [TARGET_PARTITIONS]: ['aws', 'aws-cn'],
      /* ---------------- END OF THE FUTURE ------------------------------- */
    };
  }
}


// Default context we run all integ tests with, so they don't depend on the
// account of the exercising user.
export const DEFAULT_SYNTH_OPTIONS = {
  context: {
    [AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY]: ['test-region-1a', 'test-region-1b', 'test-region-1c'],
    'availability-zones:account=12345678:region=test-region': ['test-region-1a', 'test-region-1b', 'test-region-1c'],
    'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
    'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
    'ssm:account=12345678:parameterName=/aws/service/ecs/optimized-ami/amazon-linux/recommended:region=test-region': '{"image_id": "ami-1234"}',
    // eslint-disable-next-line max-len
    'ami:account=12345678:filters.image-type.0=machine:filters.name.0=amzn-ami-vpc-nat-*:filters.state.0=available:owners.0=amazon:region=test-region': 'ami-1234',
    'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': {
      vpcId: 'vpc-60900905',
      subnetGroups: [
        {
          type: 'Public',
          name: 'Public',
          subnets: [
            {
              subnetId: 'subnet-e19455ca',
              availabilityZone: 'us-east-1a',
              routeTableId: 'rtb-e19455ca',
            },
            {
              subnetId: 'subnet-e0c24797',
              availabilityZone: 'us-east-1b',
              routeTableId: 'rtb-e0c24797',
            },
            {
              subnetId: 'subnet-ccd77395',
              availabilityZone: 'us-east-1c',
              routeTableId: 'rtb-ccd77395',
            },
          ],
        },
      ],
    },
  },
  env: {
    CDK_INTEG_ACCOUNT: '12345678',
    CDK_INTEG_REGION: 'test-region',
    CDK_INTEG_HOSTED_ZONE_ID: 'Z23ABC4XYZL05B',
    CDK_INTEG_HOSTED_ZONE_NAME: 'example.com',
    CDK_INTEG_DOMAIN_NAME: '*.example.com',
    CDK_INTEG_CERT_ARN: 'arn:aws:acm:test-region:12345678:certificate/86468209-a272-595d-b831-0efb6421265z',
  },
};
