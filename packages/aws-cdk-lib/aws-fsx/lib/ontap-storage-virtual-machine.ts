import type { Construct } from 'constructs';
import { CfnStorageVirtualMachine } from './fsx.generated';
import type { IOntapFileSystem } from './ontap-file-system';
import { warnIfPlainTextSecret } from './private/warn-plain-text-secret';
import type { ISecret } from '../../aws-secretsmanager';
import type { IResource, SecretValue } from '../../core';
import { RemovalPolicy, Resource, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The security style for the root volume of the SVM.
 */
export enum SecurityStyle {
  /** UNIX security style */
  UNIX = 'UNIX',
  /** Windows NTFS security style */
  NTFS = 'NTFS',
  /** Mixed security style (advanced) */
  MIXED = 'MIXED',
}

/**
 * Self-managed Active Directory configuration for an SVM.
 *
 * Two ways to provide credentials:
 *
 * 1. Inline (`userName` + `password`). Suitable for SSM/Vault-backed `SecretValue`s.
 * 2. Secrets Manager (`domainJoinServiceAccountSecret`). Pass a Secrets Manager
 *    secret whose value is a JSON string with the keys
 *    `CUSTOMER_MANAGED_ACTIVE_DIRECTORY_USERNAME` and
 *    `CUSTOMER_MANAGED_ACTIVE_DIRECTORY_PASSWORD`.
 *
 * The two options are mutually exclusive: provide either `userName + password`
 * **or** `domainJoinServiceAccountSecret`.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-selfmanagedactivedirectoryconfiguration.html
 */
export interface SelfManagedActiveDirectoryConfiguration {
  /**
   * The DNS IP addresses of your AD domain controllers.
   */
  readonly dnsIps: string[];

  /**
   * The fully qualified domain name of your AD domain.
   */
  readonly domainName: string;

  /**
   * The username with permissions to join the domain.
   *
   * Mutually exclusive with `domainJoinServiceAccountSecret`.
   *
   * @default - not set (use `domainJoinServiceAccountSecret` instead)
   */
  readonly userName?: string;

  /**
   * The password for the domain join user.
   *
   * Any `SecretValue` is accepted, but for production prefer one that resolves
   * to a CloudFormation dynamic reference at deploy time so the password is not
   * embedded in the synthesized template. Literal values trigger a synth-time
   * warning.
   *
   * Mutually exclusive with `domainJoinServiceAccountSecret`.
   *
   * @default - not set (use `domainJoinServiceAccountSecret` instead)
   */
  readonly password?: SecretValue;

  /**
   * A Secrets Manager secret containing the domain join service account
   * credentials. The secret value must be a JSON string with the keys
   * `CUSTOMER_MANAGED_ACTIVE_DIRECTORY_USERNAME` and
   * `CUSTOMER_MANAGED_ACTIVE_DIRECTORY_PASSWORD`.
   *
   * Mutually exclusive with `userName` and `password`.
   *
   * @default - not set (use `userName` and `password` instead)
   */
  readonly domainJoinServiceAccountSecret?: ISecret;

  /**
   * The OU distinguished name for the AD computer object.
   *
   * @default - default OU for computer objects in the domain
   */
  readonly organizationalUnitDistinguishedName?: string;

  /**
   * The AD group for file system administrators.
   *
   * @default - 'Domain Admins'
   */
  readonly fileSystemAdministratorsGroup?: string;
}

/**
 * Active Directory configuration for an SVM.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fsx-storagevirtualmachine-activedirectoryconfiguration.html
 */
export interface SvmActiveDirectoryConfiguration {
  /**
   * The NetBIOS name of the AD computer object for the SVM.
   */
  readonly netBiosName: string;

  /**
   * Self-managed AD configuration.
   *
   * @default - no AD configuration
   */
  readonly selfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfiguration;
}

/**
 * Represents an FSx for NetApp ONTAP Storage Virtual Machine.
 */
export interface IOntapStorageVirtualMachine extends IResource {
  /**
   * The ID of the SVM.
   * @attribute
   */
  readonly storageVirtualMachineId: string;

  /**
   * The ARN of the SVM.
   * @attribute
   */
  readonly resourceArn: string;

  /**
   * The system-generated UUID of the SVM.
   * @attribute
   */
  readonly uuid: string;
}

/**
 * Properties for creating an FSx for NetApp ONTAP Storage Virtual Machine.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html
 */
export interface OntapStorageVirtualMachineProps {
  /**
   * The FSx for NetApp ONTAP file system that this SVM belongs to.
   */
  readonly fileSystem: IOntapFileSystem;

  /**
   * The name of the SVM.
   *
   * Must start with a letter and may contain letters, digits, and underscores
   * (max 47 characters).
   */
  readonly name: string;

  /**
   * Active Directory configuration for the SVM.
   *
   * @default - no Active Directory
   */
  readonly activeDirectoryConfiguration?: SvmActiveDirectoryConfiguration;

  /**
   * The security style of the root volume of the SVM.
   *
   * @default SecurityStyle.UNIX
   */
  readonly rootVolumeSecurityStyle?: SecurityStyle;

  /**
   * The password to use when managing the SVM using the NetApp ONTAP CLI or REST API.
   *
   * Any `SecretValue` is accepted, but for production prefer one that resolves
   * to a CloudFormation dynamic reference at deploy time (for example from
   * `OntapFileSystemSecret`, `SecretValue.ssmSecure(...)` or
   * `SecretValue.cfnParameter(...)`). A literal `SecretValue.unsafePlainText(...)`
   * will be embedded in the synthesized template and produce a synth-time warning.
   *
   * @default - no admin password set
   */
  readonly svmAdminPassword?: SecretValue;

  /**
   * Policy to apply when the SVM is removed from the stack.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * The FSx for NetApp ONTAP Storage Virtual Machine construct.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html
 *
 * @resource AWS::FSx::StorageVirtualMachine
 */
@propertyInjectable
export class OntapStorageVirtualMachine extends Resource implements IOntapStorageVirtualMachine {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-fsx.OntapStorageVirtualMachine';

  /**
   * The ID of the SVM.
   * @attribute
   */
  public readonly storageVirtualMachineId: string;

  /**
   * The ARN of the SVM.
   * @attribute
   */
  public readonly resourceArn: string;

  /**
   * The system-generated UUID of the SVM.
   * @attribute
   */
  public readonly uuid: string;

  private readonly svm: CfnStorageVirtualMachine;

  constructor(scope: Construct, id: string, props: OntapStorageVirtualMachineProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    this.validateProps(props);

    const adConfig = props.activeDirectoryConfiguration;
    const smad = adConfig?.selfManagedActiveDirectoryConfiguration;

    this.svm = new CfnStorageVirtualMachine(this, 'Resource', {
      fileSystemId: props.fileSystem.fileSystemId,
      name: props.name,
      rootVolumeSecurityStyle: props.rootVolumeSecurityStyle,
      // `unsafeUnwrap()` is safe here: token-based SecretValues resolve to a CFN dynamic
      // reference at deploy time. Literal SecretValues are caught by `warnIfPlainTextSecret`.
      svmAdminPassword: props.svmAdminPassword?.unsafeUnwrap(),
      activeDirectoryConfiguration: adConfig ? {
        netBiosName: adConfig.netBiosName,
        selfManagedActiveDirectoryConfiguration: smad ? {
          dnsIps: smad.dnsIps,
          domainName: smad.domainName,
          userName: smad.userName,
          // Same `unsafeUnwrap()` rationale as above for the AD join password.
          password: smad.password?.unsafeUnwrap(),
          domainJoinServiceAccountSecret: smad.domainJoinServiceAccountSecret?.secretArn,
          organizationalUnitDistinguishedName: smad.organizationalUnitDistinguishedName,
          fileSystemAdministratorsGroup: smad.fileSystemAdministratorsGroup,
        } : undefined,
      } : undefined,
    });

    // Default to RETAIN: SVMs hold the volumes that contain stateful customer data,
    // and orphaning them is reversible while accidental deletion is not.
    this.svm.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);

    this.storageVirtualMachineId = this.svm.ref;
    this.resourceArn = this.svm.attrResourceArn;
    this.uuid = this.svm.attrUuid;
  }

  private validateProps(props: OntapStorageVirtualMachineProps): void {
    this.validateName(props.name);
    this.validateActiveDirectoryConfiguration(props.activeDirectoryConfiguration);
    this.validateAdCredentials(props.activeDirectoryConfiguration?.selfManagedActiveDirectoryConfiguration);
    warnIfPlainTextSecret(this, 'svmAdminPassword', props.svmAdminPassword);
    warnIfPlainTextSecret(this, 'selfManagedActiveDirectoryConfiguration.password',
      props.activeDirectoryConfiguration?.selfManagedActiveDirectoryConfiguration?.password);
  }

  private validateActiveDirectoryConfiguration(adConfig?: SvmActiveDirectoryConfiguration): void {
    if (!adConfig) return;
    // NetBIOS name: 1-15 ASCII chars, must not contain spaces. FSx uppercases the value
    // but accepts any case at create time. Skip the check when the value is a token.
    if (!Token.isUnresolved(adConfig.netBiosName)) {
      const nb = adConfig.netBiosName;
      if (nb.length < 1 || nb.length > 15) {
        throw new ValidationError(
          lit`NetBiosNameLength`,
          `'netBiosName' must be between 1 and 15 characters, got ${nb.length}`,
          this,
        );
      }
      if (/\s/.test(nb)) {
        throw new ValidationError(
          lit`NetBiosNameWhitespace`,
          `'netBiosName' must not contain whitespace, got '${nb}'`,
          this,
        );
      }
    }
    const smad = adConfig.selfManagedActiveDirectoryConfiguration;
    if (!smad) return;
    // FSx accepts 1-3 DNS IP addresses for the AD domain controllers.
    if (smad.dnsIps.length < 1 || smad.dnsIps.length > 3) {
      throw new ValidationError(
        lit`SmadDnsIpsLength`,
        `'selfManagedActiveDirectoryConfiguration.dnsIps' must contain between 1 and 3 entries, got ${smad.dnsIps.length}`,
        this,
      );
    }
    // FSx accepts up to 255 chars for the domain name.
    if (!Token.isUnresolved(smad.domainName)) {
      if (smad.domainName.length < 1 || smad.domainName.length > 255) {
        throw new ValidationError(
          lit`SmadDomainNameLength`,
          `'selfManagedActiveDirectoryConfiguration.domainName' must be between 1 and 255 characters, got ${smad.domainName.length}`,
          this,
        );
      }
    }
  }

  private validateAdCredentials(smad?: SelfManagedActiveDirectoryConfiguration): void {
    if (!smad) return;
    const hasInline = smad.userName !== undefined || smad.password !== undefined;
    const hasSecret = smad.domainJoinServiceAccountSecret !== undefined;
    if (hasInline && hasSecret) {
      throw new ValidationError(
        lit`SmadCredentialsMutuallyExclusive`,
        '\'selfManagedActiveDirectoryConfiguration\' must specify either (userName + password) or domainJoinServiceAccountSecret, not both',
        this,
      );
    }
    // Self-managed Active Directory join requires credentials. Surface this as a clear
    // CDK-side error rather than a confusing CFN-side failure at deploy time.
    if (!hasInline && !hasSecret) {
      throw new ValidationError(
        lit`SmadCredentialsRequired`,
        '\'selfManagedActiveDirectoryConfiguration\' must specify either (userName + password) or domainJoinServiceAccountSecret',
        this,
      );
    }
    // If using inline credentials, both userName and password must be present together.
    if (hasInline) {
      if (smad.userName === undefined || smad.password === undefined) {
        throw new ValidationError(
          lit`SmadInlineCredentialsRequireBoth`,
          '\'selfManagedActiveDirectoryConfiguration\' inline credentials require both userName and password',
          this,
        );
      }
    }
  }

  private validateName(name: string): void {
    if (Token.isUnresolved(name)) return;
    if (name.length < 1 || name.length > 47) {
      throw new ValidationError(lit`SvmNameLength`, `'name' must be between 1 and 47 characters, got ${name.length}`, this);
    }
    // FSx ONTAP SVM names must start with a letter and may contain letters,
    // digits, and underscores. Service-side validation will also reject mismatches.
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) {
      throw new ValidationError(
        lit`SvmNameInvalidCharacters`,
        `'name' must start with a letter and contain only letters, digits, and underscores, got '${name}'`,
        this,
      );
    }
  }
}
