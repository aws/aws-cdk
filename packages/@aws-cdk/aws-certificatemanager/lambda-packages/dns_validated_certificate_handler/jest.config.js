module.exports = {
  "roots": [
    "<rootDir>/lib",
    "<rootDir>/test"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/test/.*|(\\.|/)(test|spec))\\.(tsx|js)?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
}
