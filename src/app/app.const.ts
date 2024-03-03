import { Gender, Hobby } from "./app.models";

export enum GENDERS {
    MALE,
    FEMALE,
    BIGENDER,
    TRANSGENDER,
    AGENDER,
    QUESTIONING,
    UNKNOWN,
}

export const GENDER_OPTIONS: Gender[] = [
    { 
        label: 'Male', 
        value: GENDERS.MALE,
    },
    { 
        label: 'Female', 
        value: GENDERS.FEMALE,
    },
    { 
        label: 'Bigender', 
        value: GENDERS.BIGENDER,
    },
    { 
        label: 'Transgender', 
        value: GENDERS.TRANSGENDER,
    },
    { 
        label: 'Agender', 
        value: GENDERS.AGENDER,
    },
    { 
        label: 'Questioning', 
        value: GENDERS.QUESTIONING,
    },
    { 
        label: 'Prefer not to say', 
        value: GENDERS.UNKNOWN,
    },
];

export enum HOBBIES {
    RUNNING,
    FOOTBALL,
    DRAWING,
    DRINKING,
    UNKNOWN,
}

export const HOBBY_OPTIONS: Hobby[] = [
    {
        label: 'Running',
        value: HOBBIES.RUNNING,
    },
    {
        label: 'Football',
        value: HOBBIES.FOOTBALL,
    },
    {
        label: 'Drawing',
        value: HOBBIES.DRAWING,
    },
    {
        label: 'Drinking',
        value: HOBBIES.DRINKING,
    },
    {
        label: 'Orther',
        value: HOBBIES.UNKNOWN,
    }
];