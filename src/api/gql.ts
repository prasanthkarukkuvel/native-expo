import gql from "graphql-tag";
import { DocumentNode } from "apollo-boost";

export const querySensorMap: DocumentNode = gql`
  {
    metaInfo {
      count
    }
    sensors {
      id
      name
      loc {
        lat
        lon
      }
      connectors {
        id
        name
        bookingStatus
        sensorData {
          connectorId
        }
      }
    }
  }
`;

export const querySensorList: DocumentNode = gql`
  {
    metaInfo {
      count
    }
    sensors {
      id
      name     
      connectors {
        id
        name
        bookingStatus
        sensorData {
          connectorId
        }
      }
    }
  }
`;
