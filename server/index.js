/*jshint esversion: 6 */

const { ApolloServer, gql, MockList } = require("apollo-server");

const typeDefs = gql`
  type Query {
    metaInfo: ApiMetaInfo
    sensors: [Sensor]
  }

  type ApiMetaInfo {
    count: Int
  }

  type Sensor {
    id: ID!
    name: String,
    loc: Coordinate,
    connectors: [Connector]
  }

  type Coordinate {
    lat: Int,
    lon: Int
  }

  type Connector {
    id: ID!,
    name: String,
    bookingStatus: Boolean,
    sensorData: SensorData
  }

  type SensorData {
    connectorId: ID!
  }
`;

const mocks = {
  Query: () => ({
    stations: () => new MockList([5, 10])
  })
};

const server = new ApolloServer({
  typeDefs,
  mocks
});

server.listen(5600).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
