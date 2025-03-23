export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import SearchResults from "@/components/SearchResults/SearchResults";

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
};

export default SearchPage;
