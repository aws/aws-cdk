import { Construct } from '@aws-cdk/core';
import { cognito } from '@aws-cdk/resources';

export class CognitoChatRoomPool extends Construct {
    constructor(parent: Construct, name: string) {
        super(parent, name);

        // Create chat room user pool
        const chatPool = new cognito.UserPoolResource(this, 'UserPool', {
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
        new cognito.UserPoolClientResource(this, 'UserPoolClient', {
            clientName: 'Chat-Room',
            explicitAuthFlows: [ 'ADMIN_NO_SRP_AUTH' ],
            refreshTokenValidity: 30,
            userPoolId: chatPool.ref
         });
    }
}
