export const TOOL_ITEMS = {
    BRUSH: "BRUSH",
    LINE: "LINE",
    RECTANGLE: "RECTANGLE",
    CIRCLE: "CIRCLE",
    ERASER: "ERASER",
    ARROW: "ARROW",
    TEXT: "TEXT",
  };
  
  export const TOOL_ACTION_TYPES = {
    NONE: "NONE",
    DRAWING: "DRAWING",
    ERASING: "ERASING",
    WRITING: "WRITING",
  };
  
  export const BOARD_ACTIONS = {
    CHANGE_TOOL: "CHANGE_TOOL",
    CHANGE_ACTION_TYPE: "CHANGE_ACTION_TYPE",
    DRAW_DOWN: "DRAW_DOWN",
    DRAW_MOVE: "DRAW_MOVE",
    DRAW_UP: "DRAW_UP",
    ERASE: "ERASE",
    CHANGE_TEXT: "CHANGE_TEXT",
    UNDO: "UNDO",
    REDO: "REDO",
  };
  
  export const TOOLBOX_ACTIONS = {
    CHANGE_STROKE: "CHANGE_STROKE",
    CHANGE_FILL: "CHANGE_FILL",
    CHANGE_SIZE: "CHANGE_SIZE",
  };
  
  export const COLORS = {
    BLACK: "#000000",
    RED: "#ff0000",
    GREEN: "#00ff00",
    BLUE: "#0000ff",
    ORANGE: "#ffa500",
    YELLOW: "#ffff00",
    WHITE: "#ffffff",
  };
  
  export const COLOR_CONFIG_TYPES = {
    STROKE: "STROKE",
    FILL: "FILL",
  };
  
  export const STROKE_TOOL_ITEMS = [
    TOOL_ITEMS.LINE,
    TOOL_ITEMS.BRUSH,
    TOOL_ITEMS.RECTANGLE,
    TOOL_ITEMS.CIRCLE,
    TOOL_ITEMS.ARROW,
    TOOL_ITEMS.TEXT,
  ];
  
  export const FILL_TOOL_ITEMS = [TOOL_ITEMS.RECTANGLE, TOOL_ITEMS.CIRCLE];
  
  export const SIZE_TOOL_ITEMS = [
    TOOL_ITEMS.LINE,
    TOOL_ITEMS.RECTANGLE,
    TOOL_ITEMS.CIRCLE,
    TOOL_ITEMS.ARROW,
    TOOL_ITEMS.TEXT,
  ];
  
  
  export const DRAW_TOOL_ITEMS = [
    TOOL_ITEMS.BRUSH,
    TOOL_ITEMS.LINE,
    TOOL_ITEMS.RECTANGLE,
    TOOL_ITEMS.CIRCLE,
    TOOL_ITEMS.ARROW,
  ];
  
  export const ARROW_LENGTH = 20;
  export const ELEMENT_ERASE_THRESHOLD = 0.1;