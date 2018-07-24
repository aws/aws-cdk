using Amazon.CDK;
using Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Lambda.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html </remarks>
    public class FunctionResourceProps : DeputyBase, IFunctionResourceProps
    {
        /// <summary>``AWS::Lambda::Function.Code``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-code </remarks>
        [JsiiProperty("code", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.CodeProperty\"}]}}", true)]
        public object Code
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.Handler``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-handler </remarks>
        [JsiiProperty("handler", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Handler
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.Role``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-role </remarks>
        [JsiiProperty("role", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Role
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.Runtime``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-runtime </remarks>
        [JsiiProperty("runtime", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Runtime
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.DeadLetterConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-deadletterconfig </remarks>
        [JsiiProperty("deadLetterConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.DeadLetterConfigProperty\"}]},\"optional\":true}", true)]
        public object DeadLetterConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.Environment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-environment </remarks>
        [JsiiProperty("environment", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.EnvironmentProperty\"}]},\"optional\":true}", true)]
        public object Environment
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.FunctionName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-functionname </remarks>
        [JsiiProperty("functionName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object FunctionName
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.KmsKeyArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-kmskeyarn </remarks>
        [JsiiProperty("kmsKeyArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object KmsKeyArn
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.MemorySize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-memorysize </remarks>
        [JsiiProperty("memorySize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MemorySize
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.ReservedConcurrentExecutions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-reservedconcurrentexecutions </remarks>
        [JsiiProperty("reservedConcurrentExecutions", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ReservedConcurrentExecutions
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.Tags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tags </remarks>
        [JsiiProperty("tags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/cdk.Tag\"}]}}}}]},\"optional\":true}", true)]
        public object Tags
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.Timeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-timeout </remarks>
        [JsiiProperty("timeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Timeout
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.TracingConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-tracingconfig </remarks>
        [JsiiProperty("tracingConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.TracingConfigProperty\"}]},\"optional\":true}", true)]
        public object TracingConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::Lambda::Function.VpcConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#cfn-lambda-function-vpcconfig </remarks>
        [JsiiProperty("vpcConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResource.VpcConfigProperty\"}]},\"optional\":true}", true)]
        public object VpcConfig
        {
            get;
            set;
        }
    }
}