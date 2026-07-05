"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { Expense, ExpenseCategory, Trip } from "@/lib/types";
import { getTrip, newId, saveTrip } from "@/lib/storage";
import BackLink from "@/components/BackLink";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";

const CATEGORIES: Record<ExpenseCategory, string> = {
  food: "Food",
  transpo: "Transpo",
  lodging: "Lodging",
  activities: "Activities",
  pasalubong: "Pasalubong",
};

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-card px-3 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2";

function peso(n: number): string {
  return `₱${n.toLocaleString("en-PH")}`;
}

function fundStatus(pct: number): { line: string; barClass: string } {
  if (pct >= 0.66)
    return {
      line: "Fund is healthy. Libre ka pa mag-halo-halo.",
      barClass: "bg-sea",
    };
  if (pct >= 0.33)
    return {
      line: "Kaya pa… pero dahan-dahan sa pasalubong.",
      barClass: "bg-mango",
    };
  if (pct > 0)
    return {
      line: "Tipid mode activated: kanin + shared ulam.",
      barClass: "bg-coral-deep",
    };
  return {
    line: "Fund: wala na. The ABROAD FUND stays locked a little longer.",
    barClass: "bg-danger",
  };
}

export default function BudgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);
  const [fundInput, setFundInput] = useState("");
  const [editingFund, setEditingFund] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);

  useEffect(() => {
    const t = getTrip(id) ?? null;
    setTrip(t);
    if (t?.budgetTotal) setFundInput(String(t.budgetTotal));
  }, [id]);

  if (trip === undefined)
    return (
      <main className="flex flex-1 items-center justify-center">
        <Loader />
      </main>
    );

  if (trip === null) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl text-ink">Trip not found</h1>
        <Link
          href="/trips"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-8 text-base font-extrabold text-card shadow-poster hover:bg-coral-press"
        >
          Back to your trips
        </Link>
      </main>
    );
  }

  const expenses = trip.expenses ?? [];
  const budget = trip.budgetTotal ?? 0;
  const spent = expenses.reduce((n, e) => n + e.amount, 0);
  const remaining = budget - spent;
  const pct = budget > 0 ? remaining / budget : 0;
  const status = fundStatus(pct);

  const byCategory = (Object.keys(CATEGORIES) as ExpenseCategory[])
    .map((c) => ({
      cat: c,
      total: expenses.filter((e) => e.category === c).reduce((n, e) => n + e.amount, 0),
    }))
    .filter((x) => x.total > 0);
  const maxCat = Math.max(1, ...byCategory.map((x) => x.total));

  function update(next: Trip) {
    setTrip(saveTrip(next));
  }

  function saveFund(e: React.FormEvent) {
    e.preventDefault();
    if (!trip) return;
    const n = Math.floor(Number(fundInput));
    if (!Number.isFinite(n) || n <= 0) return;
    update({ ...trip, budgetTotal: n });
    setEditingFund(false);
  }

  function addExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!trip) return;
    const n = Math.floor(Number(amount));
    if (!Number.isFinite(n) || n <= 0) {
      setFormError("Amount muna. How much did it cost?");
      return;
    }
    const expense: Expense = {
      id: newId(),
      category,
      amount: n,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    update({ ...trip, expenses: [expense, ...expenses] });
    setAmount("");
    setNote("");
    setFormError(null);
  }

  function deleteExpense() {
    if (!trip || !toDelete) return;
    update({ ...trip, expenses: expenses.filter((e) => e.id !== toDelete.id) });
    setToDelete(null);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <BackLink href={`/trips/${trip.id}`} label={trip.name} />
      <h1 className="mt-3 font-display text-3xl text-ink">₱ TRIP FUND</h1>

      <section className="mt-5 rounded-2xl border-2 border-ink bg-card p-5 shadow-poster">
        {budget === 0 || editingFund ? (
          <form onSubmit={saveFund}>
            <label htmlFor="fund" className="mb-1.5 block text-sm font-extrabold text-ink">
              {budget === 0 ? "How much is the fund for this trip?" : "Adjust the fund"}
            </label>
            <div className="flex gap-2">
              <input
                id="fund"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={fundInput}
                onChange={(e) => setFundInput(e.target.value)}
                placeholder="15000"
                className={inputCls}
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-5 text-sm font-extrabold text-card shadow-poster-sm hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
              >
                Set fund
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-extrabold text-ink">
                Remaining
                <span className={`ml-2 font-display text-2xl tabular-nums ${remaining < 0 ? "text-danger" : "text-ink"}`}>
                  {peso(remaining)}
                </span>
              </p>
              <p className="text-sm tabular-nums text-muted">
                spent {peso(spent)} of {peso(budget)}
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={budget}
              aria-valuenow={Math.max(0, remaining)}
              aria-label="Remaining trip fund"
              className="mt-3 h-5 overflow-hidden rounded-full border-2 border-ink bg-paper"
            >
              <div
                className={`h-full ${status.barClass} transition-[width] duration-300`}
                style={{ width: `${Math.max(0, Math.min(100, pct * 100))}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-body">{status.line}</p>
            <button
              type="button"
              onClick={() => setEditingFund(true)}
              className="mt-3 text-sm font-extrabold text-sea underline-offset-4 hover:underline"
            >
              Adjust fund
            </button>
          </>
        )}
      </section>

      <section className="mt-6 rounded-2xl border-2 border-ink bg-card p-5 shadow-poster-sea">
        <h2 className="text-base font-extrabold text-ink">Add an expense</h2>
        <form onSubmit={addExpense} className="mt-3">
          <fieldset>
            <legend className="mb-1.5 block text-sm font-extrabold text-ink">Category</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORIES) as ExpenseCategory[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`inline-flex h-11 items-center rounded-full border-2 border-ink px-4 text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
                    category === c ? "bg-ink text-card" : "bg-paper text-ink hover:bg-sand"
                  }`}
                >
                  {CATEGORIES[c]}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-3 grid grid-cols-[8.5rem_1fr] gap-2.5">
            <div>
              <label htmlFor="exp-amount" className="mb-1.5 block text-sm font-extrabold text-ink">
                Amount (₱)
              </label>
              <input
                id="exp-amount"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="350"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="exp-note" className="mb-1.5 block text-sm font-extrabold text-ink">
                Note <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="exp-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Lechon sa Carcar"
                maxLength={120}
                className={inputCls}
              />
            </div>
          </div>
          {formError && (
            <p role="alert" className="mt-2 text-sm font-semibold text-danger">
              {formError}
            </p>
          )}
          <button
            type="submit"
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-ink bg-coral-deep px-6 text-base font-extrabold text-card shadow-poster transition-all duration-150 hover:bg-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-poster-sm sm:w-auto"
            style={{ touchAction: "manipulation" }}
          >
            Add expense
          </button>
        </form>
      </section>

      {byCategory.length > 0 && (
        <section className="mt-6 rounded-2xl border-2 border-ink bg-card p-5 shadow-poster">
          <h2 className="text-base font-extrabold text-ink">Where it went</h2>
          <ul className="mt-3 space-y-3">
            {byCategory.map(({ cat, total }) => (
              <li key={cat}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-extrabold text-ink">{CATEGORIES[cat]}</span>
                  <span className="tabular-nums text-body">{peso(total)}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-ink bg-paper">
                  <div
                    className="h-full bg-sea"
                    style={{ width: `${(total / maxCat) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-3 text-base font-extrabold text-ink">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted">
            Wala pang gastos. Enjoy that feeling while it lasts.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {expenses.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-xl border-2 border-ink bg-card p-3">
                <span className="inline-flex shrink-0 items-center rounded-full border border-ink bg-sea-soft px-2.5 py-1 text-xs font-extrabold text-ink">
                  {CATEGORIES[e.category]}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-body">
                  {e.note ?? <span className="text-muted">·</span>}
                </p>
                <span className="shrink-0 text-sm font-extrabold tabular-nums text-ink">
                  {peso(e.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => setToDelete(e)}
                  aria-label={`Delete ${CATEGORIES[e.category]} expense of ${peso(e.amount)}`}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-danger bg-card text-danger transition-colors hover:bg-danger hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={toDelete !== null}
        title="Delete this expense?"
        body={
          toDelete
            ? `${CATEGORIES[toDelete.category]} · ${peso(toDelete.amount)}${toDelete.note ? ` · "${toDelete.note}"` : ""} goes back into the fund.`
            : ""
        }
        confirmLabel="Delete"
        danger
        onConfirm={deleteExpense}
        onClose={() => setToDelete(null)}
      />
    </main>
  );
}
