import { Test } from 'nodeunit';
import { Stack } from "../../core/lib";
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
    userData.addCommands("command1");

    // THEN
    const rendered = userData.render();

    test.equals(rendered, '<powershell>trap {\n' +
        '$success=($PSItem.Exception.Message -eq "Success")\n' +
        'cfn-signal --stack Stack --resource RESOURCE1989552F --region ${Token[AWS::Region.4]} --success ($success.ToString().ToLower())\n' +
        'break\n' +
        '}\n' +
        'command1\n' +
        'throw "Success"</powershell>'
    );
    test.done();
  },
  'can windows userdata download and execute S3 files'(test: Test) {
    // GIVEN
    const userData = ec2.UserData.forWindows();

    // WHEN
    userData.addDownloadAndExecuteS3FileCommand({
      bucketName: "test",
      bucketKey: "filename.bat"
    } );
    userData.addDownloadAndExecuteS3FileCommand({
      bucketName: "test2",
      bucketKey: "filename2.bat",
      localFile: ".\\otherScript.sh"
    } );
    userData.addDownloadAndExecuteS3FileCommand({
      bucketName: "test3",
      bucketKey: "filename3.bat",
      localFile: ".\\thirdScript.sh",
      arguments: "arg1 arg2 -arg $variable"
    } );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '<powershell>function download_and_execute_s3_file{\n' +
        'Param(\n' +
        '  [Parameter(Mandatory=$True)]\n' +
        '  $bucketName,\n' +
        '  [Parameter(Mandatory=$True)]\n' +
        '  $bucketKey,\n' +
        '  [Parameter(Mandatory=$True)]\n' +
        '  $localFile,\n' +
        '  [parameter(mandatory=$false,ValueFromRemainingArguments=$true)]\n' +
        '  $arguments\n' +
        ')\n' +
        'mkdir (Split-Path -Path $localFile ) -ea 0\n' +
        'Read-S3Object -BucketName $bucketName -key $bucketKey -file $localFile -ErrorAction Stop\n' +
        '&"$localFile" @arguments\n' +
        'if (!$?) { Write-Error \'Failed to execute file\' -ErrorAction Stop }\n' +
        '}\n' +
        'download_and_execute_s3_file test filename.bat C:/temp/filename.bat \n' +
        'download_and_execute_s3_file test2 filename2.bat .\\otherScript.sh \n' +
        'download_and_execute_s3_file test3 filename3.bat .\\thirdScript.sh arg1 arg2 -arg $variable</powershell>'
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
    userData.addCommands("command1");
    userData.addSignalOnExitCommand( resource );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '#!/bin/bash\n' +
        'function exitTrap(){\n' +
        'exitCode=$?\n' +
        '/opt/aws/bin/cfn-signal --stack Stack --resource RESOURCE1989552F --region ${Token[AWS::Region.4]} -e $exitCode || echo \'Failed to send Cloudformation Signal\'\n' +
        '}\n' +
        'trap exitTrap EXIT\n' +
        'command1');
    test.done();
  },
  'can linux userdata download and execute S3 files'(test: Test) {
    // GIVEN
    const userData = ec2.UserData.forLinux();

    // WHEN
    userData.addDownloadAndExecuteS3FileCommand({
      bucketName: "test",
      bucketKey: "filename.sh" } );
    userData.addDownloadAndExecuteS3FileCommand({
      bucketName: "test2",
      bucketKey: "filename2.sh",
      localFile: "~/otherScript.sh"
    } );
    userData.addDownloadAndExecuteS3FileCommand({
      bucketName: "test3",
      bucketKey: "filename3.sh",
      localFile: "~/thirdScript.sh",
      arguments: "arg1 arg2 $variable"
    } );

    // THEN
    const rendered = userData.render();
    test.equals(rendered, '#!/bin/bash\n' +
        'download_and_execute_s3_file () {\n' +
        'local s3Path=$1;\n' +
        'local path=$2;\n' +
        'shift;shift;\n' +
        'echo "Downloading file ${s3Path} to ${path}";\n' +
        'mkdir -p $(dirname ${path}) ;\n' +
        'aws s3 cp ${s3Path} ${path};\n' +
        'if [ $? -ne 0 ]; then exit 1;fi;\n' +
        'chmod +x ${path};\n' +
        'if [ $? -ne 0 ]; then exit 1;fi;\n' +
        '${path} "$@"\n' +
        'if [ $? -ne 0 ]; then exit 1;fi;\n' +
        '}\n' +
        'download_and_execute_s3_file s3://test/filename.sh /tmp/filename.sh \n' +
        'download_and_execute_s3_file s3://test2/filename2.sh ~/otherScript.sh \n' +
        'download_and_execute_s3_file s3://test3/filename3.sh ~/thirdScript.sh arg1 arg2 $variable');
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
