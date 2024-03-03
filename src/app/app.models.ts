import { GENDERS, HOBBIES } from "./app.const";

export type AppAny = any;

export interface SelectOption<L = string, V = AppAny> {
    label: L,
    value: V
}

export type Gender = SelectOption<string, GENDERS>;
export type Hobby = SelectOption<string, HOBBIES>;