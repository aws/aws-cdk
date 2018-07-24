using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.KinesisAnalytics.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html </remarks>
    [JsiiClass(typeof(ApplicationReferenceDataSourceResource_), "@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-kinesisanalytics.cloudformation.ApplicationReferenceDataSourceResourceProps\"}}]")]
    public class ApplicationReferenceDataSourceResource_ : Resource
    {
        public ApplicationReferenceDataSourceResource_(Construct parent, string name, IApplicationReferenceDataSourceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ApplicationReferenceDataSourceResource_(ByRefValue reference): base(reference)
        {
        }

        protected ApplicationReferenceDataSourceResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ApplicationReferenceDataSourceResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}