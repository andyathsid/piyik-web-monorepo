'use client';

import { Container, Title, Text, Button, Group } from '@mantine/core';
import { signOut } from '@/lib/auth/sessions';
import { auth } from '@/lib/firebase/client';

export default function DashboardPage() {
    return (
        <Container size={600} my={40}>
            <Title ta="center">Welcome to the Dashboard</Title>
            <Text ta="center" mt="md">
                You have successfully registered and logged in. This is your dashboard.
            </Text>
            
            <Group justify="center" mt={30}>
                <Button 
                    color="red" 
                    onClick={() => signOut()}
                >
                    Log Out
                </Button>
            </Group>
        </Container>
    );
}