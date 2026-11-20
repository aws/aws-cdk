
import type * as EKS from '@aws-sdk/client-eks';
import { ResourceHandler } from './common';

const MAX_NAME_LEN = 63;
const MAX_EKS_PROFILE_NAME_LEN = 100;

export class FargateProfileResourceHandler extends ResourceHandler {
  protected async onCreate() {
    const fargateProfileName = this.event.ResourceProperties.Config.fargateProfileName ?? this.generateProfileName();

    const createFargateProfile: EKS.CreateFargateProfileCommandInput = {
      fargateProfileName,
      ...this.event.ResourceProperties.Config,
    };

    this.log({ createFargateProfile });
    const createFargateProfileResponse = await this.eks.createFargateProfile(createFargateProfile);
    this.log({ createFargateProfileResponse });

    if (!createFargateProfileResponse.fargateProfile) {
      throw new Error('invalid CreateFargateProfile response');
    }

    return {
      PhysicalResourceId: createFargateProfileResponse.fargateProfile.fargateProfileName,
      Data: {
        fargateProfileArn: createFargateProfileResponse.fargateProfile.fargateProfileArn,
      },
    };
  }

  protected async onDelete() {
    if (!this.physicalResourceId) {
      throw new Error('Cannot delete a profile without a physical id');
    }

    // If CloudFormation cancels the create before this provider reports a physical id (for example,
    // because another resource in the stack failed while the profile was still being created), it
    // assigns its own id ("<stack name>-<logical id>-<suffix>") and sends it with the rollback delete.
    // That id is not the name of a profile, and EKS rejects it if it isn't a valid profile name.
    if (!isValidProfileName(this.physicalResourceId)) {
      this.log(`physical id ${this.physicalResourceId} is not a valid fargate profile name, nothing to delete`);
      return;
    }

    const deleteFargateProfile: EKS.DeleteFargateProfileCommandInput = {
      clusterName: this.event.ResourceProperties.Config.clusterName,
      fargateProfileName: this.physicalResourceId,
    };

    this.log({ deleteFargateProfile });
    try {
      const deleteFargateProfileResponse = await this.eks.deleteFargateProfile(deleteFargateProfile);
      this.log({ deleteFargateProfileResponse });
    } catch (deleteFargateProfileError: any) {
      if (deleteFargateProfileError.name !== 'ResourceNotFoundException') {
        throw deleteFargateProfileError;
      }
      this.log(`fargate profile ${this.physicalResourceId} not found, idempotently succeeded`);
    }

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
    const status = await this.queryStatus();
    return {
      IsComplete: status === 'ACTIVE',
    };
  }

  protected async isDeleteComplete() {
    // see onDelete: there is no profile behind a physical id that isn't a valid profile name
    if (this.physicalResourceId && !isValidProfileName(this.physicalResourceId)) {
      return { IsComplete: true };
    }

    const status = await this.queryStatus();
    return {
      IsComplete: status === 'NOT_FOUND',
    };
  }

  /**
   * Generates a fargate profile name.
   */
  private generateProfileName() {
    const suffix = this.requestId.replace(/-/g, ''); // 32 chars
    const offset = MAX_NAME_LEN - suffix.length - 1;
    const prefix = this.logicalResourceId.slice(0, offset > 0 ? offset : 0);
    return `${prefix}-${suffix}`;
  }

  /**
   * Queries the Fargate profile's current status and returns the status or
   * NOT_FOUND if the profile doesn't exist (i.e. it has been deleted).
   */
  private async queryStatus(): Promise<EKS.FargateProfileStatus | 'NOT_FOUND' | string | undefined> {
    if (!this.physicalResourceId) {
      throw new Error('Unable to determine status for fargate profile without a resource name');
    }

    const describeFargateProfile: EKS.DescribeFargateProfileCommandInput = {
      clusterName: this.event.ResourceProperties.Config.clusterName,
      fargateProfileName: this.physicalResourceId,
    };

    try {
      this.log({ describeFargateProfile });
      const describeFargateProfileResponse = await this.eks.describeFargateProfile(describeFargateProfile);
      this.log({ describeFargateProfileResponse });
      const status = describeFargateProfileResponse.fargateProfile?.status;

      if (status === 'CREATE_FAILED' || status === 'DELETE_FAILED') {
        throw new Error(status);
      }

      return status;
    } catch (describeFargateProfileError: any) {
      if (describeFargateProfileError.name === 'ResourceNotFoundException') {
        this.log('received ResourceNotFoundException, this means the profile has been deleted (or never existed)');
        return 'NOT_FOUND';
      }

      this.log({ describeFargateProfileError });
      throw describeFargateProfileError;
    }
  }
}

/**
 * Whether `name` can be the name of a Fargate profile. EKS rejects names longer
 * than 100 characters and names that start with the reserved "eks-" prefix.
 */
function isValidProfileName(name: string) {
  return name.length <= MAX_EKS_PROFILE_NAME_LEN && !name.toLowerCase().startsWith('eks-');
}
