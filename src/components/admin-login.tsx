"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <Card className="max-w-md rounded-md shadow-none">
      <CardHeader>
        <CardTitle className="font-display text-3xl font-normal">Editor pin</CardTitle>
        <CardDescription>
          Set <code>ADMIN_PIN</code> in the environment. If it is unset, the preview pin is{" "}
          <code>tribute</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Pin</Label>
            <Input id="pin" name="pin" type="password" autoComplete="current-password" required />
          </div>
          {state.formError ? (
            <Alert variant="destructive">
              <AlertDescription>{state.formError}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Checking…" : "Open the desk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
