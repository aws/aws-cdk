"use strict";require("isomorphic-fetch");const AWS=require("aws-sdk/global"),gql=require("graphql-tag"),appsync=require("aws-appsync"),config={url:process.env.APPSYNC_ENDPOINT,region:process.env.AWS_REGION,auth:{type:appsync.AUTH_TYPE.AWS_IAM,credentials:AWS.config.credentials},disableOffline:!0},getTests=`query getTests {
  getTests {
    id
    version
  }
}`,client=new appsync.AWSAppSyncClient(config);exports.handler=(event,context,callback)=>{(async()=>{try{const result=await client.query({query:gql(getTests)});console.log(result.data),callback(null,result.data)}catch(e){console.warn("Error sending mutation: ",e),callback(Error(e))}})()};
