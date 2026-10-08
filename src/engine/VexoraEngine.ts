<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VEXORA Engine</title>
    <style>
      :root {
        color-scheme: dark;
        --bg-1: #07111f;
        --bg-2: #0d1b2a;
        --panel: rgba(10, 18, 30, 0.72);
        --panel-border: rgba(125, 211, 252, 0.24);
        --accent: #67e8f9;
        --accent-2: #a78bfa;
        --text: #e2f3ff;
        --muted: #b5d1e6;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: radial-gradient(circle at top, #14314d 0%, var(--bg-2) 30%, var(--bg-1) 100%);
        font-family: Arial, sans-serif;
        color: var(--text);
      }

      body {
        position: relative;
      }

      #app {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
      }

      #canvas-root {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(80, 154, 255, 0.15), rgba(7, 17, 31, 0.2));
      }

      canvas {
        display: block;
        width: 100%;
        height: 100%;
        filter: saturate(1.18) contrast(1.08);
      }

      .hud {
        position: absolute;
        left: 22px;
        top: 22px;
        z-index: 20;
        background: rgba(9, 14, 22, 0.78);
        border: 1px solid var(--panel-border);
        border-radius: 16px;
        padding: 14px 16px;
        color: white;
        font-size: 14px;
        line-height: 1.5;
        box-shadow: 0 16px 24px rgba(2, 6, 23, 0.35);
        backdrop-filter: blur(10px);
      }

      .hud .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--accent);
        margin-bottom: 6px;
      }

      .hud .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent), var(--accent-2));
        box-shadow: 0 0 16px rgba(103, 232, 249, 0.8);
      }

      .hud div {
        color: var(--muted);
      }

      .hud strong {
        color: var(--text);
      }

      .controls {
        position: absolute;
        left: 22px;
        bottom: 22px;
        z-index: 20;
        background: rgba(2, 6, 23, 0.72);
        border: 1px solid rgba(103, 232, 249, 0.22);
        border-radius: 16px;
        padding: 12px 14px;
        color: var(--text);
        font-size: 12px;
        line-height: 1.8;
        box-shadow: 0 14px 22px rgba(2, 6, 23, 0.25);
        backdrop-filter: blur(8px);
      }

      .controls strong {
        color: var(--accent);
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .crosshair {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 22px;
        height: 22px;
        z-index: 10;
        pointer-events: none;
      }

      .crosshair::before,
      .crosshair::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.8);
      }

      .crosshair::before {
        width: 2px;
        height: 22px;
      }

      .crosshair::after {
        width: 22px;
        height: 2px;
      }

      .crosshair span {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid rgba(255, 255, 255, 0.85);
        background: rgba(103, 232, 249, 0.12);
      }
    </style>
  </head>
  <body>
    <div id="app">
      <div id="canvas-root"></div>

      <div class="crosshair" aria-hidden="true">
        <span></span>
      </div>

      <div class="hud">
        <div class="title"><span class="dot"></span> VEXORA</div>
        <div><strong>Engine Test</strong></div>
        <div id="fps">FPS: 60</div>
        <div id="position">Position: 0.0, 0.0, 0.0</div>
      </div>

      <div class="controls">
        <div><strong>Controls</strong></div>
        <div>W / A / S / D = Move</div>
        <div>Space = Jump</div>
        <div>Mouse = Look around</div>
      </div>
    </div>

    <script type="module" src="/src/engine/main.ts"></script>
  </body>
</html>
