"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderLinks, toggleLink, deleteLink } from "@/actions/links";
import { LinkItem } from "./link-item";
import { LinkForm } from "./link-form";

export function LinkList({ links: initialLinks }) {
  const [links, setLinks] = useState(initialLinks);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const newOrder = arrayMove(links, oldIndex, newIndex);

    setLinks(newOrder);

    startTransition(async () => {
      await reorderLinks(newOrder.map((l) => l.id));
    });
  }

  function handleToggle(linkId) {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, active: !l.active } : l))
    );

    startTransition(async () => {
      await toggleLink(linkId);
    });
  }

  function handleDelete(linkId) {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));

    startTransition(async () => {
      await deleteLink(linkId);
    });
  }

  function handleLinkAdded(newLink) {
    setLinks((prev) => [...prev, { ...newLink, _count: { clicks: 0 } }]);
  }

  return (
    <div>
      <LinkForm onLinkAdded={handleLinkAdded} />

      {links.length === 0 ? (
        <p className="mt-8 text-center text-sm text-gray-500">
          No links yet. Add your first link above.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="mt-4 space-y-2">
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  disabled={isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
