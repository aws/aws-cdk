
module.exports = async ({github, context, core}) => {
    const fs = require('fs');
    const content = fs.readFileSync('./notices.json');

    console.log(content.toString());
}