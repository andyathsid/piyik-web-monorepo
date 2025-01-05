import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0">
      <Spinner show={true} size="large">
        Loading...
      </Spinner>
    </div>
  );
}
