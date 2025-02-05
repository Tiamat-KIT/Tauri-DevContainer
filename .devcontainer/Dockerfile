FROM node:23.6-bullseye-slim as node 
FROM rust:1.84-slim-bullseye as rust

FROM mcr.microsoft.com/vscode/devcontainers/base:bullseye


# ユーザー設定の引数
ARG USER_NAME=utakata
ARG USER_ID=1100
ARG GROUP_ID=1100

# ユーザーとグループの作成
RUN groupadd -g ${GROUP_ID} ${USER_NAME} && \
    useradd --create-home --uid ${USER_ID} --gid ${GROUP_ID} --shell /bin/bash ${USER_NAME}

ENV DISPLAY=:1

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    # https://tauri.app/v1/guides/getting-started/prerequisites#1-system-dependencies
    libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    # GUI
    lxde \
    # TigerVNC
    tigervnc-standalone-server \
    tigervnc-common \
    tigervnc-tools \
    # noVNC
    novnc \
    websockify \
    # other
    file \ 
    pkg-config \
    && apt clean -y && rm -rf /var/lib/apt/lists/*

# Rustのインストール
COPY --from=rust /usr/local/cargo /usr/local/cargo
COPY --from=rust /usr/local/rustup /usr/local/rustup
ENV PATH $PATH:/usr/local/cargo/bin/
ENV RUSTUP_HOME /usr/local/rustup
ENV CARGO_HOME=/usr/local/cargo

# Node.jsのインストール
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npx

RUN rustup target add wasm32-unknown-unknown && \
    rustup install nightly && \
    cargo install cargo-udeps --locked 

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# コンテナ内の作業ユーザーを設定
USER ${USER_NAME}

WORKDIR /workspace
RUN chown -R ${USER_ID}:${GROUP_ID} /workspace

# 確認用シェル
SHELL ["/bin/bash", "-c"]