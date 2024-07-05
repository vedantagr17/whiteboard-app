import React, { useContext } from "react";
import {
  FaSlash,
  FaRegCircle,
  FaEraser,
  FaArrowRight,
  FaDownload,
  FaFont,
  FaPaintBrush,
  FaUndoAlt,
  FaRedoAlt,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import cx from "classnames";

import BoardContext from "../../store/board-context";
import classes from "./index.module.css";
import { TOOL_ITEMS } from "../../constants";

const Toolbar = () => {
  const { activeToolItem, changeTool, undo, redo } = useContext(BoardContext);

  const handleToolClick = (tool) => {
    changeTool(tool);
  };

  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const URL = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = URL;
    anchor.download = "board.png";
    anchor.click();
  };

  return (
    <div className={classes.container}>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.BRUSH)}
      >
        <FaPaintBrush />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.LINE,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.LINE)}
      >
        <FaSlash />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.RECTANGLE)}
      >
        <LuRectangleHorizontal />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.CIRCLE)}
      >
        <FaRegCircle />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.ARROW,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.ARROW)}
      >
        <FaArrowRight />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.TEXT,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.TEXT)}
      >
        <FaFont />
      </div>
      <div
        className={cx(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.ERASER,
        })}
        onClick={() => handleToolClick(TOOL_ITEMS.ERASER)}
      >
        <FaEraser />
      </div>
      <div className={classes.toolItem} onClick={() => undo()}>
        <FaUndoAlt />
      </div>
      <div className={classes.toolItem} onClick={() => redo()}>
        <FaRedoAlt />
      </div>
      <div className={cx(classes.toolItem)} onClick={handleDownloadClick}>
        <FaDownload />
      </div>
    </div>
  );
};

export default Toolbar;
