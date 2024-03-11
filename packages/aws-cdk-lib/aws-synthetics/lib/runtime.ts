/**
 * All known Lambda runtime families.
 */
export enum RuntimeFamily {
  /**
   * All Lambda runtimes that depend on Node.js.
   */
  NODEJS,

  /**
   * All lambda runtimes that depend on Python.
   */
  PYTHON,

  /**
   * Any future runtime family.
   */
  OTHER,
}

/**
 * Runtime options for a canary
 */
export class Runtime {

  /**
   * `syn-1.0` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 1.14.0
   * - Chromium version that matches Puppeteer-core 1.14.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-1.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_1_0 = new Runtime('syn-1.0', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-2.0-beta` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 3.3.0
   * - Chromium version 83.0.4103.0
   *
   * New features:
   * - **Upgraded dependencies**: This runtime version uses Puppeteer-core version 3.3.0 and Chromium version 83.0.4103.0
   * - **Synthetics reporting**: For each canary run, CloudWatch Synthetics creates a report named SyntheticsReport-PASSED.json or SyntheticsReport-FAILED.json which records data such as start time, end time, status, and failures. It also records the PASSED/FAILED status of each step of the canary script, and failures and screenshots captured for each step.
   * - **Broken link checker report**: The new version of the broken link checker included in this runtime creates a report that includes the links that were checked, status code, failure reason (if any), and source and destination page screenshots.
   * - **New CloudWatch metrics**: Synthetics publishes metrics named 2xx, 4xx, 5xx, and RequestFailed in the CloudWatchSynthetics namespace. These metrics show the number of 200s, 400s, 500s, and request failures in the canary runs. These metrics are reported only for UI canaries, and are not reported for API canaries.
   * - **Sortable HAR files**: You can now sort your HAR files by status code, request size, and duration.
   * - **Metrics timestamp**: CloudWatch metrics are now reported based on the Lambda invocation time instead of the canary run end time.
   *
   * Bug fixes:
   * - Fixed the issue of canary artifact upload errors not being reported. Such errors are now surfaced as execution errors.
   * - Fixed the issue of redirected requests (3xx) being incorrectly logged as errors.
   * - Fixed the issue of screenshots being numbered starting from 0. They should now start with 1.
   * - Fixed the issue of screenshots being garbled for Chinese and Japanese fonts.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-2.0-beta
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_2_0_BETA = new Runtime('syn-nodejs-2.0-beta', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-2.0` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 3.3.0
   * - Chromium version 83.0.4103.0
   *
   * New features:
   * - **Upgraded dependencies**: This runtime version uses Puppeteer-core version 3.3.0 and Chromium version 83.0.4103.0
   * - **Support for X-Ray active tracing**: When a canary has tracing enabled, X-Ray traces are sent for all calls made by the canary that use the browser, the AWS SDK, or HTTP or HTTPS modules. Canaries with tracing enabled appear on the X-Ray Trace Map, even when they don't send requests to other services or applications that have tracing enabled. For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_tracing.html | Canaries and X-Ray tracing}.
   * - **Synthetics reporting**: For each canary run, CloudWatch Synthetics creates a report named SyntheticsReport-PASSED.json or SyntheticsReport-FAILED.json which records data such as start time, end time, status, and failures. It also records the PASSED/FAILED status of each step of the canary script, and failures and screenshots captured for each step.
   * - **Broken link checker report**: The new version of the broken link checker included in this runtime creates a report that includes the links that were checked, status code, failure reason (if any), and source and destination page screenshots.
   * - **New CloudWatch metrics**: Synthetics publishes metrics named 2xx, 4xx, 5xx, and RequestFailed in the CloudWatchSynthetics namespace. These metrics show the number of 200s, 400s, 500s, and request failures in the canary runs. With this runtime version, these metrics are reported only for UI canaries, and are not reported for API canaries. They are also reported for API canaries starting with runtime version syn-nodejs-puppeteeer-2.2.
   * - **Sortable HAR files**: You can now sort your HAR files by status code, request size, and duration.
   * - **Metrics timestamp**: CloudWatch metrics are now reported based on the Lambda invocation time instead of the canary run end time.
   *
   * Bug fixes:
   * - Fixed the issue of canary artifact upload errors not being reported. Such errors are now surfaced as execution errors.
   * - Fixed the issue of redirected requests (3xx) being incorrectly logged as errors.
   * - Fixed the issue of screenshots being numbered starting from 0. They should now start with 1.
   * - Fixed the issue of screenshots being garbled for Chinese and Japanese fonts.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-2.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_2_0 = new Runtime('syn-nodejs-2.0', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-2.1` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 3.3.0
   * - Chromium version 83.0.4103.0
   *
   * New features:
   * - **Configurable screenshot behavior**: Provides the ability to turn off the capturing of screenshots by UI canaries. In canaries that use previous versions of the runtimes, UI canaries always capture screenshots before and after each step. With syn-nodejs-2.1, this is configurable. Turning off screenshots can reduce your Amazon S3 storage costs, and can help you comply with HIPAA regulations. For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library_Nodejs.html#CloudWatch_Synthetics_Library_SyntheticsConfiguration | SyntheticsConfiguration class}.
   * - **Customize the Google Chrome launch parameters**: You can now configure the arguments used when a canary launches a Google Chrome browser window. For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library_Nodejs.html#CloudWatch_Synthetics_Library_LaunchOptions | launch(options)}.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-2.1
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_2_1 = new Runtime('syn-nodejs-2.1', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-2.2` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 3.3.0
   * - Chromium version 83.0.4103.0
   *
   * New features:
   * - **Monitor your canaries as HTTP steps**: You can now test multiple APIs in a single canary. Each API is tested as a separate HTTP step, and CloudWatch Synthetics monitors the status of each step using step metrics and the CloudWatch Synthetics step report. CloudWatch Synthetics creates SuccessPercent and Duration metrics for each HTTP step.
   * This functionality is implemented by the {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library_Nodejs.html#CloudWatch_Synthetics_Library_executeHttpStep | executeHttpStep(stepName, requestOptions, callback, stepConfig)} function. For more information, see executeHttpStep(stepName, requestOptions, [callback], [stepConfig]).
   * The API canary blueprint is updated to use this new feature.
   * - **HTTP request reporting**: You can now view detailed HTTP requests reports which capture details such as request/response headers, response body, status code, error and performance timings, TCP connection time, TLS handshake time, first byte time, and content transfer time. All HTTP requests which use the HTTP/HTTPS module under the hood are captured here. Headers and response body are not captured by default but can be enabled by setting configuration options.
   * - **Global and step-level configuration**: You can set CloudWatch Synthetics configurations at the global level, which are applied to all steps of canaries. You can also override these configurations at the step level by passing configuration key/value pairs to enable or disable certain options.
   * For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library_Nodejs.html#CloudWatch_Synthetics_Library_SyntheticsConfiguration | SyntheticsConfiguration class}.
   * - **Continue on step failure configuration**: You can choose to continue canary execution when a step fails. For the executeHttpStep function, this is turned on by default. You can set this option once at global level or set it differently per-step.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-2.2
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_2_2 = new Runtime('syn-nodejs-2.2', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.0` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * New Features:
   * - **Upgraded dependencies**: This version uses Puppeteer version 5.5.0, Node.js 12.x, and Chromium 88.0.4298.0.
   * - **Cross-Region bucket access**: You can now specify an S3 bucket in another Region as the bucket where your canary stores its log files, screenshots, and HAR files.
   * - **New functions available**: This version adds library functions to retrieve the canary name and the Synthetics runtime version.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_0 = new Runtime('syn-nodejs-puppeteer-3.0', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.1` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * New Features:
   * - **Ability to configure CloudWatch metrics**: With this runtime, you can disable the metrics that you do not require. Otherwise, canaries publish various CloudWatch metrics for each canary run.
   * - **Screenshot linking**: You can link a screenshot to a canary step after the step has completed. To do this, you take the screenshot by using the takeScreenshot method, using the name of the step that you want to associate the screenshot with. For example, you might want to perform a step, add a wait time, and then take the screenshot.
   * - **Heartbeat monitor blueprint can monitor multiple URLs**: You can use the heartbeat monitoring blueprint in the CloudWatch console to monitor multiple URLs and see the status, duration, associated screenshots, and failure reason for each URL in the step summary of the canary run report.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.1
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_1 = new Runtime('syn-nodejs-puppeteer-3.1', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.2` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * New Features:
   * - **Visual monitoring with screenshots**: Canaries using this runtime or later can compare a screenshot taken during a run with a baseline version of the same screenshot. If the screenshots are more different than a specified percentage threshold, the canary fails. For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library_Nodejs.html#CloudWatch_Synthetics_Library_SyntheticsLogger_VisualTesting | Visual monitoring} or {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Blueprints.html#CloudWatch_Synthetics_Canaries_Blueprints_VisualTesting | Visual monitoring blueprint}.
   * - **New functions regarding sensitive data**: You can prevent sensitive data from appearing in canary logs and reports. For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library_Nodejs.html#CloudWatch_Synthetics_Library_SyntheticsLogHelper | SyntheticsLogHelper class}.
   * - **Deprecated function**: The RequestResponseLogHelper class is deprecated in favor of other new configuration options. For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library_Nodejs.html#CloudWatch_Synthetics_Library_RequestResponseLogHelper | RequestResponseLogHelper class}.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.2
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_2 = new Runtime('syn-nodejs-puppeteer-3.2', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.3` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * New Features:
   * - **More options for artifact encryption**: For canaries using this runtime or later, instead of using an AWS managed key to encrypt artifacts that the canary stores in Amazon S3, you can choose to use an AWS KMS customer managed key or an Amazon S3-managed key. For more information, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_artifact_encryption.html | Encrypting canary artifacts}.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.3
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_3 = new Runtime('syn-nodejs-puppeteer-3.3', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.4` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * New features:
   * - **Custom handler function**: You can now use a custom handler function for your canary scripts. Previous runtimes required the script entry point to include .handler.
   * You can also put canary scripts in any folder and pass the folder name as part of the handler. For example, MyFolder/MyScriptFile.functionname can be used as an entry point.
   * - **Expanded HAR file information**: You can now see bad, pending, and incomplete requests in the HAR files produced by canaries.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.4
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_4 = new Runtime('syn-nodejs-puppeteer-3.4', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.5` includes the following:
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 92.0.4512
   *
   * New features:
   * - **Updated dependencies**: The only new features in this runtime are the updated dependencies.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.5
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_5 = new Runtime('syn-nodejs-puppeteer-3.5', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.6` includes the following:
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 92.0.4512
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.6
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_6 = new Runtime('syn-nodejs-puppeteer-3.6', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.7` includes the following:
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 92.0.4512
   *
   * New Features:
   * - **Logging enhancement**: The canary will upload logs to Amazon S3 even if it times out or crashes.
   * - **Lambda layer size reduced**: The size of the Lambda layer used for canaries is reduced by 34%.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.7
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_7 = new Runtime('syn-nodejs-puppeteer-3.7', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.8` includes the following:
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 10.1.0
   * - Chromium version 92.0.4512
   *
   * New Features:
   * - **Profile cleanup**: Chromium profiles are now cleaned up after each canary run.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.8
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_8 = new Runtime('syn-nodejs-puppeteer-3.8', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.9` includes the following:
   *
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 92.0.4512
   *
   * New Features:
   * - **Dependency upgrades**: Upgrades some third-party dependency packages.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.9
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_9 = new Runtime('syn-nodejs-puppeteer-3.9', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-4.0` includes the following:
   * - Lambda runtime Node.js 16.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 92.0.4512
   *
   * New Features:
   * - **Dependency upgrades**: The Node.js dependency is updated to 16.x.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-4.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_4_0 = new Runtime('syn-nodejs-puppeteer-4.0', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-5.0` includes the following:
   * - Lambda runtime Node.js 16.x
   * - Puppeteer-core version 19.7.0
   * - Chromium version 111.0.5563.146
   *
   * New Features:
   * - **Dependency upgrade**: The Puppeteer-core version is updated to 19.7.0. The Chromium version is upgraded to 111.0.5563.146.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-5.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_5_0 = new Runtime('syn-nodejs-puppeteer-5.0', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-5.1` includes the following:
   * - Lambda runtime Node.js 16.x
   * - Puppeteer-core version 19.7.0
   * - Chromium version 111.0.5563.146
   *
   * Bug fixes:
   * - **Bug fix**: This runtime fixes a bug in `syn-nodejs-puppeteer-5.0` where the HAR files created by the canaries were missing request headers.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-5.1
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_5_1 = new Runtime('syn-nodejs-puppeteer-5.1', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-5.2` includes the following:
   * - Lambda runtime Node.js 16.x
   * - Puppeteer-core version 19.7.0
   * - Chromium version 111.0.5563.146
   *
   * New Features:
   * - **Updated versions of the bundled libraries in Chromium**
   * - **Bug fixes**
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-5.2
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_5_2 = new Runtime('syn-nodejs-puppeteer-5.2', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-6.0` includes the following:
   * - Lambda runtime Node.js 18.x
   * - Puppeteer-core version 19.7.0
   * - Chromium version 111.0.5563.146
   *
   * New Features:
   * - **Dependency upgrade**: The Node.js dependency is upgraded to 18.x.
   * Bug fixes:
   * - **Bug fix**: Clean up core dump generated when Chromium crashes during a canary run.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-6.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_6_0 = new Runtime('syn-nodejs-puppeteer-6.0', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-6.1` includes the following:
   * - Lambda runtime Node.js 18.x
   * - Puppeteer-core version 19.7.0
   * - Chromium version 111.0.5563.146
   *
   * New Features:
   * - **Stability improvements**: Added auto-retry logic for handling intermittent Puppeteer launch errors.
   * - **Dependency upgrades**: Upgrades for some third-party dependency packages.
   * - **Canaries without Amazon S3 permissions**: Bug fixes, such that canaries that don't have any Amazon S3 permissions can still run. These canaries with no Amazon S3 permissions won't be able to upload screenshots or other artifacts to Amazon S3. For more information about permissions for canaries, see {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_CanaryPermissions.html | Required roles and permissions for canaries}.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-6.1
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest NodeJS Puppeteer runtime.
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_6_1 = new Runtime('syn-nodejs-puppeteer-6.1', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-6.2` includes the following:
   * - Lambda runtime Node.js 18.x
   * - Puppeteer-core version 19.7.0
   * - Chromium version 111.0.5563.146
   *
   * New Features:
   * - **Updated versions of the bundled libraries in Chromium**
   * - **Ephemeral storage monitoring**: This runtime adds ephemeral storage monitoring in customer accounts.
   * - **Bug fixes**
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-6.1
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_6_2 = new Runtime('syn-nodejs-puppeteer-6.2', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-7.0` includes the following:
   * - Lambda runtime Node.js 18.x
   * - Puppeteer-core version 21.9.0
   * - Chromium version 121.0.6167.139
   *
   * New Features:
   * - **Updated versions of the bundled libraries in Puppeteer and Chromium**: The Puppeteer and Chromium dependencies are updated to new versions.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-7.0
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_7_0 = new Runtime('syn-nodejs-puppeteer-7.0', RuntimeFamily.NODEJS);

  /**
   * `syn-python-selenium-1.0` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 3.141.0
   * - Chromium version 83.0.4103.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-1.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Python Selenium runtime.
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_1_0 = new Runtime('syn-python-selenium-1.0', RuntimeFamily.PYTHON);

  /**
   * `syn-python-selenium-1.1` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 3.141.0
   * - Chromium version 83.0.4103.0
   *
   * New Features:
   * - **Custom handler function**: You can now use a custom handler function for your canary scripts.
   * - **Configuration options for adding metrics and step failure configurations**: These options were already available in runtimes for Node.js canaries.
   * - **Custom arguments in Chrome**: You can now open a browser in incognito mode or pass in proxy server configuration.
   * - **Cross-Region artifact buckets**: A canary can store its artifacts in an Amazon S3 bucket in a different Region.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-1.1
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Python Selenium runtime.
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_1_1 = new Runtime('syn-python-selenium-1.1', RuntimeFamily.PYTHON);

  /**
   * `syn-python-selenium-1.2` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 3.141.0
   * - Chromium version 92.0.4512.0
   *
   * New Features:
   * - **Updated dependencies**: The only new features in this runtime are the updated dependencies.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-1.2
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Python Selenium runtime.
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_1_2 = new Runtime('syn-python-selenium-1.2', RuntimeFamily.PYTHON);

  /**
   * `syn-python-selenium-1.3` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 3.141.0
   * - Chromium version 92.0.4512.0
   *
   * New Features:
   * - **More precise timestamps**: The start time and stop time of canary runs are now precise to the millisecond.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-1.3
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Python Selenium runtime.
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_1_3 = new Runtime('syn-python-selenium-1.3', RuntimeFamily.PYTHON);

  /**
   * `syn-python-selenium-2.0` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 4.10.0
   * - Chromium version 111.0.5563.146
   *
   * New Features:
   * - **Updated dependencies**: The Chromium and Selenium dependencies are updated to new versions.
   * - **More precise timestamps**: The start time and stop time of canary runs are now precise to the millisecond.
   *
   * Bug fixes:
   * - **Timestamp added**: A timestamp has been added to canary logs.
   * - **Session re-use**: A bug was fixed so that canaries are now prevented from reusing the session from their previous canary run.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-2.0
   * @deprecated Legacy runtime no longer supported by AWS Lambda. Migrate to the latest Python Selenium runtime.
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_2_0 = new Runtime('syn-python-selenium-2.0', RuntimeFamily.PYTHON);

  /**
   * `syn-python-selenium-2.1` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 4.15.1
   * - Chromium version 111.0.5563.146
   *
   * New Features:
   * - **Updated versions of the bundled libraries in Chromium**: The Chromium and Selenium dependencies are updated to new versions.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-2.0
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_2_1 = new Runtime('syn-python-selenium-2.1', RuntimeFamily.PYTHON);

  /**
   * `syn-python-selenium-3.0` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 4.15.1
   * - Chromium version 121.0.6167.139
   *
   * New Features:
   * - **Updated versions of the bundled libraries in Chromium**: The Chromium dependency is updated to a new version.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-3.0
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_3_0 = new Runtime('syn-python-selenium-3.0', RuntimeFamily.PYTHON);

  /**
    * @param name The name of the runtime version
    * @param family The Lambda runtime family
    */
  public constructor(public readonly name: string, public readonly family: RuntimeFamily) {
  }
}
