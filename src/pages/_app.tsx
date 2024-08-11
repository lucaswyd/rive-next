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

  useEffect(() => {
    let elements: NodeListOf<HTMLElement> | null = document.querySelectorAll("a[href]");
    let currentIndex = 0;

    console.log("Identified elements:", elements);

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

      // Adjust the detection logic for movement direction
      if (movementX > 0 || movementY > 0) {
        currentIndex = (currentIndex + 1) % (elements?.length || 0);
      } else if (movementX < 0 || movementY < 0) {
        currentIndex = (currentIndex - 1 + (elements?.length || 0)) % (elements?.length || 0);
      }

      updateSelectionBox();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
        <title>My Next.js App</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
        <div className="overlay"></div>
        <div className="selection-box" ref={selectionBoxRef}></div>
        <Toaster />
        <Tooltip />
      </Layout>
    </>
  );
}
