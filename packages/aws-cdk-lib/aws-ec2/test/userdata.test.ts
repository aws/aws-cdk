import { Template, Match } from '../../assertions';
import { Bucket } from '../../aws-s3';
import type { CfnResource } from '../../core';
import { App, Aws, CfnParameter, Stack, Token } from '../../core';
import { EC2_ENCODE_USER_DATA_COMMAND_VALUES } from '../../cx-api';
import * as ec2 from '../lib';

describe('user data', () => {
  test('can create Windows user data', () => {
    // GIVEN

    // WHEN
    const userData = ec2.UserData.forWindows();
    userData.addCommands('command1', 'command2');

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('<powershell>command1\ncommand2</powershell>');
  });
  test('can create Windows user data with commands on exit', () => {
    // GIVEN
    const userData = ec2.UserData.forWindows();

    // WHEN
    userData.addCommands('command1', 'command2');
    userData.addOnExitCommands('onexit1', 'onexit2');

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('<powershell>trap {\n' +
        '$success=($PSItem.Exception.Message -eq "Success")\n' +
        'onexit1\n' +
        'onexit2\n' +
        'break\n' +
        '}\n' +
        'command1\n' +
        'command2\n' +
        'throw "Success"</powershell>');
  });
  test('can create Windows with Signal Command', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');
    const userData = ec2.UserData.forWindows();
    const logicalId = (resource.node.defaultChild as CfnResource).logicalId;

    // WHEN
    userData.addSignalOnExitCommand( resource );
    userData.addCommands('command1');

    // THEN
    const rendered = userData.render();

    expect(stack.resolve(logicalId)).toEqual('RESOURCE1989552F');
    expect(rendered).toEqual('<powershell>trap {\n' +
        '$success=($PSItem.Exception.Message -eq "Success")\n' +
        `cfn-signal --stack Default --resource ${logicalId} --region ${Aws.REGION} --success ($success.ToString().ToLower())\n` +
        'break\n' +
        '}\n' +
        'command1\n' +
        'throw "Success"</powershell>',
    );
  });
  test('can create Windows with Signal Command and userDataCausesReplacement', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const userData = ec2.UserData.forWindows();
    const resource = new ec2.Instance(stack, 'RESOURCE', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
      machineImage: ec2.MachineImage.genericWindows({ ['us-east-1']: 'ami-12345678' }),
      userDataCausesReplacement: true,
      userData,
    });

    const logicalId = (resource.node.defaultChild as CfnResource).logicalId;

    // WHEN
    userData.addSignalOnExitCommand( resource );
    userData.addCommands('command1');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: Match.objectLike({
        RESOURCE1989552Fdfd505305f427919: {
          Type: 'AWS::EC2::Instance',
        },
      }),
    });
    expect(stack.resolve(logicalId)).toEqual('RESOURCE1989552Fdfd505305f427919');
    const rendered = userData.render();
    expect(rendered).toEqual('<powershell>trap {\n' +
        '$success=($PSItem.Exception.Message -eq "Success")\n' +
        `cfn-signal --stack Default --resource ${logicalId} --region ${Aws.REGION} --success ($success.ToString().ToLower())\n` +
        'break\n' +
        '}\n' +
        'command1\n' +
        'throw "Success"</powershell>',
    );
  });
  test('can windows userdata download S3 files', () => {
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
    expect(rendered).toEqual('<powershell>mkdir (Split-Path -Path \'C:/temp/filename.bat\' ) -ea 0\n' +
      'Read-S3Object -BucketName \'test\' -key \'filename.bat\' -file \'C:/temp/filename.bat\' -ErrorAction Stop\n' +
      'mkdir (Split-Path -Path \'c:\\test\\location\\otherScript.bat\' ) -ea 0\n' +
      'Read-S3Object -BucketName \'test2\' -key \'filename2.bat\' -file \'c:\\test\\location\\otherScript.bat\' -ErrorAction Stop</powershell>',
    );
  });
  test('can windows userdata download S3 files with given region', () => {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.forWindows();
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    const bucket2 = Bucket.fromBucketName( stack, 'testBucket2', 'test2' );

    // WHEN
    userData.addS3DownloadCommand({
      bucket,
      bucketKey: 'filename.bat',
      region: 'us-east-1',
    } );
    userData.addS3DownloadCommand({
      bucket: bucket2,
      bucketKey: 'filename2.bat',
      localFile: 'c:\\test\\location\\otherScript.bat',
      region: 'us-east-1',
    } );

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('<powershell>mkdir (Split-Path -Path \'C:/temp/filename.bat\' ) -ea 0\n' +
      'Read-S3Object -BucketName \'test\' -key \'filename.bat\' -file \'C:/temp/filename.bat\' -ErrorAction Stop -Region us-east-1\n' +
      'mkdir (Split-Path -Path \'c:\\test\\location\\otherScript.bat\' ) -ea 0\n' +
      'Read-S3Object -BucketName \'test2\' -key \'filename2.bat\' -file \'c:\\test\\location\\otherScript.bat\' -ErrorAction Stop -Region us-east-1</powershell>',
    );
  });
  test('can windows userdata execute files', () => {
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
    expect(rendered).toEqual('<powershell>&\'C:\\test\\filename.bat\'\n' +
      'if (!$?) { Write-Error \'Failed to execute the file "C:\\test\\filename.bat"\' -ErrorAction Stop }\n' +
      '&\'C:\\test\\filename2.bat\' arg1 arg2 -arg $variable\n' +
      'if (!$?) { Write-Error \'Failed to execute the file "C:\\test\\filename2.bat"\' -ErrorAction Stop }</powershell>',
    );
  });
  test('can persist windows userdata', () => {
    // WHEN
    const userData = ec2.UserData.forWindows({ persist: true });

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('<powershell></powershell><persist>true</persist>');
  });
  test('can create Linux user data', () => {
    // GIVEN

    // WHEN
    const userData = ec2.UserData.forLinux();
    userData.addCommands('command1', 'command2');

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('#!/bin/bash\ncommand1\ncommand2');
  });
  test('can create Linux user data with commands on exit', () => {
    // GIVEN
    const userData = ec2.UserData.forLinux();

    // WHEN
    userData.addCommands('command1', 'command2');
    userData.addOnExitCommands('onexit1', 'onexit2');

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('#!/bin/bash\n' +
        'function exitTrap(){\n' +
        'exitCode=$?\n' +
        'onexit1\n' +
        'onexit2\n' +
        '}\n' +
        'trap exitTrap EXIT\n' +
        'command1\n' +
        'command2');
  });
  test('can create Linux with Signal Command', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');
    const logicalId = (resource.node.defaultChild as CfnResource).logicalId;

    // WHEN
    const userData = ec2.UserData.forLinux();
    userData.addCommands('command1');
    userData.addSignalOnExitCommand( resource );

    // THEN
    const rendered = userData.render();
    expect(stack.resolve(logicalId)).toEqual('RESOURCE1989552F');
    expect(rendered).toEqual('#!/bin/bash\n' +
        'function exitTrap(){\n' +
        'exitCode=$?\n' +
        `/opt/aws/bin/cfn-signal --stack Default --resource ${logicalId} --region ${Aws.REGION} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n` +
        '}\n' +
        'trap exitTrap EXIT\n' +
        'command1');
  });
  test('can create Linux with Signal Command and userDataCausesReplacement', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const userData = ec2.UserData.forLinux();
    const resource = new ec2.Instance(stack, 'RESOURCE', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
      machineImage: ec2.MachineImage.genericLinux({ ['us-east-1']: 'ami-12345678' }),
      userDataCausesReplacement: true,
      userData,
    });

    const logicalId = (resource.node.defaultChild as CfnResource).logicalId;

    // WHEN
    userData.addSignalOnExitCommand( resource );
    userData.addCommands('command1');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: Match.objectLike({
        RESOURCE1989552F74a24ef4fbc89422: {
          Type: 'AWS::EC2::Instance',
        },
      }),
    });
    expect(stack.resolve(logicalId)).toEqual('RESOURCE1989552F74a24ef4fbc89422');
    const rendered = userData.render();
    expect(rendered).toEqual('#!/bin/bash\n' +
        'function exitTrap(){\n' +
        'exitCode=$?\n' +
        `/opt/aws/bin/cfn-signal --stack Default --resource ${logicalId} --region ${Aws.REGION} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n` +
        '}\n' +
        'trap exitTrap EXIT\n' +
        'command1');
  });
  test('can linux userdata download S3 files', () => {
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
    expect(rendered).toEqual('#!/bin/bash\n' +
      'mkdir -p $(dirname \'/tmp/filename.sh\')\n' +
      'aws s3 cp \'s3://test/filename.sh\' \'/tmp/filename.sh\'\n' +
      'mkdir -p $(dirname \'c:\\test\\location\\otherScript.sh\')\n' +
      'aws s3 cp \'s3://test2/filename2.sh\' \'c:\\test\\location\\otherScript.sh\'',
    );
  });
  test('can linux userdata download S3 files from specific region', () => {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.forLinux();
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    const bucket2 = Bucket.fromBucketName( stack, 'testBucket2', 'test2' );

    // WHEN
    userData.addS3DownloadCommand({
      bucket,
      bucketKey: 'filename.sh',
      region: 'us-east-1',
    } );
    userData.addS3DownloadCommand({
      bucket: bucket2,
      bucketKey: 'filename2.sh',
      localFile: 'c:\\test\\location\\otherScript.sh',
      region: 'us-east-1',
    } );

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('#!/bin/bash\n' +
      'mkdir -p $(dirname \'/tmp/filename.sh\')\n' +
      'aws s3 cp \'s3://test/filename.sh\' \'/tmp/filename.sh\' --region us-east-1\n' +
      'mkdir -p $(dirname \'c:\\test\\location\\otherScript.sh\')\n' +
      'aws s3 cp \'s3://test2/filename2.sh\' \'c:\\test\\location\\otherScript.sh\' --region us-east-1',
    );
  });
  test('can linux userdata execute files', () => {
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
    expect(rendered).toEqual('#!/bin/bash\n' +
      'set -e\n' +
      'chmod +x \'/tmp/filename.sh\'\n' +
      '\'/tmp/filename.sh\'\n' +
      'set -e\n' +
      'chmod +x \'/test/filename2.sh\'\n' +
      '\'/test/filename2.sh\' arg1 arg2 -arg $variable',
    );
  });
  test('can create Custom user data', () => {
    // GIVEN

    // WHEN
    const userData = ec2.UserData.custom('Some\nmultiline\ncontent');

    // THEN
    const rendered = userData.render();
    expect(rendered).toEqual('Some\nmultiline\ncontent');
  });
  test('Custom user data throws when adding on exit commands', () => {
    // GIVEN
    // WHEN
    const userData = ec2.UserData.custom('');

    // THEN
    expect(() => userData.addOnExitCommands( 'a command goes here' )).toThrow();
  });
  test('Custom user data throws when adding signal command', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');

    // WHEN
    const userData = ec2.UserData.custom('');

    // THEN
    expect(() => userData.addSignalOnExitCommand( resource )).toThrow();
  });
  test('Custom user data throws when downloading file', () => {
    // GIVEN
    const stack = new Stack();
    const userData = ec2.UserData.custom('');
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    // WHEN
    // THEN
    expect(() => userData.addS3DownloadCommand({
      bucket,
      bucketKey: 'filename.sh',
    })).toThrow();
  });
  test('Custom user data throws when executing file', () => {
    // GIVEN
    const userData = ec2.UserData.custom('');
    // WHEN
    // THEN
    expect(() =>
      userData.addExecuteFileCommand({
        filePath: '/tmp/filename.sh',
      })).toThrow();
  });

  test('Linux user rendering multipart headers', () => {
    // GIVEN
    const stack = new Stack();
    const linuxUserData = ec2.UserData.forLinux();
    linuxUserData.addCommands('echo "Hello world"');

    // WHEN
    const defaultRender1 = ec2.MultipartBody.fromUserData(linuxUserData);
    const defaultRender2 = ec2.MultipartBody.fromUserData(linuxUserData, 'text/cloud-boothook; charset=\"utf-8\"');

    // THEN
    expect(stack.resolve(defaultRender1.renderBodyPart())).toEqual([
      'Content-Type: text/x-shellscript; charset=\"utf-8\"',
      'Content-Transfer-Encoding: base64',
      '',
      { 'Fn::Base64': '#!/bin/bash\necho \"Hello world\"' },
    ]);
    expect(stack.resolve(defaultRender2.renderBodyPart())).toEqual([
      'Content-Type: text/cloud-boothook; charset=\"utf-8\"',
      'Content-Transfer-Encoding: base64',
      '',
      { 'Fn::Base64': '#!/bin/bash\necho \"Hello world\"' },
    ]);
  });

  test('Default parts separator used, if not specified', () => {
    // GIVEN
    const multipart = new ec2.MultipartUserData();

    multipart.addPart(ec2.MultipartBody.fromRawBody({
      contentType: 'CT',
    }));

    // WHEN
    const out = multipart.render();

    // WHEN
    expect(out).toEqual([
      'Content-Type: multipart/mixed; boundary=\"+AWS+CDK+User+Data+Separator==\"',
      'MIME-Version: 1.0',
      '',
      '--+AWS+CDK+User+Data+Separator==',
      'Content-Type: CT',
      '',
      '--+AWS+CDK+User+Data+Separator==--',
      '',
    ].join('\n'));
  });

  test('Non-default parts separator used, if not specified', () => {
    // GIVEN
    const multipart = new ec2.MultipartUserData({
      partsSeparator: '//',
    });

    multipart.addPart(ec2.MultipartBody.fromRawBody({
      contentType: 'CT',
    }));

    // WHEN
    const out = multipart.render();

    // WHEN
    expect(out).toEqual([
      'Content-Type: multipart/mixed; boundary=\"//\"',
      'MIME-Version: 1.0',
      '',
      '--//',
      'Content-Type: CT',
      '',
      '--//--',
      '',
    ].join('\n'));
  });

  test('Multipart separator validation', () => {
    // Happy path
    new ec2.MultipartUserData();
    new ec2.MultipartUserData({
      partsSeparator: 'a-zA-Z0-9()+,-./:=?',
    });

    [' ', '\n', '\r', '[', ']', '<', '>', '違う'].forEach(s => expect(() => {
      new ec2.MultipartUserData({
        partsSeparator: s,
      });
    }).toThrow(/Invalid characters in separator/));
  });

  test('Multipart user data throws when adding on exit commands', () => {
    // GIVEN
    // WHEN
    const userData = new ec2.MultipartUserData();

    // THEN
    expect(() => userData.addOnExitCommands( 'a command goes here' )).toThrow();
  });
  test('Multipart user data throws when adding signal command', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');

    // WHEN
    const userData = new ec2.MultipartUserData();

    // THEN
    expect(() => userData.addSignalOnExitCommand( resource )).toThrow();
  });
  test('Multipart user data throws when downloading file', () => {
    // GIVEN
    const stack = new Stack();
    const userData = new ec2.MultipartUserData();
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    // WHEN
    // THEN
    expect(() => userData.addS3DownloadCommand({
      bucket,
      bucketKey: 'filename.sh',
    } )).toThrow();
  });
  test('Multipart user data throws when executing file', () => {
    // GIVEN
    const userData = new ec2.MultipartUserData();

    // WHEN
    // THEN
    expect(() =>
      userData.addExecuteFileCommand({
        filePath: '/tmp/filename.sh',
      } )).toThrow();
  });

  test('can add commands to Multipart user data', () => {
    // GIVEN
    const stack = new Stack();
    const innerUserData = ec2.UserData.forLinux();
    const userData = new ec2.MultipartUserData();

    // WHEN
    userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
    userData.addCommands('command1', 'command2');

    // THEN
    const expectedInner = '#!/bin/bash\ncommand1\ncommand2';
    const rendered = innerUserData.render();
    expect(rendered).toEqual(expectedInner);
    const out = stack.resolve(userData.render());
    expect(out).toEqual({
      'Fn::Join': [
        '',
        [
          [
            'Content-Type: multipart/mixed; boundary="+AWS+CDK+User+Data+Separator=="',
            'MIME-Version: 1.0',
            '',
            '--+AWS+CDK+User+Data+Separator==',
            'Content-Type: text/x-shellscript; charset="utf-8"',
            'Content-Transfer-Encoding: base64',
            '',
            '',
          ].join('\n'),
          {
            'Fn::Base64': expectedInner,
          },
          '\n--+AWS+CDK+User+Data+Separator==--\n',
        ],
      ],
    });
  });
  test('can add commands on exit to Multipart user data', () => {
    // GIVEN
    const stack = new Stack();
    const innerUserData = ec2.UserData.forLinux();
    const userData = new ec2.MultipartUserData();

    // WHEN
    userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
    userData.addCommands('command1', 'command2');
    userData.addOnExitCommands('onexit1', 'onexit2');

    // THEN
    const expectedInner = '#!/bin/bash\n' +
    'function exitTrap(){\n' +
    'exitCode=$?\n' +
    'onexit1\n' +
    'onexit2\n' +
    '}\n' +
    'trap exitTrap EXIT\n' +
    'command1\n' +
    'command2';
    const rendered = stack.resolve(innerUserData.render());
    expect(rendered).toEqual(expectedInner);
    const out = stack.resolve(userData.render());
    expect(out).toEqual({
      'Fn::Join': [
        '',
        [
          [
            'Content-Type: multipart/mixed; boundary="+AWS+CDK+User+Data+Separator=="',
            'MIME-Version: 1.0',
            '',
            '--+AWS+CDK+User+Data+Separator==',
            'Content-Type: text/x-shellscript; charset="utf-8"',
            'Content-Transfer-Encoding: base64',
            '',
            '',
          ].join('\n'),
          {
            'Fn::Base64': expectedInner,
          },
          '\n--+AWS+CDK+User+Data+Separator==--\n',
        ],
      ],
    });
  });
  test('can add Signal Command to Multipart user data', () => {
    // GIVEN
    const stack = new Stack();
    const resource = new ec2.Vpc(stack, 'RESOURCE');
    const innerUserData = ec2.UserData.forLinux();
    const userData = new ec2.MultipartUserData();

    // WHEN
    userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
    userData.addCommands('command1');
    userData.addSignalOnExitCommand( resource );

    // THEN
    const expectedInner = stack.resolve('#!/bin/bash\n' +
    'function exitTrap(){\n' +
    'exitCode=$?\n' +
    `/opt/aws/bin/cfn-signal --stack Default --resource RESOURCE1989552F --region ${Aws.REGION} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n` +
    '}\n' +
    'trap exitTrap EXIT\n' +
    'command1');
    const rendered = stack.resolve(innerUserData.render());
    expect(rendered).toEqual(expectedInner);
    const out = stack.resolve(userData.render());
    expect(out).toEqual({
      'Fn::Join': [
        '',
        [
          [
            'Content-Type: multipart/mixed; boundary="+AWS+CDK+User+Data+Separator=="',
            'MIME-Version: 1.0',
            '',
            '--+AWS+CDK+User+Data+Separator==',
            'Content-Type: text/x-shellscript; charset="utf-8"',
            'Content-Transfer-Encoding: base64',
            '',
            '',
          ].join('\n'),
          {
            'Fn::Base64': expectedInner,
          },
          '\n--+AWS+CDK+User+Data+Separator==--\n',
        ],
      ],
    });
  });
  test('can add download S3 files to Multipart user data', () => {
    // GIVEN
    const stack = new Stack();
    const innerUserData = ec2.UserData.forLinux();
    const userData = new ec2.MultipartUserData();
    const bucket = Bucket.fromBucketName( stack, 'testBucket', 'test' );
    const bucket2 = Bucket.fromBucketName( stack, 'testBucket2', 'test2' );

    // WHEN
    userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
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
    const expectedInner = '#!/bin/bash\n' +
    'mkdir -p $(dirname \'/tmp/filename.sh\')\n' +
    'aws s3 cp \'s3://test/filename.sh\' \'/tmp/filename.sh\'\n' +
    'mkdir -p $(dirname \'c:\\test\\location\\otherScript.sh\')\n' +
    'aws s3 cp \'s3://test2/filename2.sh\' \'c:\\test\\location\\otherScript.sh\'';
    const rendered = stack.resolve(innerUserData.render());
    expect(rendered).toEqual(expectedInner);
    const out = stack.resolve(userData.render());
    expect(out).toEqual({
      'Fn::Join': [
        '',
        [
          [
            'Content-Type: multipart/mixed; boundary="+AWS+CDK+User+Data+Separator=="',
            'MIME-Version: 1.0',
            '',
            '--+AWS+CDK+User+Data+Separator==',
            'Content-Type: text/x-shellscript; charset="utf-8"',
            'Content-Transfer-Encoding: base64',
            '',
            '',
          ].join('\n'),
          {
            'Fn::Base64': expectedInner,
          },
          '\n--+AWS+CDK+User+Data+Separator==--\n',
        ],
      ],
    });
  });
  test('can add execute files to Multipart user data', () => {
    // GIVEN
    const stack = new Stack();
    const innerUserData = ec2.UserData.forLinux();
    const userData = new ec2.MultipartUserData();

    // WHEN
    userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
    userData.addExecuteFileCommand({
      filePath: '/tmp/filename.sh',
    } );
    userData.addExecuteFileCommand({
      filePath: '/test/filename2.sh',
      arguments: 'arg1 arg2 -arg $variable',
    } );

    // THEN
    const expectedInner = '#!/bin/bash\n' +
    'set -e\n' +
    'chmod +x \'/tmp/filename.sh\'\n' +
    '\'/tmp/filename.sh\'\n' +
    'set -e\n' +
    'chmod +x \'/test/filename2.sh\'\n' +
    '\'/test/filename2.sh\' arg1 arg2 -arg $variable';
    const rendered = stack.resolve(innerUserData.render());
    expect(rendered).toEqual(expectedInner);
    const out = stack.resolve(userData.render());
    expect(out).toEqual({
      'Fn::Join': [
        '',
        [
          [
            'Content-Type: multipart/mixed; boundary="+AWS+CDK+User+Data+Separator=="',
            'MIME-Version: 1.0',
            '',
            '--+AWS+CDK+User+Data+Separator==',
            'Content-Type: text/x-shellscript; charset="utf-8"',
            'Content-Transfer-Encoding: base64',
            '',
            '',
          ].join('\n'),
          {
            'Fn::Base64': expectedInner,
          },
          '\n--+AWS+CDK+User+Data+Separator==--\n',
        ],
      ],
    });
  });
});

describe('user data with deploy-time values', () => {
  describe('feature flag', () => {
    test('linux: with the flag off, tokens render unencoded, byte for byte', () => {
      const stack = new Stack();
      const key = new CfnParameter(stack, 'Key').valueAsString;
      const localFile = new CfnParameter(stack, 'LocalFile').valueAsString;
      const region = new CfnParameter(stack, 'Region').valueAsString;
      const file = new CfnParameter(stack, 'File').valueAsString;
      const args = new CfnParameter(stack, 'Args').valueAsString;
      const userData = ec2.UserData.forLinux();

      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'),
        bucketKey: key,
        localFile,
        region,
      });
      userData.addExecuteFileCommand({ filePath: file, arguments: args });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          "#!/bin/bash\nmkdir -p $(dirname '", { Ref: 'LocalFile' },
          "')\naws s3 cp 's3://test/", { Ref: 'Key' }, "' '", { Ref: 'LocalFile' }, "' --region ", { Ref: 'Region' },
          "\nset -e\nchmod +x '", { Ref: 'File' }, "'\n'", { Ref: 'File' }, "' ", { Ref: 'Args' },
        ]],
      });
    });

    test('windows: with the flag off, tokens render unencoded, byte for byte', () => {
      const stack = new Stack();
      const key = new CfnParameter(stack, 'Key').valueAsString;
      const localFile = new CfnParameter(stack, 'LocalFile').valueAsString;
      const region = new CfnParameter(stack, 'Region').valueAsString;
      const file = new CfnParameter(stack, 'File').valueAsString;
      const args = new CfnParameter(stack, 'Args').valueAsString;
      const userData = ec2.UserData.forWindows();

      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'),
        bucketKey: key,
        localFile,
        region,
      });
      userData.addExecuteFileCommand({ filePath: file, arguments: args });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          "<powershell>mkdir (Split-Path -Path '", { Ref: 'LocalFile' },
          "' ) -ea 0\nRead-S3Object -BucketName 'test' -key '", { Ref: 'Key' }, "' -file '", { Ref: 'LocalFile' },
          "' -ErrorAction Stop -Region ", { Ref: 'Region' },
          "\n&'", { Ref: 'File' }, "' ", { Ref: 'Args' },
          "\nif (!$?) { Write-Error 'Failed to execute the file \"", { Ref: 'File' }, "\"' -ErrorAction Stop }</powershell>",
        ]],
      });
    });

    test.each([['off', false], ['on', true]])('linux: literals render as written with the flag %s', (_state, enabled) => {
      const stack = new Stack(new App({ context: { [EC2_ENCODE_USER_DATA_COMMAND_VALUES]: enabled } }), 'Stack');
      const userData = ec2.UserData.forLinux();

      userData.addS3DownloadCommand({ bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'), bucketKey: 'filename.sh' });
      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket2', 'test2'),
        bucketKey: 'filename2.sh',
        localFile: 'c:\\test\\location\\otherScript.sh',
        region: 'us-east-1',
      });
      userData.addExecuteFileCommand({ filePath: '/tmp/filename.sh' });
      userData.addExecuteFileCommand({ filePath: '/test/filename2.sh', arguments: 'arg1 arg2 -arg $variable' });
      userData.addExecuteFileCommand({ filePath: "/tmp/it's.sh" });

      expect(stack.resolve(userData.render())).toEqual([
        '#!/bin/bash',
        "mkdir -p $(dirname '/tmp/filename.sh')",
        "aws s3 cp 's3://test/filename.sh' '/tmp/filename.sh'",
        "mkdir -p $(dirname 'c:\\test\\location\\otherScript.sh')",
        "aws s3 cp 's3://test2/filename2.sh' 'c:\\test\\location\\otherScript.sh' --region us-east-1",
        'set -e',
        "chmod +x '/tmp/filename.sh'",
        "'/tmp/filename.sh'",
        'set -e',
        "chmod +x '/test/filename2.sh'",
        "'/test/filename2.sh' arg1 arg2 -arg $variable",
        'set -e',
        "chmod +x '/tmp/it's.sh'",
        "'/tmp/it's.sh'",
      ].join('\n'));
    });

    test.each([['off', false], ['on', true]])('windows: literals render as written with the flag %s', (_state, enabled) => {
      const stack = new Stack(new App({ context: { [EC2_ENCODE_USER_DATA_COMMAND_VALUES]: enabled } }), 'Stack');
      const userData = ec2.UserData.forWindows();

      userData.addS3DownloadCommand({ bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'), bucketKey: 'filename.bat' });
      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket2', 'test2'),
        bucketKey: 'filename2.bat',
        localFile: 'c:\\test\\location\\otherScript.bat',
        region: 'us-east-1',
      });
      userData.addExecuteFileCommand({ filePath: 'C:\\test\\filename.bat' });
      userData.addExecuteFileCommand({ filePath: 'C:\\test\\filename2.bat', arguments: 'arg1 arg2 -arg $variable' });
      userData.addExecuteFileCommand({ filePath: "C:/temp/it's.ps1" });

      expect(stack.resolve(userData.render())).toEqual([
        "<powershell>mkdir (Split-Path -Path 'C:/temp/filename.bat' ) -ea 0",
        "Read-S3Object -BucketName 'test' -key 'filename.bat' -file 'C:/temp/filename.bat' -ErrorAction Stop",
        "mkdir (Split-Path -Path 'c:\\test\\location\\otherScript.bat' ) -ea 0",
        "Read-S3Object -BucketName 'test2' -key 'filename2.bat' -file 'c:\\test\\location\\otherScript.bat' -ErrorAction Stop -Region us-east-1",
        "&'C:\\test\\filename.bat'",
        "if (!$?) { Write-Error 'Failed to execute the file \"C:\\test\\filename.bat\"' -ErrorAction Stop }",
        "&'C:\\test\\filename2.bat' arg1 arg2 -arg $variable",
        "if (!$?) { Write-Error 'Failed to execute the file \"C:\\test\\filename2.bat\"' -ErrorAction Stop }",
        "&'C:/temp/it's.ps1'",
        "if (!$?) { Write-Error 'Failed to execute the file \"C:/temp/it's.ps1\"' -ErrorAction Stop }</powershell>",
      ].join('\n'));
    });

    test('the flag is read from the scope that resolves the user data', () => {
      // One UserData object, resolved in an app with the flag off and in one with it on.
      const offStack = new Stack();
      const onStack = encodingStack();
      const userData = ec2.UserData.forLinux();
      userData.addExecuteFileCommand({ filePath: '/tmp/a.sh', arguments: Token.asString({ Ref: 'Args' }) });

      // Each resolution follows its own app's flag; neither overrides the other.
      expect(offStack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', ["#!/bin/bash\nset -e\nchmod +x '/tmp/a.sh'\n'/tmp/a.sh' ", { Ref: 'Args' }]],
      });
      expect(onStack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          "#!/bin/bash\nset -e\nchmod +x '/tmp/a.sh'\n'/tmp/a.sh' ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Args' } },
          "' | base64 -d)\"}",
        ]],
      });
    });

    test('an Instance renders the encoded form when its app enables the flag', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forLinux();
      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'),
        bucketKey: new CfnParameter(stack, 'Key').valueAsString,
      });

      new ec2.Instance(stack, 'Instance', {
        vpc: new ec2.Vpc(stack, 'Vpc'),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        userData,
      });

      const localFile = { 'Fn::Base64': { 'Fn::Join': ['', ['/tmp/', { Ref: 'Key' }]] } };
      const source = { 'Fn::Base64': { 'Fn::Join': ['', ['s3://test/', { Ref: 'Key' }]] } };
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
        UserData: Match.exact({
          'Fn::Base64': {
            'Fn::Join': ['', [
              "#!/bin/bash\nmkdir -p -- \"$(dirname -- \"$(printf %s '", localFile,
              "' | base64 -d)\")\"\naws s3 cp \"$(printf %s '", source,
              "' | base64 -d)\" \"$(printf %s '", localFile,
              "' | base64 -d)\"",
            ]],
          },
        }),
      });
    });

    test('a LaunchTemplate renders the encoded form when its app enables the flag', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forLinux();
      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'),
        bucketKey: new CfnParameter(stack, 'Key').valueAsString,
      });

      new ec2.LaunchTemplate(stack, 'LaunchTemplate', { userData });

      const localFile = { 'Fn::Base64': { 'Fn::Join': ['', ['/tmp/', { Ref: 'Key' }]] } };
      const source = { 'Fn::Base64': { 'Fn::Join': ['', ['s3://test/', { Ref: 'Key' }]] } };
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
        LaunchTemplateData: {
          UserData: Match.exact({
            'Fn::Base64': {
              'Fn::Join': ['', [
                "#!/bin/bash\nmkdir -p -- \"$(dirname -- \"$(printf %s '", localFile,
                "' | base64 -d)\")\"\naws s3 cp \"$(printf %s '", source,
                "' | base64 -d)\" \"$(printf %s '", localFile,
                "' | base64 -d)\"",
              ]],
            },
          }),
        },
      });
    });

    test('a MultipartUserData part renders the encoded form when its app enables the flag', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forLinux();
      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'),
        bucketKey: new CfnParameter(stack, 'Key').valueAsString,
      });

      const multipart = new ec2.MultipartUserData();
      multipart.addUserDataPart(userData, ec2.MultipartBody.SHELL_SCRIPT, true);
      new ec2.LaunchTemplate(stack, 'LaunchTemplate', { userData: multipart });

      const separator = '--+AWS+CDK+User+Data+Separator==';
      const multipartHeader = `Content-Type: multipart/mixed; boundary="+AWS+CDK+User+Data+Separator=="\nMIME-Version: 1.0\n\n${separator}`;
      const partHeader = 'Content-Type: text/x-shellscript; charset="utf-8"\nContent-Transfer-Encoding: base64';
      const localFile = { 'Fn::Base64': { 'Fn::Join': ['', ['/tmp/', { Ref: 'Key' }]] } };
      const source = { 'Fn::Base64': { 'Fn::Join': ['', ['s3://test/', { Ref: 'Key' }]] } };
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
        LaunchTemplateData: {
          UserData: Match.exact({
            'Fn::Base64': {
              'Fn::Join': ['', [
                `${multipartHeader}\n${partHeader}\n\n`,
                {
                  'Fn::Base64': {
                    'Fn::Join': ['', [
                      "#!/bin/bash\nmkdir -p -- \"$(dirname -- \"$(printf %s '", localFile,
                      "' | base64 -d)\")\"\naws s3 cp \"$(printf %s '", source,
                      "' | base64 -d)\" \"$(printf %s '", localFile,
                      "' | base64 -d)\"",
                    ]],
                  },
                },
                `\n${separator}--\n`,
              ]],
            },
          }),
        },
      });
    });
  });

  describe('linux', () => {
    test('literal-only arguments are inserted as written', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forLinux();

      userData.addExecuteFileCommand({ filePath: '/tmp/a.sh', arguments: '--verbose -y $HOME * \'a b\' \'c\'' });

      expect(stack.resolve(userData.render())).toEqual(
        "#!/bin/bash\nset -e\nchmod +x '/tmp/a.sh'\n'/tmp/a.sh' --verbose -y $HOME * 'a b' 'c'",
      );
    });

    test('the download returns the raw local path', () => {
      const stack = encodingStack();
      const key = new CfnParameter(stack, 'Key').valueAsString;

      const localPath = ec2.UserData.forLinux().addS3DownloadCommand({ bucket: Bucket.fromBucketName(stack, 'Bucket', 'test'), bucketKey: key });

      expect(stack.resolve(localPath)).toEqual({ 'Fn::Join': ['', ['/tmp/', { Ref: 'Key' }]] });
    });

    test('each deploy-time value is passed as Base64 and decoded inside double quotes', () => {
      const stack = encodingStack();
      const bucketName = new CfnParameter(stack, 'BucketName').valueAsString;
      const key = new CfnParameter(stack, 'Key').valueAsString;
      const localFile = new CfnParameter(stack, 'LocalFile').valueAsString;
      const region = new CfnParameter(stack, 'Region').valueAsString;
      const file = new CfnParameter(stack, 'File').valueAsString;
      const args = new CfnParameter(stack, 'Args').valueAsString;
      const userData = ec2.UserData.forLinux();

      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket', bucketName),
        bucketKey: key,
        localFile,
        region,
      });
      userData.addExecuteFileCommand({ filePath: file, arguments: args });

      const source = { 'Fn::Join': ['', ['s3://', { Ref: 'BucketName' }, '/', { Ref: 'Key' }]] };
      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          "#!/bin/bash\nmkdir -p -- \"$(dirname -- \"$(printf %s '", { 'Fn::Base64': { Ref: 'LocalFile' } },
          "' | base64 -d)\")\"\naws s3 cp \"$(printf %s '", { 'Fn::Base64': source },
          "' | base64 -d)\" \"$(printf %s '", { 'Fn::Base64': { Ref: 'LocalFile' } },
          "' | base64 -d)\" --region \"$(printf %s '", { 'Fn::Base64': { Ref: 'Region' } },
          "' | base64 -d)\"\nset -e\nchmod +x \"$(printf %s '", { 'Fn::Base64': { Ref: 'File' } },
          "' | base64 -d)\"\n\"$(printf %s '", { 'Fn::Base64': { Ref: 'File' } },
          "' | base64 -d)\" ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Args' } },
          "' | base64 -d)\"}",
        ]],
      });
    });

    test('a token in arguments is decoded in place, inside quotes and inside a word', () => {
      const stack = encodingStack();
      const env = new CfnParameter(stack, 'Env').valueAsString;
      const path = new CfnParameter(stack, 'Path').valueAsString;
      const name = new CfnParameter(stack, 'Name').valueAsString;
      const functionName = new CfnParameter(stack, 'FunctionName').valueAsString;
      const version = new CfnParameter(stack, 'Version').valueAsString;
      const host = new CfnParameter(stack, 'Host').valueAsString;
      const port = new CfnParameter(stack, 'Port').valueAsString;
      const label = new CfnParameter(stack, 'Label').valueAsString;
      const userData = ec2.UserData.forLinux();

      userData.addExecuteFileCommand({
        filePath: '/tmp/a.sh',
        arguments: `--env ${env} -f "${path}" --name=${name} ${functionName}:${version} ${host} ${port} "pre ${label} post"`,
      });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          "#!/bin/bash\nset -e\nchmod +x '/tmp/a.sh'\n'/tmp/a.sh' --env ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Env' } },
          "' | base64 -d)\"} -f \"${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Path' } },
          "' | base64 -d)\"}\" --name=${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Name' } },
          "' | base64 -d)\"} ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'FunctionName' } },
          "' | base64 -d)\"}:${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Version' } },
          "' | base64 -d)\"} ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Host' } },
          "' | base64 -d)\"} ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Port' } },
          "' | base64 -d)\"} \"pre ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Label' } },
          "' | base64 -d)\"} post\"",
        ]],
      });
    });

    test('single quotes around a lone token are dropped, other single quotes are kept', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forLinux();

      userData.addExecuteFileCommand({ filePath: '/tmp/a.sh', arguments: `-f '${new CfnParameter(stack, 'Path').valueAsString}' 'a b'` });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          "#!/bin/bash\nset -e\nchmod +x '/tmp/a.sh'\n'/tmp/a.sh' -f ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Path' } },
          "' | base64 -d)\"} 'a b'",
        ]],
      });
    });

    test('literal text next to a token is kept as written', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forLinux();

      userData.addExecuteFileCommand({
        filePath: '/tmp/a.sh',
        arguments: `--glob *.txt --var $LOG_LEVEL ${new CfnParameter(stack, 'Args').valueAsString}`,
      });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          "#!/bin/bash\nset -e\nchmod +x '/tmp/a.sh'\n'/tmp/a.sh' --glob *.txt --var $LOG_LEVEL ${0+\"$(printf %s '", { 'Fn::Base64': { Ref: 'Args' } },
          "' | base64 -d)\"}",
        ]],
      });
    });
  });

  describe('windows', () => {
    // The start of the code that turns Base64 text back into the value.
    const powershellBase64DecodeStart = '[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(';

    test('each deploy-time value is passed as Base64 and decoded', () => {
      const stack = encodingStack();
      const bucketName = new CfnParameter(stack, 'BucketName').valueAsString;
      const key = new CfnParameter(stack, 'Key').valueAsString;
      const localFile = new CfnParameter(stack, 'LocalFile').valueAsString;
      const region = new CfnParameter(stack, 'Region').valueAsString;
      const file = new CfnParameter(stack, 'File').valueAsString;
      const args = new CfnParameter(stack, 'Args').valueAsString;
      const userData = ec2.UserData.forWindows();

      userData.addS3DownloadCommand({
        bucket: Bucket.fromBucketName(stack, 'Bucket', bucketName),
        bucketKey: key,
        localFile,
        region,
      });
      userData.addExecuteFileCommand({ filePath: file, arguments: args });

      const failureMessage = { 'Fn::Join': ['', ['Failed to execute the file "', { Ref: 'File' }, '"']] };
      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          `<powershell>mkdir (Split-Path -Path (${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'LocalFile' } },
          `'))) ) -ea 0\nRead-S3Object -BucketName (${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'BucketName' } },
          `'))) -key (${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Key' } },
          `'))) -file (${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'LocalFile' } },
          `'))) -ErrorAction Stop -Region (${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Region' } },
          `')))\n&(${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'File' } },
          `'))) $((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Args' } },
          `'))))\nif (!$?) { Write-Error (${powershellBase64DecodeStart}'`, { 'Fn::Base64': failureMessage },
          "'))) -ErrorAction Stop }</powershell>",
        ]],
      });
    });

    test('a token in arguments is decoded in place, inside quotes and inside a word', () => {
      const stack = encodingStack();
      const env = new CfnParameter(stack, 'Env').valueAsString;
      const path = new CfnParameter(stack, 'Path').valueAsString;
      const name = new CfnParameter(stack, 'Name').valueAsString;
      const functionName = new CfnParameter(stack, 'FunctionName').valueAsString;
      const version = new CfnParameter(stack, 'Version').valueAsString;
      const host = new CfnParameter(stack, 'Host').valueAsString;
      const port = new CfnParameter(stack, 'Port').valueAsString;
      const label = new CfnParameter(stack, 'Label').valueAsString;
      const userData = ec2.UserData.forWindows();

      userData.addExecuteFileCommand({
        filePath: 'C:/a.ps1',
        arguments: `--env ${env} -f "${path}" --name=${name} "${functionName}:${version}" ${host} ${port} "pre ${label} post"`,
      });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          `<powershell>&'C:/a.ps1' --env $((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Env' } },
          `')))) -f "$((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Path' } },
          `'))))" --name=$((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Name' } },
          `')))) "$((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'FunctionName' } },
          `')))):$((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Version' } },
          `'))))" $((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Host' } },
          `')))) $((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Port' } },
          `')))) "pre $((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Label' } },
          "')))) post\"\nif (!$?) { Write-Error 'Failed to execute the file \"C:/a.ps1\"' -ErrorAction Stop }</powershell>",
        ]],
      });
    });

    test('single quotes around a lone token are dropped, other single quotes are kept', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forWindows();

      userData.addExecuteFileCommand({ filePath: 'C:/a.ps1', arguments: `-f '${new CfnParameter(stack, 'Path').valueAsString}' 'a b'` });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          `<powershell>&'C:/a.ps1' -f $((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Path' } },
          "')))) 'a b'\nif (!$?) { Write-Error 'Failed to execute the file \"C:/a.ps1\"' -ErrorAction Stop }</powershell>",
        ]],
      });
    });

    test('literal text next to a token is kept as written', () => {
      const stack = encodingStack();
      const userData = ec2.UserData.forWindows();

      userData.addExecuteFileCommand({
        filePath: 'C:/a.ps1',
        arguments: `-Filter *.txt -Level $env:LOG_LEVEL ${new CfnParameter(stack, 'Args').valueAsString}`,
      });

      expect(stack.resolve(userData.render())).toEqual({
        'Fn::Join': ['', [
          `<powershell>&'C:/a.ps1' -Filter *.txt -Level $env:LOG_LEVEL $((${powershellBase64DecodeStart}'`, { 'Fn::Base64': { Ref: 'Args' } },
          "'))))\nif (!$?) { Write-Error 'Failed to execute the file \"C:/a.ps1\"' -ErrorAction Stop }</powershell>",
        ]],
      });
    });
  });
});

/**
 * A stack whose app enables the encodeUserDataCommandValues feature flag.
 */
function encodingStack(): Stack {
  return new Stack(new App({ context: { [EC2_ENCODE_USER_DATA_COMMAND_VALUES]: true } }), 'Stack');
}
