import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Toaster } from "sonner";
import { Tooltip } from "react-tooltip";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import NProgress from "nprogress";
import "react-loading-skeleton/dist/skeleton.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function App({ Component, pageProps }: any) {
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const elements = useRef<NodeListOf<HTMLElement> | null>(null);
  const currentIndex = useRef<number>(0);

  const updateSelectionBox = () => {
    if (elements.current && elements.current.length > 0 && elements.current[currentIndex.current]) {
      const rect = elements.current[currentIndex.current].getBoundingClientRect();
      if (selectionBoxRef.current) {
        selectionBoxRef.current.style.display = "block";
        selectionBoxRef.current.style.top = `${rect.top + window.scrollY}px`;
        selectionBoxRef.current.style.left = `${rect.left + window.scrollX}px`;
        selectionBoxRef.current.style.width = `${rect.width}px`;
        selectionBoxRef.current.style.height = `${rect.height}px`;
      }
      setSelectedElement(elements.current[currentIndex.current]);
    } else {
      if (selectionBoxRef.current) {
        selectionBoxRef.current.style.display = "none";
      }
      setSelectedElement(null);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const movementX = e.movementX;
    const movementY = e.movementY;

    if (movementX > 0 || movementY > 0) {
      currentIndex.current = (currentIndex.current + 1) % (elements.current?.length || 0);
    } else if (movementX < 0 || movementY < 0) {
      currentIndex.current = (currentIndex.current - 1 + (elements.current?.length || 0)) % (elements.current?.length || 0);
    }

    updateSelectionBox();
  };

  const handleClick = () => {
    if (selectedElement) {
      selectedElement.click();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      elements.current = document.querySelectorAll("a[href], button, input, [role='button']");
      updateSelectionBox();

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClick);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
      };
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined') {
        elements.current = document.querySelectorAll("a[href], button, input, [role='button']");
        currentIndex.current = 0;
        updateSelectionBox();
      }
    };

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Rive</title>
        <meta name="description" content="Your Personal Streaming Oasis" />
      </Head>
      <Layout>
        <Toaster
          toastOptions={{
            className: "sooner-toast-desktop",
          }}
          position="bottom-right"
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
      <div ref={selectionBoxRef} className="selection-box" />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GT_MEASUREMENT_ID || ""} />
    </>
  );
}
