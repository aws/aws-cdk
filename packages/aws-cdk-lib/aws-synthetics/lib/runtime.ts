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
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-6.2
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
   * `syn-nodejs-puppeteer-8.0` includes the following:
   * - Lambda runtime Node.js 20.x
   * - Puppeteer-core version 22.10.0
   * - Chromium version 125.0.6422.112
   *
   * New Features:
   * - **Support for two-factor authentication**
   * - **Bug fixes** for situations where some service clients were losing data in Node.js SDK V3 responses.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-8.0
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_8_0 = new Runtime('syn-nodejs-puppeteer-8.0', RuntimeFamily.NODEJS);

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
   *
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
   * `syn-python-selenium-4.0` includes the following:
   * - Lambda runtime Python 3.9
   * - Selenium version 4.15.1
   * - Chromium version 126.0.6478.126
   *
   * New Features:
   * - **Bug fixes** for errors in HAR parser logging.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html#CloudWatch_Synthetics_runtimeversion-syn-python-selenium-4.0
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_4_0 = new Runtime('syn-python-selenium-4.0', RuntimeFamily.PYTHON);

  /**
    * @param name The name of the runtime version
    * @param family The Lambda runtime family
    */
  public constructor(public readonly name: string, public readonly family: RuntimeFamily) {
  }
}
