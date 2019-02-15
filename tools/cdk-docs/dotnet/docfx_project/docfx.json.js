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
      "disableDefaultFilter": false
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
    "template": ["default", "dotnet"],
    "postProcessors": [],
    "markdownEngineName": "markdig",
    "noLangKeyword": false,
    "keepFileLink": false,
    "cleanupCacheHistory": false,
    "disableGitFeatures": false
  }
}, undefined, 2));
