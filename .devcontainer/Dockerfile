FROM node:23.6-bullseye-slim AS node 
FROM rust:1.84-slim-bullseye AS rust

FROM ubuntu:24.10

# ユーザー設定の引数
ARG USER_NAME=utakata
ARG USER_ID=1100
ARG GROUP_ID=1100

# ユーザーとグループの作成
RUN groupadd -g ${GROUP_ID} ${USER_NAME} && \
    useradd --create-home --uid ${USER_ID} --gid ${GROUP_ID} --shell /bin/bash ${USER_NAME}

ENV DISPLAY :1
ENV DEBIAN_FRONTEND noninteractive

RUN echo "deb http://archive.ubuntu.com/ubuntu jammy main universe" >> /etc/apt/sources.list

RUN apt-get update && apt-get upgrade -y \
    && apt-get -y install --no-install-recommends \
    # https://tauri.app/v1/guides/getting-started/prerequisites#1-system-dependencies
    build-essential \
    curl \
    file \
    libayatana-appindicator3-dev \
    libgtk-3-dev \
    libjavascriptcoregtk-4.1-dev \
    librsvg2-dev \
    libsoup-3.0-dev \
    libssl-dev \
    libwebkit2gtk-4.1-dev \
    locales \
    lxde \
    novnc \
    pkg-config \
    tigervnc-common \
    tigervnc-standalone-server \
    tigervnc-tools \
    websockify \
    wget \
    && apt clean -y && rm -rf /var/lib/apt/lists/*

ENV PKG_CONFIG_PATH /usr/lib/x86_64-linux-gnu/pkgconfig

RUN locale-gen ja_JP.UTF-8 && update-locale LANG=ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

# Rustのインストール
COPY --from=rust /usr/local/cargo /usr/local/cargo
COPY --from=rust /usr/local/rustup /usr/local/rustup
ENV PATH $PATH:/usr/local/cargo/bin/
ENV RUSTUP_HOME /usr/local/rustup
ENV CARGO_HOME /usr/local/cargo

# Node.jsのインストール
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN ln -s /usr/local/bin/node /usr/local/bin/nodejs \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npx

RUN rustup target add wasm32-unknown-unknown && \
    rustup install nightly && \
    cargo install cargo-udeps --locked && \
    cargo install tauri-cli --locked 

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# 権限の設定
RUN chown -R ${USER_ID}:${GROUP_ID} /usr/local/cargo /usr/local/rustup

# コンテナ内の作業ユーザーを設定
USER ${USER_NAME}
WORKDIR /workspace
RUN chown -R $(whoami) /workspace && \
    mkdir -p /workspace/src-tauri/target && \
    chown -R $(whoami) /workspace/src-tauri/target


# 確認用シェル
SHELL ["/bin/bash", "-c"]