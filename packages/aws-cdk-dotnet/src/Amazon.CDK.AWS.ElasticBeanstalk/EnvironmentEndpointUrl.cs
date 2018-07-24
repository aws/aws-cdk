using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticBeanstalk
{
    [JsiiClass(typeof(EnvironmentEndpointUrl), "@aws-cdk/aws-elasticbeanstalk.EnvironmentEndpointUrl", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class EnvironmentEndpointUrl : Token
    {
        public EnvironmentEndpointUrl(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected EnvironmentEndpointUrl(ByRefValue reference): base(reference)
        {
        }

        protected EnvironmentEndpointUrl(DeputyProps props): base(props)
        {
        }
    }
}