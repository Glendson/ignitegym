import { Heading, Text, VStack } from "@gluestack-ui/themed";
import { ScreenHeader } from "../components/ScreenHeader";
import { HistoryCard } from "../components/HistoryCard";
import { useState } from "react";
import { SectionList } from "react-native";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "22.07.2024",
      data: ["Puxada Frontal", "Remada Unilateral"],
    },
    {
      title: "24.07.2024",
      data: ["Puxada Frontal"],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Historico de Exercicios" />
      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color={"$gray200"}
            fontSize={"$md"}
            mt={"$10"}
            mb={"$3"}
            fontFamily={"$heading"}
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color={"$gray100"} textAlign="center">
            Não ha exercicios registrados ainda.
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
