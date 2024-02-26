'use server'

import axios from "axios"

// type of formState seems to be return value
export async function search(_formState, formData: FormData) {
  const results = await axios.get("https://v6.vbb.transport.rest/locations", { params: { query: formData.get('query') } })

  // TODO: make object with either data or error, like in route search
  return results.data
}
