using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CloudFormation.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitconditionhandle.html </remarks>
    [JsiiClass(typeof(WaitConditionHandleResource), "@aws-cdk/aws-cloudformation.cloudformation.WaitConditionHandleResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public class WaitConditionHandleResource : Resource
    {
        public WaitConditionHandleResource(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected WaitConditionHandleResource(ByRefValue reference): base(reference)
        {
        }

        protected WaitConditionHandleResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(WaitConditionHandleResource));
    }
}