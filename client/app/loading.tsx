'use client';

import { LoadingOverlay } from '@mantine/core';

export default function Loading() {
    return (
        <LoadingOverlay
            visible={true}
            overlayProps={{ radius: "lg", blur: 2 }}
            loaderProps={{ type: 'bars' }}
        />
    );
}