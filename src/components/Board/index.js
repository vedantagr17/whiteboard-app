import React, { useContext, useRef, useEffect, useLayoutEffect } from "react";
import BoardContext from "../../store/board-context";
import rough from "roughjs/bundled/rough.esm";
import ToolboxContext from "../../store/toolbox-context";
import { drawElement } from "../../utils/element";
import { TOOL_ACTION_TYPES } from "../../constants";

import classes from "./index.module.css";

const Board = () => {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const {
    elements,
    boardMouseDown,
    boardMouseUp,
    boardMouseMove,
    toolActionType,
    selectedElement,
    textAreaBlur,
    undo,
    redo,
  } = useContext(BoardContext);
  const { toolboxState } = useContext(ToolboxContext);

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        undo();
        return;
      }
      if (event.ctrlKey && event.key === "y") {
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      drawElement(roughCanvas, context, element);
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textArea.focus();
      }, 0);
    }
  }, [toolActionType, selectedElement]);

  const handleMouseDown = (event) => {
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    boardMouseDown(event, toolboxState);
  };

  const handleMouseMove = (event) => {
    boardMouseMove(event);
  };

  const handleMouseUp = () => {
    boardMouseUp();
  };

  return (
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          ref={textAreaRef}
          type="text"
          className={classes.textElementBox}
          style={{
            top: selectedElement.y1,
            left: selectedElement.x1,
            fontSize: `${selectedElement.textEle?.size}px`,
            color: selectedElement.textEle?.stroke,
          }}
          onBlur={(event) => textAreaBlur(event, toolboxState)}
        />
      )}

      <div>
        <canvas
          ref={canvasRef}
          id="canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </div>
    </>
  );
};

export default Board;
