export type checkboxProps = {
    icon: "check" | "minus";
    onChange: (value: string, checked: boolean) => void;
    label: string;
    value: string;
    isDisabled?: boolean;
}