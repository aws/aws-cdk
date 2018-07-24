import { Construct, Output, Token } from "@aws-cdk/cdk";

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
    public abstract readonly hostedZoneId: HostedZoneId;

    /**
     * FQDN of this hosted zone
     */
    public abstract readonly zoneName: string;

    /**
     * Export the hosted zone
     */
    public export(): HostedZoneRefProps {
        return {
            hostedZoneId: new Output(this, 'HostedZoneId', { value: this.hostedZoneId }).makeImportValue(),
            zoneName: this.zoneName,
        };
    }
}

/**
 * Hosted zone identifier
 */
export class HostedZoneId extends Token {
}

/**
 * Reference to a hosted zone
 */
export interface HostedZoneRefProps {
    /**
     * Identifier of the hosted zone
     */
    hostedZoneId: HostedZoneId;

    /**
     * Name of the hosted zone
     */
    zoneName: string;
}

/**
 * Imported hosted zone
 */
export class ImportedHostedZone extends HostedZoneRef {
    public readonly hostedZoneId: HostedZoneId;

    public readonly zoneName: string;

    constructor(parent: Construct, name: string, props: HostedZoneRefProps) {
        super(parent, name);

        this.hostedZoneId = props.hostedZoneId;
        this.zoneName = props.zoneName;
    }
}
