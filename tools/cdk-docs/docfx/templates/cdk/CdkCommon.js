exports.firstSentence = function(summary) {
  if (!summary) return '';
  //Return first <p> tag.
  let m = /<p[\s\S]*<\/p>/.exec(summary);
  return m && m[0] || '';
}
