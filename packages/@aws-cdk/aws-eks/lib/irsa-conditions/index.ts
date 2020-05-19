import { external } from './external';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  if (event.RequestType === 'Create' || event.RequestType === 'Update') { return onCreateOrUpdate(event); }
  if (event.RequestType === 'Delete') { return; }
  throw new Error('invalid request type');
}

async function onCreateOrUpdate(event: AWSLambda.CloudFormationCustomResourceCreateEvent | AWSLambda.CloudFormationCustomResourceUpdateEvent) {
  const roleName: string = event.ResourceProperties.RoleName;
  const openIdConnectProviderIssuerUrl: string = event.ResourceProperties.OpenIdConnectProviderIssuerUrl;
  const serviceAccountName: string = event.ResourceProperties.serviceAccountName;
  const serviceAccountNamespace: string = event.ResourceProperties.serviceAccountNamespace;

  const issuerUri = openIdConnectProviderIssuerUrl.substring(8); // Trim 'https://' from the issuer url

  const resp = await external.getRole({ RoleName: roleName });
  if (!resp.Role.AssumeRolePolicyDocument) {
    throw new Error('invalid role, missing the assume role policy document');
  }
  const document = JSON.parse(decodeURIComponent(resp.Role.AssumeRolePolicyDocument));
  const statement = (document.Statement as any[]).find(s => s.Effect === 'Allow' && s.Action === 'sts:AssumeRoleWithWebIdentity');

  const condition: { [id: string]: any} = {};
  condition[`${issuerUri}:aud`] = 'sts.amazonaws.com';
  condition[`${issuerUri}:sub`] = `system:serviceaccount:${serviceAccountNamespace}:${serviceAccountName}`;
  if (!statement.Condition) {
    statement.Condition = {};
  }
  statement.Condition.StringEquals = condition;

  await external.updateAssumeRolePolicy({ RoleName: roleName, PolicyDocument: JSON.stringify(document) });
  return {
    PhysicalResourceId: resp.Role.Arn,
  };
}