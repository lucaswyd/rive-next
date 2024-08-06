import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import Head from "next/head";
import Script from "next/script";
import { Toaster, toast } from "sonner";
import "@/styles/checkbox.scss";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Router from "next/router";
import { useState, useEffect, useRef } from "react";
import NProgress from "nprogress";
import "@/styles/nprogress.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const isMovingBox = useRef(false);

  NProgress.configure({ showSpinner: false });
  const GTag: any = process.env.NEXT_PUBLIC_GT_MEASUREMENT_ID;

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setIsLoading(true);
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
      NProgress.done(false);
    });

    Router.events.on("routeChangeError", () => {
      setIsLoading(false);
    });
  }, [Router]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isMovingBox.current && selectionBoxRef.current) {
        const { clientX: x, clientY: y } = event;
        const dx = x - lastMousePosition.current.x;
        const dy = y - lastMousePosition.current.y;

        lastMousePosition.current = { x, y };

        const box = selectionBoxRef.current;
        const rect = box.getBoundingClientRect();
        box.style.left = `${rect.left + dx}px`;
        box.style.top = `${rect.top + dy}px`;
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      const box = selectionBoxRef.current;
      if (box) {
        const element = document.elementFromPoint(event.clientX, event.clientY);
        if (element && (element as HTMLElement).hasAttribute("href")) {
          setFocusedElement(element as HTMLElement);
          box.style.width = `${element.clientWidth}px`;
          box.style.height = `${element.clientHeight}px`;
          const rect = element.getBoundingClientRect();
          box.style.left = `${rect.left}px`;
          box.style.top = `${rect.top}px`;
          isMovingBox.current = true;
        }
      }
    };

    const handleMouseUp = () => {
      isMovingBox.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    // Hide the cursor
    document.body.style.cursor = "none";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <Head>
        <title>Rive</title>
        <meta name="description" content="Your Personal Streaming Oasis" />
        <meta
          name="keywords"
          content="movie, streaming, tv, rive, stream. movie app, tv shows, movie download"
        />
        <meta
          name="google-site-verification"
          content="J0QUeScQSxufPJqGTaszgnI35U2jN98vVWSOkVR4HrI"
        />
        <link rel="manifest" href="manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f4f7fe" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rive" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="shortcut icon" href="/images/logo512.png" />
        <link rel="apple-touch-startup-image" href="/images/logo512.svg" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Rive" />
        <meta
          property="og:description"
          content="Your Personal Streaming Oasis"
        />
        <meta
          property="og:image"
          content="https://rivestream.live/images/MeatImage.jpg"
        />
        <meta property="og:url" content="https://rivestream.live" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rive" />

        {/* Twitter Card Meta Tags */}
        <meta
          name="twitter:card"
          content="https://rivestream.live/images/MeatImage.jpg"
        />
        <meta property="twitter:domain" content="rivestream.live" />
        <meta property="twitter:url" content="https://rivestream.live" />
        <meta name="twitter:title" content="Rive" />
        <meta
          name="twitter:description"
          content="Your Personal Streaming Oasis"
        />
        <meta
          name="twitter:image"
          content="https://rivestream.live/images/MeatImage.jpg"
        />
      </Head>
      <Layout>
        <Toaster
          toastOptions={{
            className: "sooner-toast-desktop",
          }}
          position="bottom-right"
          expand={true}
        />
        <Toaster
          toastOptions={{
            className: "sooner-toast-mobile",
          }}
          position="top-center"
        />
        <Tooltip id="tooltip" className="react-tooltip" />
        <Component {...pageProps} />
        <div
          ref={selectionBoxRef}
          className="selection-box"
          style={{
            position: "fixed",
            width: "100px",
            height: "100px",
            border: "2px solid red",
            pointerEvents: "none",
            zIndex: 9999, // Ensure it's above other elements
            background: "rgba(255, 0, 0, 0.3)", // Add some background color for visibility
            top: 0,
            left: 0,
          }}
        />
      </Layout>
      <GoogleAnalytics gaId={GTag} />
      <Script
        disable-devtool-auto
        src="https://cdn.jsdelivr.net/npm/disable-devtool"
      />
    </>
  );
}
