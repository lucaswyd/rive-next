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

const FocusBox = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const allHrefElements = Array.from(document.querySelectorAll<HTMLElement>("[href]"));
      if (allHrefElements.length === 0) return;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      let closestElement: HTMLElement | null = null;
      let closestDistance = Infinity;

      allHrefElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(rect.left + rect.width / 2 - mouseX, 2) + // Center X of the element
          Math.pow(rect.top + rect.height / 2 - mouseY, 2) // Center Y of the element
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestElement = element;
        }
      });

      if (closestElement) {
        setFocusedElement(closestElement);
        (closestElement as HTMLElement).focus(); // Explicit cast to HTMLElement
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return focusedElement ? (
    <div
      className="focus-box"
      style={{
        position: "absolute",
        left: focusedElement.getBoundingClientRect().left,
        top: focusedElement.getBoundingClientRect().top,
        width: focusedElement.getBoundingClientRect().width,
        height: focusedElement.getBoundingClientRect().height,
        border: "2px solid #fff", // Customize border style
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  ) : null;
};

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);
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
      </Layout>
      <FocusBox />
      <GoogleAnalytics gaId={GTag} />
      <Script
        disable-devtool-auto
        src="https://cdn.jsdelivr.net/npm/disable-devtool"
      />
    </>
  );
}
