# @blocdigital/usetoplayerelement

> React hook for monitoring the top layer.

## Install

```bash
npm install --save @blocdigital/usetoplayerelement
```

## Usage

### Hook usage

```tsx
import { useEffect, createPortal } from 'react';

// Hooks
import useTopLayerElement from '@blocdigital/usetoplayerelement';

export default function GreatContent({ show = false, className, children }) {
  // Get the full list of elements in the top layer
  const { topLayerList } = useTopLayerElement();

  // If there is anything in the top layer prevent scrolling
  return <SomeComponent preventScroll={Boolean(topLayerList.length)} />;
}
```

Example for moving popover element so it is always interactable and on top  
_**Warning:** It's possible to get caught in an infinite loop if multiple elements are fighting for the top spot._

```tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Hooks
import useTopLayerElement from '@blocdigital/usetoplayerelement';

export default function GreatContent({ show = false, children }) {
  // We get a ref from useTopLayerElement to do specific checks
  const { ref, isTopElement, topDialog } = useTopLayerElement();

  // Handle show/hide popover
  useEffect(() => {
    const { current: el } = ref;

    if (!el) return;

    show ? el.showPopover() : el.hidePopover();
  }, [show]);

  // Keep element on top
  useEffect(() => {
    const { current: el } = ref;

    if (!el || !show || isTopElement) return;

    // Move the popover back on top
    el.hidePopover();
    el.showPopover();
  }, [show, isTopElement]);

  return createPortal(
    <div ref={ref} popover="manual">
      {children}
    </div>,
    topDialog || document.body,
  );
}
```

#### Event

As an added bonus a `topLayer` event is now fired, you can listen for it on the document and it will tell you which element has entered or left the top layer provided the element is still in the dom. If the element is no longer in the dom the target will be document.
