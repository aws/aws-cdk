# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-dotnet6
FROM $IMAGE

# Install Amazon Lambda Tools for .NET CLI
RUN dotnet tool install -g Amazon.Lambda.Tools --version 5.6.2

# Ensure all users can write to dotnet & NuGet paths
RUN mkdir -p /.dotnet && chmod 777 /.dotnet \
    && mkdir -p /.nuget && chmod 777 /.nuget \
    && mkdir -p /.local/share/NuGet && chmod 777 /.local/share/NuGet

CMD [ "dotnet" ]