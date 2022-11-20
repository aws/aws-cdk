import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { OrganizationRoot } from './organization-root';
import { CfnOrganizationalUnit } from './organizations.generated';

export interface IOrganizationalUnit extends IResource{
  readonly organizationalUnitName: string;
  readonly organizationalUnitId: string;
  readonly organizationalUnitArn: string;
}

export interface OrganizationUnitOptions {
  readonly organizationalUnitName: string;
}

export interface OrganizationalUnitProps extends OrganizationUnitOptions {
  readonly parent?: IOrganizationalUnit;
}

abstract class OrganizationalUnitBase extends Resource implements IOrganizationalUnit {
  readonly abstract organizationalUnitName: string;
  readonly abstract organizationalUnitId: string;
  readonly abstract organizationalUnitArn: string;
}

export interface OrganizationalUnitAttributes extends OrganizationUnitOptions {
  readonly organizationalUnitId: string;
  readonly organizationalUnitArn: string;
}

export class OrganizationalUnit extends OrganizationalUnitBase {
  public static fromOrganizationalUnitAttributes(scope: Construct, id: string, attrs: OrganizationalUnitAttributes): IOrganizationalUnit {
    return new class extends OrganizationalUnitBase {
      readonly organizationalUnitArn: string = attrs.organizationalUnitArn;
      readonly organizationalUnitId: string = attrs.organizationalUnitId;
      readonly organizationalUnitName: string = attrs.organizationalUnitName;

      constructor() {
        super(scope, id);
      }
    };
  }
  readonly organizationalUnitName: string;
  readonly organizationalUnitId: string;
  readonly organizationalUnitArn: string;

  public constructor(scope: Construct, id: string, props: OrganizationalUnitProps) {
    super(scope, id);

    const parentId = props.parent?.organizationalUnitId ?? OrganizationRoot.getOrCreate(this).organizationRootId;

    const resource = new CfnOrganizationalUnit(this, 'Resource', {
      name: props.organizationalUnitName,
      parentId: parentId,
    });

    this.organizationalUnitName = props.organizationalUnitName;
    this.organizationalUnitId = resource.ref;
    this.organizationalUnitArn = resource.attrArn;
  }
}

