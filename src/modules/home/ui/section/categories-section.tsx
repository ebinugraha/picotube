"use client";

import { FilterCarousel } from "@/components/filter-carousel";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ur } from "zod/v4/locales";

export const CategoriesSection = ({ categoryId }: { categoryId?: string }) => {
  return (
    <Suspense fallback={<CategoriesSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error loading categories</div>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSectionSkeleton = () => {
  return <FilterCarousel onSelect={() => {}} isLoading data={[]} />;
};

const CategoriesSectionSuspense = ({ categoryId }: { categoryId?: string }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: categories, isPending } = useSuspenseQuery(
    trpc.category.getMany.queryOptions()
  );

  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);

    console.log(url);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }
    router.push(url.toString());
  };

  return (
    <FilterCarousel
      onSelect={(item) => onSelect(item)}
      data={data}
      value={categoryId}
    />
  );
};
