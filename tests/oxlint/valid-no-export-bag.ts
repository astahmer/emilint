export const parsePreference = (value: string) => value.trim();
export const serializePreference = (value: string) => JSON.stringify(value);
export const usePreference = () => "hook exports stay allowed";

export class Preference {}
