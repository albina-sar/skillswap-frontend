export type radioButtonProps = {
    name: string;
    value: string;
    label: string;
    isChecked: boolean;
    isDisabled?: boolean;
    onChange: (value: string) => void;
};