import { AddIcon } from "@chakra-ui/icons";
import { googleLogout } from "@react-oauth/google";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "../config/axios";
import { useEffect } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button, useDisclosure } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import useAuth from "../store/useAuth";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, AvatarGroup } from "@chakra-ui/avatar";
import ProfileModal from "./miscellaneous/ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import SideDrawer from "./miscellaneous/SideDrawer";

const MyChats = ({ fetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);

  const toast = useToast();

  const logoutHandler = () => {
    setUser(null);
    googleLogout();
  };

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("chats", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      bg="white"
      w={{ base: "100%", md: "md" }}
    >
      <Box
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        my={6}
        px={3}
      >
        <Box fontSize="2xl" fontWeight="bold" fontFamily="Work sans">
          <b>Chat App</b>
        </Box>

        <Box d="flex" alignItems="center" experimental_spaceX={2}>
          <Menu>
            <MenuButton as={Button} bg="white">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" />
            </MenuButton>
            <MenuList px={4}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Box w="full" px={4} mb={4}>
        <Button
          variant="ghost"
          w="full"
          d="flex"
          mb={4}
          alignItems="center"
          onClick={onOpen}
          justifyContent="start"
          bg="#f1f4fb"
          borderRadius="full"
        >
          <i className="fas fa-search"></i>
          <Text ml={3}>Search User</Text>
        </Button>
        <SideDrawer isOpen={isOpen} onClose={onClose} />
        <GroupChatModal>
          <Button fontSize="md" p={4} rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        p={2}
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#2055bf" : "white"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                d="flex"
                alignItems="center"
                borderRadius="lg"
                key={chat._id}
              >
                {chat.isGroupChat ? (
                  <AvatarGroup size="md" mr={2} color="black" max={1}>
                    <Avatar
                      name={chat.groupAdmin.name}
                      src={chat.groupAdmin.pic}
                    />
                    {chats.map((user) =>
                      chat.groupAdmin._id === user._id ? null : (
                        <Avatar
                          key={user._id}
                          name={user.name}
                          src={user.pic}
                        />
                      ),
                    )}
                  </AvatarGroup>
                ) : (
                  <Avatar
                    mx={4}
                    name={getSender(user, chat.users)}
                    src={getSenderFull(user, chat.users).pic}
                  />
                )}
                <Box>
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
