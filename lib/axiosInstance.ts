import axios from "axios";
import { headers } from "next/headers";

export async function createAxiosInstance() {
  return axios.create({
    withCredentials: true,
    headers: {
      Cookie: (await headers()).get("cookie") || "",
    },
  });
}
