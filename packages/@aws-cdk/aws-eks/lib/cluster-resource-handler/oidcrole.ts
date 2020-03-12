import { ResourceHandler } from "./common";

// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from "aws-sdk";

export class OpenIDConnectRoleResourceHandler extends ResourceHandler {
  protected async onCreate() {
    const { roleName } = this.event.ResourceProperties.Config;

    const role = await this.eks.getRole({ RoleName: roleName});
    if (!role) {
      throw new Error(`no role found with name ${roleName}`);
    }

    return {
      PhysicalResourceId: roleName
    };
  }

  protected async onDelete() {
    if (!this.physicalResourceId) {
      throw new Error(
        `Cannot delete a profile without a physical id`
      );
    }

    const deleteOpenIDConnectProvider: aws.IAM.DeleteOpenIDConnectProviderRequest = {
      OpenIDConnectProviderArn: this.physicalResourceId
    };

    this.log({ deleteOpenIDConnectProvider });
    const deleteOpenIDConnectProviderResponse = await this.eks.deleteOpenIDConnectProvider(
      deleteOpenIDConnectProvider
    );
    this.log({ deleteOpenIDConnectProviderResponse });

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
        `Cannot get a profile without a physical id`
      );
    }

    const getOpenIDConnectProvider: aws.IAM.GetOpenIDConnectProviderRequest = {
      OpenIDConnectProviderArn: this.physicalResourceId
    };

    try {
      this.log({ getOpenIDConnectProvider });
      const getOpenIDConnectProviderResponse = await this.eks.getOpenIDConnectProvider(
        getOpenIDConnectProvider
      );
      this.log({ getOpenIDConnectProviderResponse });
      return true;
    } catch (getOpenIDConnectProviderError) {
      if (getOpenIDConnectProviderError.code === "NoSuchEntity") {
        this.log(
          "received NoSuchEntityFoundException, this means the profile has been deleted (or never existed)"
        );
        return false;
      }

      this.log({ getOpenIDConnectProviderError });
      throw getOpenIDConnectProviderError;
    }
  }
}
