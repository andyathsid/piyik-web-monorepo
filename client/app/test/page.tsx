'use client';

import { Button, Stack, Text, Code } from '@mantine/core';
import { useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { signInAnonymously } from 'firebase/auth';

export default function TestPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const runClientTest = async () => {
        try {
            setLoading(true);
            setError(null);

            // Test Firebase Auth (Anonymous signin)
            await signInAnonymously(auth);

            // Test ClientAPI endpoint
            const response = await fetch('/api/test');
            const data = await response.json();

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const runServerTest = async () => {
        try {
            setLoading(true);
            setError(null);
    
            // Test GET endpoint
            const getResponse = await fetch('http://localhost:5000/api/data');
            const getData = await getResponse.json();
    
            // Test POST endpoint
            const postResponse = await fetch('http://localhost:5000/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com'
                })
            });
            const postData = await postResponse.json();
    
            setResult({
                get: getData,
                post: postData
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error details:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center h-screen p-4">
            <Stack align="stretch"
                justify="center">
                <h1 className="text-2xl font-bold">Integration Test Page</h1>

                <Button
                    onClick={runClientTest}
                    loading={loading}
                >
                    Run Client Integration Test
                </Button>

                <Button
                    onClick={runServerTest}
                    loading={loading}
                    color="primary.9"
                >
                    Run Server Integration Test
                </Button>

                {error && (
                    <Text color="red">Error: {error}</Text>
                )}

                {result && (
                    <Code block>
                        {JSON.stringify(result, null, 2)}
                    </Code>
                )}
            </Stack>
        </main>
    );
} 