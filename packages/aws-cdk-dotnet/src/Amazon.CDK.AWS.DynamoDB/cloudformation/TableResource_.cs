using Amazon.CDK;
using Amazon.CDK.AWS.DynamoDB;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DynamoDB.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html </remarks>
    [JsiiClass(typeof(TableResource_), "@aws-cdk/aws-dynamodb.cloudformation.TableResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-dynamodb.cloudformation.TableResourceProps\"}}]")]
    public class TableResource_ : Resource
    {
        public TableResource_(Construct parent, string name, ITableResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected TableResource_(ByRefValue reference): base(reference)
        {
        }

        protected TableResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(TableResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("tableArn", "{\"fqn\":\"@aws-cdk/aws-dynamodb.TableArn\"}")]
        public virtual TableArn TableArn
        {
            get => GetInstanceProperty<TableArn>();
        }

        /// <remarks>cloudformation_attribute: StreamArn</remarks>
        [JsiiProperty("tableStreamArn", "{\"fqn\":\"@aws-cdk/aws-dynamodb.TableStreamArn\"}")]
        public virtual TableStreamArn TableStreamArn
        {
            get => GetInstanceProperty<TableStreamArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}