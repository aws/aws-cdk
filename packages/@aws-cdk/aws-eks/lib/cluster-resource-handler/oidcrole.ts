import { ResourceHandler } from "./common";

// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from "aws-sdk";

export class OpenIDConnectRoleResourceHandler extends ResourceHandler {
  protected async onCreate() {
    const { roleName, issuerUrl, serviceAccountName, serviceAccountNamespace } = this.event.ResourceProperties.Config;

    const role = await this.eks.getRole({ RoleName: roleName});
    if (!role) {
      throw new Error(`no role found with name ${roleName}`);
    }

    const document = JSON.parse(decodeURIComponent(role.Role.AssumeRolePolicyDocument!));
    const statement = (document.Statement as any[]).find(s => s.Effect === "Allow" && s.Action === "sts:AssumeRoleWithWebIdentity");

    const condition: { [id: string]: any} = {};
    condition[`${issuerUrl}:aud`] = "sts.amazonaws.com";
    condition[`${issuerUrl}:sub`] = `system:serviceaccount:${serviceAccountNamespace}:${serviceAccountName}`;
    if (!statement.Condition) {
      statement.Condition = {};
    }
    statement.Condition.StringEquals = condition;

    const updateAssumeRolePolicy: aws.IAM.UpdateAssumeRolePolicyRequest = {RoleName: roleName, PolicyDocument: JSON.stringify(document)};

    this.log({ updateAssumeRolePolicy });
    const updateAssumeRolePolicyResponse = await this.eks.updateAssumeRolePolicy(updateAssumeRolePolicy);
    this.log({ updateAssumeRolePolicyResponse });

    return {
      PhysicalResourceId: roleName
    };
  }

  protected async onDelete() {
    if (!this.physicalResourceId) {
      throw new Error(
        `Cannot get a role without a physical id`
      );
    }

    const role = await this.eks.getRole({ RoleName: this.physicalResourceId});
    if (!role) {
      throw new Error(`no role found with name ${this.physicalResourceId}`);
    }

    const document = JSON.parse(decodeURIComponent(role.Role.AssumeRolePolicyDocument!));
    const statement = (document.Statement as any[]).find(s => s.Effect === "Allow" && s.Action === "sts:AssumeRoleWithWebIdentity");

    if (statement.Condition?.StringEquals) {
      statement.Condition.StringEquals = {};
    }

    const updateAssumeRolePolicy: aws.IAM.UpdateAssumeRolePolicyRequest = {
      RoleName: this.physicalResourceId,
      PolicyDocument: JSON.stringify(document)
    };

    this.log({ updateAssumeRolePolicy });
    const updateAssumeRolePolicyResponse = await this.eks.updateAssumeRolePolicy(updateAssumeRolePolicy);
    this.log({ updateAssumeRolePolicyResponse });

    return;
  }

  protected async onUpdate() {
    // all updates require a replacement. as long as name is generated, we are
    // good. if name is explicit, update will fail, which is common when trying
    // to replace cfn resources with explicit physical names
    return this.onCreate();
  }

  protected async isCreateComplete() {
    return this.isUpdateComplete();
  }

  protected async isUpdateComplete() {
    return {
      IsComplete: await this.checkResource()
    };
  }

  protected async isDeleteComplete() {
    await this.checkResource();
    return {
      IsComplete: !(await this.checkResource())
    };
  }

  private async checkResource(): Promise<boolean> {
    if (!this.physicalResourceId) {
      throw new Error(
        `Cannot get a role without a physical id`
      );
    }

    const getRole: aws.IAM.GetRoleRequest = {
      RoleName: this.physicalResourceId
    };

    try {
      this.log({ getRole });
      const getRoleResponse = await this.eks.getRole(getRole);
      this.log({ getRoleResponse });

      const document = JSON.parse(decodeURIComponent(getRoleResponse.Role.AssumeRolePolicyDocument!));
      if (!document) {
        return false;
      }
      const statement = (document.Statement as any[]).find(s => s.Effect === "Allow" && s.Action === "sts:AssumeRoleWithWebIdentity");
      if (!statement) {
        return false;
      }

      return Object.keys(statement.Condition?.StringEquals || {}).find(c => c.endsWith(':sub')) !== undefined;
    } catch (getRoleError) {
      if (getRoleError.code === "NoSuchEntity") {
        this.log(
          "received NoSuchEntityFoundException, this means the role has been deleted (or never existed)"
        );
        return false;
      }

      this.log({ getRoleError });
      throw getRoleError;
    }
  }
}
