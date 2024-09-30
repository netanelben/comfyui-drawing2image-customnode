import { useRef, useState, type ChangeEvent } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

export const DrawingCanvas = ({ uploadFile }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);

  const handleExportImage = () => {
    canvasRef.current?.exportImage("jpeg").then((image) => {
      uploadFile(image);
    });
  };

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
          marginTop: "-4rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={!eraseMode}
          onClick={handlePenClick}
        >
          Pen
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={eraseMode}
          onClick={handleEraserClick}
        >
          Eraser
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
        strokeWidth={strokeWidth}
        eraserWidth={eraserWidth}
        width="100%"
        height="100%"
        canvasColor="transparent"
        strokeColor="#a855f7"
        style={{
          border: 0,
        }}
      />
      <button onClick={handleExportImage}>EXPORT</button>
    </>
  );
};
