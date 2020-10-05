import { Bucket } from '@aws-cdk/aws-s3';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { Stack } from '../../core/lib';
import * as ec2 from '../lib';

nodeunitShim({
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
  'can create Windows user data with commands on exit'(test: Test) {
    // GIVEN
    const userData = ec2.UserData.forWindows();

    // WHEN
    userData.addCommands('command1', 'command2');
    userData.addOnExitCommands('onexit1', 'onexit2');

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '<powershell>trap {\n' +
        '$success=($PSItem.Exception.Message -eq "Success")\n' +
        'onexit1\n' +
        'onexit2\n' +
        'break\n' +
        '}\n' +
        'command1\n' +
        'command2\n' +
        'throw "Success"</powershell>');
    test.done();
  },
  'can create Windows with Signal Command'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');
    const userData = ec2.UserData.forWindows();

    // WHEN
    userData.addSignalOnExitCommand( resource );
    userData.addCommands('command1');

    // THEN
    const rendered = userData.render();

    test.equals(rendered, '<powershell>trap {\n' +
        '$success=($PSItem.Exception.Message -eq "Success")\n' +
        'cfn-signal --stack Default --resource RESOURCE1989552F --region ${Token[AWS.Region.4]} --success ($success.ToString().ToLower())\n' +
        'break\n' +
        '}\n' +
        'command1\n' +
        'throw "Success"</powershell>',
    );
    test.done();
  },
  'can windows userdata download S3 files'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.forWindows();
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    const bucket2 = Bucket.fromBucketName( stack, 'testBucket2', 'test2' );

    // WHEN
    userData.addS3DownloadCommand({
      bucket,
      bucketKey: 'filename.bat',
    } );
    userData.addS3DownloadCommand({
      bucket: bucket2,
      bucketKey: 'filename2.bat',
      localFile: 'c:\\test\\location\\otherScript.bat',
    } );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '<powershell>mkdir (Split-Path -Path \'C:/temp/filename.bat\' ) -ea 0\n' +
      'Read-S3Object -BucketName \'test\' -key \'filename.bat\' -file \'C:/temp/filename.bat\' -ErrorAction Stop\n' +
      'mkdir (Split-Path -Path \'c:\\test\\location\\otherScript.bat\' ) -ea 0\n' +
      'Read-S3Object -BucketName \'test2\' -key \'filename2.bat\' -file \'c:\\test\\location\\otherScript.bat\' -ErrorAction Stop</powershell>',
    );
    test.done();
  },
  'can windows userdata execute files'(test: Test) {
    // GIVEN
    const userData = ec2.UserData.forWindows();

    // WHEN
    userData.addExecuteFileCommand({
      filePath: 'C:\\test\\filename.bat',
    } );
    userData.addExecuteFileCommand({
      filePath: 'C:\\test\\filename2.bat',
      arguments: 'arg1 arg2 -arg $variable',
    } );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '<powershell>&\'C:\\test\\filename.bat\'\n' +
      'if (!$?) { Write-Error \'Failed to execute the file "C:\\test\\filename.bat"\' -ErrorAction Stop }\n' +
      '&\'C:\\test\\filename2.bat\' arg1 arg2 -arg $variable\n' +
      'if (!$?) { Write-Error \'Failed to execute the file "C:\\test\\filename2.bat"\' -ErrorAction Stop }</powershell>',
    );
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
  'can create Linux user data with commands on exit'(test: Test) {
    // GIVEN
    const userData = ec2.UserData.forLinux();

    // WHEN
    userData.addCommands('command1', 'command2');
    userData.addOnExitCommands('onexit1', 'onexit2');

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '#!/bin/bash\n' +
        'function exitTrap(){\n' +
        'exitCode=$?\n' +
        'onexit1\n' +
        'onexit2\n' +
        '}\n' +
        'trap exitTrap EXIT\n' +
        'command1\n' +
        'command2');
    test.done();
  },
  'can create Linux with Signal Command'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');

    // WHEN
    const userData = ec2.UserData.forLinux();
    userData.addCommands('command1');
    userData.addSignalOnExitCommand( resource );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '#!/bin/bash\n' +
        'function exitTrap(){\n' +
        'exitCode=$?\n' +
        '/opt/aws/bin/cfn-signal --stack Default --resource RESOURCE1989552F --region ${Token[AWS.Region.4]} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n' +
        '}\n' +
        'trap exitTrap EXIT\n' +
        'command1');
    test.done();
  },
  'can linux userdata download S3 files'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.forLinux();
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    const bucket2 = Bucket.fromBucketName( stack, 'testBucket2', 'test2' );

    // WHEN
    userData.addS3DownloadCommand({
      bucket,
      bucketKey: 'filename.sh',
    } );
    userData.addS3DownloadCommand({
      bucket: bucket2,
      bucketKey: 'filename2.sh',
      localFile: 'c:\\test\\location\\otherScript.sh',
    } );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '#!/bin/bash\n' +
      'mkdir -p $(dirname \'/tmp/filename.sh\')\n' +
      'aws s3 cp \'s3://test/filename.sh\' \'/tmp/filename.sh\'\n' +
      'mkdir -p $(dirname \'c:\\test\\location\\otherScript.sh\')\n' +
      'aws s3 cp \'s3://test2/filename2.sh\' \'c:\\test\\location\\otherScript.sh\'',
    );
    test.done();
  },
  'can linux userdata execute files'(test: Test) {
    // GIVEN
    const userData = ec2.UserData.forLinux();

    // WHEN
    userData.addExecuteFileCommand({
      filePath: '/tmp/filename.sh',
    } );
    userData.addExecuteFileCommand({
      filePath: '/test/filename2.sh',
      arguments: 'arg1 arg2 -arg $variable',
    } );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '#!/bin/bash\n' +
      'set -e\n' +
      'chmod +x \'/tmp/filename.sh\'\n' +
      '\'/tmp/filename.sh\'\n' +
      'set -e\n' +
      'chmod +x \'/test/filename2.sh\'\n' +
      '\'/test/filename2.sh\' arg1 arg2 -arg $variable',
    );
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
  'Custom user data throws when adding on exit commands'(test: Test) {
    // GIVEN
    // WHEN
    const userData = ec2.UserData.custom('');

    // THEN
    test.throws(() => userData.addOnExitCommands( 'a command goes here' ));
    test.done();
  },
  'Custom user data throws when adding signal command'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');

    // WHEN
    const userData = ec2.UserData.custom('');

    // THEN
    test.throws(() => userData.addSignalOnExitCommand( resource ));
    test.done();
  },
  'Custom user data throws when downloading file'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.custom('');
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    // WHEN
    // THEN
    test.throws(() => userData.addS3DownloadCommand({
      bucket,
      bucketKey: 'filename.sh',
    } ));
    test.done();
  },
  'Custom user data throws when executing file'(test: Test) {
    // GIVEN
    const userData = ec2.UserData.custom('');
    // WHEN
    // THEN
    test.throws(() =>
      userData.addExecuteFileCommand({
        filePath: '/tmp/filename.sh',
      } ));
    test.done();
  },

});
