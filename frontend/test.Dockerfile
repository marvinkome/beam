FROM node:12.0.0

# create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile

# Bundle app source
COPY . .

# expose port
EXPOSE 3000

CMD ["yarn", "start:coverage"]
