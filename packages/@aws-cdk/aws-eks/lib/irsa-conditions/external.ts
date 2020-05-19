/* istanbul ignore file */

// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';

let client: aws.IAM;

function iam() {
  if (!client) { client = new aws.IAM(); }
  return client;
}

export const external = {
  getRole: (req: aws.IAM.GetRoleRequest) => iam().getRole(req).promise(),
  updateAssumeRolePolicy: (req: aws.IAM.UpdateAssumeRolePolicyRequest) => iam().updateAssumeRolePolicy(req).promise(),
};