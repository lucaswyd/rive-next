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
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getAllFocusableElements = () => {
      return Array.from(
        document.querySelectorAll<HTMLElement>(
          "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1']), [role='button']"
        )
      );
    };

    const updateSelectionBox = () => {
      if (elements.length > 0 && elements[currentIndex]) {
        const rect = elements[currentIndex].getBoundingClientRect();
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.top = `${rect.top + window.scrollY}px`;
          selectionBoxRef.current.style.left = `${rect.left + window.scrollX}px`;
          selectionBoxRef.current.style.width = `${rect.width}px`;
          selectionBoxRef.current.style.height = `${rect.height}px`;
        }
        setSelectedElement(elements[currentIndex]);
        elements[currentIndex].focus();
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % elements.length);
      } else if (movementX < 0 || movementY < 0) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + elements.length) % elements.length);
      }
    };

    const handleOverlayClick = () => {
      if (selectedElement) {
        selectedElement.click(); // Trigger click on the selected element
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Add event listener for overlay clicks
    const overlayElement = document.querySelector(".modalOverlay");
    overlayElement?.addEventListener("click", handleOverlayClick);

    // Update elements list and selection box on DOM changes
    const observer = new MutationObserver(() => {
      const newElements = getAllFocusableElements();
      setElements(newElements);
      updateSelectionBox();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      overlayElement?.removeEventListener("click", handleOverlayClick);
      observer.disconnect();
    };
  }, [currentIndex, elements]);

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
      <div className="modalOverlay" /> {/* Add this overlay div */}
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GT_MEASUREMENT_ID || ""} />
    </>
  );
}
