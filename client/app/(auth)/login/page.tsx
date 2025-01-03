

import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Divider,
  PaperProps,
  Stack
} from '@mantine/core';

import Link from 'next/link';
import { GoogleButton } from '@/components/GoogleButton';
import { IconAt, IconLock} from '@tabler/icons-react';
import classes from '@/styles/AuthenticationTitle.module.css';

export default function LoginPage(props: PaperProps) {


  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Container ta="center">
        <Link href="/register" className='text-decoration-none'>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Do not have an account yet?{' '}
            <Anchor size="sm" component="button">
              Create account
            </Anchor>
          </Text>
        </Link>
      </Container>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form >
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"


              radius="md"
              leftSection={<IconAt size={16} />}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"

              radius="md"
              leftSection={<IconLock size={16} />}
            />

            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl">
              Sign in
            </Button>
          </Stack>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}