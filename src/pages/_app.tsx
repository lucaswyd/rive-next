import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import Head from "next/head";
import Script from "next/script";
import { Toaster, toast } from "sonner";
import "@/styles/checkbox.scss";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Router from "next/router";
import { useState, useEffect } from "react";
import NProgress from "nprogress";
import "@/styles/nprogress.scss";
import "react-loading-skeleton/dist/skeleton.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  let lastX = 0;
  let lastY = 0;

  NProgress.configure({ showSpinner: false });
  const GTag: any = process.env.NEXT_PUBLIC_GT_MEASUREMENT_ID;

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
      NProgress.done(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const xDiff = event.clientX - lastX;
      const yDiff = event.clientY - lastY;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // Horizontal movement
        if (xDiff > 0) {
          moveBox("right");
        } else {
          moveBox("left");
        }
      } else {
        // Vertical movement
        if (yDiff > 0) {
          moveBox("down");
        } else {
          moveBox("up");
        }
      }

      lastX = event.clientX;
      lastY = event.clientY;
    };

    const moveBox = (direction: "up" | "down" | "left" | "right") => {
      if (focusedElement) {
        const elements = Array.from(document.querySelectorAll("a, button, [href]")).filter(el => el !== focusedElement) as HTMLElement[];

        const { top, left, right, bottom } = focusedElement.getBoundingClientRect();

        let closestElement: HTMLElement | null = null;
        let minDistance = Infinity;

        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          let distance = Infinity;

          switch (direction) {
            case "right":
              if (rect.left > right) {
                distance = rect.left - right;
              }
              break;
            case "left":
              if (rect.right < left) {
                distance = left - rect.right;
              }
              break;
            case "down":
              if (rect.top > bottom) {
                distance = rect.top - bottom;
              }
              break;
            case "up":
              if (rect.bottom < top) {
                distance = top - rect.bottom;
              }
              break;
          }

          if (distance < minDistance) {
            minDistance = distance;
            closestElement = el;
          }
        });

        if (closestElement) {
          setFocusedElement(closestElement);
          const { top, left } = closestElement.getBoundingClientRect();
          setSelectionBox({ top, left });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [focusedElement]);

  useEffect(() => {
    const disableContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      toast.info("Context Menu has been disabled");
    };

    const disableDevToolsShortcut = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey && event.shiftKey && event.key === "I") ||
        (event.ctrlKey && event.shiftKey && event.key === "J") ||
        (event.ctrlKey && event.shiftKey && event.key === "C") ||
        event.key === "F12"
      ) {
        event.preventDefault();
        toast.info("Dev Tools has been disabled");
      }
    };

    window.addEventListener("contextmenu", disableContextMenu);
    window.addEventListener("keydown", disableDevToolsShortcut);

    return () => {
      window.removeEventListener("contextmenu", disableContextMenu);
      window.removeEventListener("keydown", disableDevToolsShortcut);
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
        {focusedElement && (
          <div
            className="selection-box"
            style={{ top: `${selectionBox.top}px`, left: `${selectionBox.left}px` }}
          />
        )}
      </Layout>
      <GoogleAnalytics gaId={GTag} />
      <Script
        disable-devtool-auto
        src="https://cdn.jsdelivr.net/npm/disable-devtool"
      />
    </>
  );
}
