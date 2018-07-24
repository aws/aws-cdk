using Amazon.CDK;
using Amazon.CDK.AWS.CloudFormation;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CloudFormation.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-waitcondition.html </remarks>
    [JsiiClass(typeof(WaitConditionResource), "@aws-cdk/aws-cloudformation.cloudformation.WaitConditionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudformation.cloudformation.WaitConditionResourceProps\"}}]")]
    public class WaitConditionResource : Resource
    {
        public WaitConditionResource(Construct parent, string name, IWaitConditionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected WaitConditionResource(ByRefValue reference): base(reference)
        {
        }

        protected WaitConditionResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(WaitConditionResource));
        /// <remarks>cloudformation_attribute: Data</remarks>
        [JsiiProperty("waitConditionData", "{\"fqn\":\"@aws-cdk/aws-cloudformation.WaitConditionData\"}")]
        public virtual WaitConditionData WaitConditionData
        {
            get => GetInstanceProperty<WaitConditionData>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}