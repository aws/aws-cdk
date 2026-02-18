
import type * as constructs from 'constructs';
import * as iam from '../../aws-iam';

export function createRole(scope: constructs.Construct, _role?: iam.IRole) {
  let role = _role;
  if (!role) {
    role = new iam.Role(scope, 'Role', {
      assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
    });
  }

  return role;
}
