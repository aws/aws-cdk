// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// This file is auto-generated. Do not edit manually.
// To regenerate, run 'yarn generate' in tools/@aws-cdk/spec2cdk

import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';

/**
 * Grants for ServerlessCache
 */
export class ServerlessCacheGrants {
  constructor(private readonly resource: core.IResource) {}

  /**
   * Grant connect permissions to the cache
   */
  public grantConnect(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['elasticache:Connect', 'elasticache:DescribeServerlessCaches'],
      resourceArns: [this.resource.resourceArn],
    });
  }
}
