import { uniqueNamesGenerator, animals} from 'unique-names-generator';

const characterName = uniqueNamesGenerator({
    dictionaries: [animals]
});
let response;

exports.lambdaHandler = async(event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `Hello World`,
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }
    return response;
};
