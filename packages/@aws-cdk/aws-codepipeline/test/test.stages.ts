import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
    'Pipeline Stages': {
        'can also be created by using the Pipeline#addStage method'(test: Test) {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            pipeline.addStage('Stage');

            expect(stack, true).to(haveResource('AWS::CodePipeline::Pipeline', {
                "Stages": [
                    { "Name": "Stage" },
                ],
            }));

            test.done();
        },
    },
};
