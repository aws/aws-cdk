import { ResourceHandler } from "./common";

// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from "aws-sdk";
import * as https from "https";

export class OpenIDConnectProviderResourceHandler extends ResourceHandler {
  protected async onCreate() {
    const clusterName = this.event.ResourceProperties.Config.clusterName;

    const cluster = await this.eks.describeCluster({ name: clusterName });
    if (!cluster) {
      throw new Error(`no cluster found with name ${clusterName}`);
    }

    const issuerUrl = cluster.cluster?.identity?.oidc?.issuer;
    if (!issuerUrl) {
      throw new Error(`no issuer found on cluster`);
    }

    const thumbprint = await this.getIssuerCAThumbprint(issuerUrl);
    const createOpenIDConnectProviderResponse = await this.eks.createOpenIDConnectProvider(
      {
        Url: issuerUrl,
        ClientIDList: ["sts.amazonaws.com"],
        ThumbprintList: [thumbprint]
      }
    );

    return {
      PhysicalResourceId: createOpenIDConnectProviderResponse.OpenIDConnectProviderArn,
      Data: {
        openIDConnectIssuerUrl: issuerUrl.substring(8), // Strip https:// from the issuer
        openIDConnectProviderArn: createOpenIDConnectProviderResponse.OpenIDConnectProviderArn
      }
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

  private findCACertificate(certificate: any, parent?: any): any {
    if (
      certificate.issuerCertificate &&
      certificate.fingerprint !== certificate.issuerCertificate.fingerprint
    ) {
      return this.findCACertificate(certificate.issuerCertificate, certificate);
    }
    return parent;
  }

  private async getIssuerCAThumbprint(issuerUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const req = https
        .get(issuerUrl)
        .on("error", reject)
        .on("socket", socket => {
          socket.on("secureConnect", () => {
            const certificate = socket.getPeerCertificate(true);
            const fingerprint = this.findCACertificate(certificate).fingerprint;
            // Check if certificate is valid
            if (socket.authorized === false) {
              req.emit("error", new Error(socket.authorizationError));
              return req.abort();
            }
            resolve(
              fingerprint
                .split(":")
                .join("")
                .toLowerCase()
            );
          });
        });
      req.end();
    });
  }
}
