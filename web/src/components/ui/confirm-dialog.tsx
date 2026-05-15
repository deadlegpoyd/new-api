import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * ConfirmDialog — a reusable confirmation dialog built on top of shadcn/ui Dialog.
 *
 * Usage:
 *   <ConfirmDialog
 *     open={open}
 *     onOpenChange={setOpen}
 *     title="Delete item"
 *     description="Are you sure you want to delete this item? This action cannot be undone."
 *     onConfirm={handleDelete}
 *   />
 *
 * Personal note: changed default confirmVariant to "default" so non-destructive
 * confirmations (e.g. "Save changes") don't show up red by default. Callers that
 * need the red button should pass confirmVariant="destructive" explicitly.
 *
 * Personal note 2: bumped max-width to 480px — the default 425px felt a bit cramped
 * when description text wrapped to 3+ lines on smaller viewports.
 *
 * Personal note 3: auto-close after confirm now also fires when loading is true but
 * the promise resolves — previously the dialog would stay open forever if the caller
 * forgot to flip `loading` back to false and didn't call onOpenChange themselves.
 * Fixed by always closing after the awaited onConfirm() resolves successfully.
 *
 * Personal note 4: added keyboard shortcut — pressing Enter while the dialog is open
 * will trigger the confirm action, which feels more natural for quick confirmations.
 * Cancel still maps to Escape via the Dialog primitive's built-in behavior.
 *
 * Personal note 5: swapped button order so Cancel comes before Confirm. This matches
 * the convention I'm used to from macOS and most web apps I use daily — having the
 * destructive/primary action on the right and the safe exit on the left feels more
 * natural and reduces accidental confirmations.
 *
 * Personal note 6: changed default cancelLabel from "Cancel" to "No, go back" —
 * feels friendlier and less abrupt, especially for destructive confirm dialogs where
 * the user might have clicked confirm by accident. "Cancel" is fine for forms but
 * for "are you sure?" flows I prefer something that reads more like a reassurance.
 */

export interface ConfirmDialogProps {
  /** Controls whether the dialog is visible. */
  open: boolean;
  /** Called when the dialog requests to be closed (cancel button or overlay click). */
  onOpenChange: (open: boolean) => void;
  /** Dialog heading text. */
  title?: string;
  /** Descriptive body text shown below the title. */
  description?: string;
  /** Label for the confirm button. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "No, go back". */
  cancelLabel?: string;
  /** Variant applied to the confirm button. Defaults to "default". */
  confirmVariant?: React.ComponentProps<typeof Button>["variant"];
  /** Called when the user clicks the confirm button. */
  onConfirm: () => void | Promise<void>;
  /** Called when the user clicks the cancel button. */
  onCancel?: () => void;
  /** When true the confirm button shows a loading spinner and is disabled. */
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "No, go back",
  confirmVariant = "default",
  onConfirm,
  onCanc