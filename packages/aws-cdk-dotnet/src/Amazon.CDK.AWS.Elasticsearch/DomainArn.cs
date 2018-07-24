using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Elasticsearch
{
    [JsiiClass(typeof(DomainArn), "@aws-cdk/aws-elasticsearch.DomainArn", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DomainArn : Arn
    {
        public DomainArn(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DomainArn(ByRefValue reference): base(reference)
        {
        }

        protected DomainArn(DeputyProps props): base(props)
        {
        }
    }
}