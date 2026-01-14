# script tests

This directory includes tests for scripts under `./scripts`.

## Recent Improvements

### JavaScript Utility Scripts (2026-01)

Comprehensive improvements have been made to core utility scripts to enhance maintainability, error handling, and developer experience:

#### Enhanced Error Handling
- **log-memory.js**: Fixed critical bug where `memoryUsage.rss` was incorrectly called as a function instead of accessing the property
- **dependencies.py**: Added UTF-8 encoding support and try/except blocks for malformed JSON files
- **check-yarn-lock.js**: Collects all missing dependencies before failing, providing complete feedback

#### Improved Documentation
All JavaScript utilities now include comprehensive JSDoc documentation:
- Function parameters and return types
- Usage examples
- Error conditions
- Purpose and behavior descriptions

#### Better Developer Experience
- Progress indicators with emoji feedback (🔍, ✅, ❌)
- Detailed error messages with file context
- Input validation before processing
- Consistent error message patterns across all scripts

#### Code Quality Improvements
- Eliminated variable shadowing (e.g., `path` → `dirPath`)
- Constants for validation (e.g., `VALID_BUMP_TYPES`)
- Improved variable naming for clarity
- Enhanced code readability and maintainability

### Affected Scripts
- `stability.js` - Package stability analysis
- `align-version.js` - Version alignment across monorepo  
- `bump.js` - Version bumping for releases
- `find-latest-release.js` - Latest CDK release discovery
- `jetbrains-remove-node-modules.js` - IDE configuration
- `retain-public.js` - Public package filtering
- `create-release-notes.js` - Release notes generation
- `check-yarn-lock.js` - Dependency validation