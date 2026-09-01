# Social Network

## Run locally

Start both services from this folder with one command:

```sh
npm install
npm run dev
```

The frontend opens at `http://localhost:5173` and the backend runs at `http://localhost:4002`.

For separate terminals:

For the frontend only, run:

```sh
npm run dev
```

Then open `http://localhost:5173` (or the exact URL printed by Vite). Keep the terminal running while using the site. Vite may choose `5174` or another port only when `5173` is already occupied.

```sh
cd backend
cp .env.example .env
npm install
npm run dev
```

```sh
cd frontend
cp .env.example .env
npm install
npm run dev
```

Add your GIPHY key to `frontend/.env.local` for the chat GIF picker:

```sh
VITE_GIPHY_API_KEY=your_giphy_api_key_here
```

The frontend is available at `http://localhost:5173`, the backend at `http://localhost:4002`, and API documentation at `http://localhost:4002/api`.

`VITE_API_URL` must match the backend address. If the frontend runs from another origin, add it to `CLIENT_ORIGIN` in `backend/.env` (multiple origins may be comma-separated).
