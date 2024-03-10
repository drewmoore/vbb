'use server'

import axios, { AxiosError } from "axios"

import { ApiResponse } from "@/types"

type VbbLocation = {
  type: string;
  id: number;
  address: string;
}

export async function search(_formState: ApiResponse<Array<VbbLocation>>, formData: FormData): Promise<ApiResponse<Array<VbbLocation>>> {
  try {
    const results = await axios.get("https://v6.vbb.transport.rest/locations", { params: { query: formData.get('query') } })

    return { data: results.data }
  } catch (e: AxiosError | any) {
    // TODO: make log, monitor
    console.log('hello route error', e)

    return { error: { status: e.response.status } }
  }
}
