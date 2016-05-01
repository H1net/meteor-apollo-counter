import { Meteor } from 'meteor/meteor';
import { apolloServer } from 'graphql-tools';
import Counts from '/imports/data/collection';
import express from 'express';
import proxyMiddleware from 'http-proxy-middleware';

import schema from '/imports/data/schema';
import resolvers from '/imports/data/resolvers';

const GRAPHQL_PORT = 4000;

const graphQLServer = express();

graphQLServer.use('/graphql', apolloServer(async (req) => {
  return {
    graphiql: true,
    pretty: true,
    schema,
    resolvers
  };
}));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

WebApp.rawConnectHandlers.use(proxyMiddleware(`http://localhost:${GRAPHQL_PORT}/graphql`));

Meteor.startup(() => {
  const count = Counts.findOne();
  if (count) {
    return;
  }
  Counts.insert({count: 1, updatedAt: new Date()});
});
