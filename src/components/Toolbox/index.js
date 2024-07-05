import React, { useContext } from "react";
import BoardContext from "../../store/board-context";
import {
  STROKE_TOOL_ITEMS,
  FILL_TOOL_ITEMS,
  COLOR_CONFIG_TYPES,
  TOOL_ITEMS,
  SIZE_TOOL_ITEMS,
} from "../../constants";

import classes from "./index.module.css";
import PickColor from "./PickColor";
import ToolboxContext from "../../store/toolbox-context";

const Toolbox = () => {
  const { activeToolItem } = useContext(BoardContext);
  const { toolboxState, changeStroke, changeFill, changeSize } =
    useContext(ToolboxContext);
  const size = toolboxState[activeToolItem].size;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const strokeColor = toolboxState[activeToolItem]?.stroke;

  const onSizeChange = (event) => {
    const newSize = event.target.value;
    changeSize(activeToolItem, newSize);
  };

  return (
    <div className={classes.container}>
      {STROKE_TOOL_ITEMS.includes(activeToolItem) && (
        <PickColor
          labelText="Stroke Color"
          type={COLOR_CONFIG_TYPES.STROKE}
          strokeColor={strokeColor}
          fillColor={fillColor}
          activeToolItem={activeToolItem}
          onColorClick={changeStroke}
        />
      )}
      {FILL_TOOL_ITEMS.includes(activeToolItem) && (
        <PickColor
          labelText="Fill Color"
          type={COLOR_CONFIG_TYPES.FILL}
          strokeColor={strokeColor}
          fillColor={fillColor}
          activeToolItem={activeToolItem}
          onColorClick={changeFill}
        />
      )}
      {SIZE_TOOL_ITEMS.includes(activeToolItem) && (
        <div className={classes.selectOptionContainer}>
          <label className={classes.toolBoxLabel}>
            {activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
          </label>
          <input
            type="range"
            min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
            max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
            step={1}
            value={size}
            onChange={onSizeChange}
          ></input>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
