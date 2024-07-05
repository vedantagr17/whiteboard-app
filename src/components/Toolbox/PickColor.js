import React from "react";
import cx from "classnames";
import { COLORS, COLOR_CONFIG_TYPES, FILL_TOOL_ITEMS } from "../../constants";

import classes from "./index.module.css";

const PickColor = ({
  labelText,
  type,
  strokeColor,
  fillColor,
  activeToolItem,
  onColorClick,
}) => {
  const colorClickHandler = (newColor) => {
    onColorClick(activeToolItem, newColor);
  };

  const colorPickerChangeHandler = (event) => {
    onColorClick(activeToolItem, event.target.value);
  };

  return (
    <div className={classes.selectOptionContainer}>
      <label className={classes.toolBoxLabel}>{labelText}</label>
      <div className={classes.colorsContainer}>
        {type === COLOR_CONFIG_TYPES.FILL && fillColor === null ? (
          <div
            className={cx(classes.colorPicker, classes.noFillColorBox)}
            onClick={() => colorClickHandler(COLORS.BLACK)}
          ></div>
        ) : (
          <div>
            <input
              className={classes.colorPicker}
              type="color"
              value={
                type === COLOR_CONFIG_TYPES.STROKE ? strokeColor : fillColor
              }
              onChange={colorPickerChangeHandler}
            ></input>
          </div>
        )}
        {type === COLOR_CONFIG_TYPES.FILL &&
          FILL_TOOL_ITEMS.includes(activeToolItem) && (
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => colorClickHandler(null)}
            ></div>
          )}
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.BLACK
                : fillColor === COLORS.BLACK,
          })}
          style={{ backgroundColor: COLORS.BLACK }}
          onClick={() => colorClickHandler(COLORS.BLACK)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.RED
                : fillColor === COLORS.RED,
          })}
          style={{ backgroundColor: COLORS.RED }}
          onClick={() => colorClickHandler(COLORS.RED)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.GREEN
                : fillColor === COLORS.GREEN,
          })}
          style={{ backgroundColor: COLORS.GREEN }}
          onClick={() => colorClickHandler(COLORS.GREEN)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.BLUE
                : fillColor === COLORS.BLUE,
          })}
          style={{ backgroundColor: COLORS.BLUE }}
          onClick={() => colorClickHandler(COLORS.BLUE)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.ORANGE
                : fillColor === COLORS.ORANGE,
          })}
          style={{ backgroundColor: COLORS.ORANGE }}
          onClick={() => colorClickHandler(COLORS.ORANGE)}
        ></div>
        <div
          className={cx(classes.colorBox, {
            [classes.activeColorBox]:
              type === COLOR_CONFIG_TYPES.STROKE
                ? strokeColor === COLORS.YELLOW
                : fillColor === COLORS.YELLOW,
          })}
          style={{ backgroundColor: COLORS.YELLOW }}
          onClick={() => colorClickHandler(COLORS.YELLOW)}
        ></div>
      </div>
    </div>
  );
};

export default PickColor;
