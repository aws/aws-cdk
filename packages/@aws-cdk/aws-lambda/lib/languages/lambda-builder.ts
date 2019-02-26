import assets = require('@aws-cdk/assets');
import { BuildAsset } from '@aws-cdk/assets';
import cdk = require('@aws-cdk/cdk');
import { join } from 'path';
import { Code } from '../code';
import { CfnFunction } from '../lambda.generated';
import { Runtime } from '../runtime';

interface LambdaBuilderRequest {
  jsonrpc: string;
  method: string;
  id: number;
  params: {
    __protocol_version: string;
    capability: {
      language: string;
      dependency_manager: string;
      application_framework: string | null;
    },
    source_dir: string;
    artifacts_dir: string;
    scratch_dir: string;
    manifest_path: string;
    runtime: string;
    optimizations: object;
    options: object;
  }
}

export interface LambdaBuilderCodeProps {
  path: string;
  runtime: Runtime;
  language: string;
  dependencyManager: string;
  manifestName: string;
}

export class LambdaBuilderCode extends Code {
  public readonly isInline: boolean = false;

  protected readonly path: string;
  protected readonly runtime: Runtime;

  protected readonly language: string;
  protected readonly dependencyManager: string;
  protected readonly manifestName: string;

  protected asset?: BuildAsset;

  constructor(props: LambdaBuilderCodeProps) {
    super();
    this.path = props.path;
    this.runtime = props.runtime;
    this.language = props.language;
    this.dependencyManager = props.dependencyManager;
    this.manifestName = props.manifestName;
  }

  public bind(construct: cdk.Construct) {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      const mount = '/tmp/cdk.out/';
      const cdkStaging = join(mount, '.cdk.staging');
      const request: LambdaBuilderRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'LambdaBuilder.build',
        params: {
          __protocol_version: '0.1',
          capability: {
            language: this.language,
            dependency_manager: this.dependencyManager,
            application_framework: null
          },
          artifacts_dir: cdkStaging,
          manifest_path: join(mount, this.manifestName),
          runtime: this.runtime.name,
          scratch_dir: '/tmp/scratch',
          source_dir: mount,
          optimizations: {},
          options: {}
        }
      };

      this.asset = new assets.BuildAsset(construct, 'Code', {
        codePath: this.path,
        artifactName: 'archive.zip',
        image: `lambci/lambda:build-${this.runtime.name}`,
        command: 'lambda-builders',
        stdin: JSON.stringify(request)
      });
    }
  }

  public _toJSON(resource?: cdk.Resource | undefined): CfnFunction.CodeProperty {
    if (resource) {
      // https://github.com/awslabs/aws-cdk/issues/1432
      this.asset!.addResourceMetadata(resource, 'Code');
    }

    return  {
      s3Bucket: this.asset!.s3BucketName,
      s3Key: this.asset!.s3ObjectKey
    };
  }
}
