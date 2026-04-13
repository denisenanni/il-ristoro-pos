# Il Ristoro POS

Staff-facing tablet POS for taking orders, calculating bills, and printing kitchen + customer receipts.

> **This is separate from the customer-facing PWA.** This app is for staff only.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (`@tailwindcss/vite`)
- Local state via React hooks
- Order history in `localStorage`

## Running Locally

```bash
yarn install
yarn dev
```

Opens at `http://localhost:3001`

## Testing on a Tablet

When the dev server starts, Vite exposes the app on your local network:

```
➜  Network: http://192.168.x.x:3001/
```

Open that URL on any tablet on the same Wi-Fi network. Works best in landscape mode, added to home screen as a PWA.

## Project Structure

```
src/
├── components/       # UI components
│   ├── Header.tsx        — top bar (branding, clock, item count)
│   ├── CategoryGrid.tsx  — horizontal category selector
│   ├── ProductGrid.tsx   — tappable product cards
│   └── OrderCart.tsx     — right sidebar order summary
├── data/
│   └── products.ts       — full menu with prices
├── hooks/
│   ├── useOrder.ts       — current order state
│   └── useOrderHistory.ts — completed orders in localStorage
├── types/
│   └── index.ts          — TypeScript interfaces
└── utils/
    ├── formatReceipt.ts  — kitchen + customer receipt formatting
    └── print.ts          — printer integration (placeholder)
```

## Future Features

See [TODO.md](./TODO.md) for the full task list.
