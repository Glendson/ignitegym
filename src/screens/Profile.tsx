import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { ScreenHeader } from "../components/ScreenHeader";
import { ScrollView, TouchableOpacity } from "react-native";
import { UserPhoto } from "../components/UserPhoto";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ToastMessage } from "../components/ToastMessage";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https://github.com/Glendson.png");
  const toast = useToast();

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (photoSelected.canceled) return;

      const photoUri = photoSelected.assets[0].uri;

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande!"
                description="A imagem não pode ser salva pois é muito grande (máximo 5MB)."
                onClose={() => toast.close(id)}
              />
            ),
          });
        }
        setUserPhoto(photoUri);
      }
    } catch (error) {
      console.error("Error selecting photo", error);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={"$6"} px={"$10"}>
          <UserPhoto source={{ uri: userPhoto }} alt="" size="xl" />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color={"$green500"}
              fontFamily={"$heading"}
              fontSize={"$md"}
              mt={"$2"}
              mb={"$8"}
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Center w={"$full"} gap={"$4"}>
            <Input placeholder="Nome" bg={"$gray600"} />
            <Input value="exemplo@email.com" bg={"$gray600"} />
          </Center>

          <Heading
            alignSelf={"flex-start"}
            fontFamily={"$heading"}
            color={"$gray200"}
            fontSize={"$md"}
            mt={"$12"}
            mb={"$2"}
          >
            Alterar Senha
          </Heading>

          <Center w={"$full"} gap={"$4"}>
            <Input placeholder="Senha antiga" bg={"$gray600"} secureTextEntry />
            <Input placeholder="Nova senha" bg={"$gray600"} secureTextEntry />
            <Input
              placeholder="Confirme a nova senha"
              bg={"$gray600"}
              secureTextEntry
            />

            <Button title="Atualizar" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
