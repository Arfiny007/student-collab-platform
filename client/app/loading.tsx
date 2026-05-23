import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6"
      aria-busy="true"
      aria-label="Loading"
    >
      <Skeleton className="size-12 rounded-2xl" />
      <Skeleton className="h-5 w-48 rounded-lg" />
      <Skeleton className="h-4 w-64 rounded-lg" />
    </main>
  );
}
