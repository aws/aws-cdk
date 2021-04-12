import { expect as cdkExpect, matchTemplate, MatchStyle } from '@aws-cdk/assert-internal';
import { App, Stack } from '@aws-cdk/core';
import * as ec2 from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('can make and use a Linux image', () => {
  // WHEN
  const image = new ec2.GenericLinuxImage({
    testregion: 'ami-1234',
  });

  // THEN
  const details = image.getImage(stack);
  expect(details.imageId).toEqual('ami-1234');
  expect(details.osType).toEqual(ec2.OperatingSystemType.LINUX);
});

test('can make and use a Linux image in agnostic stack', () => {
  // WHEN
  app = new App();
  stack = new Stack(app, 'Stack');
  const image = new ec2.GenericLinuxImage({
    testregion: 'ami-1234',
  });

  // THEN
  const details = image.getImage(stack);
  const expected = {
    Mappings: {
      AmiMap: {
        testregion: {
          ami: 'ami-1234',
        },
      },
    },
  };

  cdkExpect(stack).to(matchTemplate(expected, MatchStyle.EXACT));
  expect(stack.resolve(details.imageId)).toEqual({ 'Fn::FindInMap': ['AmiMap', { Ref: 'AWS::Region' }, 'ami'] });
  expect(details.osType).toEqual(ec2.OperatingSystemType.LINUX);
});

test('can make and use a Windows image', () => {
  // WHEN
  const image = new ec2.GenericWindowsImage({
    testregion: 'ami-1234',
  });

  // THEN
  const details = image.getImage(stack);
  expect(details.imageId).toEqual('ami-1234');
  expect(details.osType).toEqual(ec2.OperatingSystemType.WINDOWS);
});

test('can make and use a Windows image in agnostic stack', () => {
  // WHEN
  app = new App();
  stack = new Stack(app, 'Stack');
  const image = new ec2.GenericWindowsImage({
    testregion: 'ami-1234',
  });

  // THEN
  const details = image.getImage(stack);
  const expected = {
    Mappings: {
      AmiMap: {
        testregion: {
          ami: 'ami-1234',
        },
      },
    },
  };

  cdkExpect(stack).to(matchTemplate(expected, MatchStyle.EXACT));
  expect(stack.resolve(details.imageId)).toEqual({ 'Fn::FindInMap': ['AmiMap', { Ref: 'AWS::Region' }, 'ami'] });
  expect(details.osType).toEqual(ec2.OperatingSystemType.WINDOWS);
});

test('can make and use a Generic SSM image', () => {
  // WHEN
  const image = new ec2.GenericSSMParameterImage('testParam', ec2.OperatingSystemType.LINUX);

  // THEN
  const details = image.getImage(stack);
  expect(details.imageId).toContain('TOKEN');
  expect(details.osType).toEqual(ec2.OperatingSystemType.LINUX);
});

test('WindowsImage retains userdata if given', () => {
  // WHEN
  const ud = ec2.UserData.forWindows();

  const image = new ec2.GenericWindowsImage({
    testregion: 'ami-1234',
  }, {
    userData: ud,
  });

  // THEN
  const details = image.getImage(stack);
  expect(details.userData).toEqual(ud);
});

test('WindowsImage creates UserData if not given', () => {
  // WHEN
  const image = new ec2.GenericWindowsImage({
    testregion: 'ami-1234',
  });

  // THEN
  const details = image.getImage(stack);
  expect(isWindowsUserData(details.userData)).toBeTruthy();
});

test('LookupMachineImage default search', () => {
  // GIVEN

  // WHEN
  new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] }).getImage(stack);

  // THEN
  const missing = app.synth().manifest.missing || [];
  expect(missing).toEqual([
    {
      key: 'ami:account=1234:filters.image-type.0=machine:filters.name.0=bla*:filters.state.0=available:owners.0=amazon:region=testregion',
      props: {
        account: '1234',
        region: 'testregion',
        owners: ['amazon'],
        filters: {
          'name': ['bla*'],
          'state': ['available'],
          'image-type': ['machine'],
        },
      },
      provider: 'ami',
    },
  ]);
});

test('LookupMachineImage creates correct type of UserData', () => {
  // WHEN
  const linuxDetails = new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'] }).getImage(stack);
  const windowsDetails = new ec2.LookupMachineImage({ name: 'bla*', owners: ['amazon'], windows: true }).getImage(stack);

  // THEN
  expect(isWindowsUserData(windowsDetails.userData)).toBeTruthy();
  expect(isLinuxUserData(linuxDetails.userData)).toBeTruthy();
});

function isWindowsUserData(ud: ec2.UserData) {
  return ud.render().indexOf('powershell') > -1;
}

function isLinuxUserData(ud: ec2.UserData) {
  return ud.render().indexOf('bash') > -1;
}