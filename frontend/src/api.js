// Göreli path: tarayıcı FE'nin origin'ine istek atar,
// nginx (docker/k8s) veya vite (lokal) bunu backend'e yönlendirir.
const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.status === 204 ? null : res.json()
}

export const api = {
  hello: () => request('/hello'),
  listMessages: () => request('/messages'),
  createMessage: (text) => request('/messages', { method: 'POST', body: JSON.stringify({ text }) }),
  deleteMessage: (id) => request(`/messages/${id}`, { method: 'DELETE' })
}
