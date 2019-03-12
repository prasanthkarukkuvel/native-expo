import React from "react";
import { NavigationInjectedProps } from "react-navigation";
import { Theme, Appbar, Text, List } from "react-native-paper";
import { View, StatusBar } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IProfileScreenProps extends NavigationInjectedProps {
  theme: Theme;
}

export class ProfileScreen extends React.Component<IProfileScreenProps> {
  constructor(props: IProfileScreenProps) {
    super(props);
  }

  render() {
    return (
      <View>
        <View>
          <StatusBar barStyle="light-content" />
          <Appbar.Header>
            <Appbar.Content title="Profile" />
          </Appbar.Header>
        </View>
        <View>
          <List.Section>
            <List.Item 
              title="Accounts"
              description="Accounts & Settings"
              left={props => <List.Icon {...props} icon="account-circle" />}
            />
            <List.Item
              title="Charging Sessions"
              description="Your charging history"
              left={props => (
                <List.Icon
                  {...props}
                  icon={props => (
                    <MaterialCommunityIcons
                      size={props.size}
                      name="power-settings"
                      color={props.color}
                    />
                  )}
                />
              )}
            />
            <List.Item
              title="Bills & Payments"
              description="Your bills and Payments"
              left={props => <List.Icon {...props} icon="payment" />}
            />
          </List.Section>
        </View>
      </View>
    );
  }
}
