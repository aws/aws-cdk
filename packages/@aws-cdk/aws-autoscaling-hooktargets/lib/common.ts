// eslint-disable-next-line import/order
import * as iam from '@aws-cdk/aws-iam';
import * as constructs from 'constructs';

export function createRole(scope: constructs.Construct, _role?: iam.IRole) {
  let role = _role;
  if (!role) {
    role = new iam.Role(scope, 'Role', {
      assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
    });
  }

  return role;
}
