import React, { useEffect, useState } from "react";
import "./App.css";

let undoInterval
let redoInterval
export default function App() {
  const [points, setPoints] = useState([])
  const [undoData, setUndoData] = useState([])
  const [mousePos, setMousePos] = useState({});
  const [isDraw, setIsDraw] = useState(false);
  const [isUndo, setIsUndo] = useState(false);
  const [isRedo, setIsRedo] = useState(false);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const handleMouseMove = (event) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const keyDownHandle = event => {
    event.preventDefault();
    event.stopPropagation();
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && charCode === 'z') { if (undoData.length) setIsRedo(true) }
    else if ((event.ctrlKey || event.metaKey) && charCode === 'z') { if (points.length) setIsUndo(true) }
  }

  const keyUpHandle = () => {
    setIsUndo(false);
    setIsRedo(false);
  }

  const addPoint = () => {
    setPoints(points => [...points, { x: mousePos.x, y: mousePos.y }]);
    setUndoData([]);
  }

  useEffect(() => {
    if (isDraw) {
      addPoint();
    }
  }, [mousePos])

  const startDraw = e => {
    addPoint();
    setIsDraw(true);
  }

  const stopDraw = e => {
    setIsDraw(false);
  }

  function undoHandle() {
    const undoData = points;
    const item = undoData.pop();
    setUndoData(undoData => [...undoData, item]);
    setPoints(undoData);
    forceUpdate();
  }

  useEffect(() => {
    if (isUndo) {
      undoInterval = setInterval(() => {
        undoHandle();
        console.log('undo');
      }, 50);
    } else {
      clearInterval(undoInterval);
    }
  }, [isUndo])

  function redoHandle() {
    if (points.length) {
      const d = undoData;
      const item = d.pop();
      setPoints(points => [...points, item]);
      setUndoData(d);
      forceUpdate();
    }
  }

  useEffect(() => {
    if (isRedo) {
      redoInterval = setInterval(() => {
        redoHandle();
      }, 50);
    } else {
      clearInterval(redoInterval);
    }
  }, [isRedo])

  return (
    <>
      <header className="header">
        <button disabled={points.length === 0} onClick={undoHandle} contentEditable={false}>Undo</button>
        <button disabled={undoData.length === 0} onClick={redoHandle} contentEditable={false}>Redo</button>
      </header>
      <div className="screen"
        onMouseMove={handleMouseMove}
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onKeyDown={keyDownHandle}
        onKeyUp={keyUpHandle}
        contentEditable={true}
        suppressContentEditableWarning={true}>
        {points.map((point, key) => <div className="point" key={key} style={{ '--left': point.x + 'px', '--top': point.y + 'px' }} />)}
      </div>
    </>
  )
}
