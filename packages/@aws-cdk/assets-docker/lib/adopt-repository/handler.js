const AWS = require('aws-sdk');
const ecr = new AWS.ECR();

exports.handler = async function(event, context, _callback, respond) {
  respond = respond || respondCFN;
  try {
    console.log(JSON.stringify(event));

    const markerStatement = {
      Sid: event.StackId,
      Effect: "Deny",
      Action: "OwnedBy:CDKStack",
      Principal: "*"
    };

    function repoName(arn) {
      return arn.split('/').slice(1).join('/');
    }

    // The repository must already exist
    async function getAdopter(name) {
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

    const repo = repoName(event.ResourceProperties.RepositoryArn);
    const adopter = await getAdopter(repo);
    if (event.RequestType === 'Delete') {
      if (adopter.Sid !== markerStatement.Sid) {
        throw new Error(`This repository is already owned by another stack: ${adopter.Sid}`);
      }
      try {
        console.log('Deleting', repo);
        const ids = (await ecr.listImages({ repositoryName: repo }).promise()).imageIds;
        await ecr.batchDeleteImage({ repositoryName: repo, imageIds: ids }).promise();
        await ecr.deleteRepository({ repositoryName: repo }).promise();
      } catch(e) {
        if (e.code !== 'RepositoryNotFoundException') { throw e; }
      }
    }

    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
      if (adopter.Sid !== undefined && adopter.Sid !== markerStatement.Sid) {
        throw new Error(`This repository is already owned by another stack: ${adopter.Sid}`);
      }
      console.log('Adopting', repo);

      const policy = event.ResourceProperties.PolicyDocument || {
        Version: '2008-10-17',
        Statement: [ ]
      };

      if (!policy.Version) {
        policy.Version = '2008-10-17';
      }

      if (!policy.Statement) {
        policy.Statement = [ ];
      }

      if (!Array.isArray(policy.Statement)) {
        policy.Statement = [ policy.Statement ];
      }

      policy.Statement.push(markerStatement);

      console.log('policy document:', JSON.stringify(policy, undefined, 2));

      await ecr.setRepositoryPolicy({ repositoryName: repo, policyText: JSON.stringify(policy) }).promise();
    }

    const arn = event.ResourceProperties.RepositoryArn.split(':');
    await respond("SUCCESS", "OK", repo, {});
  } catch (e) {
    console.log(e);
    await respond("FAILED", e.message, context.logStreamName, {});
  }

  function respondCFN(responseStatus, reason, physId, data) {
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

    return new Promise((resolve, reject) => {
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
