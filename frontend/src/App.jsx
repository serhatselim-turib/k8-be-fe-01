import { useEffect, useState } from 'react'
import { api } from './api'

const box = { border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }

export default function App() {
  const [hello, setHello] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState(null)

  const run = async (fn) => {
    try { setError(null); await fn() } catch (e) { setError(e.message) }
  }

  const loadHello = () => run(async () => setHello(await api.hello()))
  const loadMessages = () => run(async () => setMessages(await api.listMessages()))

  useEffect(() => { loadHello(); loadMessages() }, [])

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    run(async () => { await api.createMessage(text); setText(''); await loadMessages() })
  }

  const remove = (id) => run(async () => { await api.deleteMessage(id); await loadMessages() })

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <h1>K8s Demo – React ↔ Spring Boot</h1>

      {error && <div style={{ ...box, borderColor: '#e55', color: '#b00' }}>Hata: {error}</div>}

      <div style={box}>
        <h3>GET /api/hello</h3>
        {hello ? (
          <ul>
            <li><b>Mesaj:</b> {hello.message}</li>
            <li><b>Pod/Host:</b> {hello.host}</li>
            <li><b>Env:</b> {hello.env}</li>
            <li><b>Zaman:</b> {hello.time}</li>
          </ul>
        ) : <p>Yükleniyor...</p>}
        <button onClick={loadHello}>Tekrar çağır</button>
      </div>

      <div style={box}>
        <h3>Mesajlar (/api/messages)</h3>
        <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={text} onChange={(e) => setText(e.target.value)}
                 placeholder="Mesaj yaz..." style={{ flex: 1, padding: 6 }} />
          <button type="submit">Gönder</button>
        </form>
        <ul>
          {messages.map((m) => (
            <li key={m.id}>
              #{m.id} – {m.text} <small>({new Date(m.createdAt).toLocaleTimeString()})</small>{' '}
              <button onClick={() => remove(m.id)}>Sil</button>
            </li>
          ))}
          {messages.length === 0 && <li>Henüz mesaj yok</li>}
        </ul>
      </div>
    </div>
  )
}
