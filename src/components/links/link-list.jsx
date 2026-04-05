"use client";

import { useId, useState, useTransition } from "react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderLinks, toggleLink, deleteLink, moveLinkToGroup } from "@/actions/links";
import { reorderSections } from "@/actions/link-groups";
import { LinkItem } from "./link-item";
import { LinkForm } from "./link-form";
import { GroupForm } from "./group-form";
import { GroupHeader } from "./group-header";

const UNGROUPED_ID = "__ungrouped__";

const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="5" cy="3" r="1.5" />
    <circle cx="11" cy="3" r="1.5" />
    <circle cx="5" cy="8" r="1.5" />
    <circle cx="11" cy="8" r="1.5" />
    <circle cx="5" cy="13" r="1.5" />
    <circle cx="11" cy="13" r="1.5" />
  </svg>
);

function SortableSection({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({
        dragHandleRef: setActivatorNodeRef,
        dragHandleProps: { ...attributes, ...listeners },
      })}
    </div>
  );
}

function buildSections(groups, ungroupedPosition) {
  const sections = groups.map((g) => ({ type: "group", id: g.id, position: g.position }));
  sections.push({ type: "ungrouped", id: UNGROUPED_ID, position: ungroupedPosition });
  sections.sort((a, b) => a.position - b.position);
  return sections;
}

export function LinkList({ links: initialLinks, groups: initialGroups, ungroupedPosition: initialUngroupedPos }) {
  const [links, setLinks] = useState(initialLinks);
  const [groups, setGroups] = useState(initialGroups || []);
  const [sections, setSections] = useState(() =>
    buildSections(initialGroups || [], initialUngroupedPos ?? 0)
  );
  const [isPending, startTransition] = useTransition();
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const ungroupedLinks = links.filter((l) => !l.groupId);

  // --- Section DnD ---
  function handleSectionDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(sections, oldIndex, newIndex);
    setSections(newOrder);

    startTransition(async () => {
      await reorderSections(newOrder.map((s) => s.id));
    });
  }

  // --- Link DnD within a scope ---
  function handleLinkDragEnd(event, groupId) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const scopedLinks = groupId
      ? links.filter((l) => l.groupId === groupId)
      : ungroupedLinks;

    const oldIndex = scopedLinks.findIndex((l) => l.id === active.id);
    const newIndex = scopedLinks.findIndex((l) => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(scopedLinks, oldIndex, newIndex);

    setLinks((prev) => {
      const rest = prev.filter((l) =>
        groupId ? l.groupId !== groupId : !!l.groupId
      );
      return [...rest, ...newOrder];
    });

    startTransition(async () => {
      await reorderLinks(newOrder.map((l) => l.id));
    });
  }

  // --- Link actions ---
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

  function handleMoveToGroup(linkId, groupId) {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, groupId: groupId || null } : l))
    );
    startTransition(async () => {
      await moveLinkToGroup(linkId, groupId);
    });
  }

  // --- Group actions ---
  function handleGroupAdded(newGroup) {
    setGroups((prev) => [...prev, newGroup]);
    setSections((prev) => [...prev, { type: "group", id: newGroup.id, position: prev.length }]);
  }

  function handleGroupDeleted(groupId) {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setSections((prev) => prev.filter((s) => s.id !== groupId));
    setLinks((prev) =>
      prev.map((l) => (l.groupId === groupId ? { ...l, groupId: null } : l))
    );
  }

  function handleGroupRenamed(groupId, name) {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name } : g))
    );
  }

  function renderLinkItems(filteredLinks) {
    return filteredLinks.map((link) => (
      <LinkItem
        key={link.id}
        link={link}
        groups={groups}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onMoveToGroup={handleMoveToGroup}
        disabled={isPending}
      />
    ));
  }

  const hasContent = links.length > 0 || groups.length > 0;

  return (
    <div className="space-y-6">
      <LinkForm onLinkAdded={handleLinkAdded} groups={groups} />
      <GroupForm onGroupAdded={handleGroupAdded} />

      {!hasContent ? (
        <p className="mt-8 text-center text-sm text-gray-500">
          No links yet. Add your first link above.
        </p>
      ) : (
        <DndContext
          id={`${dndId}-sections`}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section) => {
                if (section.type === "ungrouped") {
                  if (ungroupedLinks.length === 0) return null;
                  return (
                    <SortableSection key={UNGROUPED_ID} id={UNGROUPED_ID}>
                      {({ dragHandleRef, dragHandleProps }) => (
                        <div className="rounded-lg border border-dashed border-gray-200 p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <button
                              ref={dragHandleRef}
                              className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
                              {...dragHandleProps}
                            >
                              <DragIcon />
                            </button>
                            <h3 className="text-sm font-semibold text-gray-500">Ungrouped</h3>
                          </div>
                          <DndContext
                            id={`${dndId}-ungrouped`}
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleLinkDragEnd(e, null)}
                          >
                            <SortableContext
                              items={ungroupedLinks.map((l) => l.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-2">
                                {renderLinkItems(ungroupedLinks)}
                              </div>
                            </SortableContext>
                          </DndContext>
                        </div>
                      )}
                    </SortableSection>
                  );
                }

                const group = groups.find((g) => g.id === section.id);
                if (!group) return null;
                const groupLinks = links.filter((l) => l.groupId === group.id);

                return (
                  <SortableSection key={group.id} id={group.id}>
                    {({ dragHandleRef, dragHandleProps }) => (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          <button
                            ref={dragHandleRef}
                            className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
                            {...dragHandleProps}
                          >
                            <DragIcon />
                          </button>
                          <GroupHeader
                            group={group}
                            onDeleted={handleGroupDeleted}
                            onRenamed={handleGroupRenamed}
                          />
                        </div>
                        <div className="mt-2 space-y-2">
                          {groupLinks.length > 0 ? (
                            <DndContext
                              id={`${dndId}-group-${group.id}`}
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(e) => handleLinkDragEnd(e, group.id)}
                            >
                              <SortableContext
                                items={groupLinks.map((l) => l.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-2">
                                  {renderLinkItems(groupLinks)}
                                </div>
                              </SortableContext>
                            </DndContext>
                          ) : (
                            <p className="py-2 text-center text-xs text-gray-400">
                              No links in this group. Use the move button on a link to add it here.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </SortableSection>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
