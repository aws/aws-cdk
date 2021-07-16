## Project Style/Structure

* [Code Organization](#code-organization)
* [Naming Conventions](#naming-conventions)
* [Coding Style](#coding-style)

### Code Organization

* Code should be under `lib/`
* Entry point should be `lib/index.ts` and should only contain “imports”
  for other files.
* No need to put every class in a separate file. Try to think of a
  reader-friendly organization of your source files.

### Naming Conventions

* **Class names**: PascalCase
* **Properties**: camelCase
* **Methods (static and non-static)**: camelCase
* **Interfaces** (“behavioral interface”): IMyInterface
* **Structs** (“data interfaces”): MyDataStruct
* **Enums**: PascalCase, **Members**: SNAKE_UPPER

### Coding Style

* **Indentation**: 2 spaces
* **Line length**: 150
* **String literals**: use single-quotes (`'`) or backticks (```)
* **Semicolons**: at the end of each code statement and declaration
  (incl. properties and imports).
* **Comments**: start with lower-case, end with a period.
