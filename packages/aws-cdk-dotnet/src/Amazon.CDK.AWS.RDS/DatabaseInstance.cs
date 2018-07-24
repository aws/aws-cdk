using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>
    /// Create a database instance
    /// 
    /// This can be a standalone database instance, or part of a cluster.
    /// </summary>
    [JsiiClass(typeof(DatabaseInstance), "@aws-cdk/aws-rds.DatabaseInstance", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public class DatabaseInstance : Construct
    {
        public DatabaseInstance(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected DatabaseInstance(ByRefValue reference): base(reference)
        {
        }

        protected DatabaseInstance(DeputyProps props): base(props)
        {
        }
    }
}