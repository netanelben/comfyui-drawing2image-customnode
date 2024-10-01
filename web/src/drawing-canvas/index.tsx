import throttle from "throttleit";
import { useRef, useState, type ChangeEvent } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

export const DrawingCanvas = ({ uploadFile, handleGenerate }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [canvasColor, setCanvasColor] = useState("#ffffff");

  const handleStrokeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeColor(event.target.value);
  };

  const handleCanvasColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCanvasColor(event.target.value);
  };

  const handleExportImage = () => {
    canvasRef.current?.exportImage("jpeg").then((image) => {
      uploadFile(image);
      handleGenerate();
    });
  };

  const throttledExportImage = throttle(handleExportImage, 1000);

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleStrokeWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(+event.target.value);
  };

  const handleEraserWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEraserWidth(+event.target.value);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: -580,
          top: 80,
          transform: "rotate(-90deg)",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <label htmlFor="color">Pen color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={handleStrokeColorChange}
          />
          <label htmlFor="color">Background color</label>
          <input
            type="color"
            value={canvasColor}
            onChange={handleCanvasColorChange}
          />
        </div>
        <button type="button" disabled={!eraseMode} onClick={handlePenClick}>
          🖌️
        </button>
        <button type="button" disabled={eraseMode} onClick={handleEraserClick}>
          Erase
        </button>
        <label htmlFor="strokeWidth" className="form-label">
          Stroke width
        </label>
        <input
          disabled={eraseMode}
          type="range"
          className="form-range"
          min="1"
          max="20"
          step="1"
          id="strokeWidth"
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
        />
        <label htmlFor="eraserWidth" className="form-label">
          Eraser width
        </label>
        <input
          disabled={!eraseMode}
          type="range"
          className="form-range"
          min="1"
          max="30"
          step="1"
          id="eraserWidth"
          value={eraserWidth}
          onChange={handleEraserWidthChange}
        />
      </div>
      <ReactSketchCanvas
        ref={canvasRef}
        onStroke={throttledExportImage}
        strokeColor={strokeColor}
        canvasColor={canvasColor}
        strokeWidth={strokeWidth}
        eraserWidth={eraserWidth}
        width="100%"
        height="100%"
        style={{
          border: 0,
        }}
      />
    </>
  );
};
