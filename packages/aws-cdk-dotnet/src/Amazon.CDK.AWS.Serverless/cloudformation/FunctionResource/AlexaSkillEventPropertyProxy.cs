using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill </remarks>
    [JsiiInterfaceProxy(typeof(IAlexaSkillEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.AlexaSkillEventProperty")]
    internal class AlexaSkillEventPropertyProxy : DeputyBase, IAlexaSkillEventProperty
    {
        private AlexaSkillEventPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.AlexaSkillEventProperty.Variables``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill </remarks>
        [JsiiProperty("variables", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        public virtual object Variables
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}