import { createContext } from "react";

const boardContext  = createContext({
    activeToolItem: "",
    toolActionType: "",
    elements: [],
    history: [[]],
    index: 0,
    boardMouseDownHandler: () => {},
    boardMouseMoveHandler: () => {},
    boardMouseUpHandler: () => {},
    changeToolHandler: () => {},
    textAreaBlurHandler: () => {},
});

export default boardContext;