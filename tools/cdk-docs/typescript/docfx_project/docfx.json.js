console.log(JSON.stringify({
  "build": {
    "content": [
      {
        "files": ["**/*.yml", "toc.yml"],
        "src": "yaml",
        "dest": "api"
      },
      {
        "files": [
          "toc.yml",
          "*.md"
        ]
      }
    ],
    "dest": process.env.OUTPUTDIR,
  }
}, undefined, 2));
