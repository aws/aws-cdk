using Amazon.CDK;
using Amazon.CDK.AWS.AppSync;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-datasource.html </remarks>
    [JsiiClass(typeof(DataSourceResource_), "@aws-cdk/aws-appsync.cloudformation.DataSourceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.DataSourceResourceProps\"}}]")]
    public class DataSourceResource_ : Resource
    {
        public DataSourceResource_(Construct parent, string name, IDataSourceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DataSourceResource_(ByRefValue reference): base(reference)
        {
        }

        protected DataSourceResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DataSourceResource_));
        /// <remarks>cloudformation_attribute: DataSourceArn</remarks>
        [JsiiProperty("dataSourceArn", "{\"fqn\":\"@aws-cdk/aws-appsync.DataSourceArn\"}")]
        public virtual DataSourceArn DataSourceArn
        {
            get => GetInstanceProperty<DataSourceArn>();
        }

        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("dataSourceName", "{\"fqn\":\"@aws-cdk/aws-appsync.DataSourceName\"}")]
        public virtual DataSourceName DataSourceName
        {
            get => GetInstanceProperty<DataSourceName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}