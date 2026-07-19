export type CheckboxSubItem = {
  id: string;
  name: string;
};

export type CheckboxItem = {
  id: string;
  name: string;
  subcategories?: CheckboxSubItem[];
};

export type CheckboxGroupProps = {
    itemsList: CheckboxItem[];
    title?: string;
    isDisabled?: boolean;
    visibleCount?: number;
    expandButtonText?: string;
}

export type CheckboxGroupItemProps = {
  item: CheckboxItem;
  selectedValues: string[];
  isExpanded: boolean;
  disabled: boolean;
  onToggleValue: (value: string) => void;
  onToggleItem: (item: CheckboxItem) => void;
  onToggleExpanded: (id: string) => void;
};
