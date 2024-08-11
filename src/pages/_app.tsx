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
  const [elements, setElements] = useState<NodeListOf<HTMLElement> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const focusableSelectors = `
      a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
    `;
    setElements(document.querySelectorAll(focusableSelectors));

    const updateSelectionBox = (index: number) => {
      if (elements && elements.length > 0 && elements[index]) {
        const rect = elements[index].getBoundingClientRect();
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.display = "block"; // Show the selection box
          selectionBoxRef.current.style.top = `${rect.top + window.scrollY}px`;
          selectionBoxRef.current.style.left = `${rect.left + window.scrollX}px`;
          selectionBoxRef.current.style.width = `${rect.width}px`;
          selectionBoxRef.current.style.height = `${rect.height}px`;
        }
        setSelectedElement(elements[index]);
      } else {
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.display = "none"; // Hide the selection box if no elements found
        }
        setSelectedElement(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const movementX = e.movementX;
      const movementY = e.movementY;

      if (movementX > 0 || movementY > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (elements?.length || 0));
      } else if (movementX < 0 || movementY < 0) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (elements?.length || 0)) % (elements?.length || 0));
      }

      updateSelectionBox(currentIndex);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [elements, currentIndex]);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });

    return () => {
      Router.events.off("routeChangeStart", () => NProgress.start());
      Router.events.off("routeChangeComplete", () => NProgress.done());
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
      <div className="overlay"></div> {/* Invisible overlay */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GT_MEASUREMENT_ID || ""} />
    </>
  );
}
