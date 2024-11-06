import { Center, Heading, Image, Text, VStack } from "@gluestack-ui/themed";

import backgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Signin() {
  return (
    <VStack flex={1} bg="$gray700">
      <Image
        h={624}
        w={"$full"}
        alt="Pessoas treinando"
        src={backgroundImg}
        defaultSource={backgroundImg}
        position="absolute"
      />
      <VStack flex={1} px={"$10"} pb={"$16"}>
        <Center my={"$24"}>
          <Logo />

          <Text color="$gray100" fontSize={"$sm"}>
            Treine sua mente e seu corpo.
          </Text>
        </Center>

        <Center gap={"$2"}>
          <Heading color="$gray100" fontSize={"$4xl"}>
            Acesse a conta
          </Heading>

          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input placeholder="Senha" secureTextEntry />

          <Button title="Acessar" />
        </Center>
      </VStack>
    </VStack>
  );
}
