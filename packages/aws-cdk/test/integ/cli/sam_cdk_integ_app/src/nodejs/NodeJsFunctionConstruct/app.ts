import { uniqueNamesGenerator, animals} from 'unique-names-generator';
import {get_dependency} from '/opt/nodejs/layer_version_dependency';

const characterName = uniqueNamesGenerator({
    dictionaries: [animals]
});
let response;

exports.lambdaHandler = async(event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `Hello World from nodejs function construct ${get_dependency()}`,
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }
    return response;
};
