'use client';

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
  Stack,
  LoadingOverlay,
  Alert
} from '@mantine/core';
import Link from 'next/link';
import { GoogleButton } from '@/components/GoogleButton';
import { IconAt, IconLock, IconAlertCircle } from '@tabler/icons-react';
import classes from '@/styles/AuthenticationTitle.module.css';
import { Login } from '@/app/actions/auth';
import { useActionState } from 'react';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(Login, {
    errors: {},
    email: '',
    generalError: '',
    success: false
  });

  useEffect(() => {
    if (state?.success) {
      notifications.show({
        title: 'Welcome back!',
        message: 'You have successfully logged in',
        color: 'green',
      });
      redirect('/dashboard');
    }
  }, [state?.success]);

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
        <LoadingOverlay visible={pending} overlayProps={{ radius: "sm", blur: 2 }} />
        {state?.generalError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="filled"
            mb="md"
          >
            {state.generalError}
          </Alert>
        )}
        <form action={formAction}>
          <Stack>
            <TextInput
              required
              name="email"
              label="Email"
              placeholder="hello@example.com"
              radius="md"
              leftSection={<IconAt size={16} />}
              defaultValue={state?.email}
              disabled={pending}
              error={state?.errors?.email?.[0]}
            />

            <PasswordInput
              required
              name="password"
              label="Password"
              placeholder="Your password"
              radius="md"
              leftSection={<IconLock size={16} />}
              disabled={pending}
              error={state?.errors?.password?.[0]}
            />

            <Group justify="space-between" mt="lg">
              <Checkbox
                name="remember"
                label="Remember me"
                disabled={pending}
              />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button type="submit" fullWidth mt="xl" disabled={pending}>
              {pending ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl" disabled={pending}>Google</GoogleButton>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}