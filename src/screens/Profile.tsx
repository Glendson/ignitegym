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
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome."),
});

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https://github.com/Glendson.png");
  const toast = useToast();

  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

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

  async function handleProfileUpdate(data: FormDataProps) {}

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
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg={"$gray600"}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail"
                  bg={"$gray600"}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
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
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  bg={"$gray600"}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  bg={"$gray600"}
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                  secureTextEntry
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  bg={"$gray600"}
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                  secureTextEntry
                />
              )}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
