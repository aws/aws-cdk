console.log(JSON.stringify({
  "metadata": [
    {
      "src": [
        {
          "src": process.env.SOURCEDIR,
          "files": [ "**/*.csproj" ]
        }
      ],
      "dest": "api",
      "disableGitFeatures": false,
      "disableDefaultFilter": false,
      "filter": "filterConfig.yml"
    }
  ],
  "build": {
    "content": [
      {
        "files": ["api/**.yml", "api/index.md"]
      },
      {
        "files": [
          "toc.yml",
          "*.md"
        ]
      }
    ],
    "dest": process.env.OUTPUTDIR,
    "postProcessors": [],
    "markdownEngineName": "markdig",
    "noLangKeyword": false,
    "keepFileLink": false,
    "cleanupCacheHistory": false,
    "disableGitFeatures": false
  }
}, undefined, 2));
