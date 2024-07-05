import { useReducer } from "react";
import {
  BOARD_ACTIONS,
  DRAW_TOOL_ITEMS,
  TOOL_ACTION_TYPES,
  TOOL_ITEMS,
} from "../constants";
import {
  createRoughElement,
  getUpdatedElements,
  isPointNearElement,
} from "../utils/element";
import BoardContext from "./board-context";

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.BRUSH,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  elements: [],
  history: [[]],
  index: 0,
  selectedElement: null,
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL:
      return { ...state, activeToolItem: action.payload.tool };
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
      return { ...state, toolActionType: action.payload.actionType };
    case BOARD_ACTIONS.DRAW_DOWN: {
      const id = state.elements.length;
      const { clientX, clientY, size, strokeColor, fillColor } = action.payload;
      const newElement = createRoughElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        {
          type: state.activeToolItem,
          stroke: strokeColor,
          fill: fillColor,
          size,
        }
      );
      const newElements = [...state.elements, newElement];
      return {
        ...state,
        elements: newElements,
        toolActionType: DRAW_TOOL_ITEMS.includes(state.activeToolItem)
          ? TOOL_ACTION_TYPES.DRAWING
          : TOOL_ACTION_TYPES.WRITING,
        selectedElement: newElement,
      };
    }

    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const index = state.elements.length - 1;
      const { x1, y1, type, stroke, text, fill, size } = state.elements[index];
      return {
        ...state,
        elements: getUpdatedElements(
          state.elements,
          index,
          x1,
          y1,
          clientX,
          clientY,
          {
            type,
            text,
            stroke,
            fill,
            size,
          }
        ),
      };
    }
    case BOARD_ACTIONS.DRAW_UP: {
      const elements = state.elements;
      let newHistory = state.history; // 2d array
      newHistory = newHistory.slice(0, state.index + 1);
      newHistory.push(elements);
      return {
        ...state,
        history: newHistory,
        index: newHistory.length - 1,
      };
    }
    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      const newElements = state.elements.filter((ele) => {
        return !isPointNearElement(ele, {
          pointX: clientX,
          pointY: clientY,
        });
      });
      if (newElements.length === state.elements.length) return state;
      const prevIndex = state.index;
      return {
        ...state,
        elements: newElements,
        history: [...state.history, newElements],
        index: prevIndex + 1,
        toolActionType: TOOL_ACTION_TYPES.ERASING,
      };
    }
    case BOARD_ACTIONS.CHANGE_TEXT: {
      const index = state.selectedElement.id;
      const elements = state.elements;
      const { x1, y1, id, type } = elements[index];
      const newEle = createRoughElement(id, x1, y1, null, null, {
        type,
        text: action.payload.text,
        stroke: action.payload.strokeColor,
        size: action.payload.size,
      });
      const elementsCopy = [...state.elements];
      elementsCopy[id] = newEle;
      const prevIndex = state.index;
      return {
        ...state,
        elements: elementsCopy,
        history: [...state.history, elementsCopy],
        index: prevIndex + 1,
      };
    }
    case BOARD_ACTIONS.UNDO: {
      if (state.index <= 0) return state;
      const prevElements = state.history[state.index - 1];
      return {
        ...state,
        elements: prevElements,
        index: state.index - 1,
      };
    }
    case BOARD_ACTIONS.REDO: {
      if (state.index >= state.history.length - 1) return state;
      const nextElements = state.history[state.index + 1];
      return {
        ...state,
        elements: nextElements,
        index: state.index + 1,
      };
    }
    default: {
      return state;
    }
  }
};

export const BoardContextProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );

  const changeToolHandler = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: { tool },
    });
  };

  const boardMouseDownHandler = (event, toolboxState) => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    const { clientX, clientY } = event;

    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      return;
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        strokeColor: toolboxState[boardState.activeToolItem]?.stroke,
        fillColor: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });
  };

  const boardMouseMoveHandler = (event) => {
    const { clientX, clientY } = event;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      });
    } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

  const boardMouseUpHandler = () => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.DRAW_UP,
      });
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      },
    });
  };

  const textAreaBlurHandler = (event, toolboxState) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text: event.target.value,
        strokeColor: toolboxState[boardState.activeToolItem]?.stroke,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      },
    });
  };

  const boardUndoHandler = () => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.UNDO,
    });
  };

  const boardRedoHandler = () => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.REDO,
    });
  };

  const boardContext = {
    activeToolItem: boardState.activeToolItem,
    toolActionType: boardState.toolActionType,
    elements: boardState.elements,
    history: boardState.history,
    index: boardState.index,
    selectedElement: boardState.selectedElement,
    changeTool: changeToolHandler,
    boardMouseDown: boardMouseDownHandler,
    boardMouseMove: boardMouseMoveHandler,
    boardMouseUp: boardMouseUpHandler,
    textAreaBlur: textAreaBlurHandler,
    undo: boardUndoHandler,
    redo: boardRedoHandler,
  };

  return (
    <BoardContext.Provider value={boardContext}>
      {children}
    </BoardContext.Provider>
  );
};
