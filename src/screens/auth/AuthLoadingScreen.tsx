import React from "react";
import { View, Animated, AsyncStorage } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "react-native-paper";
import { NavigationInjectedProps } from "react-navigation";
import { Location } from "expo";

export interface IAuthLoadingMapProps {
  token?: string | null;
}

interface IAuthLoadingState {
  geoAccess?: boolean;
  locationData?: Location.LocationData;
  token?: string | null;
}

export class AuthLoadingScreen extends React.Component<
  NavigationInjectedProps,
  IAuthLoadingState
> {
  private static userTokenKey = "AuthLoadingScreen__userToken";
  private spring: Animated.Value;

  constructor(props: NavigationInjectedProps) {
    super(props);

    this.spring = new Animated.Value(1);
  }

  componentDidMount() {
    this.bounceLoading();
    this.tryNavigate();
  }

  async tryNavigate() {
    // await this.getProfile();

    this.props.navigation.navigate("Home");
  }

  async getProfile() {
    const token: string | null = await AsyncStorage.getItem(
      AuthLoadingScreen.userTokenKey
    );

    this.setState({
      token
    });
  }

  bounceLoading() {
    this.spring.setValue(1);

    // Animated.sequence([
    //   Animated.spring(this.spring, {
    //     toValue: 1,
    //     friction: 2
    //   }),
    //   Animated.timing(this.spring, {
    //     delay: 1000,
    //     toValue: 0.3,
    //     easing: Easing.elastic(2),
    //     duration: 400
    //   })
    // ]).start(this.bounceLoading.bind(this));
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Animated.View
          style={{
            transform: [
              {
                scale: this.spring
              }
            ]
          }}
        >
          <MaterialIcons
            style={{ fontSize: 64, color: Colors.deepPurple500 }}
            name="map"
          />
        </Animated.View>
      </View>
    );
  }
}
