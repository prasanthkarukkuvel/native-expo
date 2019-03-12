import React from "react";
import { View, Text, StatusBar } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { Theme, Appbar } from "react-native-paper";

interface IDetailScreenProps extends NavigationInjectedProps {
  theme: Theme;
}

export class DetailScreen extends React.Component<IDetailScreenProps> {
  constructor(props: IDetailScreenProps) {
    super(props);
  }

  navigateBack() {
    this.props.navigation.pop();
  }

  render() {
    return (
      <View>
        <View>
          <StatusBar barStyle="light-content" />
          <Appbar.Header>
            <Appbar.BackAction onPress={this.navigateBack.bind(this)} />
            <Appbar.Content title="Charging Stations" />
          </Appbar.Header>
        </View>
        <View>
          <Text>Hello</Text>
        </View>
      </View>
    );
  }
}
