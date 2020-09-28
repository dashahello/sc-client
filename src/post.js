import { API_ROOT } from './globals';

export default async function post(url, json) {
  const res = await fetch(`${API_ROOT}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(json)
  });

  const jsonRes = await res.json();
  return jsonRes;
}
