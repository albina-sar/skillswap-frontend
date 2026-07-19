export type RadioGroupProps = {
    itemsList: GroupItem[];
    groupName: string;
    title?: string;
    isDisabled?: boolean;
    selectedValue: string;
    onChange: (value: string) => void;
}

type GroupItem = {
    id: string, 
    name: string
}