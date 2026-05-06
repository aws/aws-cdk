import type { IPolicyValidationPlugin, IPolicyValidationContext } from '../validation';
import type { PolicyValidationPluginReport } from '../validation/report';
import type { NamedValidationPluginReport } from '../validation/private/report';

/**
 * Wraps the annotation collection logic as an IPolicyValidationPlugin
 * so it can be run through the same unified plugin loop.
 */
export class AnnotationPlugin implements IPolicyValidationPlugin {
  public readonly name = 'Construct Annotations';

  constructor(private readonly report: NamedValidationPluginReport) {}

  public validate(_context: IPolicyValidationContext): PolicyValidationPluginReport {
    return this.report;
  }
}
