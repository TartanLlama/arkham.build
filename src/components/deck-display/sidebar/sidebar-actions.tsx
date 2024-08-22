import { Copy, Download, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { useStore } from "@/store";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast.hooks";
import { UpgradeModal } from "@/pages/deck-view/upgrade-modal";
import type { ResolvedDeck } from "@/store/lib/types";
import { useHotKey } from "@/utils/use-hotkey";
import css from "./sidebar.module.css";

type Props = {
  deck: ResolvedDeck;
};

export function SidebarActions(props: Props) {
  const { deck } = props;
  const toast = useToast();
  const [, setLocation] = useLocation();

  const deleteDeck = useStore((state) => state.deleteDeck);
  const deleteUpgrade = useStore((state) => state.deleteUpgrade);
  const duplicateDeck = useStore((state) => state.duplicateDeck);
  const exportJson = useStore((state) => state.exportJSON);
  const exportText = useStore((state) => state.exportText);

  const [actionsOpen, setActionsOpen] = useState(false);

  const onDelete = useCallback(async () => {
    const confirmed = confirm("Are you sure you want to delete this deck?");
    if (confirmed) {
      await deleteDeck(deck.id, toast);
      setLocation("~/");
    }
  }, [deck.id, deleteDeck, setLocation, toast]);

  const onDeleteUpgrade = useCallback(() => {
    const confirmed = confirm("Are you sure you want to delete this upgrade?");
    if (confirmed) {
      const id = deleteUpgrade(deck.id);
      setLocation(`/deck/view/${id}`);
      toast.show({
        duration: 3000,
        children: "Upgrade delete successful.",
        variant: "success",
      });
    }
  }, [deleteUpgrade, setLocation, deck.id, toast]);

  const onDuplicate = useCallback(() => {
    try {
      const id = duplicateDeck(deck.id);
      setLocation(`/deck/view/${id}`);
      toast.show({
        duration: 3000,
        children: "Deck duplicate successful.",
        variant: "success",
      });
    } catch (err) {
      toast.show({
        children: `Failed to duplicate deck: ${(err as Error)?.message}`,
        variant: "error",
      });
    }

    setActionsOpen(false);
  }, [deck.id, duplicateDeck, setLocation, toast.show]);

  const onEdit = useCallback(() => {
    setLocation(`/deck/edit/${deck.id}`);
  }, [deck.id, setLocation]);

  const onExportJson = useCallback(() => {
    try {
      exportJson(deck.id);
    } catch (err) {
      console.error(err);
      toast.show({
        duration: 3000,
        children: "Failed to export json.",
        variant: "error",
      });
    }
  }, [deck.id, exportJson, toast.show]);

  const onExportText = useCallback(() => {
    try {
      exportText(deck.id);
    } catch (err) {
      console.error(err);
      toast.show({
        children: "Failed to export markdown.",
        variant: "error",
      });
    }
  }, [deck.id, exportText, toast.show]);

  useHotKey("e", onEdit, [onEdit]);
  useHotKey("cmd+d", onDuplicate, [onDuplicate]);
  useHotKey("cmd+backspace", onDelete, [onDelete]);

  const isReadOnly = !!deck.next_deck;

  return (
    <>
      {isReadOnly && (
        <Notice variant="info">
          There is a{" "}
          <Link href={`/deck/view/${deck.next_deck}`}>newer version</Link> of
          this deck. This deck is read-only.
        </Notice>
      )}
      <div className={css["actions"]}>
        <Button
          data-testid="view-edit"
          disabled={isReadOnly}
          onClick={onEdit}
          size="full"
        >
          <Pencil /> Edit
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              data-testid="view-upgrade"
              disabled={isReadOnly}
              size="full"
            >
              <i className="icon-xp-bold" /> Upgrade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <UpgradeModal deck={deck} />
          </DialogContent>
        </Dialog>
        <Popover
          placement="bottom-start"
          open={actionsOpen}
          onOpenChange={setActionsOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="bare"
              data-testid="view-more-actions"
              tooltip="More actions"
            >
              <Ellipsis />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <DropdownMenu>
              <Button
                data-testid="view-duplicate"
                onClick={onDuplicate}
                size="full"
                variant="bare"
              >
                <Copy />
                Duplicate
              </Button>
              <hr />
              <Button
                data-testid="view-export-json"
                size="full"
                variant="bare"
                onClick={onExportJson}
              >
                <Download /> Export JSON
              </Button>
              <Button
                data-testid="view-export-text"
                size="full"
                variant="bare"
                onClick={onExportText}
              >
                <Download /> Export Markdown
              </Button>
              <hr />
              {!!deck.previous_deck && (
                <Button
                  data-testid="view-delete-upgrade"
                  disabled={isReadOnly}
                  onClick={onDeleteUpgrade}
                  size="full"
                  variant="bare"
                >
                  <i className="icon-xp-bold" /> Delete upgrade
                </Button>
              )}
              <Button
                data-testid="view-delete"
                disabled={isReadOnly}
                onClick={onDelete}
                size="full"
                variant="bare"
              >
                <Trash2 /> Delete
              </Button>
            </DropdownMenu>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
