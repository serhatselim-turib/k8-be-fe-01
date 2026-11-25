# K8s Demo – Spring Boot + React

```
Tarayıcı ──► frontend (nginx :80) ──/api/*──► backend (Spring Boot :8080)
```

FE `/api/...` göreli path'ine istek atar; nginx bunu `BACKEND_URL`'e proxy'ler.
Bu yüzden CORS gerekmez ve backend adresi FE build'ine gömülmez (runtime env).

## Endpoint'ler (backend)

| Method | Path                         | Açıklama                              |
|--------|------------------------------|---------------------------------------|
| GET    | `/api/hello`                 | Selam + cevap veren pod/host adı      |
| GET    | `/api/messages`              | Mesaj listesi (in-memory)             |
| POST   | `/api/messages`              | `{"text":"..."}` ile mesaj ekler      |
| DELETE | `/api/messages/{id}`         | Mesaj siler                           |
| GET    | `/actuator/health/liveness`  | K8s liveness probe                    |
| GET    | `/actuator/health/readiness` | K8s readiness probe                   |

> Not: Mesajlar pod belleğinde tutulur. Backend 2 replica çalıştığı için
> k8s'de liste pod'a göre farklı görünebilir — load balancing'i görmek için bilinçli bırakıldı.
> `/api/hello`'yu birkaç kez çağırıp `host` değerinin değiştiğini görebilirsin.

## 1) Lokal (Docker'sız)

```bash
cd backend && mvn spring-boot:run          # :8080
cd frontend && npm install && npm run dev  # :5173  (vite /api'yi 8080'e proxy'ler)
```

## 2) Docker Compose

```bash
docker compose up --build
```
- FE: http://localhost:3000
- BE: http://localhost:8080/api/hello

## 3) Kubernetes (Docker Desktop K8s / minikube / kind)

```bash
docker build -t demo-backend:latest ./backend
docker build -t demo-frontend:latest ./frontend

# minikube:  minikube image load demo-backend:latest && minikube image load demo-frontend:latest
# kind:      kind load docker-image demo-backend:latest demo-frontend:latest

kubectl apply -f k8s/00-namespace.yaml -f k8s/10-backend.yaml -f k8s/20-frontend.yaml
kubectl -n demo get pods -w
```

- FE: http://localhost:30080 (minikube: `minikube service demo-frontend -n demo`)
- Port-forward alternatifi: `kubectl -n demo port-forward svc/demo-frontend 8081:80`

Haberleşmeyi cluster içinden test:
```bash
kubectl -n demo run curl --rm -it --image=curlimages/curl -- curl http://demo-backend:8080/api/hello
```

Temizlik: `kubectl delete ns demo`
