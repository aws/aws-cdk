using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Lambda.cloudformation.FunctionResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-environment.html </remarks>
    [JsiiInterfaceProxy(typeof(IEnvironmentProperty), "@aws-cdk/aws-lambda.cloudformation.FunctionResource.EnvironmentProperty")]
    internal class EnvironmentPropertyProxy : DeputyBase, IEnvironmentProperty
    {
        private EnvironmentPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.EnvironmentProperty.Variables``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-environment.html#cfn-lambda-function-environment-variables </remarks>
        [JsiiProperty("variables", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object Variables
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}