import type { Construct } from 'constructs';
import type { IFileSystem } from './file-system';
import { CfnStorageVirtualMachine } from './fsx.generated';
import type { RemovalPolicy, SecretValue } from '../../core';
import { Resource, Token, ValidationError } from '../../core';
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
   */
  readonly userName: string;

  /**
   * The password for the domain join user.
   */
  readonly password: SecretValue;

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
export interface IOntapStorageVirtualMachine {
  /**
   * The ID of the SVM.
   * @attribute
   */
  readonly storageVirtualMachineId: string;
}

/**
 * Properties for creating an FSx for NetApp ONTAP Storage Virtual Machine.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-storagevirtualmachine.html
 */
export interface OntapStorageVirtualMachineProps {
  /**
   * The file system that this SVM belongs to.
   */
  readonly fileSystem: IFileSystem;

  /**
   * The name of the SVM.
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

  private readonly svm: CfnStorageVirtualMachine;

  constructor(scope: Construct, id: string, props: OntapStorageVirtualMachineProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    this.validateProps(props);

    this.svm = new CfnStorageVirtualMachine(this, 'Resource', {
      fileSystemId: props.fileSystem.fileSystemId,
      name: props.name,
      rootVolumeSecurityStyle: props.rootVolumeSecurityStyle,
      svmAdminPassword: props.svmAdminPassword?.unsafeUnwrap(),
      activeDirectoryConfiguration: props.activeDirectoryConfiguration ? {
        netBiosName: props.activeDirectoryConfiguration.netBiosName,
        selfManagedActiveDirectoryConfiguration: props.activeDirectoryConfiguration.selfManagedActiveDirectoryConfiguration ? (() => {
          const smad = props.activeDirectoryConfiguration!.selfManagedActiveDirectoryConfiguration!;
          return {
            dnsIps: smad.dnsIps,
            domainName: smad.domainName,
            userName: smad.userName,
            password: smad.password.unsafeUnwrap(),
            organizationalUnitDistinguishedName: smad.organizationalUnitDistinguishedName,
            fileSystemAdministratorsGroup: smad.fileSystemAdministratorsGroup,
          };
        })() : undefined,
      } : undefined,
    });

    this.svm.applyRemovalPolicy(props.removalPolicy);

    this.storageVirtualMachineId = this.svm.ref;
    this.resourceArn = this.svm.attrResourceArn;
  }

  private validateProps(props: OntapStorageVirtualMachineProps): void {
    this.validateName(props.name);
    this.validateSvmAdminPassword(props.svmAdminPassword);
  }

  private validateName(name: string): void {
    if (Token.isUnresolved(name)) return;
    if (name.length < 1 || name.length > 47) {
      throw new ValidationError(lit`SvmNameLength`, `'name' must be between 1 and 47 characters, got ${name.length}`, this);
    }
  }

  private validateSvmAdminPassword(password?: SecretValue): void {
    if (!password) return;
    const value = password.unsafeUnwrap();
    if (Token.isUnresolved(value)) return;
    if (value.length < 8 || value.length > 50) {
      throw new ValidationError(lit`SvmAdminPasswordLength`, '\'svmAdminPassword\' must be between 8 and 50 characters', this);
    }
  }
}
