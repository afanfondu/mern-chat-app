import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import useAuth from "../store/useAuth";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const user = useAuth((state) => state.user);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Box d="flex" w="100%" h="100%">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
