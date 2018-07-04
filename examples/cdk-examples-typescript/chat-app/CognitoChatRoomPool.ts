import { UserPoolClientResource, UserPoolResource } from '@aws-cdk/cognito';
import { Construct } from '@aws-cdk/core';

export class CognitoChatRoomPool extends Construct {
    constructor(parent: Construct, name: string) {
        super(parent, name);

        // Create chat room user pool
        const chatPool = new UserPoolResource(this, 'UserPool', {
            adminCreateUserConfig: {
                allowAdminCreateUserOnly: false
            },
            policies: {
                passwordPolicy: {
                    minimumLength: 6,
                    requireNumbers: true
                } },
            schema: [
                {
                    attributeDataType: 'String',
                    name: 'email',
                    required: true
                }
            ],
            autoVerifiedAttributes: [ 'email' ]
        });

        // Now for the client
        new UserPoolClientResource(this, 'UserPoolClient', {
            clientName: 'Chat-Room',
            explicitAuthFlows: [ 'ADMIN_NO_SRP_AUTH' ],
            refreshTokenValidity: 30,
            userPoolId: chatPool.ref
         });
    }
}
