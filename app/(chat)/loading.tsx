import { spinner } from "@/components/stocks";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {spinner}
    </div>
  );
}
