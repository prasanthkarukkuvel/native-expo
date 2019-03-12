import React from "react";
import {
  Appbar,
  ActivityIndicator,
  Card,
  Avatar,
  IconButton,
  Theme
} from "react-native-paper";
import { View, StatusBar, Text } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IListScreenState {
  isLoading: boolean;
  stationList: IStationListInput[];
}

interface IStationListInput {
  title: string;
}

interface IStationListProps {
  source: IStationListInput[];
  theme: Theme;
  onCardPress: (props: IStationListProps, source: IStationListInput) => void;
}

interface IListScreenProps extends NavigationInjectedProps {
  theme: Theme;
}

const StationList = (listProps: IStationListProps) => {
  return (
    <View style={{ marginTop: 8 }}>
      {listProps.source.map((value, index) => (
        <Card
          onPress={() => listProps.onCardPress(listProps, value)}
          style={{ marginBottom: 8 }}
          key={index}
        >
          <Card.Title
            title={value.title}
            subtitle="Card Subtitle"
            left={props => (
              <Avatar.Icon
                {...props}
                icon={props => (
                  <MaterialCommunityIcons
                    size={props.size}
                    name="power-socket-eu"
                    color={props.color}
                  />
                )}
              />
            )}
            right={props => (
              <IconButton
                onPress={() => console.log(value.title, "star")}
                icon="favorite-border"
                color={listProps.theme.colors.accent}
              />
            )}
          />
          <Card.Content>
            <Text>Hello World 2</Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};
const StationView: (props: {
  children: () => JSX.Element;
  isLoading: boolean;
}) => JSX.Element = props =>
  props.isLoading ? <ActivityIndicator animating={true} /> : props.children();

export class ListScreen extends React.Component<
  IListScreenProps,
  IListScreenState
> {
  constructor(props: IListScreenProps) {
    super(props);

    this.state = {
      isLoading: true,
      stationList: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false,
        stationList: [
          {
            title: "Hello World 1"
          },
          {
            title: "Hello World 2"
          }
        ]
      });
    }, 1000);
  }

  onCardPress(props: IStationListProps, source: IStationListInput) {
    this.props.navigation.push("Detail");
  }

  render() {
    return (
      <View>
        <View>
          <StatusBar barStyle="light-content" />
          <Appbar.Header>
            <Appbar.Content title="Charging Stations" />
            <Appbar.Action icon="search" />
          </Appbar.Header>
        </View>
        <View>
          <StationView isLoading={this.state.isLoading}>
            {() => (
              <StationList
                source={this.state.stationList}
                onCardPress={this.onCardPress.bind(this)}
                theme={this.props.theme}
              />
            )}
          </StationView>
        </View>
      </View>
    );
  }
}
