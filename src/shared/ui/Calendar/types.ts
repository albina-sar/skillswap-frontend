export type CalendarProps = {
    id?: string;
    value?: Date | null;
    onSubmit: (value: Date) => void;
}
