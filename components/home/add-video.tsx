import { Box, Button, Drawer, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { zod4Resolver } from "mantine-form-zod-resolver";
import z from "zod";
import { Add } from "@/components";

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
}

export function AddVideo() {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useLocalStorage<Video[]>({
    key: "youtube-learning-videos",
    defaultValue: [],
  });

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      url: "",
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

  function handleSubmit(values: Video) {
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
      >
        <Box component="form" onSubmit={form.onSubmit(handleSubmit)} mt={20}>
          <Stack gap={24}>
            <TextInput
              size="md"
              {...form.getInputProps("title")}
              withAsterisk
              placeholder="Enter your title"
              label="Video title"
            />

            <Textarea
              size="md"
              {...form.getInputProps("description")}
              withAsterisk
              placeholder="Enter your description"
              label="Video description"
              rows={5}
              resize="vertical"
            />

            <TextInput
              size="md"
              {...form.getInputProps("url")}
              withAsterisk
              placeholder="Enter your url"
              label="Youtube url"
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
