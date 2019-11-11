import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import ec2 = require('../lib');
import { LookupMachineImage } from '../lib';

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

  'LookupMachineImage default search'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack', {
      env: { account: '1234', region: 'testregion' }
    });

    // WHEN
    new LookupMachineImage({ name: 'bla*', owners: ['amazon'] }).getImage(stack);

    // THEN
    const missing = app.synth().manifest.missing || [];
    test.deepEqual(missing, [
      {
        key: 'ami:account=1234:filters.image-type.0=machine:filters.name.0=bla*:filters.state.0=available:owners.0=amazon:region=testregion',
        props: {
          account: '1234',
          region: 'testregion',
          owners: [ 'amazon' ],
          filters: {
            'name': [ 'bla*' ],
            'state': [ 'available' ],
            'image-type': [ 'machine' ]
          }
        },
        provider: 'ami'
      }
    ]);

    test.done();
  }
};