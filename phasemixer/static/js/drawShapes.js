/************************************************************************************
 *
 * File Name  : drawShapes.js
 * Description: This file contains the functions that draw Konva shapes on the canvas
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/


/**
 * Function to draw a rectangle on the canvas
 * @param rectX
 * @param rectY
 * @param rectWidth
 * @param rectHeight
 * @param rectFill
 * @param rectDraggable
 * @param rectOpacity
 * @returns {Konva.Rect}
 **/
const drawRectangle = (
    rectX,
    rectY,
    rectWidth = 0,
    rectHeight = 0,
    rectFill = 'red',
    rectDraggable = true,
    rectOpacity = 0.5
) => {
    return new Konva.Rect({
        x: rectX,
        y: rectY,
        width: rectWidth,
        height: rectHeight,
        fill: rectFill,
        draggable: rectDraggable,
        opacity: rectOpacity,
    });
}

/**
 * Function to draw a circle on the canvas
 * @param circX
 * @param circY
 * @param circRadiusX
 * @param circRadiusY
 * @param circFill
 * @param circDraggable
 * @param circOpacity
 * @returns {Konva.Ellipse}
 **/
const drawEllipse = (
    circX,
    circY,
    circRadiusX = 0,
    circRadiusY = 0,
    circFill = 'red',
    circDraggable = true,
    circOpacity = 0.5
) => {
    return new Konva.Ellipse({
        x: circX,
        y: circY,
        radiusX: circRadiusX,
        radiusY: circRadiusY,
        fill: circFill,
        draggable: circDraggable,
        opacity: circOpacity,
    });
}

/**
 * Function to draw Image on the canvas
 * @param imgObj
 * @param imgX
 * @param imgY
 * @param imgWidth
 * @param imgHeight
 * @returns {Konva.Image}
 **/
const drawImage = (
    imgObj,
    imgX = 0,
    imgY = 0,
    imgWidth = drawingDivWidth,
    imgHeight = drawingDivHeight
) => {
    return new Konva.Image({
        x: imgX,
        y: imgY,
        image: imgObj,
        width: imgWidth,
        height: imgHeight,
    });
}
