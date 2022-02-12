const unique_names_generator = require('unique-names-generator');
const layer_version_dependency = require('/opt/nodejs/layer_version_dependency');

const characterName = unique_names_generator.uniqueNamesGenerator({
    dictionaries: [unique_names_generator.animals]
});

let response;

exports.lambdaHandler = async (event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `Hello World from function construct with nodejs runtime ${layer_version_dependency.get_dependency()}`,
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }
    return response;
};