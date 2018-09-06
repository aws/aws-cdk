import { expect, haveResource } from '@aws-cdk/assert';
import assets = require('@aws-cdk/assets');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codebuild = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
    'can use filename as buildspec'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: new codebuild.CodePipelineSource(),
            buildSpec: 'hello.yml',
        });

        // THEN
        expect(stack).to(haveResource('AWS::CodeBuild::Project', {
            Source: {
                BuildSpec: 'hello.yml'
            }
        }));

        test.done();
    },

    'can use buildspec literal'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: new codebuild.CodePipelineSource(),
            buildSpec: { phases: [ 'say hi' ] }
        });

        // THEN
        expect(stack).to(haveResource('AWS::CodeBuild::Project', {
            Source: {
                BuildSpec: '{"phases":["say hi"]}'
            }
        }));

        test.done();
    },

    'construct from asset'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new codebuild.Project(stack, 'Project', {
            buildScriptAsset: new assets.ZipDirectoryAsset(stack, 'Asset', { path: '.' }),
            buildScriptAssetEntrypoint: 'hello.sh',
        });

        // THEN
        expect(stack).to(haveResource('AWS::CodeBuild::Project', {
            Environment: {
                ComputeType: "BUILD_GENERAL1_SMALL",
                EnvironmentVariables: [
                    {
                        Name: "SCRIPT_S3_BUCKET",
                        Type: "PLAINTEXT",
                        Value: { Ref: "AssetS3Bucket235698C0" }
                    },
                    {
                        Name: "SCRIPT_S3_KEY",
                        Type: "PLAINTEXT",
                        Value: { "Fn::Join": [ "", [
                            { "Fn::Select": [ 0, { "Fn::Split": [ "||", { Ref: "AssetS3VersionKeyA852DDAE" } ] } ] },
                            { "Fn::Select": [ 1, { "Fn::Split": [ "||", { Ref: "AssetS3VersionKeyA852DDAE" } ] } ] }
                        ] ] }
                    }
                ],
            },
            Source: {
                // tslint:disable-next-line:max-line-length
                BuildSpec: "{\"version\":\"0.2\",\"phases\":{\"pre_build\":{\"commands\":[\"echo \\\"Downloading scripts from s3://${SCRIPT_S3_BUCKET}/${SCRIPT_S3_KEY}\\\"\",\"aws s3 cp s3://${SCRIPT_S3_BUCKET}/${SCRIPT_S3_KEY} /tmp\",\"mkdir -p /tmp/scriptdir\",\"unzip /tmp/$(basename $SCRIPT_S3_KEY) -d /tmp/scriptdir\"]},\"build\":{\"commands\":[\"export SCRIPT_DIR=/tmp/scriptdir\",\"echo \\\"Running hello.sh\\\"\",\"chmod +x /tmp/scriptdir/hello.sh\",\"/tmp/scriptdir/hello.sh\"]}}}",
                Type: "NO_SOURCE"
            }
        }));

        test.done();
    },
};