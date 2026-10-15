type User = {
  readonly name: string;
};

export const accepts = (value: User) => value;
export const returns = (): User => ({ name: "value" });

const user = { name: "value" } satisfies User;
const values: Record<string, number> = {};

const read = (value: User) => value.name;
const direct = (value: string) => value.toUpperCase();

void user;
void values;
