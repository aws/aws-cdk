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
   * **Deprecated by AWS Synthetics. You can't create canaries with deprecated runtimes.**
   *
   * `syn-1.0` includes the following:
   *
   * - Synthetics library 1.0
   * - Synthetics handler code 1.0
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 1.14.0
   * - The Chromium version that matches Puppeteer-core 1.14.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-1.0
   */
  public static readonly SYNTHETICS_1_0 = new Runtime('syn-1.0', RuntimeFamily.NODEJS);

  /**
   * **Deprecated by AWS Synthetics. You can't create canaries with deprecated runtimes.**
   *
   * `syn-nodejs-2.0` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 3.3.0
   * - Chromium version 83.0.4103.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-2.0
   */
  public static readonly SYNTHETICS_NODEJS_2_0 = new Runtime('syn-nodejs-2.0', RuntimeFamily.NODEJS);


  /**
   * **Deprecated by AWS Synthetics. You can't create canaries with deprecated runtimes.**
   *
   * `syn-nodejs-2.1` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 3.3.0
   * - Chromium version 83.0.4103.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-2.1
   */
  public static readonly SYNTHETICS_NODEJS_2_1 = new Runtime('syn-nodejs-2.1', RuntimeFamily.NODEJS);

  /**
   * **Deprecated by AWS Synthetics. You can't create canaries with deprecated runtimes.**
   *
   * `syn-nodejs-2.2` includes the following:
   * - Lambda runtime Node.js 10.x
   * - Puppeteer-core version 3.3.0
   * - Chromium version 83.0.4103.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-2.2
   */
  public static readonly SYNTHETICS_NODEJS_2_2 = new Runtime('syn-nodejs-2.2', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.0` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.0
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_0 = new Runtime('syn-nodejs-puppeteer-3.0', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.1` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.1
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_1 = new Runtime('syn-nodejs-puppeteer-3.1', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.2` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.2
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_2 = new Runtime('syn-nodejs-puppeteer-3.2', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.3` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.3
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_3 = new Runtime('syn-nodejs-puppeteer-3.3', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.4` includes the following:
   * - Lambda runtime Node.js 12.x
   * - Puppeteer-core version 5.5.0
   * - Chromium version 88.0.4298.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.4
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_4 = new Runtime('syn-nodejs-puppeteer-3.4', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.5` includes the following:
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 10.1.0
   * - Chromium version 92.0.4512
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.5
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_5 = new Runtime('syn-nodejs-puppeteer-3.5', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.6` includes the following:
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 10.1.0
   * - Chromium version 92.0.4512
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.6
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_6 = new Runtime('syn-nodejs-puppeteer-3.6', RuntimeFamily.NODEJS);

  /**
   * `syn-nodejs-puppeteer-3.7` includes the following:
   * - Lambda runtime Node.js 14.x
   * - Puppeteer-core version 10.1.0
   * - Chromium version 92.0.4512
   *
   * New Features:
   * - **Logging enhancement**: The canary will upload logs to Amazon S3 even if it times out or crashes.
   * - **Lambda layer size reduced**: The size of the Lambda layer used for canaries is reduced by 34%.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_nodejs_puppeteer.html#CloudWatch_Synthetics_runtimeversion-nodejs-puppeteer-3.7
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
   */
  public static readonly SYNTHETICS_NODEJS_PUPPETEER_3_8 = new Runtime('syn-nodejs-puppeteer-3.8', RuntimeFamily.NODEJS);

  /**
   * `syn-python-selenium-1.0` includes the following:
   * - Lambda runtime Python 3.8
   * - Selenium version 3.141.0
   * - Chromium version 83.0.4103.0
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_python_selenium.html
   */
  public static readonly SYNTHETICS_PYTHON_SELENIUM_1_0 = new Runtime('syn-python-selenium-1.0', RuntimeFamily.PYTHON);

  /**
    * @param name The name of the runtime version
    * @param family The Lambda runtime family
    */
  public constructor(public readonly name: string, public readonly family: RuntimeFamily) {
  }
}
