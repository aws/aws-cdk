var gen = require('unique-names-generator');

const colorName = gen.uniqueNamesGenerator({
    dictionaries: [gen.colors]
});

exports.lambdaHandler = async(event, context) => {
    let response;

    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: "Hello World",
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }
    return response;
};
