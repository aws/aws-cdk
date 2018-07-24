using Amazon.CDK;
using Amazon.CDK.AWS.Lambda;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Lambda.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html </remarks>
    [JsiiClass(typeof(FunctionResource_), "@aws-cdk/aws-lambda.cloudformation.FunctionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.FunctionResourceProps\"}}]")]
    public class FunctionResource_ : Resource
    {
        public FunctionResource_(Construct parent, string name, IFunctionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected FunctionResource_(ByRefValue reference): base(reference)
        {
        }

        protected FunctionResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(FunctionResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("functionArn", "{\"fqn\":\"@aws-cdk/aws-lambda.FunctionArn\"}")]
        public virtual FunctionArn FunctionArn
        {
            get => GetInstanceProperty<FunctionArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}