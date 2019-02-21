console.log(JSON.stringify({
  "build": {
    "content": [
      {
        "files": ["api/**/*.yml", "api/toc.yml", "api/index.md"],
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
