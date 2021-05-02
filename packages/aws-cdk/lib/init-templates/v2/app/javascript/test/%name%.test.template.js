const cdk = require('aws-cdk-lib');
const %name.PascalCased% = require('../lib/%name%-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
    // THEN
    const actual = app.synth().getStackArtifact(stack.artifactId).template;
    expect(actual.Resources || {}).toEqual({});
});
