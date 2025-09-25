import {
  Avatar,
  Box,
  Flex,
  Heading,
  HoverCard,
  Link,
  Text,
} from "@radix-ui/themes";
import avatar from "@/assets/image/User's Avatar.jpg";

type props = {
  username: string;
  email: string;
  comment: string;
};

const HoverText = ({ email, username, comment }: props) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Link
          href={`mailto: ${email}`}
          weight="medium"
          color="indigo"
          underline="always"
        >
          {username}
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Content maxWidth="300px">
        <Flex gap="4">
          <Avatar
            size="3"
            fallback="R"
            radius="full"
            src={avatar}
            alt={avatar}
          />
          <Box>
            <Heading size="3" as="h3">
              {username}
            </Heading>
            <Text as="div" size="2" color="gray" mb="2">
              {email}
            </Text>
            <Text as="div" size="2">
              {comment.length === 100
                ? `${comment.slice(0, 100)}...`
                : `${comment}`}
            </Text>
          </Box>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
};

export default HoverText;
