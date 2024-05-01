package main

import (
	cdk "github.com/aws/aws-cdk-go/awscdk/v2"
	s3 "github.com/aws/aws-cdk-go/awscdk/v2/awss3"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type GoodGoStackProps struct {
	cdk.StackProps
}

/// AWS CloudFormation Sample Template S3_Website_Bucket_With_Retain_On_Delete: Sample template showing how to create a publicly accessible S3 bucket configured for website access with a deletion policy of retain on delete.
type GoodGoStack struct {
	cdk.Stack
	/// URL for website hosted on S3
	WebsiteUrl interface{} // TODO: fix to appropriate type
	/// Name of S3 bucket to hold website content
	S3BucketSecureUrl interface{} // TODO: fix to appropriate type
}

func NewGoodGoStack(scope constructs.Construct, id string, props *GoodGoStackProps) *GoodGoStack {
	var sprops cdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := cdk.NewStack(scope, &id, &sprops)

	s3Bucket := s3.NewCfnBucket(
		stack,
		jsii.String("S3Bucket"),
		&s3.CfnBucketProps{
			AccessControl: jsii.String("PublicRead"),
			WebsiteConfiguration: &WebsiteConfigurationProperty{
				IndexDocument: jsii.String("index.html"),
				ErrorDocument: jsii.String("error.html"),
			},
		},
	)

	return &GoodGoStack{
		Stack: stack,
		WebsiteUrl: s3Bucket.AttrWebsiteUrl(),
		S3BucketSecureUrl: cdk.Fn_Join(jsii.String(""), &[]*string{
			jsii.String("https://"),
			s3Bucket.AttrDomainName(),
		}),
	}
}

func main() {
	defer jsii.Close()

	app := cdk.NewApp(nil)

	NewGoodGoStack(app, "GoodGo", GoodGoStackProps{
		cdk.StackProps{
			Env: env(),
		},
	})

	app.Synth(nil)
}

// env determines the AWS environment (account+region) in which our stack is to
// be deployed. For more information see: https://docs.aws.amazon.com/cdk/latest/guide/environments.html
func env() *cdk.Environment {
	// If unspecified, this stack will be "environment-agnostic".
	// Account/Region-dependent features and context lookups will not work, but a
	// single synthesized template can be deployed anywhere.
	//---------------------------------------------------------------------------
	return nil

	// Uncomment if you know exactly what account and region you want to deploy
	// the stack to. This is the recommendation for production stacks.
	//---------------------------------------------------------------------------
	// return &cdk.Environment{
	//  Account: jsii.String("123456789012"),
	//  Region:  jsii.String("us-east-1"),
	// }

	// Uncomment to specialize this stack for the AWS Account and Region that are
	// implied by the current CLI configuration. This is recommended for dev
	// stacks.
	//---------------------------------------------------------------------------
	// return &cdk.Environment{
	//  Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
	//  Region:  jsii.String(os.Getenv("CDK_DEFAULT_REGION")),
	// }
}
