const cdk = require('aws-cdk-lib');
const %name.PascalCased% = require('../lib/%name%-stack');

test('SQS Queue and SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
    // THEN
    const actual = JSON.stringify(app.synth().getStackArtifact(stack.artifactId).template);
    expect(actual).toContain('AWS::SQS::Queue');
    expect(actual).toContain('AWS::SNS::Topic');
});
