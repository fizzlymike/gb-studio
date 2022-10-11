import { ScriptValue } from "../../src/lib/scriptValue/types";
import {
  optimiseScriptValue,
  precompileScriptValue,
} from "../../src/lib/scriptValue/helpers";

test("should perform constant folding for addition", () => {
  const input: ScriptValue = {
    type: "add",
    valueA: {
      type: "number",
      value: 5,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 8,
  });
});

test("should perform constant folding for subtraction", () => {
  const input: ScriptValue = {
    type: "sub",
    valueA: {
      type: "number",
      value: 5,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 2,
  });
});

test("should perform constant folding for multiplication", () => {
  const input: ScriptValue = {
    type: "mul",
    valueA: {
      type: "number",
      value: 5,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 15,
  });
});

test("should perform constant folding for division", () => {
  const input: ScriptValue = {
    type: "div",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 7,
  });
});

test("should round down to nearest int when constant folding for division", () => {
  const input: ScriptValue = {
    type: "div",
    valueA: {
      type: "number",
      value: 14,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 4,
  });
});

test("should perform constant folding for greater than", () => {
  const input: ScriptValue = {
    type: "gt",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  const input2: ScriptValue = {
    type: "gt",
    valueA: {
      type: "number",
      value: 3,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 1,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 0,
  });
});

test("should perform constant folding for greater than or equal to", () => {
  const input: ScriptValue = {
    type: "gte",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  const input2: ScriptValue = {
    type: "gte",
    valueA: {
      type: "number",
      value: 3,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  const input3: ScriptValue = {
    type: "gte",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 1,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 0,
  });
  expect(optimiseScriptValue(input3)).toEqual({
    type: "number",
    value: 1,
  });
});

test("should perform constant folding for less than", () => {
  const input: ScriptValue = {
    type: "lt",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  const input2: ScriptValue = {
    type: "lt",
    valueA: {
      type: "number",
      value: 3,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 0,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 1,
  });
});

test("should perform constant folding for less than or equal to", () => {
  const input: ScriptValue = {
    type: "lte",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  const input2: ScriptValue = {
    type: "lte",
    valueA: {
      type: "number",
      value: 3,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  const input3: ScriptValue = {
    type: "lte",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 0,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 1,
  });
  expect(optimiseScriptValue(input3)).toEqual({
    type: "number",
    value: 1,
  });
});

test("should perform constant folding for equal to", () => {
  const input: ScriptValue = {
    type: "eq",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  const input2: ScriptValue = {
    type: "eq",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 20,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 1,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 0,
  });
});

test("should perform constant folding for not equal to", () => {
  const input: ScriptValue = {
    type: "ne",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  const input2: ScriptValue = {
    type: "ne",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 20,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 0,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 1,
  });
});

test("should perform constant folding for min", () => {
  const input: ScriptValue = {
    type: "min",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  const input2: ScriptValue = {
    type: "min",
    valueA: {
      type: "number",
      value: 3,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 3,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 3,
  });
});

test("should perform constant folding for max", () => {
  const input: ScriptValue = {
    type: "max",
    valueA: {
      type: "number",
      value: 21,
    },
    valueB: {
      type: "number",
      value: 3,
    },
  };
  const input2: ScriptValue = {
    type: "max",
    valueA: {
      type: "number",
      value: 3,
    },
    valueB: {
      type: "number",
      value: 21,
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 21,
  });
  expect(optimiseScriptValue(input2)).toEqual({
    type: "number",
    value: 21,
  });
});

test("should perform constant folding for nested input", () => {
  const input: ScriptValue = {
    type: "mul",
    valueA: {
      type: "sub",
      valueA: {
        type: "number",
        value: 5,
      },
      valueB: {
        type: "number",
        value: 3,
      },
    },
    valueB: {
      type: "add",
      valueA: {
        type: "number",
        value: 5,
      },
      valueB: {
        type: "min",
        valueA: {
          type: "number",
          value: 3,
        },
        valueB: {
          type: "number",
          value: 6,
        },
      },
    },
  };
  expect(optimiseScriptValue(input)).toEqual({
    type: "number",
    value: 16,
  });
});

/*
test("should precompile to list of required operations", () => {
  const input: ScriptValue = {
    type: "add",
    valueA: {
      type: "variable",
      value: "L0",
    },
    valueB: {
      type: "variable",
      value: "L0",
    },
  };
  expect(precompileScriptValue(input)).toEqual([input]);
});

test("should precompile to list of required operations", () => {
  const input: ScriptValue = {
    type: "add",
    valueA: {
      type: "variable",
      value: "L0",
    },
    valueB: {
      type: "property",
      value: "player:xpos",
    },
  };
  expect(precompileScriptValue(input)).toEqual([
    {
      type: "set",
      symbol: "temp0",
      value: {
        type: "property",
        value: "player:xpos",
      },
    },
    {
      type: "add",
      valueA: {
        type: "variable",
        value: "L0",
      },
      valueB: {
        type: "temp",
        value: "temp0",
      },
    },
  ]);
});
*/
