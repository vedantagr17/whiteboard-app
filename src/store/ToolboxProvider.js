import ToolboxContext from "./toolbox-context";
import { COLORS, TOOLBOX_ACTIONS, TOOL_ITEMS } from "../constants";
import { useReducer } from "react";

const initialToolBoxState = {
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 32,
  },
  [TOOL_ITEMS.ERASER]: {
    size: 1,
  },
};

const toolboxReducer = (state, action) => {
  switch (action.type) {
    case TOOLBOX_ACTIONS.CHANGE_STROKE:
      const toolObjectCopy = state[action.payload.tool];
      toolObjectCopy.stroke = action.payload.stroke;
      return {
        ...state,
        [action.payload.tool]: toolObjectCopy,
      };
    case TOOLBOX_ACTIONS.CHANGE_FILL: {
      const toolObjectCopy = state[action.payload.tool];
      toolObjectCopy.fill = action.payload.fill;
      return {
        ...state,
        [action.payload.tool]: toolObjectCopy,
      };
    }
    case TOOLBOX_ACTIONS.CHANGE_SIZE: {
      const toolObjectCopy = state[action.payload.tool];
      toolObjectCopy.size = action.payload.size;
      return {
        ...state,
        [action.payload.tool]: toolObjectCopy,
      };
    }
    default:
      return state;
  }
};

export const ToolboxContextProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialToolBoxState
  );

  const changeStrokeHandler = (tool, stroke) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_STROKE,
      payload: {
        tool,
        stroke,
      },
    });
  };

  const changeFillHandler = (tool, fill) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_FILL,
      payload: {
        tool,
        fill,
      },
    });
  };

  const changeSizeHandler = (tool, size) => {
    dispatchToolboxAction({
      type: TOOLBOX_ACTIONS.CHANGE_SIZE,
      payload: {
        tool,
        size,
      },
    });
  };

  const toolboxContext = {
    toolboxState,
    changeStroke: changeStrokeHandler,
    changeFill: changeFillHandler,
    changeSize: changeSizeHandler,
  };

  return (
    <ToolboxContext.Provider value={toolboxContext}>
      {children}
    </ToolboxContext.Provider>
  );
};
