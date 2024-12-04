FROM jsii/superchain:1-bookworm-slim-node20

USER root

# Setup oh-my-zsh
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends zsh vim \
    && rm -rf /var/lib/apt/lists/* \
    && chsh -s $(which zsh) superchain

# Required, otherwise shell is extermly slow due the size of the aws-cdk
RUN sh -c 'echo "[oh-my-zsh]\n        hide-dirty = 1" > /etc/gitconfig'

# Change uid/guid of superchain so it can work with the docker-in-docker feature
RUN groupmod --gid 1000 superchain \
    && usermod --uid 1000 --gid 1000 superchain \
    && chown -R 1000:1000 /home/superchain

USER superchain

# Setup oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
