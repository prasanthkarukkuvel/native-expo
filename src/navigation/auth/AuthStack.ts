import { createStackNavigator, NavigationRouteConfig } from "react-navigation";
import { SignInScreen } from "../../screens/auth";

interface IAuthStackNavigationMap {
  SignIn: "SignIn";
}

export const AuthStackNavigationMap: IAuthStackNavigationMap = {
  SignIn: "SignIn"
};

const routeConfig: {
  [key in keyof IAuthStackNavigationMap]: NavigationRouteConfig
} = {
  SignIn: SignInScreen
};

export const AuthStack = createStackNavigator(routeConfig);
