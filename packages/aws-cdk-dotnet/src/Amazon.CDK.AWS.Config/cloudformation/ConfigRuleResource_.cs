using Amazon.CDK;
using Amazon.CDK.AWS.Config;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Config.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-config-configrule.html </remarks>
    [JsiiClass(typeof(ConfigRuleResource_), "@aws-cdk/aws-config.cloudformation.ConfigRuleResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-config.cloudformation.ConfigRuleResourceProps\"}}]")]
    public class ConfigRuleResource_ : Resource
    {
        public ConfigRuleResource_(Construct parent, string name, IConfigRuleResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ConfigRuleResource_(ByRefValue reference): base(reference)
        {
        }

        protected ConfigRuleResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ConfigRuleResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("configRuleArn", "{\"fqn\":\"@aws-cdk/aws-config.ConfigRuleArn\"}")]
        public virtual ConfigRuleArn ConfigRuleArn
        {
            get => GetInstanceProperty<ConfigRuleArn>();
        }

        /// <remarks>cloudformation_attribute: Compliance.Type</remarks>
        [JsiiProperty("configRuleComplianceType", "{\"fqn\":\"@aws-cdk/aws-config.ConfigRuleComplianceType\"}")]
        public virtual ConfigRuleComplianceType ConfigRuleComplianceType
        {
            get => GetInstanceProperty<ConfigRuleComplianceType>();
        }

        /// <remarks>cloudformation_attribute: ConfigRuleId</remarks>
        [JsiiProperty("configRuleId", "{\"fqn\":\"@aws-cdk/aws-config.ConfigRuleId\"}")]
        public virtual ConfigRuleId ConfigRuleId
        {
            get => GetInstanceProperty<ConfigRuleId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}