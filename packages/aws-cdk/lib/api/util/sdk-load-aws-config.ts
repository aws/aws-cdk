/**
 * IMPORTANT: This **must** be required _before_ 'aws-sdk' is.
 *
 * This ensures the correct environment is set-up so the AWS SDK properly
 * loads up configruation stored in the shared credentials file (usually
 * found at ~/.aws/credentials) and the aws config file (usually found at
 * ~/.aws/config), if either is present.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export const sharedCredentialsFile =
    process.env.AWS_SHARED_CREDENTIALS_FILE ? process.env.AWS_SHARED_CREDENTIALS_FILE
                                            : path.join(os.homedir(), '.aws', 'credentials');
export const awsConfigFile =
    process.env.AWS_CONFIG_FILE ? process.env.AWS_CONFIG_FILE
                                : path.join(os.homedir(), '.aws', 'config');

if (fs.existsSync(awsConfigFile) && !fs.existsSync(sharedCredentialsFile)) {
    /*
     * Write an empty credentials file if there's a config fil, otherwise the SDK will simply bail out,
     * since the credentials file is loaded before the config file is.
     */
    fs.writeFileSync(sharedCredentialsFile, '');
}
if (fs.existsSync(sharedCredentialsFile)) {
    // Ensures that region is loaded from ~/.aws/config (https://github.com/aws/aws-sdk-js/pull/1391)
    process.env.AWS_SDK_LOAD_CONFIG = '1';
}
