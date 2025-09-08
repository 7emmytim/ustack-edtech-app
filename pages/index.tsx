import {
  ActionIcon,
  AppShell,
  Container,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import ReactPlayer from "react-player";
import { AddVideo, Eye, EyeSlash, Trash, Video, Youtube } from "@/components";
import Image from "next/image";

export default function Home() {
  const [value, setValue] = useLocalStorage<Video[]>({
    key: "youtube-learning-videos",
    defaultValue: [],
  });
  const [active, setActive] = useState<Video>({
    id: "1",
    title: "New MIT study says most AI projects are doomed",
    description: "Fireship",
    url: "https://www.youtube.com/watch?v=ly6YKz9UfQ4",
    thumbnails: null,
  });

  function deleteVideo(id: string) {
    setValue(value.filter((item) => item.id !== id));
  }

  return (
    <AppShell header={{ height: 72 }}>
      <AppShell.Header>
        <Container h="100%" size={1440} px={{ base: 20, xl: "auto" }}>
          <Group h="100%" justify="space-between">
            <Title fw={700} fz={24}>
              YouLearn
            </Title>

            <AddVideo />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container
          size={1440}
          className="h-[calc(100vh_-_72px)]"
          px={{ base: 20, xl: "auto" }}
          py={20}
        >
          <Paper h="100%">
            <Group align="flex-start" h="100%">
              <Stack className="flex-1">
                <ReactPlayer
                  src={active.url}
                  controls
                  title="Learning Video"
                  pip
                  style={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "16/9",
                  }}
                />

                <Paper>
                  <Group align="flex-start" className="flex-1">
                    <ThemeIcon
                      h={42}
                      w={56}
                      variant="filled"
                      color="#ff0033"
                      radius={8}
                    >
                      <Youtube />
                    </ThemeIcon>
                    <Stack gap={3} className="flex-1">
                      <Text fw={500} fz={18} lineClamp={2}>
                        {active.title}
                      </Text>
                      <Text c="dimmed">{active.description}</Text>
                    </Stack>
                  </Group>
                </Paper>
              </Stack>

              <ScrollArea
                h="100%"
                type="auto"
                hidden={!value.length}
                offsetScrollbars
              >
                <Stack w={{ base: "100%", sm: 400 }}>
                  {value.map((video) => {
                    return (
                      <Paper
                        key={video.id}
                        p={20}
                        withBorder
                        radius={12}
                        bg="#f8f9fa"
                      >
                        <Group align="flex-start" justify="space-between">
                          <Group align="flex-start" className="flex-1">
                            {video.thumbnails?.default?.url ? (
                              <Image
                                height={90}
                                width={120}
                                src={video.thumbnails.default.url}
                                alt={video.title}
                                className="rounded-xl"
                              />
                            ) : (
                              <ThemeIcon
                                p={0}
                                h={90}
                                w={120}
                                variant="filled"
                                color="#ff0033"
                                radius={12}
                              >
                                <Youtube />
                              </ThemeIcon>
                            )}

                            <Stack gap={3} className="flex-1">
                              <Text fw={500} fz={16} lineClamp={2}>
                                {video.title}
                              </Text>
                              <Text c="dimmed" lineClamp={2} fz={14}>
                                {video.description}
                              </Text>
                            </Stack>
                          </Group>

                          <Group gap={3}>
                            <ActionIcon
                              variant="transparent"
                              size={18}
                              color="currentColor"
                              onClick={() => setActive(video)}
                            >
                              {active.id === video.id ? <EyeSlash /> : <Eye />}
                            </ActionIcon>

                            <ActionIcon
                              variant="transparent"
                              size={18}
                              color="red"
                              onClick={() => deleteVideo(video.id)}
                            >
                              <Trash />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </Paper>
                    );
                  })}
                </Stack>
              </ScrollArea>
            </Group>
          </Paper>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
