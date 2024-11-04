import { View, Text, StatusBar } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <GluestackUIProvider>
      <View>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <Text>Hello World!</Text> : <View></View>}
      </View>
    </GluestackUIProvider>
  );
}
