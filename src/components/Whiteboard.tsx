 
import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://skilltenso.onrender.com');

interface WhiteboardProps {
  onClose: () => void;
  user: { id: number; name: string; email: string };
}

function Whiteboard({ onClose, user }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#a855f7');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f0a28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    socket.on('draw-data', (data: any) => {
      drawLine(ctx, data.x1, data.y1, data.x2, data.y2, data.color, data.size);
    });

    socket.on('clear-board', () => {
      ctx.fillStyle = '#0f0a28';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('draw-data');
      socket.off('clear-board');
    };
  }, []);

  function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, strokeColor: string, size: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top
    };
  }

  function startDraw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    lastPos.current = getPos(e);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing || !lastPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    const strokeColor = tool === 'eraser' ? '#0f0a28' : color;
    const size = tool === 'eraser' ? 20 : brushSize;

    drawLine(ctx, lastPos.current.x, lastPos.current.y, pos.x, pos.y, strokeColor, size);

    socket.emit('draw-data', {
      x1: lastPos.current.x,
      y1: lastPos.current.y,
      x2: pos.x,
      y2: pos.y,
      color: strokeColor,
      size
    });

    lastPos.current = pos;
  }

  function stopDraw() {
    setIsDrawing(false);
    lastPos.current = null;
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f0a28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-board');
  }

  const colors = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ffffff', '#000000'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3"
        style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 className="text-white font-semibold text-lg">🎨 Collaborative Whiteboard</h2>

        {/* Tools */}
        <div className="flex items-center gap-4">
          {/* Colors */}
          <div className="flex gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => { setColor(c); setTool('pen'); }}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{ background: c, border: color === c && tool === 'pen' ? '3px solid white' : '2px solid rgba(255,255,255,0.3)' }} />
            ))}
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">Size:</span>
            <input type="range" min="1" max="20" value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20" />
            <span className="text-white text-xs">{brushSize}</span>
          </div>

          {/* Tool buttons */}
          <button onClick={() => setTool('pen')}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
            style={{ background: tool === 'pen' ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            ✏️ Pen
          </button>
          <button onClick={() => setTool('eraser')}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
            style={{ background: tool === 'eraser' ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            🧹 Eraser
          </button>
          <button onClick={clearBoard}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(239,68,68,0.3)', color: 'white', border: '1px solid rgba(239,68,68,0.5)' }}>
            🗑️ Clear
          </button>
          <button onClick={onClose}
            className="px-3 py-1 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
            ✕ Close
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          width={1200}
          height={650}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="rounded-xl"
          style={{
            cursor: tool === 'eraser' ? 'cell' : 'crosshair',
            maxWidth: '100%',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />
      </div>
    </div>
  );
}

export default Whiteboard;