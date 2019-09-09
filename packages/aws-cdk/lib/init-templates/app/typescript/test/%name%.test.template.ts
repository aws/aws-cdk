import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import %name.PascalCased% = require('../lib/%name%-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new %name.PascalCased%.%name.PascalCased%Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});