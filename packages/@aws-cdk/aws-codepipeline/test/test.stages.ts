import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codepipeline = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
    'Pipeline Stages': {
        'can be inserted at index 0'(test: Test) {
            const pipeline = pipelineForTesting();

            const secondStage = new codepipeline.Stage(pipeline, 'SecondStage');
            const firstStage = new codepipeline.Stage(pipeline, 'FirstStage', {
                placed: {
                    atIndex: 0,
                }
            });

            test.equal(pipeline.stages[0].name, firstStage.name);
            test.equal(pipeline.stages[1].name, secondStage.name);

            test.done();
        },

        'can be inserted before another Stage'(test: Test) {
            const pipeline = pipelineForTesting();

            const secondStage = new codepipeline.Stage(pipeline, 'SecondStage');
            const firstStage = new codepipeline.Stage(pipeline, 'FirstStage', {
                placed: {
                    rightBeforeStage: secondStage,
                }
            });

            test.equal(pipeline.stages[0].name, firstStage.name);
            test.equal(pipeline.stages[1].name, secondStage.name);

            test.done();
        },

        'can be inserted after another Stage'(test: Test) {
            const pipeline = pipelineForTesting();

            const firstStage = new codepipeline.Stage(pipeline, 'FirstStage');
            const thirdStage = new codepipeline.Stage(pipeline, 'ThirdStage');
            const secondStage = new codepipeline.Stage(pipeline, 'SecondStage', {
                placed: {
                    justAfterStage: firstStage,
                }
            });

            test.equal(pipeline.stages[0].name, firstStage.name);
            test.equal(pipeline.stages[1].name, secondStage.name);
            test.equal(pipeline.stages[2].name, thirdStage.name);

            test.done();
        },

        'attempting to insert a Stage at a negative index results in an error'(test: Test) {
            const pipeline = pipelineForTesting();

            test.throws(() => {
                new codepipeline.Stage(pipeline, 'Stage', {
                    placed: {
                        atIndex: -1,
                    }
                });
            }, /atIndex/);

            test.done();
        },

        'attempting to insert a Stage at an index larger than the current number of Stages results in an error'(test: Test) {
            const pipeline = pipelineForTesting();

            test.throws(() => {
                new codepipeline.Stage(pipeline, 'Stage', {
                    placed: {
                        atIndex: 1,
                    }
                });
            }, /atIndex/);

            test.done();
        },

        "attempting to insert a Stage before a Stage that doesn't exist results in an error"(test: Test) {
            const pipeline = pipelineForTesting();
            const stage = new codepipeline.Stage(pipeline, 'Stage');

            const anotherPipeline = pipelineForTesting();
            test.throws(() => {
                new codepipeline.Stage(anotherPipeline, 'Stage', {
                    placed: {
                        rightBeforeStage: stage,
                    }
                });
            }, /before/i);

            test.done();
        },

        "attempting to insert a Stage after a Stage that doesn't exist results in an error"(test: Test) {
            const pipeline = pipelineForTesting();
            const stage = new codepipeline.Stage(pipeline, 'Stage');

            const anotherPipeline = pipelineForTesting();
            test.throws(() => {
                new codepipeline.Stage(anotherPipeline, 'Stage', {
                    placed: {
                        justAfterStage: stage,
                    }
                });
            }, /after/i);

            test.done();
        },

        "providing more than one placement value results in an error"(test: Test) {
            const pipeline = pipelineForTesting();
            const stage = new codepipeline.Stage(pipeline, 'FirstStage');

            test.throws(() => {
                new codepipeline.Stage(pipeline, 'SecondStage', {
                    placed: {
                        rightBeforeStage: stage,
                        justAfterStage: stage,
                    }
                });
            });

            test.done();
        },
    },
};

function pipelineForTesting(): codepipeline.Pipeline {
    const stack = new cdk.Stack();
    const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    return pipeline;
}
