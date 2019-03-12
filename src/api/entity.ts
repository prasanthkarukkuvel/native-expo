export interface IApiMetaInfo {
  metaInfo: {
    count: number;
  };
}

export interface ISensorData {
  connectorId: string;
}

export interface IConnector {
  id: string;
  name: string;

  bookingStatus: boolean;
  sensorData?: ISensorData;
}

export interface ISensor {
  id: string;
  name: string;
  loc?: {
    lat: number | null;
    lon: number | null;
  };
  connectors?: IConnector[];
}

export interface IQuerySensorMap extends IApiMetaInfo {
  sensors?: ISensor[];
}
