import { PropertySelect } from "components/forms/PropertySelect";
import { VariableSelect } from "components/forms/VariableSelect";
import {
  isValueAtom,
  isValueOperation,
  ScriptValue,
  ValueAtom,
  ValueFunction,
} from "lib/scriptValue/types";
import React, { useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Button } from "ui/buttons/Button";
import { DropdownButton } from "ui/buttons/DropdownButton";
import { InputGroup, InputGroupPrepend } from "ui/form/InputGroup";
import { NumberInput } from "ui/form/NumberInput";
import {
  ActorIcon,
  BlankIcon,
  CheckIcon,
  CrossIcon,
  DiceIcon,
  DivideIcon,
  ExpressionIcon,
  MinusIcon,
  NumberIcon,
  PlusIcon,
  VariableIcon,
} from "ui/icons/Icons";
import {
  MenuAccelerator,
  MenuDivider,
  MenuItem,
  MenuItemIcon,
} from "ui/menu/Menu";
import ScriptEventFormMathArea from "./ScriptEventFormMatharea";

type ValueFunctionMenuItem = {
  value: ValueFunction;
  label: string;
  symbol: string;
};

const functionSymbolLookup: Record<ValueFunction, string> = {
  add: "+",
  sub: "-",
  mul: "*",
  div: "/",
  // rnd: "",
};

const functionIconLookup: Record<ValueFunction, JSX.Element> = {
  add: <PlusIcon />,
  sub: <MinusIcon />,
  mul: <CrossIcon />,
  div: <DivideIcon />,
  // rnd: <DiceIcon />,
};

const atomIconLookup: Record<ValueAtom, JSX.Element> = {
  number: <NumberIcon />,
  variable: <VariableIcon />,
  expression: <ExpressionIcon />,
  property: <ActorIcon />,
};

const functionMenuItems: ValueFunctionMenuItem[] = [
  {
    value: "add",
    label: "Add",
    symbol: functionSymbolLookup["add"],
  },
  {
    value: "sub",
    label: "Subtract",
    symbol: functionSymbolLookup["sub"],
  },
  {
    value: "mul",
    label: "Multiply",
    symbol: functionSymbolLookup["mul"],
  },
  {
    value: "div",
    label: "Divide",
    symbol: functionSymbolLookup["div"],
  },
  // {
  //   value: "rnd",
  //   label: "Random",
  //   symbol: functionSymbolLookup["rnd"],
  // },
];

const Wrapper = styled.div`
  display: flex;
  //   flex-basis: 300px;
`;

const OperatorWrapper = styled.div`
  width: 24px;
  flex-shrink: 0;
`;

interface ValueWrapperProps {
  hover?: boolean;
}

const ValueWrapper = styled.div<ValueWrapperProps>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  min-width: 98px;
  flex-basis: 130px;
`;

const FunctionWrapper = styled.div<ValueWrapperProps>`
  display: flex;
  align-items: center;
  border-radius: 8px;
  flex-grow: 1;
  ${(props) =>
    props.hover
      ? css`
          background: #eee;
        `
      : ""}
`;

const BracketsWrapper = styled.div<ValueWrapperProps>`
  display: flex;
  align-items: center;
  padding: 0px 5px;
  border-radius: 8px;
  flex-wrap: wrap;
  flex-grow: 1;

  > * {
    margin: 2.5px;
  }

  //   background: rgba(0, 0, 0, 0.1);
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;

  ${(props) =>
    props.hover
      ? css`
          background: #eee;
        `
      : ""}
`;

interface ValueSelectProps {
  name: string;
  entityId: string;
  value?: ScriptValue;
  onChange: (newValue: ScriptValue | undefined) => void;
  innerValue?: boolean;
  fixedType?: boolean;
}

const ValueSelect = ({
  name,
  entityId,
  value = { type: "number", value: 0 },
  onChange,
  innerValue,
  fixedType,
}: ValueSelectProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isValueFn = isValueOperation(value);

  const focus = useCallback(() => {
    setTimeout(() => {
      document.getElementById(name)?.focus();
    }, 150);
  }, [name]);

  const focusSecondChild = useCallback(() => {
    setTimeout(() => {
      document.getElementById(`${name}_valueB`)?.focus();
    }, 150);
  }, [name]);

  console.log(value.type);
  if (isValueFn) {
    console.log(value.type);
  }

  const menu = useMemo(
    () => [
      ...(!isValueFn
        ? [
            <MenuItem
              key="number"
              onClick={() => {
                onChange({
                  type: "number",
                  value: 0,
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "number" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Number
            </MenuItem>,
            <MenuItem
              key="variable"
              onClick={() => {
                onChange({
                  type: "variable",
                  value: "0",
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "variable" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Variable
              <MenuAccelerator accelerator="$" />
            </MenuItem>,
            <MenuItem
              key="property"
              onClick={() => {
                onChange({
                  type: "property",
                  value: "",
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "property" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Property
            </MenuItem>,
            <MenuItem
              key="expression"
              onClick={() => {
                onChange({
                  type: "expression",
                  value: "",
                });
              }}
            >
              <MenuItemIcon>
                {value.type === "expression" ? <CheckIcon /> : <BlankIcon />}
              </MenuItemIcon>
              Expression
            </MenuItem>,
            <MenuDivider key="divider" />,
          ]
        : []),
      ...functionMenuItems.map((functionMenuItem) => (
        <MenuItem
          key={functionMenuItem.value}
          onClick={() => {
            if (isValueOperation(value)) {
              onChange({
                type: functionMenuItem.value,
                valueA: value.valueA,
                valueB: value.valueB,
              });
              focus();
            } else {
              onChange({
                type: functionMenuItem.value,
                valueA: value,
                valueB: undefined,
              });
              focusSecondChild();
            }
          }}
        >
          <MenuItemIcon>
            {value.type === functionMenuItem.value ? (
              <CheckIcon />
            ) : (
              <BlankIcon />
            )}
          </MenuItemIcon>
          {functionMenuItem.label}
          <MenuAccelerator accelerator={functionMenuItem.symbol} />
        </MenuItem>
      )),
      <MenuItem
        key="rnd"
        onClick={() => {
          const valueA =
            "valueA" in value && value.valueA && value.valueA.type === "number"
              ? value.valueA
              : {
                  type: "number" as const,
                  value: 0,
                };
          const valueB =
            "valueB" in value && value.valueB && value.valueB.type === "number"
              ? value.valueB
              : {
                  type: "number" as const,
                  value: 0,
                };
          onChange({
            type: "rnd",
            valueA: valueA,
            valueB: valueB,
          });
          if (valueA.value) {
            focusSecondChild();
          } else {
            focus();
          }
        }}
      >
        <MenuItemIcon>
          {value.type === "rnd" ? <CheckIcon /> : <BlankIcon />}
        </MenuItemIcon>
        Random
      </MenuItem>,
    ],
    [focus, focusSecondChild, isValueFn, onChange, value]
  );

  const dropdownButton = useMemo(() => {
    if (fixedType) {
      return isValueAtom(value) ? (
        <Button size="small">{atomIconLookup[value.type]}</Button>
      ) : null;
    }
    return isValueAtom(value) ? (
      <DropdownButton
        label={atomIconLookup[value.type]}
        size="small"
        showArrow={false}
      >
        {menu}
      </DropdownButton>
    ) : null;
  }, [fixedType, menu, value]);

  let input: JSX.Element | null = null;
  if (value.type === "number") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>{dropdownButton}</InputGroupPrepend>
          <NumberInput
            id={name}
            type="number"
            value={String(
              value.value !== undefined && value.value !== null
                ? value.value
                : ""
            )}
            // min={field.min}
            // max={field.max}
            // step={field.step}
            // placeholder={String(field.placeholder || defaultValue)}
            onChange={(e) => {
              onChange({
                type: "number",
                value: parseInt(e.currentTarget.value),
              });
            }}
            onKeyDown={(e) => {
              console.log(
                e.key,
                e.currentTarget.value,
                (e.target as any).selectionStart,
                e.currentTarget.selectionEnd,
                window.getSelection()?.getRangeAt(0).startOffset,
                window.getSelection()?.getRangeAt(0)
              );
              if (e.key === "$") {
                onChange({
                  type: "variable",
                  value: "0",
                });
                focus();
              } else if (e.key === "+") {
                onChange({
                  type: "add",
                  valueA: value,
                  valueB: undefined,
                });
                focusSecondChild();
              } else if (e.key === "-") {
                // Don't add shortcut for sub
                // until we can figure out how to stop it
                // when you're trying to input a negative number
                // onChange({
                //   type: "sub",
                //   valueA: value,
                //   valueB: undefined,
                // });
                // focusSecondChild();
              } else if (e.key === "*") {
                onChange({
                  type: "mul",
                  valueA: value,
                  valueB: undefined,
                });
                focusSecondChild();
              } else if (e.key === "/") {
                onChange({
                  type: "div",
                  valueA: value,
                  valueB: undefined,
                });
                focusSecondChild();
              }
            }}
            // units={(args[field.unitsField || ""] || field.unitsDefault) as UnitType}
            // unitsAllowed={field.unitsAllowed}
            // onChangeUnits={onChangeUnits}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (value.type === "variable") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>{dropdownButton}</InputGroupPrepend>
          <VariableSelect
            // id={name}
            name={name}
            entityId={entityId}
            value={value.value}
            onChange={(newValue) => {
              onChange({
                type: "variable",
                value: newValue,
              });
            }}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (value.type === "property") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>{dropdownButton}</InputGroupPrepend>
          <PropertySelect
            name={name}
            value={value.value}
            onChange={(newValue) => {
              onChange({
                type: "property",
                value: newValue,
              });
            }}

            //   units={
            //     (args[field.unitsField || ""] || field.unitsDefault) as UnitType
            //   }
            //   unitsAllowed={field.unitsAllowed}
            //   onChangeUnits={onChangeUnits}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (value.type === "expression") {
    input = (
      <ValueWrapper>
        <InputGroup>
          <InputGroupPrepend>{dropdownButton}</InputGroupPrepend>
          <ScriptEventFormMathArea
            id={name}
            value={value.value}
            placeholder="e.g. $health >= 0..."
            onChange={(newExpression: string) => {
              onChange({
                type: "expression",
                value: newExpression,
              });
            }}
            entityId={entityId}
          />
        </InputGroup>
      </ValueWrapper>
    );
  }
  if (value.type === "rnd") {
    input = (
      <FunctionWrapper
        hover={isHovered}
        onMouseOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovered(true);
        }}
        onMouseOut={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovered(false);
        }}
      >
        <OperatorWrapper>
          <DropdownButton
            id={name}
            label={<DiceIcon />}
            showArrow={false}
            variant="transparent"
            size="small"
          >
            {menu}
            <MenuDivider />
            <MenuItem
              onClick={() => {
                onChange(value.valueA);
                focus();
              }}
            >
              <MenuItemIcon>
                <BlankIcon />
              </MenuItemIcon>
              Remove
            </MenuItem>
          </DropdownButton>
        </OperatorWrapper>
        <BracketsWrapper
          hover={isHovered}
          onMouseOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsHovered(true);
          }}
          onMouseOut={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsHovered(false);
          }}
        >
          <ValueSelect
            name={`${name}_valueA`}
            entityId={entityId}
            value={value.valueA}
            onChange={(newValue) => {
              if (!newValue || newValue.type === "number") {
                onChange({
                  ...value,
                  valueA: newValue,
                });
              }
            }}
            innerValue
            fixedType
          />

          <ValueSelect
            name={`${name}_valueB`}
            entityId={entityId}
            value={value.valueB}
            onChange={(newValue) => {
              if (!newValue || newValue.type === "number") {
                onChange({
                  ...value,
                  valueB: newValue,
                });
              }
            }}
            innerValue
            fixedType
          />
        </BracketsWrapper>
      </FunctionWrapper>
    );
  }
  if (isValueOperation(value)) {
    input = (
      <BracketsWrapper
        hover={isHovered}
        onMouseOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovered(true);
        }}
        onMouseOut={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsHovered(false);
        }}
      >
        <ValueSelect
          name={`${name}_valueA`}
          entityId={entityId}
          value={value.valueA}
          onChange={(newValue) => {
            onChange({
              ...value,
              valueA: newValue,
            });
          }}
          innerValue
        />
        <OperatorWrapper>
          <DropdownButton
            id={name}
            label={functionIconLookup[value.type]}
            showArrow={false}
            variant="transparent"
            size="small"
          >
            {menu}
            <MenuDivider />
            <MenuItem
              onClick={() => {
                onChange(value.valueA);
                focus();
              }}
            >
              <MenuItemIcon>
                <BlankIcon />
              </MenuItemIcon>
              Remove
            </MenuItem>
          </DropdownButton>
        </OperatorWrapper>
        <ValueSelect
          name={`${name}_valueB`}
          entityId={entityId}
          value={value.valueB}
          onChange={(newValue) => {
            onChange({
              ...value,
              valueB: newValue,
            });
          }}
          innerValue
        />
      </BracketsWrapper>
    );
  }

  if (innerValue) {
    return input;
  }

  return <Wrapper>{input}</Wrapper>;
};

export default ValueSelect;
