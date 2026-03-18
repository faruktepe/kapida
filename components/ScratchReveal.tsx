"use client";
import { useEffect, useRef, useState } from "react";

const BEFORE = "https://gsmpyuuiyugoifbccehx.supabase.co/storage/v1/object/public/gallery-images/before/Gemini_Generated_Image_g7kumcg7kumcg7ku.png";
const AFTER = "https://gsmpyuuiyugoifbccehx.supabase.co/storage/v1/object/public/gallery-images/after/Gemini_Generated_Image_4ndoex4ndoex4ndo.png";

export default function ScratchReveal({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const drawing = useRef(false);
  const lastPos = useRef({ x: -999, y: -999 });
  const revealedRef = useRef(false);
  const checkFrame = useRef(0);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursorCanvas = cursorRef.current;
    if (!canvas || !cursorCanvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const cctx = cursorCanvas.getContext("2d");
    if (!ctx || !cctx) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const R = isMobile ? 80 : 105;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    cursorCanvas.width = W;
    cursorCanvas.height = H;
    cursorCanvas.style.width = W + "px";
    cursorCanvas.style.height = H + "px";

    // After arka plan
    const bg = document.createElement("div");
    bg.id = "sbg";
    bg.style.cssText = `position:fixed;inset:0;z-index:58;background:#111 url('${AFTER}') center/cover no-repeat;`;
    document.body.appendChild(bg);

    // Önce siyah doldur, sonra before yükle
    ctx.fillStyle = "#160820";
    ctx.fillRect(0, 0, W, H);

    const paintBefore = (img: HTMLImageElement) => {
      ctx.globalCompositeOperation = "source-over";
      const ir = img.width / img.height;
      const sr = W / H;
      let dw, dh, dx, dy;
      if (ir > sr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0; }
      else { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
      // Koyu overlay
      ctx.fillStyle = "rgba(26,10,30,0.45)";
      ctx.fillRect(0, 0, W, H);
      // Turuncu glow
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
      g.addColorStop(0, "rgba(91,45,110,0.15)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // Silgi moduna geç
      ctx.globalCompositeOperation = "destination-out";
    };

    const img = new Image();
    img.onload = () => paintBefore(img);
    img.onerror = () => { ctx.globalCompositeOperation = "destination-out"; };
    img.src = BEFORE + "?t=" + Date.now(); // cache bust

    // Cursor
    const drawCursor = (x: number, y: number, press: boolean) => {
      cctx.clearRect(0, 0, W, H);
      cctx.beginPath();
      cctx.arc(x, y, R, 0, Math.PI * 2);
      cctx.strokeStyle = press ? "#5B2D6E" : "rgba(255,255,255,0.9)";
      cctx.lineWidth = press ? 3 : 2;
      cctx.stroke();
      cctx.beginPath();
      cctx.arc(x, y, R - 2, 0, Math.PI * 2);
      cctx.fillStyle = press ? "rgba(107,39,55,0.2)" : "rgba(255,255,255,0.05)";
      cctx.fill();
      cctx.textAlign = "center";
      cctx.textBaseline = "middle";
      cctx.fillStyle = press ? "#5B2D6E" : "rgba(255,255,255,0.9)";
      cctx.font = `bold ${isMobile ? 11 : 13}px system-ui`;
      cctx.fillText("FIRÇA", x, y);
    };

    // Her 10 frame'de check et - performans
    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();

      checkFrame.current++;
      if (checkFrame.current % 8 !== 0) return;
      if (revealedRef.current) return;

      const sw = Math.floor(W * dpr * 0.8);
      const sh = Math.floor(H * dpr * 0.8);
      const sx = Math.floor(W * dpr * 0.1);
      const sy = Math.floor(H * dpr * 0.1);
      const s = ctx.getImageData(sx, sy, sw, sh);
      let t = 0, total = 0;
      for (let i = 3; i < s.data.length; i += 20) {
        total++;
        if (s.data[i] < 100) t++;
      }
      const pct = t / total;
      if (pct > (isMobile ? 0.45 : 0.52)) {
        revealedRef.current = true;
        setTimeout(() => {
          const sbg = document.getElementById("sbg");
          if (sbg) sbg.remove();
          if (canvas) { canvas.style.opacity = "0"; canvas.style.pointerEvents = "none"; }
          if (cursorCanvas) cursorCanvas.style.opacity = "0";
          setTimeout(() => setRevealed(true), 150);
        }, 200);
      }
    };

    const getXY = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      if ("touches" in e) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
      return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      drawing.current = true;
      setStarted(true);
      const p = getXY(e);
      lastPos.current = p;
      drawCursor(p.x, p.y, true);
      scratch(p.x, p.y);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) e.preventDefault();
      const p = getXY(e);
      lastPos.current = p;
      drawCursor(p.x, p.y, drawing.current);
      if (!drawing.current) return;
      scratch(p.x, p.y);
    };

    const onUp = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      drawing.current = false;
      drawCursor(lastPos.current.x, lastPos.current.y, false);
    };

    setTimeout(() => drawCursor(W / 2, H / 2, false), 800);

    canvas.addEventListener("mousedown", onDown, { capture: true });
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp, { capture: true });
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("touchstart", onDown as EventListener, { passive: false, capture: true });
    canvas.addEventListener("touchmove", onMove as EventListener, { passive: false });
    canvas.addEventListener("touchend", onUp as EventListener, { passive: false, capture: true });

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("touchstart", onDown as EventListener);
      canvas.removeEventListener("touchmove", onMove as EventListener);
      canvas.removeEventListener("touchend", onUp as EventListener);
      document.getElementById("sbg")?.remove();
    };
  }, []);

  return (
    <div className="relative" suppressHydrationWarning>
      {children}
      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[60]"
            style={{ cursor: "none", touchAction: "none" }}
          />
          <canvas ref={cursorRef} className="fixed inset-0 z-[61] pointer-events-none" />
          {!started && (
            <div className="fixed inset-0 z-[62] flex items-end justify-center pb-20 pointer-events-none">
              <div className="flex flex-col items-center gap-2 animate-bounce">
                <div className="w-16 h-16 rounded-full border-2 border-white/60 bg-white/10 flex items-center justify-center">
                  <span className="text-white/90 text-xs font-bold tracking-wider">FIRÇA</span>
                </div>
                <p className="text-white/50 text-[11px] uppercase tracking-[0.2em]">
                  sürükle &amp; temizle
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
