FROM public.ecr.aws/debian/debian:buster-slim as build

# Install basic pre-requisites
RUN apt-get update                                                                                  \
  && apt-get install -y build-essential curl git libssl-dev openssl pkg-config zsh

# Make sure we use the correct shell going forward
SHELL ["/bin/zsh", "-c"]

# Install Rustup
ENV RUSTUP_HOME=/usr/local/rustup
ENV CARGO_HOME=/usr/local/cargo
RUN set -eo pipefail                                                                                \
  && curl -fSsL "https://sh.rustup.rs" | sh -s -- -y --no-modify-path --profile=minimal             \
  && echo "source ${CARGO_HOME}/env" >> /etc/profile.d/cargo.sh                                     \
  && chmod -R a+rw ${CARGO_HOME}
ENV PATH=$PATH:${CARGO_HOME}/bin

# Install Node
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -                                       \
  && apt-get install -y nodejs

# Install wasm-pack
RUN cargo install wasm-opt wasm-pack

ARG NOCTILUCENT_GIT
ARG NOCTILUCENT_COMMIT_ID

# Check out noctilucent
RUN git clone "${NOCTILUCENT_GIT}" "${TMPDIR}/noctilucent"                                          \
  && git -C "${TMPDIR}/noctilucent" checkout -b wasm "${NOCTILUCENT_COMMIT_ID}"

# Build noctilucent to WASM
RUN cd "${TMPDIR}/noctilucent" \
  && wasm-pack build --target=nodejs --out-name=index --out-dir=/wasm-out                           \
  && rm --force /wasm-out/.gitignore /wasm-out/README.md /wasm-out/package.json                     \
  && echo "${NOCTILUCENT_GIT}:${NOCTILUCENT_COMMIT_ID}" > /wasm-out/.version

####################################################################################################
FROM scratch as wasm
COPY --from=build /wasm-out /
