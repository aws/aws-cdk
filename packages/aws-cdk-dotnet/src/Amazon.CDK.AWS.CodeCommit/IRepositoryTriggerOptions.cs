using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeCommit
{
    /// <summary>Creates for a repository trigger to an SNS topic or Lambda function.</summary>
    [JsiiInterface(typeof(IRepositoryTriggerOptions), "@aws-cdk/aws-codecommit.RepositoryTriggerOptions")]
    public interface IRepositoryTriggerOptions
    {
        /// <summary>A name for the trigger.Triggers on a repository must have unique names</summary>
        [JsiiProperty("name", "{\"primitive\":\"string\",\"optional\":true}")]
        string Name
        {
            get;
            set;
        }

        /// <summary>
        /// The repository events for which AWS CodeCommit sends information to the
        /// target, which you specified in the DestinationArn property.If you don't
        /// specify events, the trigger runs for all repository events.
        /// </summary>
        [JsiiProperty("events", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryEventTrigger\"}},\"optional\":true}")]
        RepositoryEventTrigger[] Events
        {
            get;
            set;
        }

        /// <summary>
        /// The names of the branches in the AWS CodeCommit repository that contain
        /// events that you want to include in the trigger. If you don't specify at
        /// least one branch, the trigger applies to all branches.
        /// </summary>
        [JsiiProperty("branches", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}},\"optional\":true}")]
        string[] Branches
        {
            get;
            set;
        }

        /// <summary>
        /// When an event is triggered, additional information that AWS CodeCommit
        /// includes when it sends information to the target.
        /// </summary>
        [JsiiProperty("customData", "{\"primitive\":\"string\",\"optional\":true}")]
        string CustomData
        {
            get;
            set;
        }
    }
}