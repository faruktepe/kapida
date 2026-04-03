"use client";
import { useEffect, useRef, useState } from "react";

const BEFORE = "https://gsmpyuuiyugoifbccehx.supabase.co/storage/v1/object/public/gallery-images/before/1774950082758_Ekran%20Resmi%202026-03-31%2000.10.07.png";
const AFTER  = "https://gsmpyuuiyugoifbccehx.supabase.co/storage/v1/object/public/gallery-images/after/1774950082758_Ekran%20Resmi%202026-03-31%2000.10.21.png";

const REVEAL_THRESHOLD     = 0.25;
const BRUSH_RADIUS_MOBILE  = 140;
const BRUSH_RADIUS_DESKTOP = 160;

export default function ScratchReveal({ children }: { children: React.ReactNode }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const cursorRef   = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(() => { try { return sessionStorage.getItem("scratch_done") === "1"; } catch { return false; } });
  const [started,  setStarted]  = useState(false);
  const [ready,    setReady]    = useState(false); // resim yüklendi mi?
  const drawing     = useRef(false);
  const lastPos     = useRef({ x: -999, y: -999 });
  const revealedRef = useRef(false);
  const checkFrame  = useRef(0);
  const isMobileRef = useRef(false);
  const readyRef    = useRef(false); // sync ref

  useEffect(() => {
    const canvas       = canvasRef.current;
    const cursorCanvas = cursorRef.current;
    if (!canvas || !cursorCanvas) return;
    const ctx  = canvas.getContext("2d", { willReadFrequently: true });
    const cctx = cursorCanvas.getContext("2d");
    if (!ctx || !cctx) return;

    const isMobile = window.innerWidth < 768;
    isMobileRef.current = isMobile;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const R = isMobile ? BRUSH_RADIUS_MOBILE : BRUSH_RADIUS_DESKTOP;

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    cursorCanvas.width  = W;
    cursorCanvas.height = H;
    cursorCanvas.style.width  = W + "px";
    cursorCanvas.style.height = H + "px";

    // After arka plan
    const bg = document.createElement("div");
    bg.id = "sbg";
    bg.style.cssText = `position:fixed;inset:0;z-index:58;background:#160820 url('${AFTER}') center/cover no-repeat;`;
    document.body.appendChild(bg);

    // Önce koyu arka plan
    ctx.fillStyle = "#160820";
    ctx.fillRect(0, 0, W, H);

    const markReady = () => {
      readyRef.current = true;
      setReady(true);
    };

    const paintBefore = (img: HTMLImageElement) => {
      ctx.globalCompositeOperation = "source-over";
      const ir = img.width / img.height;
      const sr = W / H;
      let dw, dh, dx, dy;
      if (ir > sr) { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0; }
      else         { dw = W; dh = W / ir; dx = 0; dy = (H - dh) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.fillStyle = "rgba(26,10,30,0.45)";
      ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W*0.5);
      g.addColorStop(0, "rgba(91,45,110,0.15)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "destination-out";
      markReady(); // ← resim yüklendi, scratch aktif
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => paintBefore(img);
    img.onerror = () => {
      // Resim yüklenemese bile scratch aktif et
      ctx.globalCompositeOperation = "destination-out";
      markReady();
    };
    img.src = BEFORE + "?t=" + Date.now();

    const drawCursor = (x: number, y: number, press: boolean) => {
      cctx.clearRect(0, 0, W, H);
      cctx.beginPath();
      cctx.arc(x, y, R, 0, Math.PI * 2);
      cctx.strokeStyle = press ? "#BFA5B8" : "rgba(255,255,255,0.8)";
      cctx.lineWidth = 2;
      cctx.stroke();
      cctx.textAlign    = "center";
      cctx.textBaseline = "middle";
      cctx.fillStyle = press ? "#BFA5B8" : "rgba(255,255,255,0.8)";
      cctx.font = `bold ${isMobile ? 12 : 14}px system-ui`;
      cctx.fillText("FIRÇA", x, y);
    };

    const doReveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      const sbg = document.getElementById("sbg");
      if (sbg) {
        sbg.style.transition = "opacity 0.5s";
        sbg.style.opacity = "0";
        setTimeout(() => sbg.remove(), 500);
      }
      if (canvas) {
        canvas.style.transition = "opacity 0.5s";
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
      }
      if (cursorCanvas) {
        cursorCanvas.style.transition = "opacity 0.5s";
        cursorCanvas.style.opacity = "0";
      }
      setTimeout(() => { try { sessionStorage.setItem("scratch_done", "1"); } catch {} setRevealed(true); }, 500);
    };

    const scratch = (x: number, y: number) => {
      if (!readyRef.current) return; // resim yüklenmeden scratch yapma
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();

      checkFrame.current++;
      if (checkFrame.current % 5 !== 0) return;
      if (revealedRef.current) return;

      const sw = Math.floor(W * dpr * 0.6);
      const sh = Math.floor(H * dpr * 0.6);
      const sx = Math.floor(W * dpr * 0.2);
      const sy = Math.floor(H * dpr * 0.2);
      const s = ctx.getImageData(sx, sy, sw, sh);
      let t = 0, total = 0;
      for (let i = 3; i < s.data.length; i += 30) {
        total++;
        if (s.data[i] < 100) t++;
      }
      if (total > 0 && (t / total) > REVEAL_THRESHOLD) {
        doReveal();
      }
    };

    const getXY = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      if ("touches" in e) {
        const t = e.touches[0] || (e as TouchEvent).changedTouches?.[0];
        return { x: t.clientX - r.left, y: t.clientY - r.top };
      }
      return { x: (e as MouseEvent).clientX - r.left, y: (e as MouseEvent).clientY - r.top };
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!readyRef.current) return; // hazır değilse yok say
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
      if (readyRef.current) drawCursor(p.x, p.y, drawing.current);
      if (!drawing.current || !readyRef.current) return;
      scratch(p.x, p.y);
    };

    const onUp = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      drawing.current = false;
      if (readyRef.current) drawCursor(lastPos.current.x, lastPos.current.y, false);
    };

    setTimeout(() => {
      if (readyRef.current) drawCursor(W / 2, H / 2, false);
    }, 800);

    canvas.addEventListener("mousedown",  onDown as EventListener, { capture: true });
    canvas.addEventListener("mousemove",  onMove as EventListener);
    canvas.addEventListener("mouseup",    onUp   as EventListener, { capture: true });
    canvas.addEventListener("mouseleave", onUp   as EventListener);
    canvas.addEventListener("touchstart", onDown as EventListener, { passive: false, capture: true });
    canvas.addEventListener("touchmove",  onMove as EventListener, { passive: false });
    canvas.addEventListener("touchend",   onUp   as EventListener, { passive: false, capture: true });

    return () => {
      canvas.removeEventListener("mousedown",  onDown as EventListener);
      canvas.removeEventListener("mousemove",  onMove as EventListener);
      canvas.removeEventListener("mouseup",    onUp   as EventListener);
      canvas.removeEventListener("mouseleave", onUp   as EventListener);
      canvas.removeEventListener("touchstart", onDown as EventListener);
      canvas.removeEventListener("touchmove",  onMove as EventListener);
      canvas.removeEventListener("touchend",   onUp   as EventListener);
      document.getElementById("sbg")?.remove();
    };
  }, []);

  return (
    <div className="relative" suppressHydrationWarning>
      {children}
      {!revealed && (
        <>
          <canvas ref={canvasRef} className="fixed inset-0 z-[60]"
            style={{ cursor: "none", touchAction: "none" }} />
          <canvas ref={cursorRef} className="fixed inset-0 z-[61] pointer-events-none" />

          {/* Hazır değilken yükleniyor göstergesi */}
          {!ready && (
            <div className="fixed inset-0 z-[63] flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                  style={{borderColor:"rgba(191,165,184,0.4)", borderTopColor:"transparent"}} />
              </div>
            </div>
          )}

          {/* Hazır olunca fırça ipucu */}
          {ready && !started && (
            <div className="fixed inset-0 z-[62] flex items-end justify-center pb-20 pointer-events-none">
              <div className="flex flex-col items-center gap-3 animate-bounce">
                <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
                  style={{borderColor:"rgba(191,165,184,0.6)", background:"rgba(91,45,110,0.2)"}}>
                  <span className="text-xs font-bold tracking-wider" style={{color:"rgba(191,165,184,0.9)"}}>FIRÇA</span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{color:"rgba(191,165,184,0.5)"}}>
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
