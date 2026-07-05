"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Stop } from "@/lib/types";
import { newId } from "@/lib/storage";

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-card px-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2";

const iconBtnCls =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-card text-ink transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-40 disabled:hover:bg-card";

function Chevron({ dir }: { dir: "up" | "down" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      {dir === "up" ? <path d="m18 15-6-6-6 6" /> : <path d="m6 9 6 6 6-6" />}
    </svg>
  );
}

function StopRow({
  stop,
  index,
  count,
  onMove,
  onDelete,
}: {
  stop: Stop;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stop.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border-2 border-ink bg-card p-3 ${isDragging ? "z-10 shadow-poster" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${stop.title}`}
          className={`${iconBtnCls} cursor-grab touch-none active:cursor-grabbing`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-5 w-5">
            <path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" />
          </svg>
        </button>
        <div className="min-w-0 flex-1 pt-1">
          <p className="font-extrabold text-ink">
            {stop.time && (
              <span className="mr-2 tabular-nums text-coral-deep">{stop.time}</span>
            )}
            {stop.title}
          </p>
          {stop.note && (
            <p className="mt-0.5 text-sm leading-relaxed text-body">{stop.note}</p>
          )}
          {stop.placeName && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate">{stop.placeName}</span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            aria-label={`Move ${stop.title} earlier`}
            className={iconBtnCls}
          >
            <Chevron dir="up" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={index === count - 1}
            aria-label={`Move ${stop.title} later`}
            className={iconBtnCls}
          >
            <Chevron dir="down" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(stop.id)}
            aria-label={`Delete ${stop.title}`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-danger bg-card text-danger transition-colors hover:bg-danger hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
              <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

export default function DayStops({
  stops,
  onChange,
}: {
  stops: Stop[];
  onChange: (stops: Stop[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function move(from: number, to: number) {
    if (to < 0 || to >= stops.length) return;
    onChange(arrayMove(stops, from, to));
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = stops.findIndex((s) => s.id === active.id);
    const to = stops.findIndex((s) => s.id === over.id);
    if (from !== -1 && to !== -1) onChange(arrayMove(stops, from, to));
  }

  function remove(id: string) {
    const stop = stops.find((s) => s.id === id);
    if (!stop) return;
    if (!window.confirm(`Remove "${stop.title}" from this day?`)) return;
    onChange(stops.filter((s) => s.id !== id));
  }

  function addStop(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onChange([
      ...stops,
      {
        id: newId(),
        title: trimmed,
        time: time || undefined,
        note: note.trim() || undefined,
      },
    ]);
    setTitle("");
    setTime("");
    setNote("");
    setAdding(false);
  }

  return (
    <div>
      {stops.length === 0 && !adding && (
        <p className="text-sm text-muted">
          Free day pa ni. Add the first stop.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2.5">
            {stops.map((stop, i) => (
              <StopRow
                key={stop.id}
                stop={stop}
                index={i}
                count={stops.length}
                onMove={move}
                onDelete={remove}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {adding ? (
        <form onSubmit={addStop} className="mt-3 rounded-xl border-2 border-ink bg-sand p-3">
          <label htmlFor={`stop-title`} className="mb-1.5 block text-sm font-extrabold text-ink">
            What&apos;s the stop?
          </label>
          <input
            id="stop-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kawasan Falls"
            maxLength={120}
            autoFocus
            className={inputCls}
          />
          <div className="mt-2.5 grid grid-cols-[8.5rem_1fr] gap-2.5">
            <div>
              <label htmlFor="stop-time" className="mb-1.5 block text-sm font-extrabold text-ink">
                Time <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="stop-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="stop-note" className="mb-1.5 block text-sm font-extrabold text-ink">
                Note <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="stop-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bring aqua shoes"
                maxLength={200}
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border-2 border-ink bg-sea px-5 text-sm font-extrabold text-card shadow-poster-sm transition-colors hover:bg-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Add stop
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="inline-flex h-11 items-center justify-center rounded-full border-2 border-ink bg-card px-5 text-sm font-extrabold text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-ink bg-card px-5 text-sm font-extrabold text-ink transition-colors hover:bg-sea-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add stop
        </button>
      )}
    </div>
  );
}
