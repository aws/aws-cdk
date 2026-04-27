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

import * as iam from 'aws-cdk-lib/aws-iam';
import type { IConstruct } from 'constructs';

/**
 * Grant read on a specific credential provider ARN and list permission on `*` (list APIs are account-scoped).
 *
 * @internal
 */
export function grantReadWithList(
  scope: IConstruct,
  grantee: iam.IGrantable,
  resourceArn: string,
  resourceReadActions: string[],
  listActions: string[],
): iam.Grant {
  const resourceGrant = iam.Grant.addToPrincipal({
    grantee,
    actions: resourceReadActions,
    resourceArns: [resourceArn],
    scope,
  });
  const listGrant = iam.Grant.addToPrincipal({
    grantee,
    actions: listActions,
    resourceArns: ['*'],
    scope,
  });
  return resourceGrant.combine(listGrant);
}

/**
 * Grants Secrets Manager read on the credential secret when an ARN is available (e.g. not omitted on import).
 *
 * @internal
 */
export function grantCredentialSecretRead(
  scope: IConstruct,
  grantee: iam.IGrantable,
  secretArn: string | undefined,
  secretReadActions: string[],
): iam.Grant | undefined {
  if (secretArn == null || secretArn === '') {
    return undefined;
  }
  return iam.Grant.addToPrincipal({
    grantee,
    actions: secretReadActions,
    resourceArns: [secretArn],
    scope,
  });
}
