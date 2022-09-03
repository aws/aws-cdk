FROM jsii/superchain:1-buster-slim

USER root

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends zsh

USER superchain

RUN sudo chsh -s $(which zsh) $(whoami)