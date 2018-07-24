using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SDB.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-simpledb.html </remarks>
    [JsiiInterfaceProxy(typeof(IDomainResourceProps), "@aws-cdk/aws-sdb.cloudformation.DomainResourceProps")]
    internal class DomainResourcePropsProxy : DeputyBase, IDomainResourceProps
    {
        private DomainResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::SDB::Domain.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-simpledb.html#cfn-sdb-domain-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Description
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}