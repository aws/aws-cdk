import { Template, Match } from '@aws-cdk/assertions';
import { Bucket } from '@aws-cdk/aws-s3';
import { Aws, Stack, CfnResource } from '@aws-cdk/core';
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
