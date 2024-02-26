'use client'

import { useFormState } from "react-dom"

import { search } from "@/actions"

export default function Form() {
  const [formState, formAction] = useFormState(search, undefined)

  return (
    <>
      <form action={formAction}>
        <input type="text" name="query" />
        <button type="submit">Search</button>
      </form>

      <h2>Results:</h2>

      {formState &&
        <ul>
          {formState.map(location => (
            <li key={`${location.type}_${location.id}`}>{JSON.stringify(location)}</li>
          ))}
        </ul>
      }
    </>
  );
}

