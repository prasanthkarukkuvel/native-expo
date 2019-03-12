import { createStackNavigator, NavigationRouteConfig } from "react-navigation";
import { HomeScreen } from "../../screens/home";

interface IHomeStackNavigationMap {
  Home: "Home";
}

export const HomeStackNavigationMap: IHomeStackNavigationMap = {
  Home: "Home"
};

const routeConfig: {
  [key in keyof IHomeStackNavigationMap]: NavigationRouteConfig
} = {
  Home: HomeScreen
};

export const HomeStack = createStackNavigator(routeConfig, {
  headerMode: "none"
});
