import { Construct } from 'constructs';
import { ILogGroup } from './log-group';
import { IBucket } from '../../aws-s3';
import { Stack } from '../../core';
/**
 * Creates a data protection policy for CloudWatch Logs log groups.
 */
export class DataProtectionPolicy {

  private readonly dataProtectionPolicyProps: DataProtectionPolicyProps;

  constructor(props: DataProtectionPolicyProps) {
    if (props.identifiers.length == 0) {
      throw new Error('DataIdentifier cannot be empty');
    }
    this.dataProtectionPolicyProps = props;
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct): DataProtectionPolicyConfig {
    const name = this.dataProtectionPolicyProps.name || 'data-protection-policy-cdk';
    const description = this.dataProtectionPolicyProps.description || 'cdk generated data protection policy';
    const version = '2021-06-01';

    const findingsDestination: PolicyFindingsDestination = {};
    if (this.dataProtectionPolicyProps.logGroupAuditDestination) {
      findingsDestination.cloudWatchLogs = {
        logGroup: this.dataProtectionPolicyProps.logGroupAuditDestination.logGroupName,
      };
    }

    if (this.dataProtectionPolicyProps.s3BucketAuditDestination) {
      findingsDestination.s3 = {
        bucket: this.dataProtectionPolicyProps.s3BucketAuditDestination.bucketName,
      };
    }

    if (this.dataProtectionPolicyProps.deliveryStreamNameAuditDestination) {
      findingsDestination.firehose = {
        deliveryStream: this.dataProtectionPolicyProps.deliveryStreamNameAuditDestination,
      };
    }

    const identifiers: string[] = [];
    const customDataIdentifiers: PolicyCustomDataIdentifier[] = [];
    for (let identifier of this.dataProtectionPolicyProps.identifiers) {
      if (identifier instanceof CustomDataIdentifier) {
        identifiers.push(identifier.name);
        customDataIdentifiers.push({
          name: identifier.name,
          regex: identifier.regex,
        });
      } else {
        identifiers.push(Stack.of(_scope).formatArn({
          resource: 'data-identifier',
          region: '',
          account: 'aws',
          service: 'dataprotection',
          resourceName: identifier.name,
        }));
      }
    };

    const statement = [
      {
        sid: 'audit-statement-cdk',
        dataIdentifier: identifiers,
        operation: {
          audit: {
            findingsDestination: findingsDestination,
          },
        },
      },
      {
        sid: 'redact-statement-cdk',
        dataIdentifier: identifiers,
        operation: {
          deidentify: {
            maskConfig: {},
          },
        },
      },
    ];

    const configuration: PolicyConfiguration = {
      customDataIdentifier: customDataIdentifiers,
    };
    return { name, description, version, configuration, statement };
  }
}

interface PolicyConfiguration {
  customDataIdentifier?: PolicyCustomDataIdentifier[];
}

interface PolicyCustomDataIdentifier {
  name: string;
  regex: string;
}

interface PolicyFindingsDestination {
  cloudWatchLogs?: PolicyCloudWatchLogsDestination;
  firehose?: PolicyFirehoseDestination;
  s3?: PolicyS3Destination;
}

interface PolicyCloudWatchLogsDestination {
  logGroup: string;
}

interface PolicyFirehoseDestination {
  deliveryStream: string;
}

interface PolicyS3Destination {
  bucket: string;
}

/**
 * Interface representing a data protection policy
 */
export interface DataProtectionPolicyConfig {
  /**
   * Name of the data protection policy
   *
   * @default - 'data-protection-policy-cdk'
   */
  readonly name: string;

  /**
   * Description of the data protection policy
   *
   * @default - 'cdk generated data protection policy'
   */
  readonly description: string;

  /**
   * Version of the data protection policy
   */
  readonly version: string;

  /**
   * Configuration of the data protection policy. Currently supports custom data identifiers
   */
  readonly configuration: PolicyConfiguration;

  /**
   * Statements within the data protection policy. Must contain one Audit and one Redact statement
   */
  readonly statement: any;
}

/**
 * Properties for creating a data protection policy
 */
export interface DataProtectionPolicyProps {
  /**
   * Name of the data protection policy
   *
   * @default - 'data-protection-policy-cdk'
   */
  readonly name?: string;

  /**
   * Description of the data protection policy
   *
   * @default - 'cdk generated data protection policy'
   */
  readonly description?: string;

  /**
   * List of data protection identifiers, containing managed or custom data identfiers (CustomDataIdentifier).
   * Managed data identiers must be in the following list: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-managed-data-identifiers.html
   * Custom data identfiers must have a valid regex defined: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-custom-data-identifiers.html
   *
   */
  readonly identifiers: DataIdentifier[];

  /**
   * CloudWatch Logs log group to send audit findings to. The log group must already exist prior to creating the data protection policy.
   *
   * @default - no CloudWatch Logs audit destination
   */
  readonly logGroupAuditDestination?: ILogGroup;

  /**
   * S3 bucket to send audit findings to. The bucket must already exist.
   *
   * @default - no S3 bucket audit destination
   */
  readonly s3BucketAuditDestination?: IBucket;

  /**
   * Amazon Kinesis Data Firehose delivery stream to send audit findings to. The delivery stream must already exist.
   *
   * @default - no firehose delivery stream audit destination
   */
  readonly deliveryStreamNameAuditDestination?: string;
}

/**
 * A data protection identifier. If an identifier is supported but not in this class, it can be passed in the constructor instead.
 */
export class DataIdentifier {
  public static readonly ADDRESS = new DataIdentifier('Address');
  public static readonly AWSSECRETKEY = new DataIdentifier('AwsSecretKey');
  public static readonly BANKACCOUNTNUMBER_DE = new DataIdentifier('BankAccountNumber-DE');
  public static readonly BANKACCOUNTNUMBER_ES = new DataIdentifier('BankAccountNumber-ES');
  public static readonly BANKACCOUNTNUMBER_FR = new DataIdentifier('BankAccountNumber-FR');
  public static readonly BANKACCOUNTNUMBER_GB = new DataIdentifier('BankAccountNumber-GB');
  public static readonly BANKACCOUNTNUMBER_IT = new DataIdentifier('BankAccountNumber-IT');
  public static readonly BANKACCOUNTNUMBER_US = new DataIdentifier('BankAccountNumber-US');
  public static readonly CEPCODE_BR = new DataIdentifier('CepCode-BR');
  public static readonly CNPJ_BR = new DataIdentifier('Cnpj-BR');
  public static readonly CPFCODE_BR = new DataIdentifier('CpfCode-BR');
  public static readonly CREDITCARDEXPIRATION = new DataIdentifier('CreditCardExpiration');
  public static readonly CREDITCARDNUMBER = new DataIdentifier('CreditCardNumber');
  public static readonly CREDITCARDSECURITYCODE = new DataIdentifier('CreditCardSecurityCode');
  public static readonly DRIVERSLICENSE_AT = new DataIdentifier('DriversLicense-AT');
  public static readonly DRIVERSLICENSE_AU = new DataIdentifier('DriversLicense-AU');
  public static readonly DRIVERSLICENSE_BE = new DataIdentifier('DriversLicense-BE');
  public static readonly DRIVERSLICENSE_BG = new DataIdentifier('DriversLicense-BG');
  public static readonly DRIVERSLICENSE_CA = new DataIdentifier('DriversLicense-CA');
  public static readonly DRIVERSLICENSE_CY = new DataIdentifier('DriversLicense-CY');
  public static readonly DRIVERSLICENSE_CZ = new DataIdentifier('DriversLicense-CZ');
  public static readonly DRIVERSLICENSE_DE = new DataIdentifier('DriversLicense-DE');
  public static readonly DRIVERSLICENSE_DK = new DataIdentifier('DriversLicense-DK');
  public static readonly DRIVERSLICENSE_EE = new DataIdentifier('DriversLicense-EE');
  public static readonly DRIVERSLICENSE_ES = new DataIdentifier('DriversLicense-ES');
  public static readonly DRIVERSLICENSE_FI = new DataIdentifier('DriversLicense-FI');
  public static readonly DRIVERSLICENSE_FR = new DataIdentifier('DriversLicense-FR');
  public static readonly DRIVERSLICENSE_GB = new DataIdentifier('DriversLicense-GB');
  public static readonly DRIVERSLICENSE_GR = new DataIdentifier('DriversLicense-GR');
  public static readonly DRIVERSLICENSE_HR = new DataIdentifier('DriversLicense-HR');
  public static readonly DRIVERSLICENSE_HU = new DataIdentifier('DriversLicense-HU');
  public static readonly DRIVERSLICENSE_IE = new DataIdentifier('DriversLicense-IE');
  public static readonly DRIVERSLICENSE_IT = new DataIdentifier('DriversLicense-IT');
  public static readonly DRIVERSLICENSE_LT = new DataIdentifier('DriversLicense-LT');
  public static readonly DRIVERSLICENSE_LU = new DataIdentifier('DriversLicense-LU');
  public static readonly DRIVERSLICENSE_LV = new DataIdentifier('DriversLicense-LV');
  public static readonly DRIVERSLICENSE_MT = new DataIdentifier('DriversLicense-MT');
  public static readonly DRIVERSLICENSE_NL = new DataIdentifier('DriversLicense-NL');
  public static readonly DRIVERSLICENSE_PL = new DataIdentifier('DriversLicense-PL');
  public static readonly DRIVERSLICENSE_PT = new DataIdentifier('DriversLicense-PT');
  public static readonly DRIVERSLICENSE_RO = new DataIdentifier('DriversLicense-RO');
  public static readonly DRIVERSLICENSE_SE = new DataIdentifier('DriversLicense-SE');
  public static readonly DRIVERSLICENSE_SI = new DataIdentifier('DriversLicense-SI');
  public static readonly DRIVERSLICENSE_SK = new DataIdentifier('DriversLicense-SK');
  public static readonly DRIVERSLICENSE_US = new DataIdentifier('DriversLicense-US');
  public static readonly DRUGENFORCEMENTAGENCYNUMBER_US = new DataIdentifier('DrugEnforcementAgencyNumber-US');
  public static readonly ELECTORALROLLNUMBER_GB = new DataIdentifier('ElectoralRollNumber-GB');
  public static readonly EMAILADDRESS = new DataIdentifier('EmailAddress');
  public static readonly HEALTHINSURANCECARDNUMBER_EU = new DataIdentifier('HealthInsuranceCardNumber-EU');
  public static readonly HEALTHINSURANCECLAIMNUMBER_US = new DataIdentifier('HealthInsuranceClaimNumber-US');
  public static readonly HEALTHINSURANCENUMBER_FR = new DataIdentifier('HealthInsuranceNumber-FR');
  public static readonly HEALTHCAREPROCEDURECODE_US = new DataIdentifier('HealthcareProcedureCode-US');
  public static readonly INDIVIDUALTAXIDENTIFICATIONNUMBER_US = new DataIdentifier('IndividualTaxIdentificationNumber-US');
  public static readonly INSEECODE_FR = new DataIdentifier('InseeCode-FR');
  public static readonly IPADDRESS = new DataIdentifier('IpAddress');
  public static readonly LATLONG = new DataIdentifier('LatLong');
  public static readonly MEDICAREBENEFICIARYNUMBER_US = new DataIdentifier('MedicareBeneficiaryNumber-US');
  public static readonly NAME = new DataIdentifier('Name');
  public static readonly NATIONALDRUGCODE_US = new DataIdentifier('NationalDrugCode-US');
  public static readonly NATIONALIDENTIFICATIONNUMBER_DE = new DataIdentifier('NationalIdentificationNumber-DE');
  public static readonly NATIONALIDENTIFICATIONNUMBER_ES = new DataIdentifier('NationalIdentificationNumber-ES');
  public static readonly NATIONALIDENTIFICATIONNUMBER_IT = new DataIdentifier('NationalIdentificationNumber-IT');
  public static readonly NATIONALINSURANCENUMBER_GB = new DataIdentifier('NationalInsuranceNumber-GB');
  public static readonly NATIONALPROVIDERID_US = new DataIdentifier('NationalProviderId-US');
  public static readonly NHSNUMBER_GB = new DataIdentifier('NhsNumber-GB');
  public static readonly NIENUMBER_ES = new DataIdentifier('NieNumber-ES');
  public static readonly NIFNUMBER_ES = new DataIdentifier('NifNumber-ES');
  public static readonly OPENSSHPRIVATEKEY = new DataIdentifier('OpenSshPrivateKey');
  public static readonly PASSPORTNUMBER_CA = new DataIdentifier('PassportNumber-CA');
  public static readonly PASSPORTNUMBER_DE = new DataIdentifier('PassportNumber-DE');
  public static readonly PASSPORTNUMBER_ES = new DataIdentifier('PassportNumber-ES');
  public static readonly PASSPORTNUMBER_FR = new DataIdentifier('PassportNumber-FR');
  public static readonly PASSPORTNUMBER_GB = new DataIdentifier('PassportNumber-GB');
  public static readonly PASSPORTNUMBER_IT = new DataIdentifier('PassportNumber-IT');
  public static readonly PASSPORTNUMBER_US = new DataIdentifier('PassportNumber-US');
  public static readonly PERMANENTRESIDENCENUMBER_CA = new DataIdentifier('PermanentResidenceNumber-CA');
  public static readonly PERSONALHEALTHNUMBER_CA = new DataIdentifier('PersonalHealthNumber-CA');
  public static readonly PGPPRIVATEKEY = new DataIdentifier('PgpPrivateKey');
  public static readonly PHONENUMBER_BR = new DataIdentifier('PhoneNumber-BR');
  public static readonly PHONENUMBER_DE = new DataIdentifier('PhoneNumber-DE');
  public static readonly PHONENUMBER_ES = new DataIdentifier('PhoneNumber-ES');
  public static readonly PHONENUMBER_FR = new DataIdentifier('PhoneNumber-FR');
  public static readonly PHONENUMBER_GB = new DataIdentifier('PhoneNumber-GB');
  public static readonly PHONENUMBER_IT = new DataIdentifier('PhoneNumber-IT');
  public static readonly PHONENUMBER_US = new DataIdentifier('PhoneNumber-US');
  public static readonly PKCSPRIVATEKEY = new DataIdentifier('PkcsPrivateKey');
  public static readonly POSTALCODE_CA = new DataIdentifier('PostalCode-CA');
  public static readonly PUTTYPRIVATEKEY = new DataIdentifier('PuttyPrivateKey');
  public static readonly RGNUMBER_BR = new DataIdentifier('RgNumber-BR');
  public static readonly SOCIALINSURANCENUMBER_CA = new DataIdentifier('SocialInsuranceNumber-CA');
  public static readonly SSN_ES = new DataIdentifier('Ssn-ES');
  public static readonly SSN_US = new DataIdentifier('Ssn-US');
  public static readonly TAXID_DE = new DataIdentifier('TaxId-DE');
  public static readonly TAXID_ES = new DataIdentifier('TaxId-ES');
  public static readonly TAXID_FR = new DataIdentifier('TaxId-FR');
  public static readonly TAXID_GB = new DataIdentifier('TaxId-GB');
  public static readonly VEHICLEIDENTIFICATIONNUMBER = new DataIdentifier('VehicleIdentificationNumber');
  public static readonly ZIPCODE_US = new DataIdentifier('ZipCode-US');

  /**
   * Create a managed data identifier not in the list of static members. This is used to maintain forward compatibility, in case a new managed identifier is supported but not updated in CDK yet.
   * @param name - name of the identifier.
   */
  constructor(public readonly name: string) { }

  public toString(): string {
    return this.name;
  }
}

/**
 * A custom data identifier. Include a custom data identifier name and regular expression in the JSON policy used to define the data protection policy.
 * https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-custom-data-identifiers.html
 */
export class CustomDataIdentifier extends DataIdentifier {
  /**
   * Create a custom data identfier
   * @param name - the name of the custom data identifier. This cannot share the same name as a managed data identifier.
   * @param regex - the regular expresssion to detect and mask log events for.
   */
  constructor(public readonly name: string, public readonly regex: string) {
    super(name);
  }

  /**
   * String representation of a CustomDataIdentifier
   * @returns the name and RegEx of the custom data identifier
   */
  public toString(): string {
    return `${this.name}: ${this.regex}`;
  }
}
