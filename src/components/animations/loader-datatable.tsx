import { Skeleton } from "@/components/ui/skeleton"

export default function LoaderDatatable() {
    return (
        <div className="container mx-auto ">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-[250px]" />
                        <Skeleton className="h-8 w-[120px]" />
                        <Skeleton className="h-8 w-[120px]" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                </div>
                <div className="rounded-md border">
                    <div className="h-12 border-b px-4 flex items-center">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full mx-2" />
                        ))}
                    </div>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-16 border-b px-4 flex items-center">
                            {Array.from({ length: 7 }).map((_, j) => (
                                <Skeleton key={j} className="h-4 w-full mx-2" />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[200px]" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </div>
    )
}
