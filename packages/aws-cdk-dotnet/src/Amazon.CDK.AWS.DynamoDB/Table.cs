using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DynamoDB
{
    /// <summary>Provides a DynamoDB table.</summary>
    [JsiiClass(typeof(Table), "@aws-cdk/aws-dynamodb.Table", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-dynamodb.TableProps\",\"optional\":true}}]")]
    public class Table : Construct
    {
        public Table(Construct parent, string name, ITableProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Table(ByRefValue reference): base(reference)
        {
        }

        protected Table(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("tableArn", "{\"fqn\":\"@aws-cdk/aws-dynamodb.TableArn\"}")]
        public virtual TableArn TableArn
        {
            get => GetInstanceProperty<TableArn>();
        }

        [JsiiProperty("tableName", "{\"fqn\":\"@aws-cdk/aws-dynamodb.TableName\"}")]
        public virtual TableName TableName
        {
            get => GetInstanceProperty<TableName>();
        }

        [JsiiProperty("tableStreamArn", "{\"fqn\":\"@aws-cdk/aws-dynamodb.TableStreamArn\"}")]
        public virtual TableStreamArn TableStreamArn
        {
            get => GetInstanceProperty<TableStreamArn>();
        }

        [JsiiMethod("addPartitionKey", "{\"fqn\":\"@aws-cdk/aws-dynamodb.Table\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"type\",\"type\":{\"fqn\":\"@aws-cdk/aws-dynamodb.KeyAttributeType\"}}]")]
        public virtual Table AddPartitionKey(string name, KeyAttributeType type)
        {
            return InvokeInstanceMethod<Table>(new object[]{name, type});
        }

        [JsiiMethod("addSortKey", "{\"fqn\":\"@aws-cdk/aws-dynamodb.Table\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"type\",\"type\":{\"fqn\":\"@aws-cdk/aws-dynamodb.KeyAttributeType\"}}]")]
        public virtual Table AddSortKey(string name, KeyAttributeType type)
        {
            return InvokeInstanceMethod<Table>(new object[]{name, type});
        }

        /// <summary>
        /// This method can be implemented by derived constructs in order to perform
        /// validation logic. It is called on all constructs before synthesis.
        /// </summary>
        [JsiiMethod("validate", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", "[]")]
        public override string[] Validate()
        {
            return InvokeInstanceMethod<string[]>(new object[]{});
        }
    }
}