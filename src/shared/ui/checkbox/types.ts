export type checkboxProps = {
    icon: "check" | "minus";
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}