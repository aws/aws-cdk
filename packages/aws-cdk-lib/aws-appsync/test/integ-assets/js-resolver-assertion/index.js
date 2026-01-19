"use strict";exports.handler=async function(event){console.log(event);let myHeaders=new Headers;myHeaders.append("x-api-key",event.apiKey),myHeaders.append("Content-Type","application/json");const query=JSON.stringify({query:`mutation MyMutation {
  addTest(name: "123") {
    id
    name
  }
}`,variables:{}}),requestOptions={method:"POST",headers:myHeaders,body:query,redirect:"follow"};return await fetch(event.hostname,requestOptions).then(response2=>response2.json())};
