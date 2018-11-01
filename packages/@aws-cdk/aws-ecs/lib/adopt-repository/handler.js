const AWS = require('aws-sdk');
const ecr = new AWS.ECR();

exports.handler = async function adoptRegistryHandler(event, context) {
  try {
    console.log(JSON.stringify(event));

    const markerStatement = {
      Sid: event.StackId,
      Effect: "Deny",
      Action: "OwnedBy:CDKStack",
      Principal: "*"
    };

    function repoName(props) {
      return props.RepositoryArn.split('/').slice(1).join('/');
    }

    // The repository must already exist
    async function getAdopter(name): Promise<any> {
      try {
        const policyResponse = await ecr.getRepositoryPolicy({ repositoryName: name }).promise();
        const policy = JSON.parse(policyResponse.policyText);
        // Search the policy for an adopter marker
        return (policy.Statement || []).find((x) => x.Action === markerStatement.Action) || {};
      } catch (e) {
        if (e.code !== 'RepositoryPolicyNotFoundException') { throw e; }
        return {};
      }
    }

    const repo = repoName(event.ResourceProperties);
    const adopter = await getAdopter(repo);
    if (event.RequestType === 'Delete') {
      if (adopter.Sid !== markerStatement.Sid) {
        throw new Error(`This repository is already owned by another stack: ${adopter.Sid}`);
      }
      console.log('Deleting', repo);
      const ids = (await ecr.listImages({ repositoryName: repo }).promise()).imageIds;
      try {
        await ecr.batchDeleteImage({ repositoryName: repo, imageIds: ids }).promise();
        await ecr.deleteRepository({ repositoryName: repo }).promise();
      } catch (e) {
        if (e.code !== 'RepositoryPolicyNotFoundException') { throw e; }
      }
    }

    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
      if (adopter.Sid !== undefined && adopter.Sid !== markerStatement.Sid) {
        throw new Error(`This repository is already owned by another stack: ${adopter.Sid}`);
      }
      console.log('Adopting', repo);
      await ecr.setRepositoryPolicy({ repositoryName: repo, policyText: JSON.stringify({
        Version: '2008-10-17',
        Statement: [markerStatement]
      }) }).promise();
    }

    const arn = event.ResourceProperties.RepositoryArn.split(':');
    await respond("SUCCESS", "OK", repo, {
      RepositoryUri: `${arn[4]}.dkr.ecr.${arn[3]}.amazonaws.com/${repoName(event.ResourceProperties)}`
    });
  } catch (e) {
    console.log(e);
    await respond("FAILED", e.message, context.logStreamName, {});
  }

  function respond(responseStatus, reason, physId, data) {
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: false,
      Data: data
    });

    console.log('Responding', JSON.stringify(responseBody));

    const parsedUrl = require('url').parse(event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: "PUT",
      headers: { "content-type": "", "content-length": responseBody.length }
    };

    return new Promise<void>((resolve, reject) => {
      try {
        const request = require('https').request(requestOptions, resolve);
        request.on("error", reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}
