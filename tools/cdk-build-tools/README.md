CDK Build Tools
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>

================

These scripts wrap the common operations that need to happen
during a CDK build, in a common place so it's easy to change
the build for all packages.

Written in TypeScript instead of shell so that they can work
on Windows with no extra effort.
