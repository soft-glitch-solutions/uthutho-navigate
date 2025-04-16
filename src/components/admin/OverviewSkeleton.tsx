
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const OverviewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16" />
        </Card>
      ))}
      <div className="col-span-1 md:col-span-3">
        <Skeleton className="h-[400px] w-full mt-5" />
      </div>
    </div>
  );
};
