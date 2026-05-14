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
  /** Label for the cancel button. Defaults to "Cancel". */
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
  cancelLabel = "Cancel",
  confirmVariant = "default",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    await onConfirm();
    // Always close after the promise resolves. If the caller is managing
    // loading state externally they can still prevent reopening via their own
    // onOpenChange handler, but at least the dialog won't get stuck open.
    onOpenChange(false);
  };

  // Allow Enter key to trigger confirm while the dialog is open.
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        e.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Loading..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
