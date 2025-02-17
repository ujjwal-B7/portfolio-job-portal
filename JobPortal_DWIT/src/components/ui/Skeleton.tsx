import { cn } from "@/utils/twMerge";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted bg-gray-300", className)}
      {...props}
    />
  );
}

export { Skeleton };
