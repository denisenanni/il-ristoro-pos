# Il Ristoro POS - TODO

## ✅ Completed
- [x] Project scaffolding (Vite + React + TypeScript + Tailwind)
- [x] Basic layout (categories, products, cart)
- [x] Order state management (`useOrder` hook)
- [x] Order history persistence (`useOrderHistory` hook, localStorage)
- [x] Product grid with quick add (+1 on tap)
- [x] Category navigation bar
- [x] Order cart with quantity controls + line totals
- [x] Running total calculation
- [x] TypeScript types (`types/index.ts`)
- [x] PWA manifest (landscape fullscreen)
- [x] Tablet-optimized styling (44px+ touch targets, Cinzel header font)
- [x] Printer integration — ESC/POS via Web Bluetooth (`utils/printer.ts`)
- [x] Kitchen receipt formatting (pinse + fritti only, large text for kitchen)
- [x] Customer receipt formatting (all items + total)
- [x] Printer status indicator in header (connect / disconnect)
- [x] Table number input (optional, shown in cart sidebar)
- [x] Customer name input (optional, shown in cart sidebar)
- [x] Order completion flow — prints both tickets, then saves + clears
- [x] Clear order after successful print only (errors preserve the order)
- [x] Error handling for printer failures (shown inline, order preserved)
- [x] Order ID generation (`YYYYMMDD-XXXX` format)

## 🚧 In Progress
- [ ] None

## 📋 Upcoming
- [ ] Order history view (list past orders from localStorage)
- [ ] Test mode / dev print fallback (browser print dialog when no printer)

## 🔮 Future / Nice to Have
- [ ] Daily sales summary
- [ ] Product search/filter
- [ ] Custom product entry (ad-hoc items)
- [ ] Split payments
- [ ] Discount functionality
- [ ] Multi-language support
- [ ] 80mm paper size variant
