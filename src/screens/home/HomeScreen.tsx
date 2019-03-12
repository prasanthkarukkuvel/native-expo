import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { MapScreen } from "../map";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  NavigationRouteConfigMap,
  NavigationComponent,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import { ListScreen } from "../list";
import { Icon } from "react-native-vector-icons/Icon";
import { Theme, withTheme } from "react-native-paper";
import { DetailScreen } from "../detail";
import { ProfileScreen } from "../profile";

const createTabScreen = (
  tabBarLabel: string,
  icon:
    | string
    | {
        name: string;
        component: typeof Icon;
      },
  screen: NavigationComponent
): NavigationRouteConfigMap => ({
  screen,
  navigationOptions: (props: { screenProps: { theme: Theme } }) => {
    return {
      tabBarIcon: ({ tintColor }: { tintColor: string }) => {
        const IconHelper =
          typeof icon === "string"
            ? {
                name: icon,
                component: MaterialIcons
              }
            : icon;

        return (
          <IconHelper.component
            style={{ backgroundColor: "transparent" }}
            name={IconHelper.name}
            color={tintColor}
            size={24}
          />
        );
      },
      tabBarLabel
    };
  }
});

export class HomeScreen extends React.Component<{
  theme: Theme;
}> {
  constructor(props: { theme: Theme }) {
    super(props);
  }

  render() {
    return (
      <HomeScreenTab
        screenProps={{
          theme: this.props.theme
        }}
      />
    );
  }
}

export const HomeScreenTab = createAppContainer(
  createMaterialBottomTabNavigator(
    {
      Map: createTabScreen(
        "Locations",
        {
          name: "map-search-outline",
          component: MaterialCommunityIcons
        },
        MapScreen
      ),
      ListStack: createTabScreen(
        "Stations",
        "ev-station",
        createStackNavigator(
          {
            List: withTheme(ListScreen),
            Detail: DetailScreen
          },
          {
            headerMode: "none"
          }
        )
      ),
      ProfileStack: createTabScreen(
        "Profile",
        {
          name: "account-outline",
          component: MaterialCommunityIcons
        },
        createStackNavigator({
          Profile: ProfileScreen
        },
        {
          headerMode: "none"
        })
      )
    },
    {
      initialRouteName: "Map",
      shifting: true
    }
  )
);
