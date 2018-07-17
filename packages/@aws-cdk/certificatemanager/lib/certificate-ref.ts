import { Arn, Construct, Output } from "@aws-cdk/cdk";

/**
 * Represents the ARN of a certificate
 */
export class CertificateArn extends Arn {
}

/**
 * Interface for certificate-like objects
 */
export abstract class CertificateRef extends Construct {
    /**
     * Import a certificate
     */
    public static import(parent: Construct, name: string, props: CertificateRefProps): CertificateRef {
        return new ImportedCertificate(parent, name, props);
    }

    public abstract readonly certificateArn: CertificateArn;

    /**
     * Export this certificate from the stack
     */
    public export(): CertificateRefProps {
        return {
            certificateArn: new Output(this, 'Arn', { value: this.certificateArn }).makeImportValue()
        };
    }
}

/**
 * A Certificate that has been imported from another stack
 */
class ImportedCertificate extends CertificateRef {
    public readonly certificateArn: CertificateArn;

    constructor(parent: Construct, name: string, props: CertificateRefProps) {
        super(parent, name);

        this.certificateArn = props.certificateArn;
    }
}

/**
 * Reference to an existing Certificate
 */
export interface CertificateRefProps {
    /**
     * The certificate's ARN
     */
    certificateArn: CertificateArn;
}
