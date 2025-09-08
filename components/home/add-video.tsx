import {
  Box,
  Button,
  Drawer,
  Loader,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  useDebouncedCallback,
  useDisclosure,
  useLocalStorage,
} from "@mantine/hooks";
import { zod4Resolver } from "mantine-form-zod-resolver";
import z from "zod";
import { Add } from "@/components";
import { useState } from "react";

type Thumbnails = {
  default: {
    url: string;
    width: number;
    height: number;
  };
  medium: {
    url: string;
    width: number;
    height: number;
  };
  high: {
    url: string;
    width: number;
    height: number;
  };
} | null;

export interface Video {
  id: string;
  suggestion?: string;
  title: string;
  description: string;
  url: string;
  thumbnails: Thumbnails;
}

interface Response {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
}

export function AddVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useLocalStorage<Video[]>({
    key: "youtube-learning-videos",
    defaultValue: [],
  });

  const form = useForm({
    initialValues: {
      suggestion: "",
      title: "",
      description: "",
      url: "",
      thumbnails: {} as Thumbnails,
      id: "",
    },
    validateInputOnChange: true,
    validate: zod4Resolver(
      z.object({
        title: z.string().trim().min(1, "Enter title"),
        description: z.string().trim().min(1, "Enter description"),
        url: z
          .string()
          .refine(
            (url) =>
              /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/.test(url),
            {
              message: "Must be a valid YouTube video URL",
            }
          ),
      })
    ),
  });

  const handleSearch = useDebouncedCallback(async (value: string) => {
    if (value) {
      setIsLoading(true);
      const res = await fetch(`/api/videos?q=${encodeURIComponent(value)}`);
      const response: Response = await res.json();

      form.setValues({
        title: response.snippet.title,
        description: response.snippet.description,
        url: `https://www.youtube.com/embed/${response.id.videoId}`,
        thumbnails: response.snippet.thumbnails,
      });
      setIsLoading(false);
    }
  }, 500);

  async function handleSubmit(values: Video) {
    setValue([...value, { ...values, id: `${Math.random()}` }]);
    form.reset();
    close();
  }

  return (
    <>
      <Button
        radius="xl"
        leftSection={<Add />}
        variant="light"
        color="black"
        onClick={open}
      >
        Add Video
      </Button>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title="Add Video"
        styles={{
          title: {
            fontWeight: 700,
          },
        }}
        size={500}
      >
        <Box component="form" onSubmit={form.onSubmit(handleSubmit)} mt={20}>
          <Stack gap={24}>
            <TextInput
              size="md"
              {...form.getInputProps("suggestion")}
              onChange={({ target }) => {
                form.setFieldValue("suggestion", target.value);
                handleSearch(target.value);
              }}
              description="This field will help suggest a youtube video for you"
              placeholder="Enter a text that best describes what you want to watch"
              label="Video Suggestion"
              {...(isLoading ? { rightSection: <Loader size={18} /> } : {})}
            />

            <TextInput
              size="md"
              {...form.getInputProps("title")}
              withAsterisk
              placeholder="Enter your title"
              label="Video Title"
            />

            <Textarea
              size="md"
              {...form.getInputProps("description")}
              withAsterisk
              placeholder="Enter a short description of what you want to learn"
              label="Video Description"
              rows={5}
              resize="vertical"
            />

            <TextInput
              size="md"
              {...form.getInputProps("url")}
              withAsterisk
              placeholder="Enter your url"
              label="Youtube URL"
            />

            <Button size="md" type="submit" radius="sm">
              Submit
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
