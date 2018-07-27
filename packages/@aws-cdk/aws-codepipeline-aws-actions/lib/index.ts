import codebuild_ = require('@aws-cdk/aws-codebuild-codepipeline');

export namespace codebuild {
    export import BuildActionProps = codebuild_.BuildActionProps;
    export import BuildAction = codebuild_.BuildAction;
}

import codecommit_ = require('@aws-cdk/aws-codecommit-codepipeline');

export namespace codecommit {
    export import SourceActionProps = codecommit_.SourceActionProps;
    export import SourceAction = codecommit_.SourceAction;
}

import lambda_ = require('@aws-cdk/aws-lambda-codepipeline');

export namespace lambda {
    export import PipelineInvokeAction = lambda_.PipelineInvokeAction;
    export import PipelineInvokeActionProps = lambda_.PipelineInvokeActionProps;
}
