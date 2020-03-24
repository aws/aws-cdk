/**
 * Provides default values for certain regional information points.
 */
export class Default {
  /**
   * Computes a "standard" AWS Service principal for a given service, region and suffix. This is useful for example when
   * you need to compute a service principal name, but you do not have a synthesize-time region literal available (so
   * all you have is `{ "Ref": "AWS::Region" }`). This way you get the same defaulting behavior that is normally used
   * for built-in data.
   *
   * @param service   the name of the service (s3, s3.amazonaws.com, ...)
   * @param region    the region in which the service principal is needed.
   * @param urlSuffix the URL suffix for the partition in which the region is located.
   */
  public static servicePrincipal(service: string, region: string, urlSuffix: string): string {
    const matches = service.match(/^([^.]+)(?:\.amazonaws\.com(?:\.cn)?)?$/);
    if (!matches) {
      // Return "service" if it does not look like any of the following:
      // - s3
      // - s3.amazonaws.com
      // - s3.amazonaws.com.cn
      return service;
    }

    service = matches[1]; // Simplify the service name down to something like "s3"
    switch (service) {
      // Services with a regional AND partitional principal
      case 'codedeploy':
      case 'logs':
        return `${service}.${region}.${urlSuffix}`;

      // Services with a regional principal
      case 'states':
        return `${service}.${region}.amazonaws.com`;

      // Services with a partitional principal
      case 'ec2':
        return `${service}.${urlSuffix}`;

      // Services with a universal principal across all regions/partitions (the default case)
      default:
          return `${service}.amazonaws.com`;

    }
  }

  private constructor() { }
}
