FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node

ENV REACT_APP_OPENAI_API_KEY=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
CMD ["npm", "start"]
