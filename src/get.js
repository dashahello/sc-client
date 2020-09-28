import { API_ROOT } from './globals';

export default async function get(url) {
  const res = await fetch(`${API_ROOT}${url}`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const jsonRes = await res.json();
  return jsonRes;
}
