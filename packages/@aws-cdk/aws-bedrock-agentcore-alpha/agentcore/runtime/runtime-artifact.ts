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

import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import { Construct } from 'constructs';
import { Runtime } from './runtime';

/**
 * Agent runtime artifact configuration for Bedrock Agent Core Runtime
 */
export interface AgentRuntimeArtifactConfig {
  /**
   * The ECR URI of the container.
   */
  readonly containerUri: string;
}

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
   * Called when the image is used by a Runtime
   */
  public abstract bind(scope: Construct, runtime: Runtime): AgentRuntimeArtifactConfig;
}

class EcrImage extends AgentRuntimeArtifact {
  constructor(private readonly repository: ecr.IRepository, private readonly tag: string) {
    super();
  }

  public bind(_scope: Construct, runtime: Runtime): AgentRuntimeArtifactConfig {
    // Now we can use runtime.role for permissions
    if (runtime.role) {
      this.repository.grantPull(runtime.role);
    }

    return {
      containerUri: this.repository.repositoryUriForTag(this.tag),
    };
  }
}

class AssetImage extends AgentRuntimeArtifact {
  private asset?: assets.DockerImageAsset;

  constructor(private readonly directory: string, private readonly options: assets.DockerImageAssetOptions = {}) {
    super();
  }

  public bind(scope: Construct, runtime: Runtime): AgentRuntimeArtifactConfig {
    // Retain the first instantiation of this asset
    if (!this.asset) {
      const hash = md5hash(this.directory);
      this.asset = new assets.DockerImageAsset(scope, `AgentRuntimeArtifact${hash}`, {
        directory: this.directory,
        ...this.options,
      });
    }

    this.asset.repository.grantPull(runtime.role);

    return {
      containerUri: this.asset.imageUri,
    };
  }
}
