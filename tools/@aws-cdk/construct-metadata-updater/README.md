# Metadata Updater Project

This project consists of several updater classes designed to process source files in a CDK (Cloud Development Kit) project and generate metadata for analytics purposes. Below is a summary of each updater's functionality.

## 1. MetadataUpdater (Base Class)

Provides common functionality used by all updaters.
Handles adding import statements and metadata to source files.

### Key Methods

addImportAndMetadataStatement(): Adds import statements and metadata to a file.
parseConstructorProps(): Parses constructor properties from class declarations.

## 2. PropertyUpdater

Extracts constructor properties from CDK resource classes and generates a JSON file containing these properties.

### Functionality

Processes each source file to identify CDK resource classes.
Extracts properties from the constructors of these classes.
Generates a JSON file (classes.ts) that maps module names to their respective properties.

### Output

Writes metadata to ../../../../packages/aws-cdk-lib/core/lib/analytics-data-source/classes.ts.

## 3. EnumsUpdater

Collects and generates metadata for all enum types in the project.

### Functionality

Scans source files for enum declarations.
Extracts enum member values and writes them to a JSON file.

### Output

Writes metadata to ../../../../packages/aws-cdk-lib/core/lib/analytics-data-source/enums.ts.

## 4. MethodsUpdater

Note: This updater is still in the implementation phase and not yet fully functional.

Adds specific decorators or metadata to class methods.
Likely used for tracking method usage or other analytics-related metadata.
