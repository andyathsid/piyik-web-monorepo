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
    PaperProps,
    Stack,
    Text
} from '@mantine/core';
import Link from 'next/link';
import { GoogleButton } from '@/components/GoogleButton';
import { IconAt, IconLock, IconUser } from '@tabler/icons-react';
import classes from '@/styles/AuthenticationTitle.module.css';

export default function RegisterPage(props: PaperProps) {
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
                <form >
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="Your name"

                           
                            radius="md"
                            leftSection={<IconUser size={16} />}
                        />

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

                        <Checkbox
                            label="I accept terms and conditions"
                         
                    
                        />

                        <Button fullWidth mt="xl">
                            Register
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