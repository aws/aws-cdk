package com.myorg;

import software.constructs.Construct;

import java.util.*;
import software.amazon.awscdk.CfnMapping;
import software.amazon.awscdk.CfnTag;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;

import software.amazon.awscdk.*;
import software.amazon.awscdk.services.s3.*;

class GoodJavaStack extends Stack {
    private Object websiteUrl;

    private Object s3BucketSecureUrl;

    public Object getWebsiteUrl() {
        return this.websiteUrl;
    }

    public Object getS3BucketSecureUrl() {
        return this.s3BucketSecureUrl;
    }

    public GoodJavaStack(final Construct scope, final String id) {
        super(scope, id, null);
    }

    public GoodJavaStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        CfnBucket s3Bucket = CfnBucket.Builder.create(this, "S3Bucket")
                .accessControl("PublicRead")
                .websiteConfiguration(CfnBucket.WebsiteConfigurationProperty.builder()
                        .indexDocument("index.html")
                        .errorDocument("error.html")
                        .build())
                .build();

        s3Bucket.applyRemovalPolicy(RemovalPolicy.RETAIN);

        this.websiteUrl = s3Bucket.getAttrWebsiteUrl();
        CfnOutput.Builder.create(this, "CfnOutputWebsiteURL")
                .key("WebsiteURL")
                .value(this.websiteUrl.toString())
                .description("URL for website hosted on S3")
                .build();

        this.s3BucketSecureUrl = String.join("",
                "https://",
                s3Bucket.getAttrDomainName());
        CfnOutput.Builder.create(this, "CfnOutputS3BucketSecureURL")
                .key("S3BucketSecureURL")
                .value(this.s3BucketSecureUrl.toString())
                .description("Name of S3 bucket to hold website content")
                .build();

    }
}
