import React, { useContext } from 'react'
import { COLORS, FILL_TOOL_ITEMS, STROKE_TOOL_ITEMS, SIZE_TOOL_ITEMS, TOOL_ITEMS } from '../../constants'
import cx from "classnames";
import toolboxContext from '../../store/toolbox-context';
import boardContext from '../../store/board-context';
import classes from "./index.module.css"


const Toolbox = () => {
    const {activeToolItem} = useContext(boardContext);
    const {toolboxState, changeStroke, changeFill, changeSize} = useContext(toolboxContext);

    const strokeColor = toolboxState[activeToolItem]?.stroke;
    const fillColor = toolboxState[activeToolItem]?.fill;
    const size =  toolboxState[activeToolItem]?.size;


  return (
    <div className={classes.container}>
        {STROKE_TOOL_ITEMS.includes(activeToolItem) && <div className={classes.selecOptionContainer}>
            <div className={classes.toolBoxLabel}>Stroke Color</div>
                <div className={classes.colorsContainer}>
                    <div>
                        <input
                            className={classes.colorPicker}
                            type="color"
                            value={strokeColor}
                            onChange={(event) => changeStroke(activeToolItem, event.target.value)}
                        >
                        </input>
                    </div>
                    {Object.keys(COLORS).map((k) => {
                        return (
                            <div
                                key = {k}
                                className={cx(classes.colorBox, {
                                    [classes.activeColorBox]: strokeColor===COLORS[k]})}
                                style={{backgroundColor: COLORS[k]}}
                                onClick={() => {
                                   changeStroke(activeToolItem, COLORS[k]) 
                                }}
                                >
                            </div>
                        )
                    })}
                </div>
        </div>}
        {FILL_TOOL_ITEMS.includes(activeToolItem) && <div className={classes.selecOptionContainer}>
            <div className={classes.toolBoxLabel}>Fill Color</div>
                <div className={classes.colorsContainer}>   
                {fillColor === null ? <div
                    className={cx(classes.colorPicker, classes.noFillColorBox)}
                    onClick={() => changeFill(activeToolItem, COLORS.BLACK)}
                ></div> : <div>
                    <input
                        className={classes.colorPicker}
                        type="color"
                        value={fillColor}
                        onChange={(event) => changeFill(activeToolItem, event.target.value)}
                    >
                    </input>
                    </div>}
                    
                    <div
                        className={cx(classes.colorBox, classes.noFillColorBox, {
                        [classes.activeColorBox]: fillColor===null})}
                        onClick={() => changeFill(activeToolItem, null)}
                    ></div>

                        {Object.keys(COLORS).map((k) => {
                            return (
                                <div
                                    key = {k}
                                    className={cx(classes.colorBox, {
                                        [classes.activeColorBox]: fillColor===COLORS[k]})}
                                    style={{backgroundColor: COLORS[k]}}
                                    onClick={() => {
                                    changeFill(activeToolItem, COLORS[k]) 
                                    }}
                                    >
                                </div>
                            )
                        })}
                        </div>
                    </div>}
                    {SIZE_TOOL_ITEMS.includes(activeToolItem) && <div className={classes.selecOptionContainer}>
                        <div className={classes.toolBoxLabel}>{activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}</div>
                            <div className={classes.colorsContainer}>
                                <input 
                                    type = "range"
                                    min = {activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
                                    max = {activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
                                    step={1}
                                    value={size}
                                    onChange={(event) => changeSize(activeToolItem, event.target.value)}
                                ></input>
                            </div>
                    </div>}
                </div>
  )
}

export default Toolbox;