using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html </remarks>
    public class RuleProperty : DeputyBase, IRuleProperty
    {
        /// <summary>``BucketResource.RuleProperty.AbortIncompleteMultipartUpload``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-abortincompletemultipartupload </remarks>
        [JsiiProperty("abortIncompleteMultipartUpload", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.AbortIncompleteMultipartUploadProperty\"}]},\"optional\":true}", true)]
        public object AbortIncompleteMultipartUpload
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.ExpirationDate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-expirationdate </remarks>
        [JsiiProperty("expirationDate", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"primitive\":\"date\"}]},\"optional\":true}", true)]
        public object ExpirationDate
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.ExpirationInDays``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-expirationindays </remarks>
        [JsiiProperty("expirationInDays", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ExpirationInDays
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.Id``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-id </remarks>
        [JsiiProperty("id", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Id
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.NoncurrentVersionExpirationInDays``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversionexpirationindays </remarks>
        [JsiiProperty("noncurrentVersionExpirationInDays", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object NoncurrentVersionExpirationInDays
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.NoncurrentVersionTransition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransition </remarks>
        [JsiiProperty("noncurrentVersionTransition", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.NoncurrentVersionTransitionProperty\"}]},\"optional\":true}", true)]
        public object NoncurrentVersionTransition
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.NoncurrentVersionTransitions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-noncurrentversiontransitions </remarks>
        [JsiiProperty("noncurrentVersionTransitions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.NoncurrentVersionTransitionProperty\"}]}}}}]},\"optional\":true}", true)]
        public object NoncurrentVersionTransitions
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.Prefix``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-prefix </remarks>
        [JsiiProperty("prefix", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Prefix
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.Status``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-status </remarks>
        [JsiiProperty("status", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Status
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.TagFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-rule-tagfilters </remarks>
        [JsiiProperty("tagFilters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.TagFilterProperty\"}]}}}}]},\"optional\":true}", true)]
        public object TagFilters
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.Transition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-transition </remarks>
        [JsiiProperty("transition", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.TransitionProperty\"}]},\"optional\":true}", true)]
        public object Transition
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RuleProperty.Transitions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-lifecycleconfig-rule.html#cfn-s3-bucket-lifecycleconfig-rule-transitions </remarks>
        [JsiiProperty("transitions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.TransitionProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Transitions
        {
            get;
            set;
        }
    }
}