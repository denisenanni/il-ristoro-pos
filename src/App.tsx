import { useState } from 'react';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { OrderCart } from './components/OrderCart';
import { FloatingCartButton } from './components/FloatingCartButton';
import { useOrder } from './hooks/useOrder';
import { useOrderHistory } from './hooks/useOrderHistory';
import { printKitchenTicket, printCustomerReceipt, browserPrintAll, isPrinterConnected, generateOrderId } from './utils/printer';
import type { Category } from './types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('pinse-rosse');
  const [cartOpen, setCartOpen] = useState(false);
  const order = useOrder();
  const { saveOrder } = useOrderHistory();

  async function handleComplete(tableNumber: string, customerName: string): Promise<void> {
    if (order.items.length === 0) return;

    const orderId = generateOrderId();
    const timestamp = new Date();

    const orderData = {
      orderId,
      items: order.items,
      total: order.total,
      timestamp,
      tableNumber: tableNumber || undefined,
      customerName: customerName || undefined,
    };

    if (isPrinterConnected()) {
      await printKitchenTicket(orderData);
      await printCustomerReceipt(orderData);
    } else {
      browserPrintAll(orderData, orderData);
    }

    saveOrder({
      id: orderId,
      items: order.items,
      total: order.total,
      timestamp,
      tableNumber: tableNumber || undefined,
      customerName: customerName || undefined,
      status: 'completed',
    });
    order.clearOrder();
  }

  return (
    <div className="h-screen flex flex-col bg-stone-100 overflow-hidden">
      <Header orderCount={order.itemCount} />

      <div className="flex-1 flex overflow-hidden">
        {/* Product area — full width on mobile, 70% on desktop */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ProductGrid
            category={selectedCategory}
            cartItems={order.items}
            onAddItem={order.addItem}
          />
        </div>

        {/* Desktop sidebar — hidden below lg */}
        <div className="hidden lg:flex">
          <OrderCart
            items={order.items}
            total={order.total}
            onUpdateQuantity={order.updateQuantity}
            onRemove={order.removeItem}
            onClear={order.clearOrder}
            onComplete={handleComplete}
          />
        </div>
      </div>

      {/* Mobile floating cart button */}
      <FloatingCartButton
        itemCount={order.itemCount}
        total={order.total}
        onClick={() => setCartOpen(true)}
      />

      {/* Mobile slide-over cart */}
      {cartOpen && (
        <OrderCart
          items={order.items}
          total={order.total}
          onUpdateQuantity={order.updateQuantity}
          onRemove={order.removeItem}
          onClear={order.clearOrder}
          onComplete={handleComplete}
          onClose={() => setCartOpen(false)}
          isMobile
        />
      )}
    </div>
  );
}

export default App;
