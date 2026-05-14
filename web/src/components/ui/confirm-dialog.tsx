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
    // Only close automatically when not controlled externally via `loading`.
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                {confirmLabel}
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
