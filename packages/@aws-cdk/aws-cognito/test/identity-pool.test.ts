import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { IdentityPool } from '../lib/identity-pool';

describe('Identity Pool', () => {

    test('minimal setup', () => {
        const stack = new Stack();
        const authRole = new Role(stack, 'authRole', {
            assumedBy: new ServicePrincipal('service.amazonaws.com'),
        });
        const unauthRole = new Role(stack, 'unauthRole', {
            assumedBy: new ServicePrincipal('service.amazonaws.com'),
        });
        new IdentityPool(stack, 'TestIdentityPool', {
            authenticatedRole: authRole,
            unauthenticatedRole: unauthRole,
        });
        expect(stack).toMatchTemplate({
            
        })
    });
});