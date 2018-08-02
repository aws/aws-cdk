import { expect, haveResource } from '@aws-cdk/assert';
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
    }
};