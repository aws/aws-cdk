import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, ConstructScopeSettings } from "constructs";

/**
 * Configures the construct scope to use legacy values for error/warning/info metadata keys
 * as well as disable stack traces if needed.
 */
export function applyLegacyConstructSettings(scope: Construct) {
  const settings = ConstructScopeSettings.of(scope);
  if (scope.node.tryGetContext(cxapi.DISABLE_METADATA_STACK_TRACE) || process.env.CDK_DISABLE_STACK_TRACE) {
    settings.disableStackTraces();
  }

  settings.errorMetadataKey = cxschema.ArtifactMetadataEntryType.ERROR;
  settings.warningMetadataKey = cxschema.ArtifactMetadataEntryType.WARN;
  settings.infoMetadataKey = cxschema.ArtifactMetadataEntryType.INFO;
}