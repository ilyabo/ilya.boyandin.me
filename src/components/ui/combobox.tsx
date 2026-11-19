// Adapted from shadcn/ui's Base UI Combobox (MIT), using the site's theme.
// https://ui.shadcn.com/docs/components/base/combobox
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import './combobox.css';

export const Combobox = ComboboxPrimitive.Root;
export const ComboboxValue = ComboboxPrimitive.Value;

export function CloseIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  );
}

export function ComboboxContent({
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props & Pick<ComboboxPrimitive.Positioner.Props, 'anchor'>) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner anchor={anchor} sideOffset={6} align="start" className="combobox-positioner">
        <ComboboxPrimitive.Popup data-slot="combobox-content" {...props} />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

export function ComboboxList(props: ComboboxPrimitive.List.Props) {
  return <ComboboxPrimitive.List data-slot="combobox-list" {...props} />;
}

export function ComboboxEmpty(props: ComboboxPrimitive.Empty.Props) {
  return <ComboboxPrimitive.Empty data-slot="combobox-empty" {...props} />;
}

export function ComboboxItem({ children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item data-slot="combobox-item" {...props}>
      {children}
      <ComboboxPrimitive.ItemIndicator className="combobox-indicator">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m5 12 4 4L19 6" />
        </svg>
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

export function ComboboxChips(props: ComboboxPrimitive.Chips.Props) {
  return <ComboboxPrimitive.Chips data-slot="combobox-chips" {...props} />;
}

export function ComboboxChip({ children, ...props }: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip data-slot="combobox-chip" {...props}>
      {children}
      <ComboboxPrimitive.ChipRemove data-slot="combobox-chip-remove" aria-label={`Remove ${children}`}>
        <CloseIcon />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  );
}

export function ComboboxChipsInput(props: ComboboxPrimitive.Input.Props) {
  return <ComboboxPrimitive.Input data-slot="combobox-chips-input" {...props} />;
}
