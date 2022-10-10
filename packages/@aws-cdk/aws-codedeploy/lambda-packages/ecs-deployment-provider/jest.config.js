module.exports = {
  "roots": [
    "<rootDir>/lib",
    "<rootDir>/test"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": ".test.ts$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "collectCoverage": true,
  "collectCoverageFrom": ["./lib/**"],
  "coverageThreshold": {
    "global": {
      "branches": 80
    }
  },
  "testEnvironment": "node"
}
