const layer_version_dependency = require('/opt/nodejs/layer_version_dependency');
let response;

exports.lambdaHandler = async (event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `Hello World from nodejs pre built function ${layer_version_dependency.get_dependency()}`,
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }
    return response;
};