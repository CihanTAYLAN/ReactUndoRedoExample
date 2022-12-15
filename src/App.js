import { useState } from "react";
import "./App.css";
export default function App() {
  const [points, setPoints] = useState([])
  const [data, setData] = useState([])
  const clickHandle = e => {
    setPoints(points => [...points, { x: e.clientX, y: e.clientY }]);
    setData([]);
  }
  const keyDownHandle = event => {
    event.preventDefault();
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && charCode === 'z') if (data.length) redoHandle(event);
    else if ((event.ctrlKey || event.metaKey) && charCode === 'z') if (points.length) undoHandle(event);
  }
  const undoHandle = e => {
    e.stopPropagation();
    const data = [...points];
    const item = data.pop();
    setData(data => [...data, item]);
    setPoints(data);
  }
  const redoHandle = e => {
    e.stopPropagation();
    const d = [...data];
    const item = d.pop();
    setPoints(points => [...points, item]);
    setData(d);
  }
  return (
    <div className="screen" onClick={clickHandle} onKeyDown={keyDownHandle} contentEditable={true} suppressContentEditableWarning={true}>
      <header className="header">
        <button disabled={points.length === 0} onClick={undoHandle} contentEditable={false}>Undo</button>
        <button disabled={data.length === 0} onClick={redoHandle} contentEditable={false}>Redo</button>
      </header>
      {points.map((point, key) => <div className="point" key={key} style={{ '--left': point.x + 'px', '--top': point.y + 'px' }} />)}
    </div>
  )
}
