import rough from "roughjs/bin/rough";
import getStroke from "perfect-freehand";
import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";
import { getArrowHeadsCoordinates, isPointCloseToLine } from "./math";

const gen = rough.generator();

export const createRoughElement = (
  index,
  x1,
  y1,
  x2,
  y2,
  { type, text, stroke, fill, size }
) => {
  let roughEle = {},
    options = {
      seed: index + 1, // seed can't be zero, isliye index+1
      strokeWidth: 3,
    };
  if (stroke && stroke.length > 0) options.stroke = stroke;
  if (fill && fill.length > 0) {
    options.fill = fill;
    options.fillStyle = "solid";
  }
  if (size) options.strokeWidth = size;
  if (type === TOOL_ITEMS.BRUSH) {
    return {
      id: index,
      points: [{ x: x1, y: y1 }],
      path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))),
      type,
      stroke,
      size,
    };
  } else if (type === TOOL_ITEMS.LINE) {
    roughEle = gen.line(x1, y1, x2, y2, options);
    return { id: index, x1, y1, x2, y2, roughEle, type, stroke, size };
  } else if (type === TOOL_ITEMS.RECTANGLE) {
    roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
    return { id: index, x1, y1, x2, y2, roughEle, type, stroke, fill, size };
  } else if (type === TOOL_ITEMS.CIRCLE) {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const width = x2 - x1,
      height = y2 - y1,
      roughEle = gen.ellipse(cx, cy, width, height, options);
    return {
      id: index,
      x1,
      y1,
      x2,
      y2,
      roughEle,
      type,
      width,
      height,
      centerX: cx,
      centerY: cy,
      stroke,
      fill,
      size,
    };
  } else if (type === TOOL_ITEMS.ARROW) {
    const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
      x1,
      y1,
      x2,
      y2,
      ARROW_LENGTH
    );
    const points = [
      [x1, y1],
      [x2, y2],
      [x3, y3],
      [x2, y2],
      [x4, y4],
    ];
    roughEle = gen.linearPath(points, options);
    return { id: index, x1, y1, x2, y2, roughEle, type, stroke, size };
  } else if (type === TOOL_ITEMS.TEXT) {
    if (!text) text = "";
    return {
      id: index,
      type,
      x1,
      y1,
      x2,
      y2,
      textEle: {
        text,
        stroke,
        size,
      },
    };
  } else {
    throw new Error(`Type not recognized ${type}`);
  }
};

export const drawElement = (roughCanvas, context, element) => {
  switch (element.type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.CIRCLE:
    case TOOL_ITEMS.ARROW:
      roughCanvas.draw(element.roughEle);
      break;
    case TOOL_ITEMS.BRUSH:
      context.fillStyle = element.stroke;
      context.fill(element.path);
      context.restore();
      break;
    case TOOL_ITEMS.TEXT:
      context.textBaseline = "top";
      context.font = `${element.textEle.size}px Caveat`;
      context.fillStyle = element.textEle.stroke;
      context.fillText(element.textEle.text, element.x1, element.y1);
      context.restore();
      break;
    default:
      throw new Error(`Type not recognized ${element.type}`);
  }
};

export const getUpdatedElements = (
  elements,
  id,
  x1,
  y1,
  x2,
  y2,
  { type, text, stroke, fill, size }
) => {
  const elementsCopy = [...elements];
  switch (type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.CIRCLE:
    case TOOL_ITEMS.ARROW:
      const { x1, y1, type, text, stroke, fill, size } = elements[id];
      elementsCopy[id] = createRoughElement(id, x1, y1, x2, y2, {
        type,
        text,
        stroke,
        fill,
        size,
      });
      return elementsCopy;
    case TOOL_ITEMS.BRUSH:
      elementsCopy[id].points = [...elements[id].points, { x: x2, y: y2 }];
      elementsCopy[id].path = new Path2D(
        getSvgPathFromStroke(getStroke(elementsCopy[id].points))
      );
      return elementsCopy;
    case TOOL_ITEMS.TEXT:
      break;
    default:
      throw new Error(`Type not recognized ${type}`);
  }
};

export const adjustElementCoordinates = (element) => {
  const { x1, y1, x2, y2 } = element;
  if (x1 < x2 || (x1 === x2 && y1 < y2)) {
    return { x1, y1, x2, y2 };
  } else {
    return { x1: x2, y1: y2, x2: x1, y2: y1 };
  }
};

export const isPointNearElement = (element, { pointX, pointY }) => {
  const { x1, y1, x2, y2, type } = element;
  const context = document.getElementById("canvas").getContext("2d");
  switch (type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.ARROW:
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
    case TOOL_ITEMS.RECTANGLE:
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
      );
    case TOOL_ITEMS.CIRCLE:
      const { centerX, centerY, width, height } = element;
      const rectx1 = centerX - width / 2,
        recty1 = centerY - height / 2;
      const rectx2 = centerX + width / 2,
        recty2 = centerY - height / 2;
      const rectx3 = centerX + width / 2,
        recty3 = centerY + height / 2;
      const rectx4 = centerX - width / 2,
        recty4 = centerY + height / 2;
      return (
        isPointCloseToLine(rectx1, recty1, rectx2, recty2, pointX, pointY) ||
        isPointCloseToLine(rectx2, recty2, rectx3, recty3, pointX, pointY) ||
        isPointCloseToLine(rectx3, recty3, rectx4, recty4, pointX, pointY) ||
        isPointCloseToLine(rectx4, recty4, rectx1, recty1, pointX, pointY)
      );
    case TOOL_ITEMS.TEXT:
      context.font = `${element.textEle.size}px Caveat`;
      context.fillStyle = element.textEle.stroke;
      const textWidth = context.measureText(element.textEle.text).width;
      const textHeight = parseInt(element.textEle.size);
      context.restore();
      return (
        isPointCloseToLine(x1, y1, x1 + textWidth, y1, pointX, pointY) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1,
          x1 + textWidth,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1 + textHeight,
          x1,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(x1, y1 + textHeight, x1, y1, pointX, pointY)
      );
    case TOOL_ITEMS.BRUSH:
      return context.isPointInPath(element.path, pointX, pointY);
    default:
      throw new Error(`Type not recognized ${type}`);
  }
};

const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};
