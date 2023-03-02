import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Represents a data protection policy in a log group.
 */
export class DataProtectionPolicy {

  /**
   * Name of the data protection policy
   *
   * @default - 'data-protection-policy-cdk'
   */
  public readonly name: string;

  /**
   * Description of the data protection policy
   *
   * @default - 'cdk generated data protection policy'
   */
  public readonly description: string;

  /**
   * Version of the data protection policy
   */
  public readonly version: string;

  /**
   * Statements within the data protection policy. Must contain one Audit and one Redact statement
   */
  public statement: object;

  constructor(scope: Construct, props: DataProtectionPolicyProps) {
    this.name = props.name || 'data-protection-policy-cdk';
    this.description = props.description || 'cdk generated data protection policy';
    this.version = '2021-06-01';

    var findingsDestination: FindingsDestination = {};

    if (props.logGroupNameAuditDestination) {
      findingsDestination.cloudWatchLogs = {
        logGroup: props.logGroupNameAuditDestination,
      };
    }

    if (props.s3BucketNameAuditDestination) {
      findingsDestination.s3 = {
        bucket: props.s3BucketNameAuditDestination,
      };
    }

    if (props.deliveryStreamNameAuditDestination) {
      findingsDestination.firehose = {
        deliveryStream: props.deliveryStreamNameAuditDestination,
      };
    }

    var identifierArns: string[] = [];
    if (props.identifiers != null) {
      for (let identifier of props.identifiers) {
        let identifierArn = Stack.of(scope).formatArn({
          resource: 'data-identifier',
          region: '',
          account: 'aws',
          service: 'dataprotection',
          resourceName: identifier.toString(),
        });
        identifierArns.push(identifierArn);
      };
    }

    if (props.identifierArnStrings != null) {
      for (let identifierArnString of props.identifierArnStrings) {
        identifierArns.push(identifierArnString);
      }
    }

    this.statement = [
      {
        sid: 'audit-statement-cdk',
        dataIdentifier: identifierArns,
        operation: {
          audit: {
            findingsDestination: findingsDestination,
          },
        },
      },
      {
        sid: 'redact-statement-cdk',
        dataIdentifier: identifierArns,
        operation: {
          deidentify: {
            maskConfig: {},
          },
        },
      },
    ];
  }
}

type FindingsDestination = {
  cloudWatchLogs?: CloudWatchLogsDestination;
  firehose?: FirehoseDestination;
  s3?: S3Destination;
}

type CloudWatchLogsDestination = {
  logGroup: string;
}

type FirehoseDestination = {
  deliveryStream: string;
}

type S3Destination = {
  bucket: string;
}

/**
 * Interface for creating a data protection policy
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
   * List of data protection identifiers. Must be in the following list: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types.html
   *
   * @default - no identifiers
   */
  readonly identifiers?: DataIdentifier[];

  /**
   * For futureproofing; if an identifier is not part of DataIdentifier, but still supported by data protection, a string (full ARN) can be supplied instead.
   *
   * @default - no string identifiers
   */
  readonly identifierArnStrings?: string[];

  /**
   * CloudWatch Logs log group name to send audit findings to. The log group must already exist prior to creating the data protection policy.
   *
   * @default - no CloudWatch Logs audit destination
   */
  readonly logGroupNameAuditDestination?: string;

  /**
   * S3 bucket name to send audit findings to. The bucket must already exist.
   *
   * @default - no S3 bucket audit destination
   */
  readonly s3BucketNameAuditDestination?: string;

  /**
   * Amazon Kinesis Data Firehose delivery stream to send audit findings to. The delivery stream must already exist.
   *
   * @default - no firehose delivery stream audit destination
   */
  readonly deliveryStreamNameAuditDestination?: string;
}


/**
 * A data protection identifier. If an identifier is supported but not in this enum, it can be passed as a string instead.
 */
export enum DataIdentifier {
  /** Address */
  ADDRESS = 'Address',
  /** AwsSecretKey */
  AWSSECRETKEY = 'AwsSecretKey',
  /** BankAccountNumber-DE */
  BANKACCOUNTNUMBER_DE = 'BankAccountNumber-DE',
  /** BankAccountNumber-ES */
  BANKACCOUNTNUMBER_ES = 'BankAccountNumber-ES',
  /** BankAccountNumber-FR */
  BANKACCOUNTNUMBER_FR = 'BankAccountNumber-FR',
  /** BankAccountNumber-GB */
  BANKACCOUNTNUMBER_GB = 'BankAccountNumber-GB',
  /** BankAccountNumber-IT */
  BANKACCOUNTNUMBER_IT = 'BankAccountNumber-IT',
  /** BankAccountNumber-US */
  BANKACCOUNTNUMBER_US = 'BankAccountNumber-US',
  /** CepCode-BR */
  CEPCODE_BR = 'CepCode-BR',
  /** Cnpj-BR */
  CNPJ_BR = 'Cnpj-BR',
  /** CpfCode-BR */
  CPFCODE_BR = 'CpfCode-BR',
  /** CreditCardExpiration */
  CREDITCARDEXPIRATION = 'CreditCardExpiration',
  /** CreditCardNumber */
  CREDITCARDNUMBER = 'CreditCardNumber',
  /** CreditCardSecurityCode */
  CREDITCARDSECURITYCODE = 'CreditCardSecurityCode',
  /** DriversLicense-AT */
  DRIVERSLICENSE_AT = 'DriversLicense-AT',
  /** DriversLicense-AU */
  DRIVERSLICENSE_AU = 'DriversLicense-AU',
  /** DriversLicense-BE */
  DRIVERSLICENSE_BE = 'DriversLicense-BE',
  /** DriversLicense-BG */
  DRIVERSLICENSE_BG = 'DriversLicense-BG',
  /** DriversLicense-CA */
  DRIVERSLICENSE_CA = 'DriversLicense-CA',
  /** DriversLicense-CY */
  DRIVERSLICENSE_CY = 'DriversLicense-CY',
  /** DriversLicense-CZ */
  DRIVERSLICENSE_CZ = 'DriversLicense-CZ',
  /** DriversLicense-DE */
  DRIVERSLICENSE_DE = 'DriversLicense-DE',
  /** DriversLicense-DK */
  DRIVERSLICENSE_DK = 'DriversLicense-DK',
  /** DriversLicense-EE */
  DRIVERSLICENSE_EE = 'DriversLicense-EE',
  /** DriversLicense-ES */
  DRIVERSLICENSE_ES = 'DriversLicense-ES',
  /** DriversLicense-FI */
  DRIVERSLICENSE_FI = 'DriversLicense-FI',
  /** DriversLicense-FR */
  DRIVERSLICENSE_FR = 'DriversLicense-FR',
  /** DriversLicense-GB */
  DRIVERSLICENSE_GB = 'DriversLicense-GB',
  /** DriversLicense-GR */
  DRIVERSLICENSE_GR = 'DriversLicense-GR',
  /** DriversLicense-HR */
  DRIVERSLICENSE_HR = 'DriversLicense-HR',
  /** DriversLicense-HU */
  DRIVERSLICENSE_HU = 'DriversLicense-HU',
  /** DriversLicense-IE */
  DRIVERSLICENSE_IE = 'DriversLicense-IE',
  /** DriversLicense-IT */
  DRIVERSLICENSE_IT = 'DriversLicense-IT',
  /** DriversLicense-LT */
  DRIVERSLICENSE_LT = 'DriversLicense-LT',
  /** DriversLicense-LU */
  DRIVERSLICENSE_LU = 'DriversLicense-LU',
  /** DriversLicense-LV */
  DRIVERSLICENSE_LV = 'DriversLicense-LV',
  /** DriversLicense-MT */
  DRIVERSLICENSE_MT = 'DriversLicense-MT',
  /** DriversLicense-NL */
  DRIVERSLICENSE_NL = 'DriversLicense-NL',
  /** DriversLicense-PL */
  DRIVERSLICENSE_PL = 'DriversLicense-PL',
  /** DriversLicense-PT */
  DRIVERSLICENSE_PT = 'DriversLicense-PT',
  /** DriversLicense-RO */
  DRIVERSLICENSE_RO = 'DriversLicense-RO',
  /** DriversLicense-SE */
  DRIVERSLICENSE_SE = 'DriversLicense-SE',
  /** DriversLicense-SI */
  DRIVERSLICENSE_SI = 'DriversLicense-SI',
  /** DriversLicense-SK */
  DRIVERSLICENSE_SK = 'DriversLicense-SK',
  /** DriversLicense-US */
  DRIVERSLICENSE_US = 'DriversLicense-US',
  /** DrugEnforcementAgencyNumber-US */
  DRUGENFORCEMENTAGENCYNUMBER_US = 'DrugEnforcementAgencyNumber-US',
  /** ElectoralRollNumber-GB */
  ELECTORALROLLNUMBER_GB = 'ElectoralRollNumber-GB',
  /** EmailAddress */
  EMAILADDRESS = 'EmailAddress',
  /** HealthInsuranceCardNumber-EU */
  HEALTHINSURANCECARDNUMBER_EU = 'HealthInsuranceCardNumber-EU',
  /** HealthInsuranceClaimNumber-US */
  HEALTHINSURANCECLAIMNUMBER_US = 'HealthInsuranceClaimNumber-US',
  /** HealthInsuranceNumber-FR */
  HEALTHINSURANCENUMBER_FR = 'HealthInsuranceNumber-FR',
  /** HealthcareProcedureCode-US */
  HEALTHCAREPROCEDURECODE_US = 'HealthcareProcedureCode-US',
  /** IndividualTaxIdentificationNumber-US */
  INDIVIDUALTAXIDENTIFICATIONNUMBER_US = 'IndividualTaxIdentificationNumber-US',
  /** InseeCode-FR */
  INSEECODE_FR = 'InseeCode-FR',
  /** IpAddress */
  IPADDRESS = 'IpAddress',
  /** LatLong */
  LATLONG = 'LatLong',
  /** MedicareBeneficiaryNumber-US */
  MEDICAREBENEFICIARYNUMBER_US = 'MedicareBeneficiaryNumber-US',
  /** Name */
  NAME = 'Name',
  /** NationalDrugCode-US */
  NATIONALDRUGCODE_US = 'NationalDrugCode-US',
  /** NationalIdentificationNumber-DE */
  NATIONALIDENTIFICATIONNUMBER_DE = 'NationalIdentificationNumber-DE',
  /** NationalIdentificationNumber-ES */
  NATIONALIDENTIFICATIONNUMBER_ES = 'NationalIdentificationNumber-ES',
  /** NationalIdentificationNumber-IT */
  NATIONALIDENTIFICATIONNUMBER_IT = 'NationalIdentificationNumber-IT',
  /** NationalInsuranceNumber-GB */
  NATIONALINSURANCENUMBER_GB = 'NationalInsuranceNumber-GB',
  /** NationalProviderId-US */
  NATIONALPROVIDERID_US = 'NationalProviderId-US',
  /** NhsNumber-GB */
  NHSNUMBER_GB = 'NhsNumber-GB',
  /** NieNumber-ES */
  NIENUMBER_ES = 'NieNumber-ES',
  /** NifNumber-ES */
  NIFNUMBER_ES = 'NifNumber-ES',
  /** OpenSshPrivateKey */
  OPENSSHPRIVATEKEY = 'OpenSshPrivateKey',
  /** PassportNumber-CA */
  PASSPORTNUMBER_CA = 'PassportNumber-CA',
  /** PassportNumber-DE */
  PASSPORTNUMBER_DE = 'PassportNumber-DE',
  /** PassportNumber-ES */
  PASSPORTNUMBER_ES = 'PassportNumber-ES',
  /** PassportNumber-FR */
  PASSPORTNUMBER_FR = 'PassportNumber-FR',
  /** PassportNumber-GB */
  PASSPORTNUMBER_GB = 'PassportNumber-GB',
  /** PassportNumber-IT */
  PASSPORTNUMBER_IT = 'PassportNumber-IT',
  /** PassportNumber-US */
  PASSPORTNUMBER_US = 'PassportNumber-US',
  /** PermanentResidenceNumber-CA */
  PERMANENTRESIDENCENUMBER_CA = 'PermanentResidenceNumber-CA',
  /** PersonalHealthNumber-CA */
  PERSONALHEALTHNUMBER_CA = 'PersonalHealthNumber-CA',
  /** PgpPrivateKey */
  PGPPRIVATEKEY = 'PgpPrivateKey',
  /** PhoneNumber */
  PHONENUMBER = 'PhoneNumber',
  /** PhoneNumber-BR */
  PHONENUMBER_BR = 'PhoneNumber-BR',
  /** PhoneNumber-DE */
  PHONENUMBER_DE = 'PhoneNumber-DE',
  /** PhoneNumber-ES */
  PHONENUMBER_ES = 'PhoneNumber-ES',
  /** PhoneNumber-FR */
  PHONENUMBER_FR = 'PhoneNumber-FR',
  /** PhoneNumber-GB */
  PHONENUMBER_GB = 'PhoneNumber-GB',
  /** PhoneNumber-IT */
  PHONENUMBER_IT = 'PhoneNumber-IT',
  /** PhoneNumber-US */
  PHONENUMBER_US = 'PhoneNumber-US',
  /** PkcsPrivateKey */
  PKCSPRIVATEKEY = 'PkcsPrivateKey',
  /** PostalCode-CA */
  POSTALCODE_CA = 'PostalCode-CA',
  /** PuttyPrivateKey */
  PUTTYPRIVATEKEY = 'PuttyPrivateKey',
  /** RgNumber-BR */
  RGNUMBER_BR = 'RgNumber-BR',
  /** SocialInsuranceNumber-CA */
  SOCIALINSURANCENUMBER_CA = 'SocialInsuranceNumber-CA',
  /** Ssn-ES */
  SSN_ES = 'Ssn-ES',
  /** Ssn-US */
  SSN_US = 'Ssn-US',
  /** TaxId-DE */
  TAXID_DE = 'TaxId-DE',
  /** TaxId-ES */
  TAXID_ES = 'TaxId-ES',
  /** TaxId-FR */
  TAXID_FR = 'TaxId-FR',
  /** TaxId-GB */
  TAXID_GB = 'TaxId-GB',
  /** VehicleIdentificationNumber */
  VEHICLEIDENTIFICATIONNUMBER = 'VehicleIdentificationNumber',
  /** ZipCode-US */
  ZIPCODE_US = 'ZipCode-US',
}
