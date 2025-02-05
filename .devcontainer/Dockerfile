FROM node:23.6-bullseye-slim as node 
FROM rust:1.84-slim-bullseye as rust

FROM debian:bullseye-20250113

# 環境変数の設定
ENV DEBIAN_FRONTEND=noninteractive

# ユーザー設定の引数
ARG USER_NAME=utakata
ARG USER_ID=1100
ARG GROUP_ID=1100

# ユーザーとグループの作成
RUN groupadd -g ${GROUP_ID} ${USER_NAME} && \
    useradd --create-home --uid ${USER_ID} --gid ${GROUP_ID} --shell /bin/bash ${USER_NAME}

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    pkg-config \
    libwebkit2gtk-4.1-dev \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Rustのインストール
COPY --from=rust /usr/local/cargo /usr/local/cargo
COPY --from=rust /usr/local/rustup /usr/local/rustup
ENV PATH $PATH:/usr/local/cargo/bin/
ENV RUSTUP_HOME /usr/local/rustup

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

RUN echo "source /usr/share/bash-completion/completions/git" >> ~/.bashrc

WORKDIR /usr/share/bash-completion/completions

RUN curl -O https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh
RUN curl -O https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash
RUN chmod a+x git*.*
RUN ls -l $PWD/git*.* | awk '{print "source "$9}' >> ~/.bashrc

RUN echo "GIT_PS1_SHOWDIRTYSTATE=true" >> ~/.bashrc
RUN echo "GIT_PS1_SHOWUNTRACKEDFILES=true" >> ~/.bashrc
RUN echo "GIT_PS1_SHOWUPSTREAM=auto" >> ~/.bashrc

RUN echo 'export PS1="\[\033[01;32m\]\u@\h\[\033[01;33m\] \w \[\033[01;31m\]\$(__git_ps1 \"(%s)\") \\n\[\033[01;34m\]\\$ \[\033[00m\]"' >> ~/.bashrc

WORKDIR /workspace
RUN chown -R ${USER_ID}:${GROUP_ID} /workspace


# 確認用シェル
SHELL ["/bin/bash", "-c"]