import { apolloClient } from "../providers/ApolloClient";
import { DocumentNode } from "apollo-boost";
import { IQuerySensorMap } from "../api/entity";
import { querySensorMap, querySensorList } from "../api/gql";
import { requestHandler } from "../api/handler";

export const resolveQuery = <T>(query: DocumentNode) =>
  apolloClient.watchQuery<T>({
    query
  });

export const resolveSensorMap = () => requestHandler(
  resolveQuery<IQuerySensorMap>(querySensorMap)
);
export const resolveSensorList = () => requestHandler(
  resolveQuery<IQuerySensorMap>(querySensorList)
);
