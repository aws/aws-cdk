/**
 * Provides default values for certain regional information points.
 */
export class Default {

  /**
   * The default value for a VPC Endpoint Service name prefix, useful if you do
   * not have a synthesize-time region literal available (all you have is
   * `{ "Ref": "AWS::Region" }`)
   */
  public static readonly VPC_ENDPOINT_SERVICE_NAME_PREFIX = 'com.amazonaws.vpce';

  /**
   * Computes a "standard" AWS Service principal for a given service, region and suffix. This is useful for example when
   * you need to compute a service principal name, but you do not have a synthesize-time region literal available (so
   * all you have is `{ "Ref": "AWS::Region" }`). This way you get the same defaulting behavior that is normally used
   * for built-in data.
   *
   * @param serviceFqn the name of the service (s3, s3.amazonaws.com, ...)
   * @param region    the region in which the service principal is needed.
   * @param urlSuffix deprecated and ignored.
   */
  public static servicePrincipal(serviceFqn: string, region: string, urlSuffix: string): string {
    // NOTE: this whole method is deprecated, and should not be used or updated anymore. The global service
    // principal is always correct, when referenced from within a region.
    // (As a note, regional principals (`<SERVICE>.<REGION>.amazonaws.com`) are required in
    // case of a cross-region reference to an opt-in region, but that's the only case, and that is not
    // controlled here).
    //
    // (It cannot be actually @deprecated since many of our tests use it :D)

    const serviceName = extractSimpleName(serviceFqn);
    if (!serviceName) {
      // Return "service" if it does not look like any of the following:
      // - s3
      // - s3.amazonaws.com
      // - s3.amazonaws.com.cn
      // - s3.c2s.ic.gov
      // - s3.sc2s.sgov.gov
      return serviceFqn;
    }

    function determineConfiguration(service: string): (service: string, region: string, urlSuffix: string) => string {
      function universal(s: string) { return `${s}.amazonaws.com`; }
      function partitional(s: string, _: string, u: string) { return `${s}.${u}`; }
      function regional(s: string, r: string) { return `${s}.${r}.amazonaws.com`; }
      function regionalPartitional(s: string, r: string, u: string) { return `${s}.${r}.${u}`; }

      // Exceptions for Service Principals in us-iso-*
      const US_ISO_EXCEPTIONS = new Set([
        'cloudhsm',
        'config',
        'states',
        'workspaces',
      ]);

      // Account for idiosyncratic Service Principals in `us-iso-*` regions
      if (region.startsWith('us-iso-') && US_ISO_EXCEPTIONS.has(service)) {
        switch (service) {
          // Services with universal principal
          case ('states'):
            return universal;

          // Services with a partitional principal
          default:
            return partitional;
        }
      }

      // Exceptions for Service Principals in us-isob-*
      const US_ISOB_EXCEPTIONS = new Set([
        'dms',
        'states',
      ]);

      // Account for idiosyncratic Service Principals in `us-isob-*` regions
      if (region.startsWith('us-isob-') && US_ISOB_EXCEPTIONS.has(service)) {
        switch (service) {
          // Services with universal principal
          case ('states'):
            return universal;

          // Services with a partitional principal
          default:
            return partitional;
        }
      }

      switch (service) {
        // CodeDeploy is regional+partitional in CN, only regional everywhere else
        case 'codedeploy':
          return region.startsWith('cn-')
            ? regionalPartitional
            // ...except in the isolated regions, where it's universal
            : (region.startsWith('us-iso') ? universal : regional);

        // Services with a regional AND partitional principal
        case 'logs':
          return regionalPartitional;

        // Services with a regional principal
        case 'states':
          return regional;

        case 'elasticmapreduce':
          return region.startsWith('cn-')
            ? partitional
            : universal;

        // Services with a universal principal across all regions/partitions (the default case)
        default:
          return universal;

      }
    };

    const configuration = determineConfiguration(serviceName);
    return configuration(serviceName, region, urlSuffix);
  }

  private constructor() { }
}

function extractSimpleName(serviceFqn: string) {
  const matches = serviceFqn.match(/^([^.]+)(?:(?:\.amazonaws\.com(?:\.cn)?)|(?:\.c2s\.ic\.gov)|(?:\.sc2s\.sgov\.gov))?$/);
  return matches ? matches[1] : undefined;
}
