'use client';

import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    TextInput,
    Title,
    Divider,
    Stack,
    Text,
    LoadingOverlay,
    Alert
} from '@mantine/core';
import Link from 'next/link';
import { GoogleButton } from '@/components/GoogleButton';
import { IconAt, IconLock, IconUser, IconAlertCircle } from '@tabler/icons-react';
import classes from '@/styles/AuthenticationTitle.module.css';
import { useActionState} from 'react';
import { Register } from '@/app/actions/auth';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function RegisterPage() {
    const [state, formAction, pending] = useActionState(Register, {
        errors: {},
        email: '',
        name: '',
        generalError: '',
        success: false
    });

    useEffect(() => {
        if (state?.success) {
            notifications.show({
                title: 'Success',
                message: 'Your account has been created successfully',
                color: 'green',
            });
           redirect('/dashboard');
        }
    }, [state?.success]);

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Create an account
            </Title>
            <Container ta="center">
                <Link href="/login" className='text-decoration-none'>
                    <Text c="dimmed" size="sm" ta="center" mt={5}>
                        Already have an account? {' '}
                        <Anchor size="sm" component="button">
                            Login
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
                            name="name"
                            label="Name"
                            type='text'
                            placeholder="Your name"
                            radius="md"
                            leftSection={<IconUser size={16} />}
                            defaultValue={state?.name}
                            disabled={pending}
                            error={state?.errors?.name?.[0]}
                        />

                        <TextInput
                            required
                            name="email"
                            label="Email"
                            type='email'
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
                            type="password"
                            placeholder="Your password"
                            radius="md"
                            leftSection={<IconLock size={16} />}
                            disabled={pending}
                            error={state?.errors?.password?.[0]}
                        />

                        <PasswordInput
                            required
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            radius="md"
                            leftSection={<IconLock size={16} />}
                            disabled={pending}
                            error={state?.errors?.confirmPassword?.[0]}
                        />

                        <Checkbox
                            name="terms"
                            label="I accept terms and conditions"
                            disabled={pending}
                            error={state?.errors?.terms?.[0]}
                        />

                        <Button type="submit" fullWidth mt="xl" disabled={pending}>
                            {pending ? 'Registering...' : 'Register'}
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