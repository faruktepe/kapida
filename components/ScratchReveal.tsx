"use client";
import { useEffect, useRef, useState } from "react";

const BEFORE = "https://gsmpyuuiyugoifbccehx.supabase.co/storage/v1/object/public/gallery-images/before/Gemini_Generated_Image_g7kumcg7kumcg7ku.png";
const AFTER  = "https://gsmpyuuiyugoifbccehx.supabase.co/storage/v1/object/public/gallery-images/after/Gemini_Generated_Image_4ndoex4ndoex4ndo.png";

const REVEAL_THRESHOLD   = 0.08;
const BRUSH_RADIUS_MOBILE  = 140;
const BRUSH_RADIUS_DESKTOP = 160;

export default function ScratchReveal({ children }: { children: React.ReactNode }) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const cursorRef  = useRef<HTMLCanvasElement>(null);
    const [revealed, setRevealed] = useState(false);
    const [started,  setStarted]  = useState(false);
    const drawing        = useRef(false);
    const lastPos        = useRef({ x: -999, y: -999 });
    const revealedRef    = useRef(false);
    const totalScratched = useRef(0);
    const isMobileRef    = useRef(false);

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
        const W   = window.innerWidth;
        const H   = window.innerHeight;
        const R   = isMobile ? BRUSH_RADIUS_MOBILE : BRUSH_RADIUS_DESKTOP;

                canvas.width        = W * dpr;
        canvas.height       = H * dpr;
        canvas.style.width  = W + "px";
        canvas.style.height = H + "px";
        ctx.scale(dpr, dpr);

                cursorCanvas.width        = W;
        cursorCanvas.height       = H;
        cursorCanvas.style.width  = W + "px";
        cursorCanvas.style.height = H + "px";

                const bg = document.createElement("div");
        bg.id = "sbg";
        bg.style.cssText = `position:fixed;inset:0;z-index:58;background:#160820 url('${AFTER}') center/cover no-repeat;`;
        document.body.appendChild(bg);

                ctx.fillStyle = "#160820";
        ctx.fillRect(0, 0, W, H);

                const paintBefore = (img: HTMLImageElement) => {
                        ctx.globalCompositeOperation = "source-over";
                        const ir = img.width / img.height;
                        const sr = W / H;
                        let dw, dh, dx, dy;
                        if (ir > 
