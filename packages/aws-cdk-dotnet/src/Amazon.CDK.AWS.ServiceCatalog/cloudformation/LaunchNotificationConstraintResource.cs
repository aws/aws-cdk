using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html </remarks>
    [JsiiClass(typeof(LaunchNotificationConstraintResource), "@aws-cdk/aws-servicecatalog.cloudformation.LaunchNotificationConstraintResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.LaunchNotificationConstraintResourceProps\"}}]")]
    public class LaunchNotificationConstraintResource : Resource
    {
        public LaunchNotificationConstraintResource(Construct parent, string name, ILaunchNotificationConstraintResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LaunchNotificationConstraintResource(ByRefValue reference): base(reference)
        {
        }

        protected LaunchNotificationConstraintResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LaunchNotificationConstraintResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}