import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useState } from "react";
import axios from "../config/axios";
import useAuth from "../store/useAuth";

function Homepage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const setUser = useAuth((state) => state.setUser);

  const onSuccess = async (res) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/login/google", {
        credential: res.credential,
      });

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Chat App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login loading={loading} />
            </TabPanel>
            <TabPanel>
              <Signup loading={loading} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => {
            toast({
              title: "Something went wrong!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }}
          useOneTap
        />
      </Box>
    </Container>
  );
}

export default Homepage;
