import { CfnParameter } from '../cfn-parameter';
import { Construct } from '../construct-compat';

export class FileAssetParameters extends Construct {
  public readonly bucketNameParameter: CfnParameter;
  public readonly objectKeyParameter: CfnParameter;
  public readonly artifactHashParameter: CfnParameter;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // add parameters for s3 bucket and s3 key. those will be set by
    // the toolkit or by CI/CD when the stack is deployed and will include
    // the name of the bucket and the S3 key where the code lives.

    this.bucketNameParameter = new CfnParameter(this, 'S3Bucket', {
      type: 'String',
      description: `S3 bucket for asset "${id}"`,
    });

    this.objectKeyParameter = new CfnParameter(this, 'S3VersionKey', {
      type: 'String',
      description: `S3 key for asset version "${id}"`,
    });

    this.artifactHashParameter = new CfnParameter(this, 'ArtifactHash', {
      description: `Artifact hash for asset "${id}"`,
      type: 'String',
    });
  }
}
