export type checkboxProps = {
    icon: "check" | "minus";
    onChange: (value: string) => void;
    label: string;
    value: string;
    isChecked: boolean;
    isDisabled?: boolean;
}