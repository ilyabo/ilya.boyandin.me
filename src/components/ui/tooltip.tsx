// Adapted from shadcn/ui's Base UI Tooltip (MIT), using the site's theme.
// https://ui.shadcn.com/docs/components/base/tooltip
import { Tooltip as Primitive } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';
import './tooltip.css';

export const Tooltip = Primitive.Root;

export function TooltipContent({ anchor, id, children }: { anchor: HTMLElement; id: string; children: ReactNode }) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner anchor={anchor} side={anchor.closest('header') ? 'bottom' : 'top'} sideOffset={7} className="tooltip-positioner">
        <Primitive.Popup id={id} role="tooltip" data-slot="tooltip-content">
          {children}
          <Primitive.Arrow className="tooltip-arrow">
            <svg width="12" height="6" viewBox="0 0 12 6" aria-hidden="true"><path d="M0 0h12L6 6z" fill="currentColor" /></svg>
          </Primitive.Arrow>
        </Primitive.Popup>
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
