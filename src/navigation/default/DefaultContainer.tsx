import {
  createAppContainer,
  createSwitchNavigator,
  NavigationRouteConfig
} from "react-navigation";
import { AuthLoadingScreen } from "../../screens/auth";
import { HomeStack } from "../home";
import { AuthStack } from "../auth";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { apolloClient } from "../../providers/ApolloClient";
import { View, StatusBar } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

interface IDefaultContainerNavigationMap {
  AuthLoadingScreen: "AuthLoadingScreen";
  Default: "Default";
  Auth: "Auth";
}

export const DefaultContainerNavigationMap: IDefaultContainerNavigationMap = {
  AuthLoadingScreen: "AuthLoadingScreen",
  Default: "Default",
  Auth: "Auth"
};

const routeConfig: {
  [key in keyof IDefaultContainerNavigationMap]: NavigationRouteConfig
} = {
  AuthLoadingScreen,
  Default: HomeStack,
  Auth: AuthStack
};

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#00838f",
    accent: "#ff5722"
  }
};

export class DefaultContainer extends React.Component<null> {
  constructor(props: null) {
    super(props);
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <View style={{ flex: 1 }}>
          <View>
            <StatusBar
              barStyle="dark-content"
              translucent
              backgroundColor={"transparent"}
            />
          </View>
          <ApolloProvider client={apolloClient}>
            <RootNavigationContainer />
          </ApolloProvider>
        </View>
      </PaperProvider>
    );
  }
}

const RootNavigationContainer = createAppContainer(
  createSwitchNavigator(routeConfig, {
    initialRouteName: DefaultContainerNavigationMap.AuthLoadingScreen
  })
);
