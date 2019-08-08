import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import ec2 = require('../lib');

export = {
  'can make and use a Windows image'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: { region: 'testregion' }
    });

    // WHEN
    const image = new ec2.GenericWindowsImage({
      testregion: 'ami-1234'
    });

    // THEN
    const details = image.getImage(stack);
    test.equals(details.imageId, 'ami-1234');
    test.equals(details.osType, ec2.OperatingSystemType.WINDOWS);

    test.done();
  },

  'WindowsImage retains userdata'(test: Test) {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: { region: 'testregion' }
    });

    // WHEN
    const ud = ec2.UserData.forWindows();

    const image = new ec2.GenericWindowsImage({
      testregion: 'ami-1234',
    }, {
      userData: ud
    });

    // THEN
    const details = image.getImage(stack);
    test.equals(details.userData, ud);

    test.done();
  },
};