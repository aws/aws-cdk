using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-as-lifecyclehook.html </remarks>
    [JsiiClass(typeof(LifecycleHookResource), "@aws-cdk/aws-autoscaling.cloudformation.LifecycleHookResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.LifecycleHookResourceProps\"}}]")]
    public class LifecycleHookResource : Resource
    {
        public LifecycleHookResource(Construct parent, string name, ILifecycleHookResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LifecycleHookResource(ByRefValue reference): base(reference)
        {
        }

        protected LifecycleHookResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LifecycleHookResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}