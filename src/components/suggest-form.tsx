"use client";

import { useActionState } from "react";
import { categories } from "@/lib/categories";
import { submitTip, type TipFormState } from "@/lib/actions";

const initialState: TipFormState = {};

const fieldClass =
  "mt-2 w-full rounded-md border border-line bg-paper-raised px-3 py-3 text-base text-ink outline-none";

export function SuggestForm() {
  const [state, formAction, pending] = useActionState(submitTip, initialState);

  if (state.success) {
    return (
      <div role="status" className="border border-pine bg-paper-raised px-6 py-8">
        <p className="text-xs uppercase tracking-[0.18em] text-pine">Received</p>
        <h2 className="mt-2 font-display text-4xl tracking-tight">Thank you.</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed">
          Editors have this suggestion. It stays on the desk as a private note. It is not published,
          and it is not arranged against anyone else.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          {state.storage === "memory"
            ? "This server could not write the note to disk, so it is held in memory for this process only. A production edition needs a database."
            : "This preview stores the note in a file on the server. A production edition needs a database."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" aria-busy={pending}>
      <p className="text-muted">
        Required fields are marked. Your name and contact are optional, and they are never placed on
        the public site.
      </p>
      {state.formError ? (
        <p role="alert" className="border border-clay bg-paper-raised px-4 py-3 text-clay">
          {state.formError}
        </p>
      ) : null}

      <div hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="personName"
          name="personName"
          label="Their name"
          required
          error={state.fieldErrors?.personName}
          autoComplete="off"
        />
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Category <span className="text-muted">(required)</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            aria-invalid={state.fieldErrors?.category ? true : undefined}
            aria-describedby={state.fieldErrors?.category ? "category-error" : undefined}
            className={fieldClass}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.category ? (
            <p id="category-error" className="mt-2 text-sm text-clay">
              {state.fieldErrors.category}
            </p>
          ) : null}
        </div>
      </div>

      <Field
        id="place"
        name="place"
        label="Where they work"
        required
        error={state.fieldErrors?.place}
        autoComplete="off"
      />

      <TextArea
        id="workSummary"
        name="workSummary"
        label="The work editors should see"
        hint="Name a project, a practice, or a change you can point to. A few sentences is enough."
        required
        error={state.fieldErrors?.workSummary}
      />

      <TextArea
        id="why"
        name="why"
        label="Why you are suggesting them"
        hint="What would a reader in Tanzania understand after spending time with this work?"
        required
        error={state.fieldErrors?.why}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="suggesterName"
          name="suggesterName"
          label="Your name"
          autoComplete="name"
        />
        <Field
          id="contact"
          name="contact"
          label="How editors can reach you"
          hint="Phone or email. Optional."
          autoComplete="on"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-pine px-6 text-paper hover:bg-pine-deep disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Sending…" : "Send to the editors"}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  required = false,
  error,
  hint,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}{" "}
        {required ? <span className="text-muted">(required)</span> : <span className="text-muted">(optional)</span>}
      </label>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      <input
        id={id}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextArea({
  id,
  name,
  label,
  hint,
  required,
  error,
}: {
  id: string;
  name: string;
  label: string;
  hint: string;
  required?: boolean;
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required ? <span className="text-muted">(required)</span> : null}
      </label>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
