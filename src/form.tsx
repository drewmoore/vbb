'use client'

import { useFormState } from "react-dom"
import { useState } from 'react';

import { search } from "@/actions"
import LocationForm from "@/resources/locations/form"
import { translate } from "@/i18n"

export default function Form() {
  const [formState, formAction] = useFormState(search, undefined)
  const [from, setFrom] = useState({ address: null })
  const [to, setTo] = useState({ address: null })

  console.log('hello form', formState?.data?.journeys)

  return (
    <>
      {translate("from")}: <LocationForm onSelect={setFrom} />
      {from && <div>{from.address}</div>}

      {translate("to")}: <LocationForm onSelect={setTo} />
      {to && <div>{to.address}</div>}

      {from && to &&
        <form action={formAction}>
          <input type="hidden" name="from" value={JSON.stringify(from)} />
          <input type="hidden" name="to" value={JSON.stringify(to)} />
          <button type="submit">{translate("searchRoute")}</button>
        </form>
      }

      {formState?.error &&
        <i>{translate("error", { status: formState.error.status })}</i>
      }

      {formState?.data &&
        <ul>
          {formState.data.journeys.map((journey) => (
            <li key={journey.refreshToken}>
              {journey.legs[0].origin.address} {`->`} {journey.legs[journey.legs.length - 1].origin.name}
              <ul>
                {journey.legs.map(leg => (
                  <li key={`${leg.origin.id}_${leg.destination.id}`}>
                    <ul>
                      <li>Origin:</li>
                      <li>Type: {leg.origin.type}</li>
                      <li>Name: {leg.origin.name}</li>
                      <li>Address: {leg.origin.address}</li>
                    </ul>

                    <ul>
                      <li>Destination:</li>
                      <li>Type: {leg.destination.type}</li>
                      <li>Name: {leg.destination.name}</li>
                      <li>Address: {leg.destination.address}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      }
    </>
  )
}
