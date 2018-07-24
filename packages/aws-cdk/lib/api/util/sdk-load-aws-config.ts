/**
 * IMPORTANT: This **must** be required _before_ 'aws-sdk' is.
 *
 * This ensures the correct environment is set-up so the AWS SDK properly
 * loads up configruation stored in the shared credentials file (usually
 * found at ~/.aws/credentials) and the aws config file (usually found at
 * ~/.aws/config), if either is present.
 *
 * @see https://github.com/awslabs/aws-cdk/pull/128
 */

import fs = require('fs');
import os = require('os');
import path = require('path');

const sharedCredentialsFile =
    process.env.AWS_SHARED_CREDENTIALS_FILE ? process.env.AWS_SHARED_CREDENTIALS_FILE
                                            : path.join(os.homedir(), '.aws', 'credentials');
const awsConfigFile =
    process.env.AWS_CONFIG_FILE ? process.env.AWS_CONFIG_FILE
                                : path.join(os.homedir(), '.aws', 'config');

if (fs.existsSync(awsConfigFile) && !fs.existsSync(sharedCredentialsFile)) {
    /*
     * Write an empty credentials file if there's a config file, otherwise the SDK will simply bail out,
     * since the credentials file is loaded before the config file is.
     */
    fs.writeFileSync(sharedCredentialsFile, '');
}
if (fs.existsSync(sharedCredentialsFile)) {
    // Ensures that region is loaded from ~/.aws/config (https://github.com/aws/aws-sdk-js/pull/1391)
    process.env.AWS_SDK_LOAD_CONFIG = '1';
}

/*
 * Set environment variables so JS AWS SDK behaves as close as possible to AWS CLI.
 * @see https://github.com/aws/aws-sdk-js/issues/373
 * @see https://github.com/awslabs/aws-cdk/issues/131
 */
if (process.env.AWS_DEFAULT_PROFILE && !process.env.AWS_PROFILE) {
    process.env.AWS_PROFILE = process.env.AWS_DEFAULT_PROFILE;
}
if (process.env.AWS_DEFAULT_REGION && !process.env.AWS_REGION) {
    process.env.AWS_REGION = process.env.AWS_DEFAULT_REGION;
}
