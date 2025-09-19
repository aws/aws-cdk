import { Construct } from 'constructs';
import { ILogGroup } from '../../aws-logs';
import { IBucket } from '../../aws-s3';
import { UnscopedValidationError, Token } from '../../core';

/**
 * Configuration returned by data protection policy binding
 */
export interface DataProtectionPolicyConfig {
  /**
   * The name of the data protection policy
   */
  readonly name: string;

  /**
   * The description of the data protection policy
   */
  readonly description: string;

  /**
   * The version of the data protection policy
   */
  readonly version: string;

  /**
   * The policy statements for the data protection policy
   */
  readonly statement: any[];

  /**
   * The configuration for custom data identifiers
   */
  readonly configuration: any;
}

/**
 * Represents a data protection policy that can be applied to SNS topics
 */
export interface IDataProtectionPolicy {
  /**
   * Binds this data protection policy to a construct scope
   * @internal
   */
  _bind(scope: Construct): DataProtectionPolicyConfig;
}

const IS_DATA_PROTECTION_POLICY = Symbol.for('@aws-cdk/aws-sns.DataProtectionPolicy');

/**
 * Creates a data protection policy for SNS topics.
 */
export class DataProtectionPolicy implements IDataProtectionPolicy {
  /**
   * Check if the given object is a DataProtectionPolicy
   */
  public static isDataProtectionPolicy(x: any): x is DataProtectionPolicy {
    return x != null && typeof x === 'object' && IS_DATA_PROTECTION_POLICY in x;
  }
  private readonly dataProtectionPolicyProps: DataProtectionPolicyProps;

  constructor(props: DataProtectionPolicyProps) {
    if (props.identifiers.length == 0) {
      throw new UnscopedValidationError('DataIdentifier cannot be empty');
    }

    Object.defineProperty(this, IS_DATA_PROTECTION_POLICY, { value: true });

    this.dataProtectionPolicyProps = props;
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct): DataProtectionPolicyConfig {
    const name = this.dataProtectionPolicyProps.name || 'data-protection-policy-cdk';
    const description = this.dataProtectionPolicyProps.description || 'cdk generated data protection policy';
    const version = '2021-06-01';

    const findingsDestination: any = {};
    if (this.dataProtectionPolicyProps.logGroupAuditDestination) {
      const logGroup = this.dataProtectionPolicyProps.logGroupAuditDestination;
      const logGroupName = logGroup.logGroupName;

      // Try to get the physical name if available (for validation)
      let nameToValidate = logGroupName;
      if ('physicalName' in logGroup && typeof logGroup.physicalName === 'string' && logGroup.physicalName && !Token.isUnresolved(logGroup.physicalName)) {
        nameToValidate = logGroup.physicalName;
      }

      // Only validate if it's not a token (i.e., it's a concrete string value)
      const isToken = Token.isUnresolved(nameToValidate);
      if (!isToken && !nameToValidate.startsWith('/aws/vendedlogs/')) {
        throw new UnscopedValidationError(`CloudWatch log group for SNS data protection policy audit destination must start with '/aws/vendedlogs/', got: ${nameToValidate}`);
      }
      findingsDestination.CloudWatchLogs = {
        LogGroup: logGroupName,
      };
    }

    if (this.dataProtectionPolicyProps.s3BucketAuditDestination) {
      findingsDestination.S3 = {
        Bucket: this.dataProtectionPolicyProps.s3BucketAuditDestination.bucketName,
      };
    }

    if (this.dataProtectionPolicyProps.deliveryStreamNameAuditDestination) {
      findingsDestination.Firehose = {
        DeliveryStream: this.dataProtectionPolicyProps.deliveryStreamNameAuditDestination,
      };
    }

    const identifiers: string[] = [];
    const customDataIdentifiers = [];
    for (let identifier of this.dataProtectionPolicyProps.identifiers) {
      if (identifier instanceof CustomDataIdentifier) {
        identifiers.push(identifier.name);
        customDataIdentifiers.push({
          Name: identifier.name,
          Regex: identifier.regex,
        });
      } else {
        // Use static ARN format - managed data identifiers are always in the standard AWS partition
        // This avoids CloudFormation intrinsic functions that would convert the entire policy to a string
        // eslint-disable-next-line @cdklabs/no-literal-partition
        identifiers.push(`arn:aws:dataprotection::aws:data-identifier/${identifier.name}`);
      }
    }

    const statement = [
      {
        Sid: 'audit-statement-cdk',
        DataIdentifier: identifiers,
        DataDirection: 'Inbound',
        Principal: ['*'],
        Operation: {
          Audit: {
            SampleRate: 99,
            FindingsDestination: findingsDestination,
          },
        },
      },
      {
        Sid: 'redact-statement-cdk',
        DataIdentifier: identifiers,
        DataDirection: 'Inbound',
        Principal: ['*'],
        Operation: {
          Deidentify: {
            MaskConfig: {},
          },
        },
      },
    ];

    const configuration = {
      CustomDataIdentifier: customDataIdentifiers,
    };

    return {
      name,
      description,
      version,
      statement,
      configuration,
    };
  }
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
   * List of data protection identifiers.
   *
   * Managed data identifiers must be in the following list: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-managed-data-identifiers.html
   * Custom data identifiers must have a valid regex defined: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-custom-data-identifiers.html#custom-data-identifiers-constraints
   */
  readonly identifiers: DataIdentifier[];

  /**
   * CloudWatch Logs log group to send audit findings to. The log group must already exist prior to creating the data protection policy.
   *
   * The log group name must start with '/aws/vendedlogs/' as required by AWS for SNS data protection policy audit destinations.
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
   * Amazon Data Firehose delivery stream to send audit findings to. The delivery stream must already exist.
   *
   * @default - no firehose delivery stream audit destination
   */
  readonly deliveryStreamNameAuditDestination?: string;
}

/**
 * A data protection identifier. If an identifier is supported but not in this class, it can be passed in the constructor instead.
 */
export class DataIdentifier {
  /** Address data identifier */
  public static readonly ADDRESS = new DataIdentifier('Address');
  /** AWS Secret Key data identifier */
  public static readonly AWSSECRETKEY = new DataIdentifier('AwsSecretKey');
  /** Bank Account Number (Germany) data identifier */
  public static readonly BANKACCOUNTNUMBER_DE = new DataIdentifier('BankAccountNumber-DE');
  /** Bank Account Number (Spain) data identifier */
  public static readonly BANKACCOUNTNUMBER_ES = new DataIdentifier('BankAccountNumber-ES');
  /** Bank Account Number (France) data identifier */
  public static readonly BANKACCOUNTNUMBER_FR = new DataIdentifier('BankAccountNumber-FR');
  /** Bank Account Number (United Kingdom) data identifier */
  public static readonly BANKACCOUNTNUMBER_GB = new DataIdentifier('BankAccountNumber-GB');
  /** Bank Account Number (Italy) data identifier */
  public static readonly BANKACCOUNTNUMBER_IT = new DataIdentifier('BankAccountNumber-IT');
  /** Bank Account Number (United States) data identifier */
  public static readonly BANKACCOUNTNUMBER_US = new DataIdentifier('BankAccountNumber-US');
  /** CEP Code (Brazil) data identifier */
  public static readonly CEPCODE_BR = new DataIdentifier('CepCode-BR');
  /** CNPJ (Brazil) data identifier */
  public static readonly CNPJ_BR = new DataIdentifier('Cnpj-BR');
  /** CPF Code (Brazil) data identifier */
  public static readonly CPFCODE_BR = new DataIdentifier('CpfCode-BR');
  /** Credit Card Expiration data identifier */
  public static readonly CREDITCARDEXPIRATION = new DataIdentifier('CreditCardExpiration');
  /** Credit Card Number data identifier */
  public static readonly CREDITCARDNUMBER = new DataIdentifier('CreditCardNumber');
  /** Credit Card Security Code data identifier */
  public static readonly CREDITCARDSECURITYCODE = new DataIdentifier('CreditCardSecurityCode');
  /** Driver's License (Austria) data identifier */
  public static readonly DRIVERSLICENSE_AT = new DataIdentifier('DriversLicense-AT');
  /** Driver's License (Australia) data identifier */
  public static readonly DRIVERSLICENSE_AU = new DataIdentifier('DriversLicense-AU');
  /** Driver's License (Belgium) data identifier */
  public static readonly DRIVERSLICENSE_BE = new DataIdentifier('DriversLicense-BE');
  /** Driver's License (Bulgaria) data identifier */
  public static readonly DRIVERSLICENSE_BG = new DataIdentifier('DriversLicense-BG');
  /** Driver's License (Canada) data identifier */
  public static readonly DRIVERSLICENSE_CA = new DataIdentifier('DriversLicense-CA');
  /** Driver's License (Cyprus) data identifier */
  public static readonly DRIVERSLICENSE_CY = new DataIdentifier('DriversLicense-CY');
  /** Driver's License (Czech Republic) data identifier */
  public static readonly DRIVERSLICENSE_CZ = new DataIdentifier('DriversLicense-CZ');
  /** Driver's License (Germany) data identifier */
  public static readonly DRIVERSLICENSE_DE = new DataIdentifier('DriversLicense-DE');
  /** Driver's License (Denmark) data identifier */
  public static readonly DRIVERSLICENSE_DK = new DataIdentifier('DriversLicense-DK');
  /** Driver's License (Estonia) data identifier */
  public static readonly DRIVERSLICENSE_EE = new DataIdentifier('DriversLicense-EE');
  /** Driver's License (Spain) data identifier */
  public static readonly DRIVERSLICENSE_ES = new DataIdentifier('DriversLicense-ES');
  /** Driver's License (Finland) data identifier */
  public static readonly DRIVERSLICENSE_FI = new DataIdentifier('DriversLicense-FI');
  /** Driver's License (France) data identifier */
  public static readonly DRIVERSLICENSE_FR = new DataIdentifier('DriversLicense-FR');
  /** Driver's License (United Kingdom) data identifier */
  public static readonly DRIVERSLICENSE_GB = new DataIdentifier('DriversLicense-GB');
  /** Driver's License (Greece) data identifier */
  public static readonly DRIVERSLICENSE_GR = new DataIdentifier('DriversLicense-GR');
  /** Driver's License (Croatia) data identifier */
  public static readonly DRIVERSLICENSE_HR = new DataIdentifier('DriversLicense-HR');
  /** Driver's License (Hungary) data identifier */
  public static readonly DRIVERSLICENSE_HU = new DataIdentifier('DriversLicense-HU');
  /** Driver's License (Ireland) data identifier */
  public static readonly DRIVERSLICENSE_IE = new DataIdentifier('DriversLicense-IE');
  /** Driver's License (Italy) data identifier */
  public static readonly DRIVERSLICENSE_IT = new DataIdentifier('DriversLicense-IT');
  /** Driver's License (Lithuania) data identifier */
  public static readonly DRIVERSLICENSE_LT = new DataIdentifier('DriversLicense-LT');
  /** Driver's License (Luxembourg) data identifier */
  public static readonly DRIVERSLICENSE_LU = new DataIdentifier('DriversLicense-LU');
  /** Driver's License (Latvia) data identifier */
  public static readonly DRIVERSLICENSE_LV = new DataIdentifier('DriversLicense-LV');
  /** Driver's License (Malta) data identifier */
  public static readonly DRIVERSLICENSE_MT = new DataIdentifier('DriversLicense-MT');
  /** Driver's License (Netherlands) data identifier */
  public static readonly DRIVERSLICENSE_NL = new DataIdentifier('DriversLicense-NL');
  /** Driver's License (Poland) data identifier */
  public static readonly DRIVERSLICENSE_PL = new DataIdentifier('DriversLicense-PL');
  /** Driver's License (Portugal) data identifier */
  public static readonly DRIVERSLICENSE_PT = new DataIdentifier('DriversLicense-PT');
  /** Driver's License (Romania) data identifier */
  public static readonly DRIVERSLICENSE_RO = new DataIdentifier('DriversLicense-RO');
  /** Driver's License (Sweden) data identifier */
  public static readonly DRIVERSLICENSE_SE = new DataIdentifier('DriversLicense-SE');
  /** Driver's License (Slovenia) data identifier */
  public static readonly DRIVERSLICENSE_SI = new DataIdentifier('DriversLicense-SI');
  /** Driver's License (Slovakia) data identifier */
  public static readonly DRIVERSLICENSE_SK = new DataIdentifier('DriversLicense-SK');
  /** Driver's License (United States) data identifier */
  public static readonly DRIVERSLICENSE_US = new DataIdentifier('DriversLicense-US');
  /** Drug Enforcement Agency Number (United States) data identifier */
  public static readonly DRUGENFORCEMENTAGENCYNUMBER_US = new DataIdentifier('DrugEnforcementAgencyNumber-US');
  /** Electoral Roll Number (United Kingdom) data identifier */
  public static readonly ELECTORALROLLNUMBER_GB = new DataIdentifier('ElectoralRollNumber-GB');
  /** Email Address data identifier */
  public static readonly EMAILADDRESS = new DataIdentifier('EmailAddress');
  /** Health Insurance Card Number (European Union) data identifier */
  public static readonly HEALTHINSURANCECARDNUMBER_EU = new DataIdentifier('HealthInsuranceCardNumber-EU');
  /** Health Insurance Claim Number (United States) data identifier */
  public static readonly HEALTHINSURANCECLAIMNUMBER_US = new DataIdentifier('HealthInsuranceClaimNumber-US');
  /** Health Insurance Number (France) data identifier */
  public static readonly HEALTHINSURANCENUMBER_FR = new DataIdentifier('HealthInsuranceNumber-FR');
  /** Healthcare Procedure Code (United States) data identifier */
  public static readonly HEALTHCAREPROCEDURECODE_US = new DataIdentifier('HealthcareProcedureCode-US');
  /** Individual Tax Identification Number (United States) data identifier */
  public static readonly INDIVIDUALTAXIDENTIFICATIONNUMBER_US = new DataIdentifier('IndividualTaxIdentificationNumber-US');
  /** INSEE Code (France) data identifier */
  public static readonly INSEECODE_FR = new DataIdentifier('InseeCode-FR');
  /** IP Address data identifier */
  public static readonly IPADDRESS = new DataIdentifier('IpAddress');
  /** Latitude/Longitude coordinates data identifier */
  public static readonly LATLONG = new DataIdentifier('LatLong');
  /** Medicare Beneficiary Number (United States) data identifier */
  public static readonly MEDICAREBENEFICIARYNUMBER_US = new DataIdentifier('MedicareBeneficiaryNumber-US');
  /** Name data identifier */
  public static readonly NAME = new DataIdentifier('Name');
  /** National Drug Code (United States) data identifier */
  public static readonly NATIONALDRUGCODE_US = new DataIdentifier('NationalDrugCode-US');
  /** National Identification Number (Germany) data identifier */
  public static readonly NATIONALIDENTIFICATIONNUMBER_DE = new DataIdentifier('NationalIdentificationNumber-DE');
  /** National Identification Number (Spain) data identifier */
  public static readonly NATIONALIDENTIFICATIONNUMBER_ES = new DataIdentifier('NationalIdentificationNumber-ES');
  /** National Identification Number (Italy) data identifier */
  public static readonly NATIONALIDENTIFICATIONNUMBER_IT = new DataIdentifier('NationalIdentificationNumber-IT');
  /** National Insurance Number (United Kingdom) data identifier */
  public static readonly NATIONALINSURANCENUMBER_GB = new DataIdentifier('NationalInsuranceNumber-GB');
  /** National Provider ID (United States) data identifier */
  public static readonly NATIONALPROVIDERID_US = new DataIdentifier('NationalProviderId-US');
  /** NHS Number (United Kingdom) data identifier */
  public static readonly NHSNUMBER_GB = new DataIdentifier('NhsNumber-GB');
  /** NIE Number (Spain) data identifier */
  public static readonly NIENUMBER_ES = new DataIdentifier('NieNumber-ES');
  /** NIF Number (Spain) data identifier */
  public static readonly NIFNUMBER_ES = new DataIdentifier('NifNumber-ES');
  /** OpenSSH Private Key data identifier */
  public static readonly OPENSSHPRIVATEKEY = new DataIdentifier('OpenSshPrivateKey');
  /** Passport Number (Canada) data identifier */
  public static readonly PASSPORTNUMBER_CA = new DataIdentifier('PassportNumber-CA');
  /** Passport Number (Germany) data identifier */
  public static readonly PASSPORTNUMBER_DE = new DataIdentifier('PassportNumber-DE');
  /** Passport Number (Spain) data identifier */
  public static readonly PASSPORTNUMBER_ES = new DataIdentifier('PassportNumber-ES');
  /** Passport Number (France) data identifier */
  public static readonly PASSPORTNUMBER_FR = new DataIdentifier('PassportNumber-FR');
  /** Passport Number (United Kingdom) data identifier */
  public static readonly PASSPORTNUMBER_GB = new DataIdentifier('PassportNumber-GB');
  /** Passport Number (Italy) data identifier */
  public static readonly PASSPORTNUMBER_IT = new DataIdentifier('PassportNumber-IT');
  /** Passport Number (United States) data identifier */
  public static readonly PASSPORTNUMBER_US = new DataIdentifier('PassportNumber-US');
  /** Permanent Residence Number (Canada) data identifier */
  public static readonly PERMANENTRESIDENCENUMBER_CA = new DataIdentifier('PermanentResidenceNumber-CA');
  /** Personal Health Number (Canada) data identifier */
  public static readonly PERSONALHEALTHNUMBER_CA = new DataIdentifier('PersonalHealthNumber-CA');
  /** PGP Private Key data identifier */
  public static readonly PGPPRIVATEKEY = new DataIdentifier('PgpPrivateKey');
  /** Phone Number (Brazil) data identifier */
  public static readonly PHONENUMBER_BR = new DataIdentifier('PhoneNumber-BR');
  /** Phone Number (Germany) data identifier */
  public static readonly PHONENUMBER_DE = new DataIdentifier('PhoneNumber-DE');
  /** Phone Number (Spain) data identifier */
  public static readonly PHONENUMBER_ES = new DataIdentifier('PhoneNumber-ES');
  /** Phone Number (France) data identifier */
  public static readonly PHONENUMBER_FR = new DataIdentifier('PhoneNumber-FR');
  /** Phone Number (United Kingdom) data identifier */
  public static readonly PHONENUMBER_GB = new DataIdentifier('PhoneNumber-GB');
  /** Phone Number (Italy) data identifier */
  public static readonly PHONENUMBER_IT = new DataIdentifier('PhoneNumber-IT');
  /** Phone Number (United States) data identifier */
  public static readonly PHONENUMBER_US = new DataIdentifier('PhoneNumber-US');
  /** PKCS Private Key data identifier */
  public static readonly PKCSPRIVATEKEY = new DataIdentifier('PkcsPrivateKey');
  /** Postal Code (Canada) data identifier */
  public static readonly POSTALCODE_CA = new DataIdentifier('PostalCode-CA');
  /** PuTTY Private Key data identifier */
  public static readonly PUTTYPRIVATEKEY = new DataIdentifier('PuttyPrivateKey');
  /** RG Number (Brazil) data identifier */
  public static readonly RGNUMBER_BR = new DataIdentifier('RgNumber-BR');
  /** Social Insurance Number (Canada) data identifier */
  public static readonly SOCIALINSURANCENUMBER_CA = new DataIdentifier('SocialInsuranceNumber-CA');
  /** Social Security Number (Spain) data identifier */
  public static readonly SSN_ES = new DataIdentifier('Ssn-ES');
  /** Social Security Number (United States) data identifier */
  public static readonly SSN_US = new DataIdentifier('Ssn-US');
  /** Tax ID (Germany) data identifier */
  public static readonly TAXID_DE = new DataIdentifier('TaxId-DE');
  /** Tax ID (Spain) data identifier */
  public static readonly TAXID_ES = new DataIdentifier('TaxId-ES');
  /** Tax ID (France) data identifier */
  public static readonly TAXID_FR = new DataIdentifier('TaxId-FR');
  /** Tax ID (United Kingdom) data identifier */
  public static readonly TAXID_GB = new DataIdentifier('TaxId-GB');
  /** Vehicle Identification Number data identifier */
  public static readonly VEHICLEIDENTIFICATIONNUMBER = new DataIdentifier('VehicleIdentificationNumber');
  /** ZIP Code (United States) data identifier */
  public static readonly ZIPCODE_US = new DataIdentifier('ZipCode-US');

  /**
   * Create a managed data identifier not in the list of static members. This is used to maintain forward compatibility, in case a new managed identifier is supported but not updated in CDK yet.
   * @param name - name of the identifier.
   */
  constructor(public readonly name: string) { }

  /**
   * String representation of a DataIdentifier
   *
   * @returns the name of the data identifier
   */
  public toString(): string {
    return this.name;
  }
}

/**
 * A custom data identifier. Include a custom data identifier name and regular expression in the JSON policy used to define the data protection policy.
 */
export class CustomDataIdentifier extends DataIdentifier {
  /**
   * Create a custom data identifier.
   * @param name - the name of the custom data identifier. This cannot share the same name as a managed data identifier.
   * @param regex - the regular expression to detect and mask log events for.
   */
  constructor(public readonly name: string, public readonly regex: string) {
    super(name);

    if (!name || name.trim().length === 0) {
      throw new UnscopedValidationError('Custom data identifier name cannot be empty');
    }

    if (!regex || regex.trim().length === 0) {
      throw new UnscopedValidationError('Custom data identifier regex cannot be empty');
    }
  }

  /**
   * String representation of a CustomDataIdentifier
   * @returns the name and RegEx of the custom data identifier
   */
  public toString(): string {
    return `${this.name}: ${this.regex}`;
  }
}
