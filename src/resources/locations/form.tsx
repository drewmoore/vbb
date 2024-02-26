'use client'

import { useFormState } from "react-dom"
import { useState } from 'react';

import { search } from "./actions"
import { translate } from "@/i18n"

export default function LocationForm({ onSelect }) {
  const [formState, formAction] = useFormState(search, undefined)
  const [visible, setVisible] = useState(true)

  return (
    <>
      <form action={formAction}>
        <input type="text" name="query" />
        <button type="submit">{translate("searchLocation")}</button>
      </form>

      {visible && formState &&
        <>
          <h2>{translate("searchLocationResults")}:</h2>

          <ul>
            {formState.map(location => (
              <li key={`${location.type}_${location.id}`} onClick={() => { setVisible(false); onSelect(location) }}>{location.address}</li>
            ))}
          </ul>
        </>
      }
    </>
  );
}


