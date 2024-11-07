import { View, StatusBar } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";
import { config } from "./config/gluestack-ui.config";
import { Loading } from "./src/components/Loading";
import { Routes } from "./src/routes";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <GluestackUIProvider config={config}>
      <View>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontsLoaded ? <Routes /> : <Loading />}
      </View>
    </GluestackUIProvider>
  );
}
