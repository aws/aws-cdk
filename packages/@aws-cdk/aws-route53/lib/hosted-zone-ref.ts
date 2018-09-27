import { Construct, Output } from "@aws-cdk/cdk";

/**
 * Imported or created hosted zone
 */
export abstract class HostedZoneRef extends Construct {
  public static import(parent: Construct, name: string, props: HostedZoneRefProps): HostedZoneRef {
    return new ImportedHostedZone(parent, name, props);
  }

  /**
   * ID of this hosted zone
   */
  public abstract readonly hostedZoneId: string;

  /**
   * FQDN of this hosted zone
   */
  public abstract readonly zoneName: string;

  /**
   * Export the hosted zone
   */
  public export(): HostedZoneRefProps {
    return {
      hostedZoneId: new Output(this, 'HostedZoneId', { value: this.hostedZoneId }).makeImportValue().toString(),
      zoneName: this.zoneName,
    };
  }
}

/**
 * Reference to a hosted zone
 */
export interface HostedZoneRefProps {
  /**
   * Identifier of the hosted zone
   */
  hostedZoneId: string;

  /**
   * Name of the hosted zone
   */
  zoneName: string;
}

/**
 * Imported hosted zone
 */
export class ImportedHostedZone extends HostedZoneRef {
  public readonly hostedZoneId: string;

  public readonly zoneName: string;

  constructor(parent: Construct, name: string, props: HostedZoneRefProps) {
    super(parent, name);

    this.hostedZoneId = props.hostedZoneId;
    this.zoneName = props.zoneName;
  }
}
