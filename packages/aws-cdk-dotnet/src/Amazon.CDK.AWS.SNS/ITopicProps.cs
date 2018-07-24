using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Properties for a new SNS topic</summary>
    [JsiiInterface(typeof(ITopicProps), "@aws-cdk/aws-sns.TopicProps")]
    public interface ITopicProps
    {
        /// <summary>A developer-defined string that can be used to identify this SNS topic.</summary>
        /// <remarks>default: None</remarks>
        [JsiiProperty("displayName", "{\"primitive\":\"string\",\"optional\":true}")]
        string DisplayName
        {
            get;
            set;
        }

        /// <summary>
        /// A name for the topic.
        /// 
        /// If you don't specify a name, AWS CloudFormation generates a unique
        /// physical ID and uses that ID for the topic name. For more information,
        /// see Name Type.
        /// </summary>
        /// <remarks>default: Generated name</remarks>
        [JsiiProperty("topicName", "{\"primitive\":\"string\",\"optional\":true}")]
        string TopicName
        {
            get;
            set;
        }
    }
}