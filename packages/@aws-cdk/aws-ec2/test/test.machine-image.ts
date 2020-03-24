import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ec2 from '../lib';

let app: App;
let stack: Stack;

export = {
  'setUp'(cb: () => void) {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '1234', region: 'testregion' }
    });

    cb();
  },
  'can make and use a Windows image'(test: Test) {
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

  'WindowsImage retains userdata if given'(test: Test) {
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

  'WindowsImage creates UserData if not given'(test: Test) {
    // WHEN
    const image = new ec2.GenericWindowsImage({
      testregion: 'ami-1234',
    });

    // THEN
    const details = image.getImage(stack);
    test.ok(isWindowsUserData(details.userData));

    test.done();
  },

  'LookupMachineImage default search'(test: Test) {
    // GIVEN

    // WHEN
    new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] }).getImage(stack);

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
  },

  'LookupMachineImage creates correct type of UserData'(test: Test) {
    // WHEN
    const linuxDetails = new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] }).getImage(stack);
    const windowsDetails = new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'], windows: true }).getImage(stack);

    // THEN
    test.ok(isWindowsUserData(windowsDetails.userData));
    test.ok(isLinuxUserData(linuxDetails.userData));
    test.done();
  },
};

function isWindowsUserData(ud: ec2.UserData) {
  return ud.render().indexOf('powershell') > -1;
}

function isLinuxUserData(ud: ec2.UserData) {
  return ud.render().indexOf('bash') > -1;
}