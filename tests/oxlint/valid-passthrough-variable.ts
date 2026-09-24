const sourceValue = "source";

export const exportedValue = sourceValue;

let mutableValue = exportedValue;
mutableValue = "updated";

const { value } = { value: sourceValue };
void value;

// oxlint-disable-next-line anti-slop/no-passthrough-variable -- Keep the original reference across the asynchronous boundary.
const snapshot = mutableValue;
void snapshot;
