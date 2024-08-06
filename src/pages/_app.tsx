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
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const updateSelectionBox = () => {
      if (elements && elements.length > 0 && elements[currentIndex]) {
        const rect = elements[currentIndex].getBoundingClientRect();
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.display = "block"; // Show the selection box
          selectionBoxRef.current.style.top = `${rect.top + window.scrollY}px`;
          selectionBoxRef.current.style.left = `${rect.left + window.scrollX}px`;
          selectionBoxRef.current.style.width = `${rect.width}px`;
          selectionBoxRef.current.style.height = `${rect.height}px`;
        }
        setSelectedElement(elements[currentIndex]);
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

      updateSelectionBox();
    };

    const handleClick = () => {
      if (selectedElement) {
        selectedElement.click(); // Trigger click on the selected element
      }
    };

    // Initialize elements and attach event listeners
    const updateElements = () => {
      setElements(document.querySelectorAll("a[href]")); // Update the list of elements
    };
    updateElements();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Clean up event listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
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
        {/* Add other meta tags as needed */}
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
