const unique_names_generator = require('unique-names-generator');

const characterName = unique_names_generator.uniqueNamesGenerator({
    dictionaries: [unique_names_generator.animals]
});

exports.get_dependency = () => {
   return 7
};