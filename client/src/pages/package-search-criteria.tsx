import React from "react";
import SearchCriteriaTemplate from "@/components/SearchCriteriaTemplate";
import { searchCriteriaConfigs } from "@/lib/searchCriteriaConfig";

export default function PackageSearchCriteria() {
  const config = searchCriteriaConfigs.package;
  
  if (!config) {
    return <div>Configuration not found</div>;
  }

  return <SearchCriteriaTemplate config={config} />;
}
