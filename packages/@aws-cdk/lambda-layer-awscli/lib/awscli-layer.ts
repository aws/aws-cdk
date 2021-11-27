import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer extends lambda.LayerVersion {

  /**
   * The system architectures compatible with this layer.
   */
  public static readonly COMPATIBLE_ARCHITECTURES = [
    lambda.Architecture.X86_64,
  ];

  /**
   * The runtimes compatible with this Layer.
   */
  public static readonly COMPATIBLE_RUNTIMES = [
    lambda.Runtime.GO_1_X,
    lambda.Runtime.JAVA_8,
    lambda.Runtime.PYTHON_3_6,
    lambda.Runtime.PYTHON_3_7,
  ];

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'layer.zip'), {
        // we hash the Dockerfile (it contains the tools versions) because hashing the zip is non-deterministic
        assetHash: hashFile(path.join(__dirname, '..', 'layer', 'Dockerfile')),
      }),
      description: '/opt/awscli/aws',
      compatibleArchitectures: AwsCliLayer.COMPATIBLE_ARCHITECTURES,
      compatibleRuntimes: AwsCliLayer.COMPATIBLE_RUNTIMES,
    });
  }
}

function hashFile(fileName: string) {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(fileName))
    .digest('hex');
}
