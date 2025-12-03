/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { Stack, Token } from 'aws-cdk-lib';
import { CfnRuntime } from 'aws-cdk-lib/aws-bedrockagentcore';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Runtime } from './runtime';
import { ValidationError } from './validation-helpers';

/**
 * Bedrock AgentCore runtime environment for code execution
 * Allowed values: PYTHON_3_10 | PYTHON_3_11 | PYTHON_3_12 | PYTHON_3_13
 */
export enum AgentCoreRuntime {
  /**
   * Python 3.10 runtime
   */
  PYTHON_3_10 = 'PYTHON_3_10',
  /**
   * Python 3.11 runtime
   */
  PYTHON_3_11 = 'PYTHON_3_11',
  /**
   * Python 3.12 runtime
   */
  PYTHON_3_12 = 'PYTHON_3_12',
  /**
   * Python 3.13 runtime
   */
  PYTHON_3_13 = 'PYTHON_3_13',
}

/**
 * Abstract base class for agent runtime artifacts.
 * Provides methods to reference container images from ECR repositories or local assets.
 */
export abstract class AgentRuntimeArtifact {
  /**
   * Reference an image in an ECR repository
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest'): AgentRuntimeArtifact {
    return new EcrImage(repository, tag);
  }

  /**
   * Reference an agent runtime artifact that's constructed directly from sources on disk
   * @param directory The directory where the Dockerfile is stored
   * @param options The options to further configure the selected image
   */
  public static fromAsset(directory: string, options: assets.DockerImageAssetOptions = {}): AgentRuntimeArtifact {
    return new AssetImage(directory, options);
  }

  /**
   * Reference an agent runtime artifact that's constructed directly from an S3 object
   * @param s3Location The source code location and configuration details.
   * @param runtime The runtime environment for executing the code. Allowed values: PYTHON_3_10 | PYTHON_3_11 | PYTHON_3_12 | PYTHON_3_13
   * @param entrypoint The entry point for the code execution, specifying the function or method that should be invoked when the code runs.
   */
  public static fromS3(s3Location: s3.Location, runtime: AgentCoreRuntime, entrypoint: string[]): AgentRuntimeArtifact {
    return new S3Image(s3Location, runtime, entrypoint);
  }

  /**
   * Reference an image using an ECR container URI
   *
   * Use this when referencing ECR images from CloudFormation parameters or cross-stack references.
   *
   * **Note:** No IAM permissions are automatically granted. You must ensure the runtime has
   * ECR pull permissions for the repository.
   *
   * @param containerUri The ECR container image URI (format: {account}.dkr.ecr.{region}.amazonaws.com/{repository}:{tag})
   */
  public static fromImageUri(containerUri: string): AgentRuntimeArtifact {
    return new ImageUriArtifact(containerUri);
  }

  /**
   * Called when the image is used by a Runtime to handle side effects like permissions
   */
  public abstract bind(scope: Construct, runtime: Runtime): void;

  /**
   * Render the artifact configuration for CloudFormation
   * @internal
   */
  public abstract _render(): CfnRuntime.AgentRuntimeArtifactProperty;
}

class EcrImage extends AgentRuntimeArtifact {
  private bound = false;

  constructor(private readonly repository: ecr.IRepository, private readonly tag: string) {
    super();
  }

  public bind(_scope: Construct, runtime: Runtime): void {
    // Handle permissions (only once)
    if (!this.bound && runtime.role) {
      this.repository.grantPull(runtime.role);
      this.bound = true;
    }
  }

  public _render(): CfnRuntime.AgentRuntimeArtifactProperty {
    // Return container configuration directly as expected by the runtime
    // The runtime wraps this in containerConfiguration
    return {
      containerUri: this.repository.repositoryUriForTag(this.tag),
    } as any;
  }
}

class AssetImage extends AgentRuntimeArtifact {
  private asset?: assets.DockerImageAsset;
  private bound = false;

  constructor(private readonly directory: string, private readonly options: assets.DockerImageAssetOptions = {}) {
    super();
  }

  public bind(scope: Construct, runtime: Runtime): void {
    // Create the asset if not already created
    if (!this.asset) {
      this.asset = new assets.DockerImageAsset(scope, 'AgentRuntimeArtifact', {
        directory: this.directory,
        ...this.options,
      });
    }

    // Grant permissions (only once)
    if (!this.bound) {
      this.asset.repository.grantPull(runtime.role);
      this.bound = true;
    }
  }

  public _render(): CfnRuntime.AgentRuntimeArtifactProperty {
    if (!this.asset) {
      throw new ValidationError('Asset not initialized. Call bind() before _render()');
    }

    // Return container configuration directly as expected by the runtime
    // The runtime wraps this in containerConfiguration
    return {
      containerUri: this.asset.imageUri,
    } as any;
  }
}

class S3Image extends AgentRuntimeArtifact {
  private bound = false;

  constructor(private readonly s3Location: s3.Location, private readonly runtime: AgentCoreRuntime, private readonly entrypoint: string[]) {
    super();
  }

  public bind(scope: Construct, runtime: Runtime): void {
    // Handle permissions (only once)
    if (!this.bound && runtime.role) {
      if (!Token.isUnresolved(this.s3Location.bucketName)) {
        Stack.of(scope).resolve(this.s3Location.bucketName);
      }
      const bucket = s3.Bucket.fromBucketName(
        scope,
        `${this.s3Location.bucketName}CodeArchive`,
        this.s3Location.bucketName,
      );
      // Ensure the policy is applied before the browser resource is created
      bucket.grantRead(runtime.role);
      this.bound = true;
    }
  }

  public _render(): CfnRuntime.AgentRuntimeArtifactProperty {
    const s3Config: any = {
      bucket: this.s3Location.bucketName,
      prefix: this.s3Location.objectKey,
    };
    if (this.s3Location.objectVersion) {
      s3Config.versionId = this.s3Location.objectVersion;
    }
    return {
      code: {
        s3: s3Config,
      },
      runtime: this.runtime,
      entryPoint: this.entrypoint,
    } as any;
  }
}

class ImageUriArtifact extends AgentRuntimeArtifact {
  constructor(private readonly containerUri: string) {
    super();

    // Validate ECR container URI format per CloudFormation requirements
    const ecrPattern = /^\d{12}\.dkr\.ecr\.([a-z0-9-]+)\.amazonaws\.com\/((?:[a-z0-9]+(?:[._-][a-z0-9]+)*\/)*[a-z0-9]+(?:[._-][a-z0-9]+)*)([:@]\S+)$/;
    if (!Token.isUnresolved(containerUri) && !ecrPattern.test(containerUri)) {
      throw new ValidationError(
        `Invalid ECR container URI format: ${containerUri}. Must be an ECR URI: {account}.dkr.ecr.{region}.amazonaws.com/{repository}:{tag}`,
      );
    }
  }

  public bind(_scope: Construct, _runtime: Runtime): void {
    // No permissions are granted automatically when using a direct URI.
    // Users must manage ECR pull permissions separately.
  }

  public _render(): CfnRuntime.AgentRuntimeArtifactProperty {
    return {
      containerUri: this.containerUri,
    } as any;
  }
}
