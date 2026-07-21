import { FilterGroupConfig, FiltersState } from "@/features/filters/model/filterGroups";

export type FilterSectionProps = {
  groups: FilterGroupConfig[];
  onFiltersChange: (values: FiltersState) => void;
};