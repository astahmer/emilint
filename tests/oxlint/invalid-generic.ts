import { vi } from "vitest";

type UnknownAlias = unknown;

export const acceptsBroadObject = (value: object) => value;
export const acceptsUnknown = (value: unknown) => value;
export const returnsUnknown = (): unknown => "value";

const widenedObject: object = { value: 1 };
const assertedObject = widenedObject as { value: number };
const knownObject: object = { value: 1 };
const unsafeDictionary: Record<string, unknown> = {};
const chainedAssertion = "value" as unknown as string;
const conditionalObject = { ...(true ? { value: 1 } : {}) };

export const isText = (value: unknown) => typeof value === "string";
export const reflectedValue = Reflect.get({ value: 1 }, "value");
export const reflectedCall = Reflect.apply(String, undefined, ["value"]);
vi.mock("./module");

void UnknownAlias;
void assertedObject;
void knownObject;
void unsafeDictionary;
void chainedAssertion;
void conditionalObject;
