"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/actions";

const initialState: LoginState = {};

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4 border border-line bg-paper-raised p-6">
      <div>
        <label htmlFor="pin" className="text-sm font-medium">
          Editor pin
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-3"
        />
      </div>
      {state.formError ? (
        <p role="alert" className="text-sm text-clay">
          {state.formError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-pine px-5 text-paper hover:bg-pine-deep disabled:opacity-70"
      >
        {pending ? "Checking…" : "Open the desk"}
      </button>
      <p className="text-sm text-muted">
        Set <code>ADMIN_PIN</code> in the environment. If it is unset, the preview pin is{" "}
        <code>tribute</code>.
      </p>
    </form>
  );
}
