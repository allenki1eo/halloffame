"use client";

import { useState } from "react";
import { useActionState } from "react";
import { categories } from "@/lib/categories";
import { submitTip, type TipFormState } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: TipFormState = {};

export function SuggestForm() {
  const [state, formAction, pending] = useActionState(submitTip, initialState);
  const [category, setCategory] = useState("");

  if (state.success) {
    return (
      <Card role="status" className="rounded-md border-primary/40 shadow-none">
        <CardContent className="space-y-4 px-6 py-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Received</p>
          <h2 className="font-display text-5xl tracking-tight">Thank you.</h2>
          <p className="max-w-xl text-lg leading-relaxed">
            Editors have this suggestion. It stays on the desk as a private note. It is not published,
            and it is not arranged against anyone else.
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {state.storage === "memory"
              ? "This server could not write the note to disk, so it is held in memory for this process only. A production edition needs a database."
              : "This preview stores the note in a file on the server. A production edition needs a database."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-6" aria-busy={pending}>
      <p className="text-muted-foreground">
        Required fields are marked. Your name and contact are optional, and they are never placed on
        the public site.
      </p>
      {state.formError ? (
        <Alert variant="destructive">
          <AlertTitle>Check the suggestion</AlertTitle>
          <AlertDescription>{state.formError}</AlertDescription>
        </Alert>
      ) : null}

      <div hidden>
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" tabIndex={-1} autoComplete="off" />
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
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-muted-foreground">(required)</span>
          </Label>
          <input type="hidden" name="category" value={category} />
          <Select value={category || undefined} onValueChange={setCategory}>
            <SelectTrigger
              id="category"
              className="h-11 w-full rounded-md text-base"
              aria-invalid={state.fieldErrors?.category ? true : undefined}
              aria-describedby={state.fieldErrors?.category ? "category-error" : undefined}
            >
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.fieldErrors?.category ? (
            <p id="category-error" className="text-sm text-destructive">
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

      <TextField
        id="workSummary"
        name="workSummary"
        label="The work editors should see"
        hint="Name a project, a practice, or a change you can point to. A few sentences is enough."
        required
        error={state.fieldErrors?.workSummary}
      />

      <TextField
        id="why"
        name="why"
        label="Why you are suggesting them"
        hint="What would a reader in Tanzania understand after spending time with this work?"
        required
        error={state.fieldErrors?.why}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="suggesterName" name="suggesterName" label="Your name" autoComplete="name" />
        <Field
          id="contact"
          name="contact"
          label="How editors can reach you"
          hint="Phone or email. Optional."
          autoComplete="on"
        />
      </div>

      <Button type="submit" size="lg" data-track="suggest" data-track-target="form" disabled={pending}>
        {pending ? "Sending…" : "Send to the editors"}
      </Button>
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
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}{" "}
        {required ? (
          <span className="text-muted-foreground">(required)</span>
        ) : (
          <span className="text-muted-foreground">(optional)</span>
        )}
      </Label>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      <Input
        id={id}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextField({
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
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required ? <span className="text-muted-foreground">(required)</span> : null}
      </Label>
      <p className="text-sm text-muted-foreground">{hint}</p>
      <Textarea
        id={id}
        name={name}
        required={required}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
