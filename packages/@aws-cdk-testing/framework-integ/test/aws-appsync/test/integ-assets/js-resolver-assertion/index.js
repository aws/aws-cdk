exports.handler = async function(event) {
  console.log(event);

  let myHeaders = new Headers();
  myHeaders.append("x-api-key", event.apiKey);
  myHeaders.append("Content-Type", "application/json");

  const query = JSON.stringify({
    query: "mutation MyMutation {\n  addTest(name: \"123\") {\n    id\n    name\n  }\n}",
    variables: {}
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: query,
    redirect: 'follow'
  };

  const response = await fetch(event.hostname, requestOptions)
    .then(response => response.json())

  return response;
}
