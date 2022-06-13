const AWS = require('aws-sdk');

// These are used for test purposes only
let defaultResponseURL;

/**
 * Upload a CloudFormation response for a Custom Resource
 *
 * @param {object} event the Lambda event payload received by the handler function
 * @param {object} context the Lambda context received by the handler function
 * @param {string} responseStatus the response status, either 'SUCCESS' or 'FAILED'
 * @param {string} physicalResourceId CloudFormation physical resource ID
 * @param {object} [responseData] arbitrary response data object
 * @param {string} [reason] reason for failure, if any, to convey to the user
 * @returns {Promise} Promise that is resolved on success, or rejected on connection error or HTTP error response
 */
let report = function (event, context, responseStatus, physicalResourceId, responseData, reason) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const { URL } = require('url');

    var responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physicalResourceId || context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
    });

    const parsedUrl = new URL(event.ResponseURL || defaultResponseURL);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': responseBody.length
      }
    };

    https.request(options)
      .on('error', reject)
      .on('response', res => {
        res.resume();
        if (res.statusCode >= 400) {
          reject(new Error(`Server returned error ${res.statusCode}: ${res.statusMessage}`));
        } else {
          resolve();
        }
      })
      .end(responseBody, 'utf8');
  });
};
/**
 * Lambda to handle linking together DynamoDB tables into a global table.
 */
exports.handler = async function (event, context) {
  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));
  var responseData = {};
  var physicalResourceId;

  try {
    switch (event.RequestType) {
      case 'Create':
        console.log("CREATE!");
        var dynamodb = new AWS.DynamoDB();
        var regions = [];
        for (var i = 0; i < event.ResourceProperties.Regions.length; i++) {
          regions.push({
            "RegionName": event.ResourceProperties.Regions[i]
          });
        }
        var params = {
          GlobalTableName: event["ResourceProperties"]["TableName"],
          ReplicationGroup: regions
        };
        console.log(params);
        await dynamodb.createGlobalTable(params).promise();
        await report(event, context, 'SUCCESS', physicalResourceId, responseData);
        break;
      case 'Update':
        console.log("UPDATE!");
        var dynamodb = new AWS.DynamoDB();
        var params = {
          GlobalTableName: event["ResourceProperties"]["TableName"]
        };
        // Get the current regions deployed for this table
        let data = await dynamodb.describeGlobalTable(params).promise();
        // Flatten the data
        var currentDynamoRegions = [];
        for (let region of data["GlobalTableDescription"]["ReplicationGroup"]) {
          currentDynamoRegions.push(region["RegionName"]);
        }

        // Build the params for regions to build
        var addRegions = [];
        for (var i = 0; i < event.ResourceProperties.Regions.length; i++) {
          if(currentDynamoRegions.indexOf(event.ResourceProperties.Regions[i]) < 0 ){
            addRegions.push({
              Create: {
                RegionName: String(event.ResourceProperties.Regions[i])
              }
            });
          }
        }
        // Call AWS sdk to update DynamoDB to add the regions
        console.log("Add Regions: "+ JSON.stringify(addRegions));
        if(addRegions.length > 0){
          var params = {
            GlobalTableName: event["ResourceProperties"]["TableName"],
            ReplicaUpdates: addRegions
          };
          console.log(params);
          await dynamodb.updateGlobalTable(params).promise();
        }

        // Need to add/remove regions in separate steps
        // Build the params for removing regions
        var removeRegions = [];
        for (var i = 0; i < currentDynamoRegions.length; i++) {
          if(event.ResourceProperties.Regions.indexOf(currentDynamoRegions[i]) < 0 ){
            removeRegions.push({
              Delete: {
                RegionName: String(currentDynamoRegions[i])
              }
            });
          }
        }
        // Call AWS sdk to update DynamoDB to remove the regions
        console.log("Remove Regions: "+ JSON.stringify(removeRegions));
        if(removeRegions.length > 0){
          var params = {
            GlobalTableName: event["ResourceProperties"]["TableName"],
            ReplicaUpdates: removeRegions
          };
          console.log(params);
          await dynamodb.updateGlobalTable(params).promise();
        }
        await report(event, context, 'SUCCESS', physicalResourceId, responseData);
        break;
      case 'Delete':
        console.log("DELETE!");
        await report(event, context, 'SUCCESS', physicalResourceId, responseData);
        break;
      default:
        throw new Error(`Unsupported request type ${event.RequestType}`);
    }

    console.log(`Done!`);
  } catch (err) {
    console.log(`Caught error ${err}.`);
    await report(event, context, 'FAILED', physicalResourceId, null, err.message);
  }
};

/**
 * @private
 */
exports.withDefaultResponseURL = function (url) {
  defaultResponseURL = url;
};
