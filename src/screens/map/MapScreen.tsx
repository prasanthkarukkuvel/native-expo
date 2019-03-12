import React from "react";
import { Region, Constants } from "expo";
import { NavigationInjectedProps } from "react-navigation";
import { IAuthLoadingMapProps } from "../auth";
import MapView, { Polygon } from "react-native-maps";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import mapStyle from "./mapStyle.json";
import { Dimensions, View, StyleSheet, ViewStyle } from "react-native";
import { Searchbar, ActivityIndicator } from "react-native-paper";
import { resolveSensorMap } from "../../services/ApolloClientService";
import { IQuerySensorMap } from "../../api/entity";
import { StateHandler } from "../../api/handler";
import { getCurrentLocation } from "../../providers/CurrentLocation";
import { MaterialIcons } from "@expo/vector-icons";

interface IMapScreenMarker {
  id: string;
  title: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface IBoundingBox {
  northEast: {
    latitude: number;
    longitude: number;
  };
  southWest: {
    latitude: number;
    longitude: number;
  };
}

interface IMapScreenState {
  region: Region;
  markers: IMapScreenMarker[];
  isSensorLoading: boolean;
  boundingBox: IBoundingBox | null;
}

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const checkBoundaries = (region: Region, compareRegion: Region) => {
  return (
    region.latitude === compareRegion.latitude &&
    region.latitudeDelta === region.latitudeDelta &&
    region.longitude === compareRegion.longitude &&
    region.longitudeDelta === region.longitudeDelta
  );
};

const SensorLoadingView: (props: {
  style?: ViewStyle;
  isLoading: boolean;
  size?: number;
  color?: string;
}) => JSX.Element = props =>
  props.isLoading ? (
    <View style={props.style}>
      <ActivityIndicator animating={true} />
    </View>
  ) : (
    <MaterialIcons color={props.color} name="search" size={props.size} />
  );

export class MapScreen extends React.Component<
  NavigationInjectedProps<IAuthLoadingMapProps>,
  IMapScreenState
> {
  mapRef: MapView | null = null;

  sensorResolver: StateHandler<IQuerySensorMap>;

  constructor(props: NavigationInjectedProps<IAuthLoadingMapProps>) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markers: [],
      isSensorLoading: false,
      boundingBox: null
    };

    this.sensorResolver = resolveSensorMap();
  }

  async componentDidMount() {
    this.sensorResolver.state.onChange$.subscribe(() => {
      this.createMarkers();

      this.setState({
        isSensorLoading: this.sensorResolver.state.loading
      });
    });
  }

  addMarkers(markers: IMapScreenMarker[], recenterMap?: boolean) {
    this.setState(
      {
        markers: markers.reduce((agg, marker) => {
          const index = agg.findIndex(value => value.id === marker.id);

          if (index >= 0) {
            agg[index] = marker;
          } else {
            agg.push(marker);
          }

          return agg;
        }, this.state.markers)
      },
      () => {
        if (recenterMap) {
          this.recenterMap();
        }
      }
    );
  }

  async fetchSensors() {
    const currentLocation = await getCurrentLocation();

    if (currentLocation) {
      this.addMarkers(
        [
          {
            id: "__current_location__",
            title: "Current Location",
            coordinates: {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude
            }
          }
        ],
        true
      );
    }
  }

  createMarkers() {
    if (this.sensorResolver.state.loaded) {
      const result = this.sensorResolver.value;

      if (
        result &&
        result.data &&
        result.data.sensors &&
        result.data.sensors.length
      ) {
        this.addMarkers(
          result.data.sensors.reduce((agg: IMapScreenMarker[], value) => {
            if (value.loc && value.loc.lat !== null && value.loc.lon !== null) {
              agg.push({
                id: value.id,
                title: value.name,
                coordinates: {
                  latitude: value.loc.lat,
                  longitude: value.loc.lon
                }
              });
            }

            return agg;
          }, [])
        );
      }
    }
  }

  setMapRef(mapRef: MapView | null): void {
    this.mapRef = mapRef;
  }

  recenterMap(): void {
    if (this.mapRef && this.state.markers.length) {
      this.mapRef.fitToCoordinates(
        this.state.markers.map(value => value.coordinates),
        {
          edgePadding: { top: 48, right: 24, bottom: 48, left: 24 },
          animated: true
        }
      );
    }
  }

  updateRegion(region: Region) {
    const boundary = [
      region.longitude - region.longitudeDelta / 2, // westLng - min lng
      region.latitude - region.latitudeDelta / 2, // southLat - min lat
      region.longitude + region.longitudeDelta / 2, // eastLng - max lng
      region.latitude + region.latitudeDelta / 2 // northLat - max lat
    ];

    // poly: [
    //   {
    //     latitude: a[3],
    //     longitude: a[0]
    //   },
    //   {
    //     latitude: a[3],
    //     longitude: a[2]
    //   },
    //   {
    //     latitude: a[1],
    //     longitude: a[2]
    //   },
    //   {
    //     latitude: a[1],
    //     longitude: a[0]
    //   }
    // ]

    this.setState(
      {
        region,
        boundingBox: {
          northEast: {
            latitude: boundary[3],
            longitude: boundary[2]
          },
          southWest: {
            latitude: boundary[1],
            longitude: boundary[0]
          }
        }
      },
      () => {
        this.sensorResolver.fetch();
      }
    );
  }

  onRegionChange(region: Region) {
    if (!checkBoundaries(region, this.state.region)) {
      this.updateRegion(region);
    }
  }

  onMapReady() {
    this.fetchSensors();
  }

  render() {
    return (
      <View style={style.container}>
        <MapView
          ref={this.setMapRef.bind(this)}
          onMapReady={this.onMapReady.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          style={style.map}
          initialRegion={this.state.region}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          rotateEnabled={false}
          mapPadding={{
            top: 24,
            bottom: 48,
            left: 24,
            right: 24
          }}
        >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinates}
              title={marker.title}
            />
          ))}
        </MapView>
        <View style={style.searchContainer}>
          <Searchbar
            icon={props => (
              <SensorLoadingView
                {...props}
                isLoading={this.state.isSensorLoading}
              />
            )}
            style={style.searchBar}
            placeholder="Search"
          />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create<StyleSheet.NamedStyles<any>>({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  searchContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: Constants.statusBarHeight + 16
  },
  searchBar: {
    borderRadius: 24,
    zIndex: 1
  },
  sensorLoadingView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 32,
    zIndex: 2
  }
});
