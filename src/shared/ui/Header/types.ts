import { User } from "@/shared/types";

export type HeaderProps = {
    isAuth: boolean;
    user: User;
    onSearch: (value: string) => void;
    categories: React.ReactNode;
    notify: React.ReactNode;
}