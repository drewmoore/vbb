'use server'

import axios, { AxiosError } from "axios"

import { ApiResponse } from "@/types"

type VbbLocation = {
  type: string;
  id: number;
  address: string;
}

export async function search(_formState: ApiResponse<VbbLocation>, formData: FormData): Promise<ApiResponse<VbbLocation>> {
  try {
    const results = await axios.get("https://v6.vbb.transport.rest/locations", { params: { query: formData.get('query') } })

    // TODO: make object with either data or error, like in route search
    return { data: results.data }
  } catch (e: AxiosError | any) {
    // TODO: make log, monitor
    console.log('hello route error', e)

    // e type is AxiosError
    return { error: { status: e.response.status } }
  }
}
