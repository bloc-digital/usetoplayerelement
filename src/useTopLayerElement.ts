import { useEffect, useMemo, useRef, useState } from "react";

const topLayerElements = new Set<HTMLElement>();

// Custom event to notify elements when they are added/removed from the top layer
const topLayerEvent = (inTopLayer: boolean) =>
  new CustomEvent("topLayer", { bubbles: true, detail: { inTopLayer } });

if (typeof document !== "undefined") {
  // Listen for elements being added/removed from the top layer
  document.addEventListener(
    "toggle",
    ({ target }) => {
      if (!target) return;

      const el = target as HTMLElement;

      if (!(el instanceof HTMLDialogElement || el.hasAttribute("popover")))
        return;

      if (el.matches(":modal, :popover-open") && document.contains(el)) {
        topLayerElements.add(el);
        el.dispatchEvent(topLayerEvent(true));
      } else {
        if (topLayerElements.delete(el)) el.dispatchEvent(topLayerEvent(false));
      }
    },
    { capture: true }
  );

  // MutationObserver for automatic cleanup
  const observer = new MutationObserver((mutations) => {
    const nodes = mutations.flatMap(({ removedNodes }) =>
      Array.from(removedNodes).filter((node) => node instanceof HTMLElement),
    );

    for (const node of nodes)
      if (topLayerElements.delete(node))
        document.dispatchEvent(topLayerEvent(false));
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export interface useTopLayerElementsReturn {
  ref: React.RefObject<HTMLElement | null>;
  topElement: HTMLElement | null;
  topDialog: HTMLElement | null;
  isInTopLayer: boolean;
  isTopElement: boolean;
  topLayerList: HTMLElement[];
}

export default function useTopLayerElements(): useTopLayerElementsReturn {
  const ref = useRef<HTMLElement | null>(null);
  const [topLayerList, setTopLayerList] = useState<HTMLElement[]>([
    ...topLayerElements,
  ]);

  const derivedState = useMemo(() => {
    const topElement = topLayerList.length ? topLayerList.at(-1) || null : null;
    const topDialog =
      topLayerList.findLast((el) => el.tagName === "DIALOG") || null;
    const isTopElement = ref.current ? topElement === ref.current : false;
    const isInTopLayer = ref.current
      ? topLayerList.includes(ref.current)
      : false;

    return { topElement, topDialog, isTopElement, isInTopLayer };
  }, [topLayerList]);

  // Listen for top layer changes
  useEffect(() => {
    const ac = new AbortController();

    document.addEventListener(
      "topLayer",
      () => setTopLayerList([...topLayerElements]),
      { signal: ac.signal }
    );

    return () => ac.abort();
  }, []);

  return useMemo<useTopLayerElementsReturn>(
    () => ({ ref, ...derivedState, topLayerList }),
    [derivedState, topLayerList]
  );
}
