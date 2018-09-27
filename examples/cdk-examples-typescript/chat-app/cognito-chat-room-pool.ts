import cognito = require('@aws-cdk/aws-cognito');
import cdk = require('@aws-cdk/cdk');

export class CognitoChatRoomPool extends cdk.Construct {
  constructor(parent: cdk.Construct, name: string) {
    super(parent, name);

    // Create chat room user pool
    const chatPool = new cognito.cloudformation.UserPoolResource(this, 'UserPool', {
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
    new cognito.cloudformation.UserPoolClientResource(this, 'UserPoolClient', {
      clientName: 'Chat-Room',
      explicitAuthFlows: [ 'ADMIN_NO_SRP_AUTH' ],
      refreshTokenValidity: 30,
      userPoolId: chatPool.ref
     });
  }
}
