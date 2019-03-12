import { AsyncStorage } from "react-native";
import { Permissions, Location } from "expo";

const geoPermissionAskKey = "CurrentLoactionProvider__canAskLocationPermission";

const askLocationPermission = async (): Promise<boolean> => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);

  await AsyncStorage.setItem(geoPermissionAskKey, "1");

  return status === "granted";
};

const canAskLocationPermission = async (): Promise<boolean> => {
  const askStatus: string | null = await AsyncStorage.getItem(
    geoPermissionAskKey
  );

  if (askStatus === "1") {
    return false;
  } else {
    return await askLocationPermission();
  }
};

const checkGeoAccess = async (): Promise<boolean> => {
  const { status } = await Permissions.getAsync(Permissions.LOCATION);

  if (status === "granted") {
    return true;
  } else {
    return await canAskLocationPermission();
  }
};

const tryGetPosition = async (): Promise<Location.LocationData> => {
  const locationData: Location.LocationData = await Location.getCurrentPositionAsync(
    {
      accuracy: 3
    }
  );

  return locationData;
};

const tryGetLocation = async (): Promise<Location.LocationData | null> => {
  const canAsk = await checkGeoAccess();

  if (canAsk) {
    return await tryGetPosition();
  }

  return null;
};

export const getCurrentLocation = async () => tryGetLocation();
