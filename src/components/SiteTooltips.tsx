import { useEffect, useId, useState } from 'react';
import { Tooltip, TooltipContent } from './ui/tooltip';

// A shared popup can anchor to the server-rendered Astro controls without replacing them.
export default function SiteTooltips() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    let timer: number;
    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    const trigger = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>('[data-tooltip]') : null;
    function close() {
      window.clearTimeout(timer);
      setAnchor(null);
    }
    // The pointer may already be over a control when this island hydrates.
    if (window.matchMedia('(any-hover: hover)').matches) {
      const hovered = document.querySelector<HTMLElement>('[data-tooltip]:hover');
      if (hovered) timer = window.setTimeout(() => setAnchor(hovered), 300);
    }
    document.addEventListener('pointerover', event => {
      const next = trigger(event.target);
      if (event.pointerType === 'touch' || !next || next === trigger(event.relatedTarget)) return;
      close();
      timer = window.setTimeout(() => setAnchor(next), 300);
    }, options);
    document.addEventListener('pointerout', event => {
      if (trigger(event.target) !== trigger(event.relatedTarget)) close();
    }, options);
    document.addEventListener('focusin', event => {
      const next = trigger(event.target);
      if (next && event.target instanceof Element && event.target.matches(':focus-visible')) {
        window.clearTimeout(timer);
        setAnchor(next);
      }
    }, options);
    document.addEventListener('focusout', close, options);
    document.addEventListener('pointerdown', close, options);
    document.addEventListener('click', close, options);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); }, options);
    document.addEventListener('astro:before-swap', close, options);
    window.addEventListener('blur', close, options);
    return () => {
      listeners.abort();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!anchor) return;
    const control = anchor instanceof HTMLLabelElement ? anchor.control ?? anchor : anchor;
    const previous = control.getAttribute('aria-describedby');
    control.setAttribute('aria-describedby', [previous, id].filter(Boolean).join(' '));
    return () => {
      if (previous) control.setAttribute('aria-describedby', previous);
      else control.removeAttribute('aria-describedby');
    };
  }, [anchor, id]);

  return (
    <Tooltip open={!!anchor} onOpenChange={open => { if (!open) setAnchor(null); }}>
      {anchor && <TooltipContent anchor={anchor} id={id}>{anchor.dataset.tooltip}</TooltipContent>}
    </Tooltip>
  );
}
