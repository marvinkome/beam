FROM node:12.0.0

# create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile

# Bundle app source
COPY . .

# yarn build
ARG STAGING
RUN if [ "$STAGING" = "true" ]; then \
    yarn build:staging; \
    else \
    yarn build; \
    fi

# expose port
EXPOSE 3033

CMD ["yarn", "serve"]
