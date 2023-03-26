"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const ec2 = require("../lib");
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
        const stack = new core_1.Stack();
        const resource = new ec2.Vpc(stack, 'RESOURCE');
        const userData = ec2.UserData.forWindows();
        const logicalId = resource.node.defaultChild.logicalId;
        // WHEN
        userData.addSignalOnExitCommand(resource);
        userData.addCommands('command1');
        // THEN
        const rendered = userData.render();
        expect(stack.resolve(logicalId)).toEqual('RESOURCE1989552F');
        expect(rendered).toEqual('<powershell>trap {\n' +
            '$success=($PSItem.Exception.Message -eq "Success")\n' +
            `cfn-signal --stack Default --resource ${logicalId} --region ${core_1.Aws.REGION} --success ($success.ToString().ToLower())\n` +
            'break\n' +
            '}\n' +
            'command1\n' +
            'throw "Success"</powershell>');
    });
    test('can create Windows with Signal Command and userDataCausesReplacement', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const userData = ec2.UserData.forWindows();
        const resource = new ec2.Instance(stack, 'RESOURCE', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
            machineImage: ec2.MachineImage.genericWindows({ ['us-east-1']: 'ami-12345678' }),
            userDataCausesReplacement: true,
            userData,
        });
        const logicalId = resource.node.defaultChild.logicalId;
        // WHEN
        userData.addSignalOnExitCommand(resource);
        userData.addCommands('command1');
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: assertions_1.Match.objectLike({
                RESOURCE1989552Fdfd505305f427919: {
                    Type: 'AWS::EC2::Instance',
                },
            }),
        });
        expect(stack.resolve(logicalId)).toEqual('RESOURCE1989552Fdfd505305f427919');
        const rendered = userData.render();
        expect(rendered).toEqual('<powershell>trap {\n' +
            '$success=($PSItem.Exception.Message -eq "Success")\n' +
            `cfn-signal --stack Default --resource ${logicalId} --region ${core_1.Aws.REGION} --success ($success.ToString().ToLower())\n` +
            'break\n' +
            '}\n' +
            'command1\n' +
            'throw "Success"</powershell>');
    });
    test('can windows userdata download S3 files', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userData = ec2.UserData.forWindows();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'test');
        const bucket2 = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket2', 'test2');
        // WHEN
        userData.addS3DownloadCommand({
            bucket,
            bucketKey: 'filename.bat',
        });
        userData.addS3DownloadCommand({
            bucket: bucket2,
            bucketKey: 'filename2.bat',
            localFile: 'c:\\test\\location\\otherScript.bat',
        });
        // THEN
        const rendered = userData.render();
        expect(rendered).toEqual('<powershell>mkdir (Split-Path -Path \'C:/temp/filename.bat\' ) -ea 0\n' +
            'Read-S3Object -BucketName \'test\' -key \'filename.bat\' -file \'C:/temp/filename.bat\' -ErrorAction Stop\n' +
            'mkdir (Split-Path -Path \'c:\\test\\location\\otherScript.bat\' ) -ea 0\n' +
            'Read-S3Object -BucketName \'test2\' -key \'filename2.bat\' -file \'c:\\test\\location\\otherScript.bat\' -ErrorAction Stop</powershell>');
    });
    test('can windows userdata download S3 files with given region', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userData = ec2.UserData.forWindows();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'test');
        const bucket2 = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket2', 'test2');
        // WHEN
        userData.addS3DownloadCommand({
            bucket,
            bucketKey: 'filename.bat',
            region: 'us-east-1',
        });
        userData.addS3DownloadCommand({
            bucket: bucket2,
            bucketKey: 'filename2.bat',
            localFile: 'c:\\test\\location\\otherScript.bat',
            region: 'us-east-1',
        });
        // THEN
        const rendered = userData.render();
        expect(rendered).toEqual('<powershell>mkdir (Split-Path -Path \'C:/temp/filename.bat\' ) -ea 0\n' +
            'Read-S3Object -BucketName \'test\' -key \'filename.bat\' -file \'C:/temp/filename.bat\' -ErrorAction Stop -Region us-east-1\n' +
            'mkdir (Split-Path -Path \'c:\\test\\location\\otherScript.bat\' ) -ea 0\n' +
            'Read-S3Object -BucketName \'test2\' -key \'filename2.bat\' -file \'c:\\test\\location\\otherScript.bat\' -ErrorAction Stop -Region us-east-1</powershell>');
    });
    test('can windows userdata execute files', () => {
        // GIVEN
        const userData = ec2.UserData.forWindows();
        // WHEN
        userData.addExecuteFileCommand({
            filePath: 'C:\\test\\filename.bat',
        });
        userData.addExecuteFileCommand({
            filePath: 'C:\\test\\filename2.bat',
            arguments: 'arg1 arg2 -arg $variable',
        });
        // THEN
        const rendered = userData.render();
        expect(rendered).toEqual('<powershell>&\'C:\\test\\filename.bat\'\n' +
            'if (!$?) { Write-Error \'Failed to execute the file "C:\\test\\filename.bat"\' -ErrorAction Stop }\n' +
            '&\'C:\\test\\filename2.bat\' arg1 arg2 -arg $variable\n' +
            'if (!$?) { Write-Error \'Failed to execute the file "C:\\test\\filename2.bat"\' -ErrorAction Stop }</powershell>');
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
        const stack = new core_1.Stack();
        const resource = new ec2.Vpc(stack, 'RESOURCE');
        const logicalId = resource.node.defaultChild.logicalId;
        // WHEN
        const userData = ec2.UserData.forLinux();
        userData.addCommands('command1');
        userData.addSignalOnExitCommand(resource);
        // THEN
        const rendered = userData.render();
        expect(stack.resolve(logicalId)).toEqual('RESOURCE1989552F');
        expect(rendered).toEqual('#!/bin/bash\n' +
            'function exitTrap(){\n' +
            'exitCode=$?\n' +
            `/opt/aws/bin/cfn-signal --stack Default --resource ${logicalId} --region ${core_1.Aws.REGION} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n` +
            '}\n' +
            'trap exitTrap EXIT\n' +
            'command1');
    });
    test('can create Linux with Signal Command and userDataCausesReplacement', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const userData = ec2.UserData.forLinux();
        const resource = new ec2.Instance(stack, 'RESOURCE', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
            machineImage: ec2.MachineImage.genericLinux({ ['us-east-1']: 'ami-12345678' }),
            userDataCausesReplacement: true,
            userData,
        });
        const logicalId = resource.node.defaultChild.logicalId;
        // WHEN
        userData.addSignalOnExitCommand(resource);
        userData.addCommands('command1');
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: assertions_1.Match.objectLike({
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
            `/opt/aws/bin/cfn-signal --stack Default --resource ${logicalId} --region ${core_1.Aws.REGION} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n` +
            '}\n' +
            'trap exitTrap EXIT\n' +
            'command1');
    });
    test('can linux userdata download S3 files', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userData = ec2.UserData.forLinux();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'test');
        const bucket2 = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket2', 'test2');
        // WHEN
        userData.addS3DownloadCommand({
            bucket,
            bucketKey: 'filename.sh',
        });
        userData.addS3DownloadCommand({
            bucket: bucket2,
            bucketKey: 'filename2.sh',
            localFile: 'c:\\test\\location\\otherScript.sh',
        });
        // THEN
        const rendered = userData.render();
        expect(rendered).toEqual('#!/bin/bash\n' +
            'mkdir -p $(dirname \'/tmp/filename.sh\')\n' +
            'aws s3 cp \'s3://test/filename.sh\' \'/tmp/filename.sh\'\n' +
            'mkdir -p $(dirname \'c:\\test\\location\\otherScript.sh\')\n' +
            'aws s3 cp \'s3://test2/filename2.sh\' \'c:\\test\\location\\otherScript.sh\'');
    });
    test('can linux userdata download S3 files from specific region', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userData = ec2.UserData.forLinux();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'test');
        const bucket2 = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket2', 'test2');
        // WHEN
        userData.addS3DownloadCommand({
            bucket,
            bucketKey: 'filename.sh',
            region: 'us-east-1',
        });
        userData.addS3DownloadCommand({
            bucket: bucket2,
            bucketKey: 'filename2.sh',
            localFile: 'c:\\test\\location\\otherScript.sh',
            region: 'us-east-1',
        });
        // THEN
        const rendered = userData.render();
        expect(rendered).toEqual('#!/bin/bash\n' +
            'mkdir -p $(dirname \'/tmp/filename.sh\')\n' +
            'aws s3 cp \'s3://test/filename.sh\' \'/tmp/filename.sh\' --region us-east-1\n' +
            'mkdir -p $(dirname \'c:\\test\\location\\otherScript.sh\')\n' +
            'aws s3 cp \'s3://test2/filename2.sh\' \'c:\\test\\location\\otherScript.sh\' --region us-east-1');
    });
    test('can linux userdata execute files', () => {
        // GIVEN
        const userData = ec2.UserData.forLinux();
        // WHEN
        userData.addExecuteFileCommand({
            filePath: '/tmp/filename.sh',
        });
        userData.addExecuteFileCommand({
            filePath: '/test/filename2.sh',
            arguments: 'arg1 arg2 -arg $variable',
        });
        // THEN
        const rendered = userData.render();
        expect(rendered).toEqual('#!/bin/bash\n' +
            'set -e\n' +
            'chmod +x \'/tmp/filename.sh\'\n' +
            '\'/tmp/filename.sh\'\n' +
            'set -e\n' +
            'chmod +x \'/test/filename2.sh\'\n' +
            '\'/test/filename2.sh\' arg1 arg2 -arg $variable');
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
        expect(() => userData.addOnExitCommands('a command goes here')).toThrow();
    });
    test('Custom user data throws when adding signal command', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const resource = new ec2.Vpc(stack, 'RESOURCE');
        // WHEN
        const userData = ec2.UserData.custom('');
        // THEN
        expect(() => userData.addSignalOnExitCommand(resource)).toThrow();
    });
    test('Custom user data throws when downloading file', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userData = ec2.UserData.custom('');
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'test');
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
        expect(() => userData.addExecuteFileCommand({
            filePath: '/tmp/filename.sh',
        })).toThrow();
    });
    test('Linux user rendering multipart headers', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
        expect(() => userData.addOnExitCommands('a command goes here')).toThrow();
    });
    test('Multipart user data throws when adding signal command', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const resource = new ec2.Vpc(stack, 'RESOURCE');
        // WHEN
        const userData = new ec2.MultipartUserData();
        // THEN
        expect(() => userData.addSignalOnExitCommand(resource)).toThrow();
    });
    test('Multipart user data throws when downloading file', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userData = new ec2.MultipartUserData();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'test');
        // WHEN
        // THEN
        expect(() => userData.addS3DownloadCommand({
            bucket,
            bucketKey: 'filename.sh',
        })).toThrow();
    });
    test('Multipart user data throws when executing file', () => {
        // GIVEN
        const userData = new ec2.MultipartUserData();
        // WHEN
        // THEN
        expect(() => userData.addExecuteFileCommand({
            filePath: '/tmp/filename.sh',
        })).toThrow();
    });
    test('can add commands to Multipart user data', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
        const stack = new core_1.Stack();
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
        const stack = new core_1.Stack();
        const resource = new ec2.Vpc(stack, 'RESOURCE');
        const innerUserData = ec2.UserData.forLinux();
        const userData = new ec2.MultipartUserData();
        // WHEN
        userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
        userData.addCommands('command1');
        userData.addSignalOnExitCommand(resource);
        // THEN
        const expectedInner = stack.resolve('#!/bin/bash\n' +
            'function exitTrap(){\n' +
            'exitCode=$?\n' +
            `/opt/aws/bin/cfn-signal --stack Default --resource RESOURCE1989552F --region ${core_1.Aws.REGION} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n` +
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
        const stack = new core_1.Stack();
        const innerUserData = ec2.UserData.forLinux();
        const userData = new ec2.MultipartUserData();
        const bucket = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket', 'test');
        const bucket2 = aws_s3_1.Bucket.fromBucketName(stack, 'testBucket2', 'test2');
        // WHEN
        userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
        userData.addS3DownloadCommand({
            bucket,
            bucketKey: 'filename.sh',
        });
        userData.addS3DownloadCommand({
            bucket: bucket2,
            bucketKey: 'filename2.sh',
            localFile: 'c:\\test\\location\\otherScript.sh',
        });
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
        const stack = new core_1.Stack();
        const innerUserData = ec2.UserData.forLinux();
        const userData = new ec2.MultipartUserData();
        // WHEN
        userData.addUserDataPart(innerUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
        userData.addExecuteFileCommand({
            filePath: '/tmp/filename.sh',
        });
        userData.addExecuteFileCommand({
            filePath: '/test/filename2.sh',
            arguments: 'arg1 arg2 -arg $variable',
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcmRhdGEudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXJkYXRhLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsNENBQXlDO0FBQ3pDLHdDQUF3RDtBQUN4RCw4QkFBOEI7QUFFOUIsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsSUFBSSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUN4QyxRQUFRO1FBRVIsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDM0MsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFN0MsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7SUFFMUUsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1FBQzlELFFBQVE7UUFDUixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRTNDLE9BQU87UUFDUCxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRWpELE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0I7WUFDM0Msc0RBQXNEO1lBQ3RELFdBQVc7WUFDWCxXQUFXO1lBQ1gsU0FBUztZQUNULEtBQUs7WUFDTCxZQUFZO1lBQ1osWUFBWTtZQUNaLDhC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QUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN4QyxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDbEIsVUFBVSxFQUFFO2dCQUNWLEVBQUU7Z0JBQ0Y7b0JBQ0U7d0JBQ0UsMEVBQTBFO3dCQUMxRSxtQkFBbUI7d0JBQ25CLEVBQUU7d0JBQ0Ysa0NBQWtDO3dCQUNsQyxtREFBbUQ7d0JBQ25ELG1DQUFtQzt3QkFDbkMsRUFBRTt3QkFDRixFQUFFO3FCQUNILENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDWjt3QkFDRSxZQUFZLEVBQUUsYUFBYTtxQkFDNUI7b0JBQ0Qsd0NBQXdDO2lCQUN6QzthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlLCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEF3cywgU3RhY2ssIENmblJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3VzZXIgZGF0YScsICgpID0+IHtcbiAgdGVzdCgnY2FuIGNyZWF0ZSBXaW5kb3dzIHVzZXIgZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gZWMyLlVzZXJEYXRhLmZvcldpbmRvd3MoKTtcbiAgICB1c2VyRGF0YS5hZGRDb21tYW5kcygnY29tbWFuZDEnLCAnY29tbWFuZDInKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IHVzZXJEYXRhLnJlbmRlcigpO1xuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCgnPHBvd2Vyc2hlbGw+Y29tbWFuZDFcXG5jb21tYW5kMjwvcG93ZXJzaGVsbD4nKTtcblxuICB9KTtcbiAgdGVzdCgnY2FuIGNyZWF0ZSBXaW5kb3dzIHVzZXIgZGF0YSB3aXRoIGNvbW1hbmRzIG9uIGV4aXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JXaW5kb3dzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoJ2NvbW1hbmQxJywgJ2NvbW1hbmQyJyk7XG4gICAgdXNlckRhdGEuYWRkT25FeGl0Q29tbWFuZHMoJ29uZXhpdDEnLCAnb25leGl0MicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gdXNlckRhdGEucmVuZGVyKCk7XG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKCc8cG93ZXJzaGVsbD50cmFwIHtcXG4nICtcbiAgICAgICAgJyRzdWNjZXNzPSgkUFNJdGVtLkV4Y2VwdGlvbi5NZXNzYWdlIC1lcSBcIlN1Y2Nlc3NcIilcXG4nICtcbiAgICAgICAgJ29uZXhpdDFcXG4nICtcbiAgICAgICAgJ29uZXhpdDJcXG4nICtcbiAgICAgICAgJ2JyZWFrXFxuJyArXG4gICAgICAgICd9XFxuJyArXG4gICAgICAgICdjb21tYW5kMVxcbicgK1xuICAgICAgICAnY29tbWFuZDJcXG4nICtcbiAgICAgICAgJ3Rocm93IFwiU3VjY2Vzc1wiPC9wb3dlcnNoZWxsPicpO1xuXG4gIH0pO1xuICB0ZXN0KCdjYW4gY3JlYXRlIFdpbmRvd3Mgd2l0aCBTaWduYWwgQ29tbWFuZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1JFU09VUkNFJyk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yV2luZG93cygpO1xuICAgIGNvbnN0IGxvZ2ljYWxJZCA9IChyZXNvdXJjZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5SZXNvdXJjZSkubG9naWNhbElkO1xuXG4gICAgLy8gV0hFTlxuICAgIHVzZXJEYXRhLmFkZFNpZ25hbE9uRXhpdENvbW1hbmQoIHJlc291cmNlICk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoJ2NvbW1hbmQxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGxvZ2ljYWxJZCkpLnRvRXF1YWwoJ1JFU09VUkNFMTk4OTU1MkYnKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJzxwb3dlcnNoZWxsPnRyYXAge1xcbicgK1xuICAgICAgICAnJHN1Y2Nlc3M9KCRQU0l0ZW0uRXhjZXB0aW9uLk1lc3NhZ2UgLWVxIFwiU3VjY2Vzc1wiKVxcbicgK1xuICAgICAgICBgY2ZuLXNpZ25hbCAtLXN0YWNrIERlZmF1bHQgLS1yZXNvdXJjZSAke2xvZ2ljYWxJZH0gLS1yZWdpb24gJHtBd3MuUkVHSU9OfSAtLXN1Y2Nlc3MgKCRzdWNjZXNzLlRvU3RyaW5nKCkuVG9Mb3dlcigpKVxcbmAgK1xuICAgICAgICAnYnJlYWtcXG4nICtcbiAgICAgICAgJ31cXG4nICtcbiAgICAgICAgJ2NvbW1hbmQxXFxuJyArXG4gICAgICAgICd0aHJvdyBcIlN1Y2Nlc3NcIjwvcG93ZXJzaGVsbD4nLFxuICAgICk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NhbiBjcmVhdGUgV2luZG93cyB3aXRoIFNpZ25hbCBDb21tYW5kIGFuZCB1c2VyRGF0YUNhdXNlc1JlcGxhY2VtZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IHVzZXJEYXRhID0gZWMyLlVzZXJEYXRhLmZvcldpbmRvd3MoKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBlYzIuSW5zdGFuY2Uoc3RhY2ssICdSRVNPVVJDRScsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5UMiwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjMi5NYWNoaW5lSW1hZ2UuZ2VuZXJpY1dpbmRvd3MoeyBbJ3VzLWVhc3QtMSddOiAnYW1pLTEyMzQ1Njc4JyB9KSxcbiAgICAgIHVzZXJEYXRhQ2F1c2VzUmVwbGFjZW1lbnQ6IHRydWUsXG4gICAgICB1c2VyRGF0YSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGxvZ2ljYWxJZCA9IChyZXNvdXJjZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5SZXNvdXJjZSkubG9naWNhbElkO1xuXG4gICAgLy8gV0hFTlxuICAgIHVzZXJEYXRhLmFkZFNpZ25hbE9uRXhpdENvbW1hbmQoIHJlc291cmNlICk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoJ2NvbW1hbmQxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgUkVTT1VSQ0UxOTg5NTUyRmRmZDUwNTMwNWY0Mjc5MTk6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpFQzI6Okluc3RhbmNlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGxvZ2ljYWxJZCkpLnRvRXF1YWwoJ1JFU09VUkNFMTk4OTU1MkZkZmQ1MDUzMDVmNDI3OTE5Jyk7XG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJzxwb3dlcnNoZWxsPnRyYXAge1xcbicgK1xuICAgICAgICAnJHN1Y2Nlc3M9KCRQU0l0ZW0uRXhjZXB0aW9uLk1lc3NhZ2UgLWVxIFwiU3VjY2Vzc1wiKVxcbicgK1xuICAgICAgICBgY2ZuLXNpZ25hbCAtLXN0YWNrIERlZmF1bHQgLS1yZXNvdXJjZSAke2xvZ2ljYWxJZH0gLS1yZWdpb24gJHtBd3MuUkVHSU9OfSAtLXN1Y2Nlc3MgKCRzdWNjZXNzLlRvU3RyaW5nKCkuVG9Mb3dlcigpKVxcbmAgK1xuICAgICAgICAnYnJlYWtcXG4nICtcbiAgICAgICAgJ31cXG4nICtcbiAgICAgICAgJ2NvbW1hbmQxXFxuJyArXG4gICAgICAgICd0aHJvdyBcIlN1Y2Nlc3NcIjwvcG93ZXJzaGVsbD4nLFxuICAgICk7XG4gIH0pO1xuICB0ZXN0KCdjYW4gd2luZG93cyB1c2VyZGF0YSBkb3dubG9hZCBTMyBmaWxlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yV2luZG93cygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0JywgJ3Rlc3QnICk7XG4gICAgY29uc3QgYnVja2V0MiA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0MicsICd0ZXN0MicgKTtcblxuICAgIC8vIFdIRU5cbiAgICB1c2VyRGF0YS5hZGRTM0Rvd25sb2FkQ29tbWFuZCh7XG4gICAgICBidWNrZXQsXG4gICAgICBidWNrZXRLZXk6ICdmaWxlbmFtZS5iYXQnLFxuICAgIH0gKTtcbiAgICB1c2VyRGF0YS5hZGRTM0Rvd25sb2FkQ29tbWFuZCh7XG4gICAgICBidWNrZXQ6IGJ1Y2tldDIsXG4gICAgICBidWNrZXRLZXk6ICdmaWxlbmFtZTIuYmF0JyxcbiAgICAgIGxvY2FsRmlsZTogJ2M6XFxcXHRlc3RcXFxcbG9jYXRpb25cXFxcb3RoZXJTY3JpcHQuYmF0JyxcbiAgICB9ICk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJzxwb3dlcnNoZWxsPm1rZGlyIChTcGxpdC1QYXRoIC1QYXRoIFxcJ0M6L3RlbXAvZmlsZW5hbWUuYmF0XFwnICkgLWVhIDBcXG4nICtcbiAgICAgICdSZWFkLVMzT2JqZWN0IC1CdWNrZXROYW1lIFxcJ3Rlc3RcXCcgLWtleSBcXCdmaWxlbmFtZS5iYXRcXCcgLWZpbGUgXFwnQzovdGVtcC9maWxlbmFtZS5iYXRcXCcgLUVycm9yQWN0aW9uIFN0b3BcXG4nICtcbiAgICAgICdta2RpciAoU3BsaXQtUGF0aCAtUGF0aCBcXCdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LmJhdFxcJyApIC1lYSAwXFxuJyArXG4gICAgICAnUmVhZC1TM09iamVjdCAtQnVja2V0TmFtZSBcXCd0ZXN0MlxcJyAta2V5IFxcJ2ZpbGVuYW1lMi5iYXRcXCcgLWZpbGUgXFwnYzpcXFxcdGVzdFxcXFxsb2NhdGlvblxcXFxvdGhlclNjcmlwdC5iYXRcXCcgLUVycm9yQWN0aW9uIFN0b3A8L3Bvd2Vyc2hlbGw+JyxcbiAgICApO1xuXG4gIH0pO1xuICB0ZXN0KCdjYW4gd2luZG93cyB1c2VyZGF0YSBkb3dubG9hZCBTMyBmaWxlcyB3aXRoIGdpdmVuIHJlZ2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yV2luZG93cygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0JywgJ3Rlc3QnICk7XG4gICAgY29uc3QgYnVja2V0MiA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0MicsICd0ZXN0MicgKTtcblxuICAgIC8vIFdIRU5cbiAgICB1c2VyRGF0YS5hZGRTM0Rvd25sb2FkQ29tbWFuZCh7XG4gICAgICBidWNrZXQsXG4gICAgICBidWNrZXRLZXk6ICdmaWxlbmFtZS5iYXQnLFxuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9ICk7XG4gICAgdXNlckRhdGEuYWRkUzNEb3dubG9hZENvbW1hbmQoe1xuICAgICAgYnVja2V0OiBidWNrZXQyLFxuICAgICAgYnVja2V0S2V5OiAnZmlsZW5hbWUyLmJhdCcsXG4gICAgICBsb2NhbEZpbGU6ICdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LmJhdCcsXG4gICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgIH0gKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IHVzZXJEYXRhLnJlbmRlcigpO1xuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCgnPHBvd2Vyc2hlbGw+bWtkaXIgKFNwbGl0LVBhdGggLVBhdGggXFwnQzovdGVtcC9maWxlbmFtZS5iYXRcXCcgKSAtZWEgMFxcbicgK1xuICAgICAgJ1JlYWQtUzNPYmplY3QgLUJ1Y2tldE5hbWUgXFwndGVzdFxcJyAta2V5IFxcJ2ZpbGVuYW1lLmJhdFxcJyAtZmlsZSBcXCdDOi90ZW1wL2ZpbGVuYW1lLmJhdFxcJyAtRXJyb3JBY3Rpb24gU3RvcCAtUmVnaW9uIHVzLWVhc3QtMVxcbicgK1xuICAgICAgJ21rZGlyIChTcGxpdC1QYXRoIC1QYXRoIFxcJ2M6XFxcXHRlc3RcXFxcbG9jYXRpb25cXFxcb3RoZXJTY3JpcHQuYmF0XFwnICkgLWVhIDBcXG4nICtcbiAgICAgICdSZWFkLVMzT2JqZWN0IC1CdWNrZXROYW1lIFxcJ3Rlc3QyXFwnIC1rZXkgXFwnZmlsZW5hbWUyLmJhdFxcJyAtZmlsZSBcXCdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LmJhdFxcJyAtRXJyb3JBY3Rpb24gU3RvcCAtUmVnaW9uIHVzLWVhc3QtMTwvcG93ZXJzaGVsbD4nLFxuICAgICk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NhbiB3aW5kb3dzIHVzZXJkYXRhIGV4ZWN1dGUgZmlsZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JXaW5kb3dzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgdXNlckRhdGEuYWRkRXhlY3V0ZUZpbGVDb21tYW5kKHtcbiAgICAgIGZpbGVQYXRoOiAnQzpcXFxcdGVzdFxcXFxmaWxlbmFtZS5iYXQnLFxuICAgIH0gKTtcbiAgICB1c2VyRGF0YS5hZGRFeGVjdXRlRmlsZUNvbW1hbmQoe1xuICAgICAgZmlsZVBhdGg6ICdDOlxcXFx0ZXN0XFxcXGZpbGVuYW1lMi5iYXQnLFxuICAgICAgYXJndW1lbnRzOiAnYXJnMSBhcmcyIC1hcmcgJHZhcmlhYmxlJyxcbiAgICB9ICk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJzxwb3dlcnNoZWxsPiZcXCdDOlxcXFx0ZXN0XFxcXGZpbGVuYW1lLmJhdFxcJ1xcbicgK1xuICAgICAgJ2lmICghJD8pIHsgV3JpdGUtRXJyb3IgXFwnRmFpbGVkIHRvIGV4ZWN1dGUgdGhlIGZpbGUgXCJDOlxcXFx0ZXN0XFxcXGZpbGVuYW1lLmJhdFwiXFwnIC1FcnJvckFjdGlvbiBTdG9wIH1cXG4nICtcbiAgICAgICcmXFwnQzpcXFxcdGVzdFxcXFxmaWxlbmFtZTIuYmF0XFwnIGFyZzEgYXJnMiAtYXJnICR2YXJpYWJsZVxcbicgK1xuICAgICAgJ2lmICghJD8pIHsgV3JpdGUtRXJyb3IgXFwnRmFpbGVkIHRvIGV4ZWN1dGUgdGhlIGZpbGUgXCJDOlxcXFx0ZXN0XFxcXGZpbGVuYW1lMi5iYXRcIlxcJyAtRXJyb3JBY3Rpb24gU3RvcCB9PC9wb3dlcnNoZWxsPicsXG4gICAgKTtcblxuICB9KTtcbiAgdGVzdCgnY2FuIHBlcnNpc3Qgd2luZG93cyB1c2VyZGF0YScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yV2luZG93cyh7IHBlcnNpc3Q6IHRydWUgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJzxwb3dlcnNoZWxsPjwvcG93ZXJzaGVsbD48cGVyc2lzdD50cnVlPC9wZXJzaXN0PicpO1xuICB9KTtcbiAgdGVzdCgnY2FuIGNyZWF0ZSBMaW51eCB1c2VyIGRhdGEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIHVzZXJEYXRhLmFkZENvbW1hbmRzKCdjb21tYW5kMScsICdjb21tYW5kMicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gdXNlckRhdGEucmVuZGVyKCk7XG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKCcjIS9iaW4vYmFzaFxcbmNvbW1hbmQxXFxuY29tbWFuZDInKTtcblxuICB9KTtcbiAgdGVzdCgnY2FuIGNyZWF0ZSBMaW51eCB1c2VyIGRhdGEgd2l0aCBjb21tYW5kcyBvbiBleGl0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcblxuICAgIC8vIFdIRU5cbiAgICB1c2VyRGF0YS5hZGRDb21tYW5kcygnY29tbWFuZDEnLCAnY29tbWFuZDInKTtcbiAgICB1c2VyRGF0YS5hZGRPbkV4aXRDb21tYW5kcygnb25leGl0MScsICdvbmV4aXQyJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJyMhL2Jpbi9iYXNoXFxuJyArXG4gICAgICAgICdmdW5jdGlvbiBleGl0VHJhcCgpe1xcbicgK1xuICAgICAgICAnZXhpdENvZGU9JD9cXG4nICtcbiAgICAgICAgJ29uZXhpdDFcXG4nICtcbiAgICAgICAgJ29uZXhpdDJcXG4nICtcbiAgICAgICAgJ31cXG4nICtcbiAgICAgICAgJ3RyYXAgZXhpdFRyYXAgRVhJVFxcbicgK1xuICAgICAgICAnY29tbWFuZDFcXG4nICtcbiAgICAgICAgJ2NvbW1hbmQyJyk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NhbiBjcmVhdGUgTGludXggd2l0aCBTaWduYWwgQ29tbWFuZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1JFU09VUkNFJyk7XG4gICAgY29uc3QgbG9naWNhbElkID0gKHJlc291cmNlLm5vZGUuZGVmYXVsdENoaWxkIGFzIENmblJlc291cmNlKS5sb2dpY2FsSWQ7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICB1c2VyRGF0YS5hZGRDb21tYW5kcygnY29tbWFuZDEnKTtcbiAgICB1c2VyRGF0YS5hZGRTaWduYWxPbkV4aXRDb21tYW5kKCByZXNvdXJjZSApO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gdXNlckRhdGEucmVuZGVyKCk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUobG9naWNhbElkKSkudG9FcXVhbCgnUkVTT1VSQ0UxOTg5NTUyRicpO1xuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCgnIyEvYmluL2Jhc2hcXG4nICtcbiAgICAgICAgJ2Z1bmN0aW9uIGV4aXRUcmFwKCl7XFxuJyArXG4gICAgICAgICdleGl0Q29kZT0kP1xcbicgK1xuICAgICAgICBgL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1zdGFjayBEZWZhdWx0IC0tcmVzb3VyY2UgJHtsb2dpY2FsSWR9IC0tcmVnaW9uICR7QXdzLlJFR0lPTn0gLWUgJGV4aXRDb2RlIHx8IGVjaG8gXFwnRmFpbGVkIHRvIHNlbmQgQ2xvdWRmb3JtYXRpb24gU2lnbmFsXFwnXFxuYCArXG4gICAgICAgICd9XFxuJyArXG4gICAgICAgICd0cmFwIGV4aXRUcmFwIEVYSVRcXG4nICtcbiAgICAgICAgJ2NvbW1hbmQxJyk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NhbiBjcmVhdGUgTGludXggd2l0aCBTaWduYWwgQ29tbWFuZCBhbmQgdXNlckRhdGFDYXVzZXNSZXBsYWNlbWVudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IGVjMi5JbnN0YW5jZShzdGFjaywgJ1JFU09VUkNFJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQyLCBlYzIuSW5zdGFuY2VTaXplLkxBUkdFKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogZWMyLk1hY2hpbmVJbWFnZS5nZW5lcmljTGludXgoeyBbJ3VzLWVhc3QtMSddOiAnYW1pLTEyMzQ1Njc4JyB9KSxcbiAgICAgIHVzZXJEYXRhQ2F1c2VzUmVwbGFjZW1lbnQ6IHRydWUsXG4gICAgICB1c2VyRGF0YSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGxvZ2ljYWxJZCA9IChyZXNvdXJjZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5SZXNvdXJjZSkubG9naWNhbElkO1xuXG4gICAgLy8gV0hFTlxuICAgIHVzZXJEYXRhLmFkZFNpZ25hbE9uRXhpdENvbW1hbmQoIHJlc291cmNlICk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoJ2NvbW1hbmQxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgUkVTT1VSQ0UxOTg5NTUyRjc0YTI0ZWY0ZmJjODk0MjI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpFQzI6Okluc3RhbmNlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGxvZ2ljYWxJZCkpLnRvRXF1YWwoJ1JFU09VUkNFMTk4OTU1MkY3NGEyNGVmNGZiYzg5NDIyJyk7XG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJyMhL2Jpbi9iYXNoXFxuJyArXG4gICAgICAgICdmdW5jdGlvbiBleGl0VHJhcCgpe1xcbicgK1xuICAgICAgICAnZXhpdENvZGU9JD9cXG4nICtcbiAgICAgICAgYC9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tc3RhY2sgRGVmYXVsdCAtLXJlc291cmNlICR7bG9naWNhbElkfSAtLXJlZ2lvbiAke0F3cy5SRUdJT059IC1lICRleGl0Q29kZSB8fCBlY2hvIFxcJ0ZhaWxlZCB0byBzZW5kIENsb3VkZm9ybWF0aW9uIFNpZ25hbFxcJ1xcbmAgK1xuICAgICAgICAnfVxcbicgK1xuICAgICAgICAndHJhcCBleGl0VHJhcCBFWElUXFxuJyArXG4gICAgICAgICdjb21tYW5kMScpO1xuICB9KTtcbiAgdGVzdCgnY2FuIGxpbnV4IHVzZXJkYXRhIGRvd25sb2FkIFMzIGZpbGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0JywgJ3Rlc3QnICk7XG4gICAgY29uc3QgYnVja2V0MiA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0MicsICd0ZXN0MicgKTtcblxuICAgIC8vIFdIRU5cbiAgICB1c2VyRGF0YS5hZGRTM0Rvd25sb2FkQ29tbWFuZCh7XG4gICAgICBidWNrZXQsXG4gICAgICBidWNrZXRLZXk6ICdmaWxlbmFtZS5zaCcsXG4gICAgfSApO1xuICAgIHVzZXJEYXRhLmFkZFMzRG93bmxvYWRDb21tYW5kKHtcbiAgICAgIGJ1Y2tldDogYnVja2V0MixcbiAgICAgIGJ1Y2tldEtleTogJ2ZpbGVuYW1lMi5zaCcsXG4gICAgICBsb2NhbEZpbGU6ICdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LnNoJyxcbiAgICB9ICk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJyMhL2Jpbi9iYXNoXFxuJyArXG4gICAgICAnbWtkaXIgLXAgJChkaXJuYW1lIFxcJy90bXAvZmlsZW5hbWUuc2hcXCcpXFxuJyArXG4gICAgICAnYXdzIHMzIGNwIFxcJ3MzOi8vdGVzdC9maWxlbmFtZS5zaFxcJyBcXCcvdG1wL2ZpbGVuYW1lLnNoXFwnXFxuJyArXG4gICAgICAnbWtkaXIgLXAgJChkaXJuYW1lIFxcJ2M6XFxcXHRlc3RcXFxcbG9jYXRpb25cXFxcb3RoZXJTY3JpcHQuc2hcXCcpXFxuJyArXG4gICAgICAnYXdzIHMzIGNwIFxcJ3MzOi8vdGVzdDIvZmlsZW5hbWUyLnNoXFwnIFxcJ2M6XFxcXHRlc3RcXFxcbG9jYXRpb25cXFxcb3RoZXJTY3JpcHQuc2hcXCcnLFxuICAgICk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NhbiBsaW51eCB1c2VyZGF0YSBkb3dubG9hZCBTMyBmaWxlcyBmcm9tIHNwZWNpZmljIHJlZ2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICBjb25zdCBidWNrZXQgPSBCdWNrZXQuZnJvbUJ1Y2tldE5hbWUoIHN0YWNrLCAndGVzdEJ1Y2tldCcsICd0ZXN0JyApO1xuICAgIGNvbnN0IGJ1Y2tldDIgPSBCdWNrZXQuZnJvbUJ1Y2tldE5hbWUoIHN0YWNrLCAndGVzdEJ1Y2tldDInLCAndGVzdDInICk7XG5cbiAgICAvLyBXSEVOXG4gICAgdXNlckRhdGEuYWRkUzNEb3dubG9hZENvbW1hbmQoe1xuICAgICAgYnVja2V0LFxuICAgICAgYnVja2V0S2V5OiAnZmlsZW5hbWUuc2gnLFxuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9ICk7XG4gICAgdXNlckRhdGEuYWRkUzNEb3dubG9hZENvbW1hbmQoe1xuICAgICAgYnVja2V0OiBidWNrZXQyLFxuICAgICAgYnVja2V0S2V5OiAnZmlsZW5hbWUyLnNoJyxcbiAgICAgIGxvY2FsRmlsZTogJ2M6XFxcXHRlc3RcXFxcbG9jYXRpb25cXFxcb3RoZXJTY3JpcHQuc2gnLFxuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9ICk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJyMhL2Jpbi9iYXNoXFxuJyArXG4gICAgICAnbWtkaXIgLXAgJChkaXJuYW1lIFxcJy90bXAvZmlsZW5hbWUuc2hcXCcpXFxuJyArXG4gICAgICAnYXdzIHMzIGNwIFxcJ3MzOi8vdGVzdC9maWxlbmFtZS5zaFxcJyBcXCcvdG1wL2ZpbGVuYW1lLnNoXFwnIC0tcmVnaW9uIHVzLWVhc3QtMVxcbicgK1xuICAgICAgJ21rZGlyIC1wICQoZGlybmFtZSBcXCdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LnNoXFwnKVxcbicgK1xuICAgICAgJ2F3cyBzMyBjcCBcXCdzMzovL3Rlc3QyL2ZpbGVuYW1lMi5zaFxcJyBcXCdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LnNoXFwnIC0tcmVnaW9uIHVzLWVhc3QtMScsXG4gICAgKTtcblxuICB9KTtcbiAgdGVzdCgnY2FuIGxpbnV4IHVzZXJkYXRhIGV4ZWN1dGUgZmlsZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIHVzZXJEYXRhLmFkZEV4ZWN1dGVGaWxlQ29tbWFuZCh7XG4gICAgICBmaWxlUGF0aDogJy90bXAvZmlsZW5hbWUuc2gnLFxuICAgIH0gKTtcbiAgICB1c2VyRGF0YS5hZGRFeGVjdXRlRmlsZUNvbW1hbmQoe1xuICAgICAgZmlsZVBhdGg6ICcvdGVzdC9maWxlbmFtZTIuc2gnLFxuICAgICAgYXJndW1lbnRzOiAnYXJnMSBhcmcyIC1hcmcgJHZhcmlhYmxlJyxcbiAgICB9ICk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJyMhL2Jpbi9iYXNoXFxuJyArXG4gICAgICAnc2V0IC1lXFxuJyArXG4gICAgICAnY2htb2QgK3ggXFwnL3RtcC9maWxlbmFtZS5zaFxcJ1xcbicgK1xuICAgICAgJ1xcJy90bXAvZmlsZW5hbWUuc2hcXCdcXG4nICtcbiAgICAgICdzZXQgLWVcXG4nICtcbiAgICAgICdjaG1vZCAreCBcXCcvdGVzdC9maWxlbmFtZTIuc2hcXCdcXG4nICtcbiAgICAgICdcXCcvdGVzdC9maWxlbmFtZTIuc2hcXCcgYXJnMSBhcmcyIC1hcmcgJHZhcmlhYmxlJyxcbiAgICApO1xuXG4gIH0pO1xuICB0ZXN0KCdjYW4gY3JlYXRlIEN1c3RvbSB1c2VyIGRhdGEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5jdXN0b20oJ1NvbWVcXG5tdWx0aWxpbmVcXG5jb250ZW50Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSB1c2VyRGF0YS5yZW5kZXIoKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoJ1NvbWVcXG5tdWx0aWxpbmVcXG5jb250ZW50Jyk7XG5cbiAgfSk7XG4gIHRlc3QoJ0N1c3RvbSB1c2VyIGRhdGEgdGhyb3dzIHdoZW4gYWRkaW5nIG9uIGV4aXQgY29tbWFuZHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuY3VzdG9tKCcnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gdXNlckRhdGEuYWRkT25FeGl0Q29tbWFuZHMoICdhIGNvbW1hbmQgZ29lcyBoZXJlJyApKS50b1Rocm93KCk7XG5cbiAgfSk7XG4gIHRlc3QoJ0N1c3RvbSB1c2VyIGRhdGEgdGhyb3dzIHdoZW4gYWRkaW5nIHNpZ25hbCBjb21tYW5kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnUkVTT1VSQ0UnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5jdXN0b20oJycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB1c2VyRGF0YS5hZGRTaWduYWxPbkV4aXRDb21tYW5kKCByZXNvdXJjZSApKS50b1Rocm93KCk7XG5cbiAgfSk7XG4gIHRlc3QoJ0N1c3RvbSB1c2VyIGRhdGEgdGhyb3dzIHdoZW4gZG93bmxvYWRpbmcgZmlsZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuY3VzdG9tKCcnKTtcbiAgICBjb25zdCBidWNrZXQgPSBCdWNrZXQuZnJvbUJ1Y2tldE5hbWUoIHN0YWNrLCAndGVzdEJ1Y2tldCcsICd0ZXN0JyApO1xuICAgIC8vIFdIRU5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHVzZXJEYXRhLmFkZFMzRG93bmxvYWRDb21tYW5kKHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIGJ1Y2tldEtleTogJ2ZpbGVuYW1lLnNoJyxcbiAgICB9KSkudG9UaHJvdygpO1xuXG4gIH0pO1xuICB0ZXN0KCdDdXN0b20gdXNlciBkYXRhIHRocm93cyB3aGVuIGV4ZWN1dGluZyBmaWxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuY3VzdG9tKCcnKTtcbiAgICAvLyBXSEVOXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PlxuICAgICAgdXNlckRhdGEuYWRkRXhlY3V0ZUZpbGVDb21tYW5kKHtcbiAgICAgICAgZmlsZVBhdGg6ICcvdG1wL2ZpbGVuYW1lLnNoJyxcbiAgICAgIH0pKS50b1Rocm93KCk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnTGludXggdXNlciByZW5kZXJpbmcgbXVsdGlwYXJ0IGhlYWRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxpbnV4VXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICBsaW51eFVzZXJEYXRhLmFkZENvbW1hbmRzKCdlY2hvIFwiSGVsbG8gd29ybGRcIicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGRlZmF1bHRSZW5kZXIxID0gZWMyLk11bHRpcGFydEJvZHkuZnJvbVVzZXJEYXRhKGxpbnV4VXNlckRhdGEpO1xuICAgIGNvbnN0IGRlZmF1bHRSZW5kZXIyID0gZWMyLk11bHRpcGFydEJvZHkuZnJvbVVzZXJEYXRhKGxpbnV4VXNlckRhdGEsICd0ZXh0L2Nsb3VkLWJvb3Rob29rOyBjaGFyc2V0PVxcXCJ1dGYtOFxcXCInKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShkZWZhdWx0UmVuZGVyMS5yZW5kZXJCb2R5UGFydCgpKSkudG9FcXVhbChbXG4gICAgICAnQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9XFxcInV0Zi04XFxcIicsXG4gICAgICAnQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogYmFzZTY0JyxcbiAgICAgICcnLFxuICAgICAgeyAnRm46OkJhc2U2NCc6ICcjIS9iaW4vYmFzaFxcbmVjaG8gXFxcIkhlbGxvIHdvcmxkXFxcIicgfSxcbiAgICBdKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShkZWZhdWx0UmVuZGVyMi5yZW5kZXJCb2R5UGFydCgpKSkudG9FcXVhbChbXG4gICAgICAnQ29udGVudC1UeXBlOiB0ZXh0L2Nsb3VkLWJvb3Rob29rOyBjaGFyc2V0PVxcXCJ1dGYtOFxcXCInLFxuICAgICAgJ0NvbnRlbnQtVHJhbnNmZXItRW5jb2Rpbmc6IGJhc2U2NCcsXG4gICAgICAnJyxcbiAgICAgIHsgJ0ZuOjpCYXNlNjQnOiAnIyEvYmluL2Jhc2hcXG5lY2hvIFxcXCJIZWxsbyB3b3JsZFxcXCInIH0sXG4gICAgXSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdEZWZhdWx0IHBhcnRzIHNlcGFyYXRvciB1c2VkLCBpZiBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgbXVsdGlwYXJ0ID0gbmV3IGVjMi5NdWx0aXBhcnRVc2VyRGF0YSgpO1xuXG4gICAgbXVsdGlwYXJ0LmFkZFBhcnQoZWMyLk11bHRpcGFydEJvZHkuZnJvbVJhd0JvZHkoe1xuICAgICAgY29udGVudFR5cGU6ICdDVCcsXG4gICAgfSkpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG91dCA9IG11bHRpcGFydC5yZW5kZXIoKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3Qob3V0KS50b0VxdWFsKFtcbiAgICAgICdDb250ZW50LVR5cGU6IG11bHRpcGFydC9taXhlZDsgYm91bmRhcnk9XFxcIitBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PVxcXCInLFxuICAgICAgJ01JTUUtVmVyc2lvbjogMS4wJyxcbiAgICAgICcnLFxuICAgICAgJy0tK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09JyxcbiAgICAgICdDb250ZW50LVR5cGU6IENUJyxcbiAgICAgICcnLFxuICAgICAgJy0tK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09LS0nLFxuICAgICAgJycsXG4gICAgXS5qb2luKCdcXG4nKSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdOb24tZGVmYXVsdCBwYXJ0cyBzZXBhcmF0b3IgdXNlZCwgaWYgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG11bHRpcGFydCA9IG5ldyBlYzIuTXVsdGlwYXJ0VXNlckRhdGEoe1xuICAgICAgcGFydHNTZXBhcmF0b3I6ICcvLycsXG4gICAgfSk7XG5cbiAgICBtdWx0aXBhcnQuYWRkUGFydChlYzIuTXVsdGlwYXJ0Qm9keS5mcm9tUmF3Qm9keSh7XG4gICAgICBjb250ZW50VHlwZTogJ0NUJyxcbiAgICB9KSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgb3V0ID0gbXVsdGlwYXJ0LnJlbmRlcigpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdChvdXQpLnRvRXF1YWwoW1xuICAgICAgJ0NvbnRlbnQtVHlwZTogbXVsdGlwYXJ0L21peGVkOyBib3VuZGFyeT1cXFwiLy9cXFwiJyxcbiAgICAgICdNSU1FLVZlcnNpb246IDEuMCcsXG4gICAgICAnJyxcbiAgICAgICctLS8vJyxcbiAgICAgICdDb250ZW50LVR5cGU6IENUJyxcbiAgICAgICcnLFxuICAgICAgJy0tLy8tLScsXG4gICAgICAnJyxcbiAgICBdLmpvaW4oJ1xcbicpKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ011bHRpcGFydCBzZXBhcmF0b3IgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICAvLyBIYXBweSBwYXRoXG4gICAgbmV3IGVjMi5NdWx0aXBhcnRVc2VyRGF0YSgpO1xuICAgIG5ldyBlYzIuTXVsdGlwYXJ0VXNlckRhdGEoe1xuICAgICAgcGFydHNTZXBhcmF0b3I6ICdhLXpBLVowLTkoKSssLS4vOj0/JyxcbiAgICB9KTtcblxuICAgIFsnICcsICdcXG4nLCAnXFxyJywgJ1snLCAnXScsICc8JywgJz4nLCAn6YGV44GGJ10uZm9yRWFjaChzID0+IGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgZWMyLk11bHRpcGFydFVzZXJEYXRhKHtcbiAgICAgICAgcGFydHNTZXBhcmF0b3I6IHMsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9JbnZhbGlkIGNoYXJhY3RlcnMgaW4gc2VwYXJhdG9yLykpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnTXVsdGlwYXJ0IHVzZXIgZGF0YSB0aHJvd3Mgd2hlbiBhZGRpbmcgb24gZXhpdCBjb21tYW5kcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IG5ldyBlYzIuTXVsdGlwYXJ0VXNlckRhdGEoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gdXNlckRhdGEuYWRkT25FeGl0Q29tbWFuZHMoICdhIGNvbW1hbmQgZ29lcyBoZXJlJyApKS50b1Rocm93KCk7XG5cbiAgfSk7XG4gIHRlc3QoJ011bHRpcGFydCB1c2VyIGRhdGEgdGhyb3dzIHdoZW4gYWRkaW5nIHNpZ25hbCBjb21tYW5kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnUkVTT1VSQ0UnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IG5ldyBlYzIuTXVsdGlwYXJ0VXNlckRhdGEoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gdXNlckRhdGEuYWRkU2lnbmFsT25FeGl0Q29tbWFuZCggcmVzb3VyY2UgKSkudG9UaHJvdygpO1xuXG4gIH0pO1xuICB0ZXN0KCdNdWx0aXBhcnQgdXNlciBkYXRhIHRocm93cyB3aGVuIGRvd25sb2FkaW5nIGZpbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHVzZXJEYXRhID0gbmV3IGVjMi5NdWx0aXBhcnRVc2VyRGF0YSgpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0JywgJ3Rlc3QnICk7XG4gICAgLy8gV0hFTlxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gdXNlckRhdGEuYWRkUzNEb3dubG9hZENvbW1hbmQoe1xuICAgICAgYnVja2V0LFxuICAgICAgYnVja2V0S2V5OiAnZmlsZW5hbWUuc2gnLFxuICAgIH0gKSkudG9UaHJvdygpO1xuXG4gIH0pO1xuICB0ZXN0KCdNdWx0aXBhcnQgdXNlciBkYXRhIHRocm93cyB3aGVuIGV4ZWN1dGluZyBmaWxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBuZXcgZWMyLk11bHRpcGFydFVzZXJEYXRhKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PlxuICAgICAgdXNlckRhdGEuYWRkRXhlY3V0ZUZpbGVDb21tYW5kKHtcbiAgICAgICAgZmlsZVBhdGg6ICcvdG1wL2ZpbGVuYW1lLnNoJyxcbiAgICAgIH0gKSkudG9UaHJvdygpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgY29tbWFuZHMgdG8gTXVsdGlwYXJ0IHVzZXIgZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgaW5uZXJVc2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIGNvbnN0IHVzZXJEYXRhID0gbmV3IGVjMi5NdWx0aXBhcnRVc2VyRGF0YSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIHVzZXJEYXRhLmFkZFVzZXJEYXRhUGFydChpbm5lclVzZXJEYXRhLCBlYzIuTXVsdGlwYXJ0Qm9keS5TSEVMTF9TQ1JJUFQsIHRydWUpO1xuICAgIHVzZXJEYXRhLmFkZENvbW1hbmRzKCdjb21tYW5kMScsICdjb21tYW5kMicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGV4cGVjdGVkSW5uZXIgPSAnIyEvYmluL2Jhc2hcXG5jb21tYW5kMVxcbmNvbW1hbmQyJztcbiAgICBjb25zdCByZW5kZXJlZCA9IGlubmVyVXNlckRhdGEucmVuZGVyKCk7XG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKGV4cGVjdGVkSW5uZXIpO1xuICAgIGNvbnN0IG91dCA9IHN0YWNrLnJlc29sdmUodXNlckRhdGEucmVuZGVyKCkpO1xuICAgIGV4cGVjdChvdXQpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGU6IG11bHRpcGFydC9taXhlZDsgYm91bmRhcnk9XCIrQVdTK0NESytVc2VyK0RhdGErU2VwYXJhdG9yPT1cIicsXG4gICAgICAgICAgICAnTUlNRS1WZXJzaW9uOiAxLjAnLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnLS0rQVdTK0NESytVc2VyK0RhdGErU2VwYXJhdG9yPT0nLFxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZTogdGV4dC94LXNoZWxsc2NyaXB0OyBjaGFyc2V0PVwidXRmLThcIicsXG4gICAgICAgICAgICAnQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogYmFzZTY0JyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgXS5qb2luKCdcXG4nKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkJhc2U2NCc6IGV4cGVjdGVkSW5uZXIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnXFxuLS0rQVdTK0NESytVc2VyK0RhdGErU2VwYXJhdG9yPT0tLVxcbicsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gIH0pO1xuICB0ZXN0KCdjYW4gYWRkIGNvbW1hbmRzIG9uIGV4aXQgdG8gTXVsdGlwYXJ0IHVzZXIgZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgaW5uZXJVc2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIGNvbnN0IHVzZXJEYXRhID0gbmV3IGVjMi5NdWx0aXBhcnRVc2VyRGF0YSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIHVzZXJEYXRhLmFkZFVzZXJEYXRhUGFydChpbm5lclVzZXJEYXRhLCBlYzIuTXVsdGlwYXJ0Qm9keS5TSEVMTF9TQ1JJUFQsIHRydWUpO1xuICAgIHVzZXJEYXRhLmFkZENvbW1hbmRzKCdjb21tYW5kMScsICdjb21tYW5kMicpO1xuICAgIHVzZXJEYXRhLmFkZE9uRXhpdENvbW1hbmRzKCdvbmV4aXQxJywgJ29uZXhpdDInKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBleHBlY3RlZElubmVyID0gJyMhL2Jpbi9iYXNoXFxuJyArXG4gICAgJ2Z1bmN0aW9uIGV4aXRUcmFwKCl7XFxuJyArXG4gICAgJ2V4aXRDb2RlPSQ/XFxuJyArXG4gICAgJ29uZXhpdDFcXG4nICtcbiAgICAnb25leGl0MlxcbicgK1xuICAgICd9XFxuJyArXG4gICAgJ3RyYXAgZXhpdFRyYXAgRVhJVFxcbicgK1xuICAgICdjb21tYW5kMVxcbicgK1xuICAgICdjb21tYW5kMic7XG4gICAgY29uc3QgcmVuZGVyZWQgPSBzdGFjay5yZXNvbHZlKGlubmVyVXNlckRhdGEucmVuZGVyKCkpO1xuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbChleHBlY3RlZElubmVyKTtcbiAgICBjb25zdCBvdXQgPSBzdGFjay5yZXNvbHZlKHVzZXJEYXRhLnJlbmRlcigpKTtcbiAgICBleHBlY3Qob3V0KS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PVwiK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09XCInLFxuICAgICAgICAgICAgJ01JTUUtVmVyc2lvbjogMS4wJyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgJy0tK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09JyxcbiAgICAgICAgICAgICdDb250ZW50LVR5cGU6IHRleHQveC1zaGVsbHNjcmlwdDsgY2hhcnNldD1cInV0Zi04XCInLFxuICAgICAgICAgICAgJ0NvbnRlbnQtVHJhbnNmZXItRW5jb2Rpbmc6IGJhc2U2NCcsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgIF0uam9pbignXFxuJyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpCYXNlNjQnOiBleHBlY3RlZElubmVyLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1xcbi0tK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09LS1cXG4nLFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICB9KTtcblxuICB9KTtcbiAgdGVzdCgnY2FuIGFkZCBTaWduYWwgQ29tbWFuZCB0byBNdWx0aXBhcnQgdXNlciBkYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnUkVTT1VSQ0UnKTtcbiAgICBjb25zdCBpbm5lclVzZXJEYXRhID0gZWMyLlVzZXJEYXRhLmZvckxpbnV4KCk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBuZXcgZWMyLk11bHRpcGFydFVzZXJEYXRhKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgdXNlckRhdGEuYWRkVXNlckRhdGFQYXJ0KGlubmVyVXNlckRhdGEsIGVjMi5NdWx0aXBhcnRCb2R5LlNIRUxMX1NDUklQVCwgdHJ1ZSk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoJ2NvbW1hbmQxJyk7XG4gICAgdXNlckRhdGEuYWRkU2lnbmFsT25FeGl0Q29tbWFuZCggcmVzb3VyY2UgKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBleHBlY3RlZElubmVyID0gc3RhY2sucmVzb2x2ZSgnIyEvYmluL2Jhc2hcXG4nICtcbiAgICAnZnVuY3Rpb24gZXhpdFRyYXAoKXtcXG4nICtcbiAgICAnZXhpdENvZGU9JD9cXG4nICtcbiAgICBgL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1zdGFjayBEZWZhdWx0IC0tcmVzb3VyY2UgUkVTT1VSQ0UxOTg5NTUyRiAtLXJlZ2lvbiAke0F3cy5SRUdJT059IC1lICRleGl0Q29kZSB8fCBlY2hvIFxcJ0ZhaWxlZCB0byBzZW5kIENsb3VkZm9ybWF0aW9uIFNpZ25hbFxcJ1xcbmAgK1xuICAgICd9XFxuJyArXG4gICAgJ3RyYXAgZXhpdFRyYXAgRVhJVFxcbicgK1xuICAgICdjb21tYW5kMScpO1xuICAgIGNvbnN0IHJlbmRlcmVkID0gc3RhY2sucmVzb2x2ZShpbm5lclVzZXJEYXRhLnJlbmRlcigpKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoZXhwZWN0ZWRJbm5lcik7XG4gICAgY29uc3Qgb3V0ID0gc3RhY2sucmVzb2x2ZSh1c2VyRGF0YS5yZW5kZXIoKSk7XG4gICAgZXhwZWN0KG91dCkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZTogbXVsdGlwYXJ0L21peGVkOyBib3VuZGFyeT1cIitBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PVwiJyxcbiAgICAgICAgICAgICdNSU1FLVZlcnNpb246IDEuMCcsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICctLStBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PScsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9XCJ1dGYtOFwiJyxcbiAgICAgICAgICAgICdDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nOiBiYXNlNjQnLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6QmFzZTY0JzogZXhwZWN0ZWRJbm5lcixcbiAgICAgICAgICB9LFxuICAgICAgICAgICdcXG4tLStBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PS0tXFxuJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NhbiBhZGQgZG93bmxvYWQgUzMgZmlsZXMgdG8gTXVsdGlwYXJ0IHVzZXIgZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgaW5uZXJVc2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIGNvbnN0IHVzZXJEYXRhID0gbmV3IGVjMi5NdWx0aXBhcnRVc2VyRGF0YSgpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0JywgJ3Rlc3QnICk7XG4gICAgY29uc3QgYnVja2V0MiA9IEJ1Y2tldC5mcm9tQnVja2V0TmFtZSggc3RhY2ssICd0ZXN0QnVja2V0MicsICd0ZXN0MicgKTtcblxuICAgIC8vIFdIRU5cbiAgICB1c2VyRGF0YS5hZGRVc2VyRGF0YVBhcnQoaW5uZXJVc2VyRGF0YSwgZWMyLk11bHRpcGFydEJvZHkuU0hFTExfU0NSSVBULCB0cnVlKTtcbiAgICB1c2VyRGF0YS5hZGRTM0Rvd25sb2FkQ29tbWFuZCh7XG4gICAgICBidWNrZXQsXG4gICAgICBidWNrZXRLZXk6ICdmaWxlbmFtZS5zaCcsXG4gICAgfSApO1xuICAgIHVzZXJEYXRhLmFkZFMzRG93bmxvYWRDb21tYW5kKHtcbiAgICAgIGJ1Y2tldDogYnVja2V0MixcbiAgICAgIGJ1Y2tldEtleTogJ2ZpbGVuYW1lMi5zaCcsXG4gICAgICBsb2NhbEZpbGU6ICdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LnNoJyxcbiAgICB9ICk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgZXhwZWN0ZWRJbm5lciA9ICcjIS9iaW4vYmFzaFxcbicgK1xuICAgICdta2RpciAtcCAkKGRpcm5hbWUgXFwnL3RtcC9maWxlbmFtZS5zaFxcJylcXG4nICtcbiAgICAnYXdzIHMzIGNwIFxcJ3MzOi8vdGVzdC9maWxlbmFtZS5zaFxcJyBcXCcvdG1wL2ZpbGVuYW1lLnNoXFwnXFxuJyArXG4gICAgJ21rZGlyIC1wICQoZGlybmFtZSBcXCdjOlxcXFx0ZXN0XFxcXGxvY2F0aW9uXFxcXG90aGVyU2NyaXB0LnNoXFwnKVxcbicgK1xuICAgICdhd3MgczMgY3AgXFwnczM6Ly90ZXN0Mi9maWxlbmFtZTIuc2hcXCcgXFwnYzpcXFxcdGVzdFxcXFxsb2NhdGlvblxcXFxvdGhlclNjcmlwdC5zaFxcJyc7XG4gICAgY29uc3QgcmVuZGVyZWQgPSBzdGFjay5yZXNvbHZlKGlubmVyVXNlckRhdGEucmVuZGVyKCkpO1xuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbChleHBlY3RlZElubmVyKTtcbiAgICBjb25zdCBvdXQgPSBzdGFjay5yZXNvbHZlKHVzZXJEYXRhLnJlbmRlcigpKTtcbiAgICBleHBlY3Qob3V0KS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PVwiK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09XCInLFxuICAgICAgICAgICAgJ01JTUUtVmVyc2lvbjogMS4wJyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgJy0tK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09JyxcbiAgICAgICAgICAgICdDb250ZW50LVR5cGU6IHRleHQveC1zaGVsbHNjcmlwdDsgY2hhcnNldD1cInV0Zi04XCInLFxuICAgICAgICAgICAgJ0NvbnRlbnQtVHJhbnNmZXItRW5jb2Rpbmc6IGJhc2U2NCcsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgIF0uam9pbignXFxuJyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0ZuOjpCYXNlNjQnOiBleHBlY3RlZElubmVyLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1xcbi0tK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09LS1cXG4nLFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICB9KTtcblxuICB9KTtcbiAgdGVzdCgnY2FuIGFkZCBleGVjdXRlIGZpbGVzIHRvIE11bHRpcGFydCB1c2VyIGRhdGEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGlubmVyVXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICBjb25zdCB1c2VyRGF0YSA9IG5ldyBlYzIuTXVsdGlwYXJ0VXNlckRhdGEoKTtcblxuICAgIC8vIFdIRU5cbiAgICB1c2VyRGF0YS5hZGRVc2VyRGF0YVBhcnQoaW5uZXJVc2VyRGF0YSwgZWMyLk11bHRpcGFydEJvZHkuU0hFTExfU0NSSVBULCB0cnVlKTtcbiAgICB1c2VyRGF0YS5hZGRFeGVjdXRlRmlsZUNvbW1hbmQoe1xuICAgICAgZmlsZVBhdGg6ICcvdG1wL2ZpbGVuYW1lLnNoJyxcbiAgICB9ICk7XG4gICAgdXNlckRhdGEuYWRkRXhlY3V0ZUZpbGVDb21tYW5kKHtcbiAgICAgIGZpbGVQYXRoOiAnL3Rlc3QvZmlsZW5hbWUyLnNoJyxcbiAgICAgIGFyZ3VtZW50czogJ2FyZzEgYXJnMiAtYXJnICR2YXJpYWJsZScsXG4gICAgfSApO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGV4cGVjdGVkSW5uZXIgPSAnIyEvYmluL2Jhc2hcXG4nICtcbiAgICAnc2V0IC1lXFxuJyArXG4gICAgJ2NobW9kICt4IFxcJy90bXAvZmlsZW5hbWUuc2hcXCdcXG4nICtcbiAgICAnXFwnL3RtcC9maWxlbmFtZS5zaFxcJ1xcbicgK1xuICAgICdzZXQgLWVcXG4nICtcbiAgICAnY2htb2QgK3ggXFwnL3Rlc3QvZmlsZW5hbWUyLnNoXFwnXFxuJyArXG4gICAgJ1xcJy90ZXN0L2ZpbGVuYW1lMi5zaFxcJyBhcmcxIGFyZzIgLWFyZyAkdmFyaWFibGUnO1xuICAgIGNvbnN0IHJlbmRlcmVkID0gc3RhY2sucmVzb2x2ZShpbm5lclVzZXJEYXRhLnJlbmRlcigpKTtcbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoZXhwZWN0ZWRJbm5lcik7XG4gICAgY29uc3Qgb3V0ID0gc3RhY2sucmVzb2x2ZSh1c2VyRGF0YS5yZW5kZXIoKSk7XG4gICAgZXhwZWN0KG91dCkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZTogbXVsdGlwYXJ0L21peGVkOyBib3VuZGFyeT1cIitBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PVwiJyxcbiAgICAgICAgICAgICdNSU1FLVZlcnNpb246IDEuMCcsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICctLStBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PScsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlOiB0ZXh0L3gtc2hlbGxzY3JpcHQ7IGNoYXJzZXQ9XCJ1dGYtOFwiJyxcbiAgICAgICAgICAgICdDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nOiBiYXNlNjQnLFxuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6QmFzZTY0JzogZXhwZWN0ZWRJbm5lcixcbiAgICAgICAgICB9LFxuICAgICAgICAgICdcXG4tLStBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PS0tXFxuJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfSk7XG59KTtcbiJdfQ==