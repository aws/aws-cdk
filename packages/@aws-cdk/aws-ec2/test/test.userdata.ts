import { Test } from 'nodeunit';
import * as ec2 from '../lib';

export = {
  'can create Windows user data'(test: Test) {
    // GIVEN

    // WHEN
    const userData = ec2.UserData.forWindows();
    userData.addCommands('command1', 'command2');

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '<powershell>command1\ncommand2</powershell>');
    test.done();
  },
  'can create Linux user data'(test: Test) {
    // GIVEN

    // WHEN
    const userData = ec2.UserData.forLinux();
    userData.addCommands('command1', 'command2');

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '#!/bin/bash\ncommand1\ncommand2');
    test.done();
  },
  'can create Custom user data'(test: Test) {
    // GIVEN

    // WHEN
    const userData = ec2.UserData.custom('Some\nmultiline\ncontent');

    // THEN
    const rendered = userData.render();
    test.equals(rendered, 'Some\nmultiline\ncontent');
    test.done();
  },
};
