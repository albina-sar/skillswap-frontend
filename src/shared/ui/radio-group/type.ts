export type RadioGroupProps = {
    itemsList: GroupItem[];
    groupName: string;
    title?: string;
    isDisabled?: boolean;
}

type GroupItem = {
    id: string, 
    name: string
}