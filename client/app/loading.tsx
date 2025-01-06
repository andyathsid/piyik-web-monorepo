import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-background">
      <Spinner show={true} size="large">
        Loading...
      </Spinner>
    </div>
  );
}