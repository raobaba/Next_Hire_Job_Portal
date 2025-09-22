import React from "react";

const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
};

const SkeletonCard = () => {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};

const SearchSkeleton = () => {
  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md z-20 p-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

const CarouselSkeleton = () => {
  return (
    <div className="w-full max-w-xl mx-auto my-10">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grow-0 shrink-0 min-w-0 md:basis-1/2">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export { Skeleton, SkeletonCard, SearchSkeleton, CarouselSkeleton };
