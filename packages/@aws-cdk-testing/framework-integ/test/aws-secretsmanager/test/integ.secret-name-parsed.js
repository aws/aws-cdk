"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cdk = require("aws-cdk-lib");
const secretsmanager = require("aws-cdk-lib/aws-secretsmanager");
/**
 * Creates several secrets, with varying names and IDs, with the parseOwnedSecretName feature flag set,
 * to verify the secretName returned by `Secret.secretName` matches the `Name` returned by `DescribeSecrets`.
 */
class SecretsManagerStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const defaultSecret = new secretsmanager.Secret(this, 'DefaultSecret');
        const namedSecret = new secretsmanager.Secret(this, 'NamedSecret', { secretName: 'namedSecret' });
        const namedSecretWithHyphen = new secretsmanager.Secret(this, 'NamedSecretWithHyphen', { secretName: 'named-secret-1' });
        const longSecret = new secretsmanager.Secret(this, 'AReallyLongLogicalIThatWillBeTrimmedBeforeItsUsedInTheName');
        const secrets = [defaultSecret, namedSecret, namedSecretWithHyphen, longSecret];
        const resourceType = 'Custom::IntegVerificationSecretNameMatches';
        const serviceToken = cdk.CustomResourceProvider.getOrCreate(this, resourceType, {
            codeDirectory: path.join(__dirname, 'integ.secret-name-parsed.handler'),
            runtime: cdk.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [{
                    Effect: 'Allow',
                    Resource: secrets.map(s => s.secretArn),
                    Action: ['secretsmanager:DescribeSecret'],
                }],
        });
        new cdk.CustomResource(this, 'SecretNameVerification', {
            resourceType: resourceType,
            serviceToken,
            properties: {
                Secrets: secrets.map(s => ({ secretArn: s.secretArn, secretName: s.secretName })),
            },
        });
    }
}
const app = new cdk.App();
new SecretsManagerStack(app, 'Integ-SecretsManager-ParsedSecretName');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2VjcmV0LW5hbWUtcGFyc2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc2VjcmV0LW5hbWUtcGFyc2VkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG1DQUFtQztBQUNuQyxpRUFBaUU7QUFFakU7OztHQUdHO0FBRUgsTUFBTSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUN2RSxNQUFNLFdBQVcsR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ2xHLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDekgsTUFBTSxVQUFVLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSw0REFBNEQsQ0FBQyxDQUFDO1FBRWpILE1BQU0sT0FBTyxHQUFHLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxxQkFBcUIsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVoRixNQUFNLFlBQVksR0FBRyw0Q0FBNEMsQ0FBQztRQUNsRSxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDOUUsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtDQUFrQyxDQUFDO1lBQ3ZFLE9BQU8sRUFBRSxHQUFHLENBQUMsNkJBQTZCLENBQUMsV0FBVztZQUN0RCxnQkFBZ0IsRUFBRSxDQUFDO29CQUNqQixNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQ3ZDLE1BQU0sRUFBRSxDQUFDLCtCQUErQixDQUFDO2lCQUMxQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRTtZQUNyRCxZQUFZLEVBQUUsWUFBWTtZQUMxQixZQUFZO1lBQ1osVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQzthQUNsRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksbUJBQW1CLENBQUMsR0FBRyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7QUFDdEUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc2VjcmV0c21hbmFnZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgc2V2ZXJhbCBzZWNyZXRzLCB3aXRoIHZhcnlpbmcgbmFtZXMgYW5kIElEcywgd2l0aCB0aGUgcGFyc2VPd25lZFNlY3JldE5hbWUgZmVhdHVyZSBmbGFnIHNldCxcbiAqIHRvIHZlcmlmeSB0aGUgc2VjcmV0TmFtZSByZXR1cm5lZCBieSBgU2VjcmV0LnNlY3JldE5hbWVgIG1hdGNoZXMgdGhlIGBOYW1lYCByZXR1cm5lZCBieSBgRGVzY3JpYmVTZWNyZXRzYC5cbiAqL1xuXG5jbGFzcyBTZWNyZXRzTWFuYWdlclN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZGVmYXVsdFNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ0RlZmF1bHRTZWNyZXQnKTtcbiAgICBjb25zdCBuYW1lZFNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ05hbWVkU2VjcmV0JywgeyBzZWNyZXROYW1lOiAnbmFtZWRTZWNyZXQnIH0pO1xuICAgIGNvbnN0IG5hbWVkU2VjcmV0V2l0aEh5cGhlbiA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQodGhpcywgJ05hbWVkU2VjcmV0V2l0aEh5cGhlbicsIHsgc2VjcmV0TmFtZTogJ25hbWVkLXNlY3JldC0xJyB9KTtcbiAgICBjb25zdCBsb25nU2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldCh0aGlzLCAnQVJlYWxseUxvbmdMb2dpY2FsSVRoYXRXaWxsQmVUcmltbWVkQmVmb3JlSXRzVXNlZEluVGhlTmFtZScpO1xuXG4gICAgY29uc3Qgc2VjcmV0cyA9IFtkZWZhdWx0U2VjcmV0LCBuYW1lZFNlY3JldCwgbmFtZWRTZWNyZXRXaXRoSHlwaGVuLCBsb25nU2VjcmV0XTtcblxuICAgIGNvbnN0IHJlc291cmNlVHlwZSA9ICdDdXN0b206OkludGVnVmVyaWZpY2F0aW9uU2VjcmV0TmFtZU1hdGNoZXMnO1xuICAgIGNvbnN0IHNlcnZpY2VUb2tlbiA9IGNkay5DdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHJlc291cmNlVHlwZSwge1xuICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ludGVnLnNlY3JldC1uYW1lLXBhcnNlZC5oYW5kbGVyJyksXG4gICAgICBydW50aW1lOiBjZGsuQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBwb2xpY3lTdGF0ZW1lbnRzOiBbe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiBzZWNyZXRzLm1hcChzID0+IHMuc2VjcmV0QXJuKSxcbiAgICAgICAgQWN0aW9uOiBbJ3NlY3JldHNtYW5hZ2VyOkRlc2NyaWJlU2VjcmV0J10sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgICBuZXcgY2RrLkN1c3RvbVJlc291cmNlKHRoaXMsICdTZWNyZXROYW1lVmVyaWZpY2F0aW9uJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiByZXNvdXJjZVR5cGUsXG4gICAgICBzZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlY3JldHM6IHNlY3JldHMubWFwKHMgPT4gKHsgc2VjcmV0QXJuOiBzLnNlY3JldEFybiwgc2VjcmV0TmFtZTogcy5zZWNyZXROYW1lIH0pKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBTZWNyZXRzTWFuYWdlclN0YWNrKGFwcCwgJ0ludGVnLVNlY3JldHNNYW5hZ2VyLVBhcnNlZFNlY3JldE5hbWUnKTtcbmFwcC5zeW50aCgpO1xuIl19