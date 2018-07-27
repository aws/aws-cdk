import codebuild_ = require('@aws-cdk/aws-codebuild-codepipeline');

export namespace codebuild {
    export import BuildActionProps = codebuild_.BuildActionProps;
    export import BuildAction = codebuild_.BuildAction;
}

import codecommit_ = require('@aws-cdk/aws-codecommit-codepipeline');

export namespace codecommit {
    export import PipelineSourceProps = codecommit_.PipelineSourceProps;
    export import PipelineSource = codecommit_.PipelineSource;
}

import lambda_ = require('@aws-cdk/aws-lambda-codepipeline');

export namespace lambda {
    export import PipelineInvokeAction = lambda_.PipelineInvokeAction;
    export import PipelineInvokeActionProps = lambda_.PipelineInvokeActionProps;
}
