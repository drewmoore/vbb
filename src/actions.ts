'use server'

import axios from "axios"

export async function search(_whatState, formData: FormData) {
  const results = await axios.get("https://v6.vbb.transport.rest/locations", { params: { query: formData.get('query') } })

  // console.log('hello search', _whatState, formData.get('query'), results)

  return results.data
}
