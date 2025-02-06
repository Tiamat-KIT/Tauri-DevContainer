FROM node:23.6-alpine AS node 
FROM rust:1.84-alpine AS rust

FROM alpine:latest

# 必要なパッケージをインストール
RUN apk update && apk add --no-cache \
    build-base \
    curl \
    file \
    gtk+3.0 \
    webkit2gtk-dev \
    javascriptcoregtk-4.1 \
    librsvg \
    libsoup \
    openssl-dev \
    pkgconf \
    openbox \
    lxpanel \
    x11vnc \
    websockify \
    wget \
    shadow \
    bash

# Rustの設定をコピー
COPY --from=rust /usr/local/cargo /usr/local/cargo
COPY --from=rust /usr/local/rustup /usr/local/rustup

# Node.jsの設定をコピー
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

# 環境変数の設定
ENV DISPLAY=:1
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8
ENV PATH=$PATH:/usr/local/cargo/bin/
ENV RUSTUP_HOME=/usr/local/rustup
ENV CARGO_HOME=/usr/local/cargo
ENV PKG_CONFIG_PATH=/usr/lib/pkgconfig

ARG USER_NAME=utakata
ARG USER_ID=1100
ARG GROUP_ID=1100

# ユーザーを作成
RUN addgroup -g ${GROUP_ID} ${USER_NAME} && \
    adduser -D -u ${USER_ID} -G ${USER_NAME} -s /bin/bash ${USER_NAME}

# シンボリックリンクとRustツールのセットアップ
RUN ln -sf /usr/local/bin/node /usr/local/bin/nodejs && \
    ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -sf /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npx && \
    # Rust関連のセットアップ
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh && \
    rustup target add wasm32-unknown-unknown && \
    rustup install nightly && \
    cargo install cargo-udeps --locked && \
    cargo install tauri-cli --locked && \
    # 権限の設定
    chown -R ${USER_ID}:${GROUP_ID} /usr/local/cargo /usr/local/rustup

USER ${USER_NAME}
WORKDIR /workspace

RUN mkdir -p /workspace/src-tauri/target && \
    chown -R $(whoami) /workspace /workspace/src-tauri/target

SHELL ["/bin/bash", "-c"]
