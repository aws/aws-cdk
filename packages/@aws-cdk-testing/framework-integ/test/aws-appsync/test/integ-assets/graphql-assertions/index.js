const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

/**
 * 
 * @param {Object} event json object that contains the prompt and model
 * @returns {Object}
 */
exports.handler = async function(event) {
  console.log(event);

  let myHeaders = new Headers();
  myHeaders.append("x-api-key", API_KEY);
  myHeaders.append("Content-Type", "application/json");

  const query = JSON.stringify({
    query: `
      mutation Mutation($prompt: String, $model: String) {
        invokeModel(prompt: $prompt, model: $model)
      }
    `,
    variables: {
      prompt: event.prompt,
      model: event.model
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: query,
    redirect: 'follow'
  };

  const response = await fetch(API_URL, requestOptions).then(response => response.json());

  if (response.errors) {
    return {
      statusCode: 400,
      errorType: response.errors[0].errorType
    }
  } else {
    return {
      statusCode: 200,
      message: "Model returned successfully"
    }
  }
}
