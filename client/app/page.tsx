import { Button, Group } from '@mantine/core';

export default function Home() {
  return (
    <main className="fixed inset-0 grid place-content-center">
      <div className="text-center flex flex-col items-center gap-8">
        <h1 className="text-5xl font-bold">
          Time to cook!
        </h1>
      </div>
    </main>
  );
}