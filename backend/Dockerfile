FROM node:12.0.0

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN  yarn --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 5055

CMD ["yarn", "start"]
