import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Customer, DeliverySlot, Order } from './types';
import { getDeliverySlots } from './services/deliveryService';
import DatePicker from './components/DatePicker';
import { CHAPATIS_PER_BOX, MAX_ORDER_BOXES, MIN_ORDER_BOXES, PRICE_PER_BOX } from './constants';
import { CheckCircleIcon, HistoryIcon, MinusIcon, PlusIcon, ShoppingBagIcon, UserIcon } from './components/Icons';

// Header Component
const Header: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => (
  <header className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center cursor-pointer" onClick={() => setView(AppView.ORDERING)}>
          <img src="https://picsum.photos/seed/chapati/100/100" alt="Chapatis Online Logo" className="h-12 w-12 rounded-full object-cover" />
          <h1 className="text-2xl font-bold text-amber-800 ml-3">Chapatis Online</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <button onClick={() => setView(AppView.ORDERING)} className="flex items-center text-gray-600 hover:text-amber-700 transition">
            <ShoppingBagIcon className="w-6 h-6" />
            <span className="hidden sm:inline ml-2 font-medium">Order</span>
          </button>
          <button onClick={() => setView(AppView.HISTORY)} className="flex items-center text-gray-600 hover:text-amber-700 transition">
            <HistoryIcon className="w-6 h-6" />
            <span className="hidden sm:inline ml-2 font-medium">History</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
);

// Confirmation Page Component
const ConfirmationPage: React.FC<{ order: Order | null; onNewOrder: () => void }> = ({ order, onNewOrder }) => {
    if (!order) return null;

    return (
        <div className="text-center py-16 px-4">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
            <p className="text-lg text-gray-600 mb-8">Thank you for your purchase, {order.customer.name}.</p>
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-left divide-y divide-gray-200">
                <div className="pb-4">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-800">{order.id}</p>
                </div>
                <div className="py-4">
                    <p className="text-sm text-gray-500">Delivery Date</p>
                    <p className="font-semibold text-gray-800">{order.deliveryDate.toDateString()}</p>
                </div>
                <div className="py-4">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-800">{order.quantity} boxes ({order.quantity * CHAPATIS_PER_BOX} chapatis)</p>
                </div>
                 <div className="pt-4">
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-bold text-xl text-amber-700">£{order.totalPrice.toFixed(2)}</p>
                </div>
            </div>
             <p className="text-gray-500 mt-8">A confirmation has been sent to {order.customer.email}.</p>
            <button onClick={onNewOrder} className="mt-6 bg-amber-600 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-700 transition-transform transform hover:scale-105 shadow-lg">
                Place Another Order
            </button>
        </div>
    );
};

// History Page Component
const HistoryPage: React.FC<{ orders: Order[] }> = ({ orders }) => (
    <div className="py-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Order History</h2>
        {orders.length === 0 ? (
            <p className="text-center text-gray-500">You have no past orders.</p>
        ) : (
            <div className="max-w-3xl mx-auto space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg text-gray-800">Order #{order.id.substring(0, 8)}</p>
                            <p className="text-sm text-gray-500">Delivery on {order.deliveryDate.toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg text-amber-700">£{order.totalPrice.toFixed(2)}</p>
                           <p className="text-sm text-gray-600">{order.quantity} boxes</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);


const App: React.FC = () => {
    const [view, setView] = useState<AppView>(AppView.ORDERING);
    const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [quantity, setQuantity] = useState<number>(MIN_ORDER_BOXES);
    const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '', address: '' });
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

    useEffect(() => {
        setDeliverySlots(getDeliverySlots());
    }, []);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < MIN_ORDER_BOXES) return MIN_ORDER_BOXES;
            if (newQuantity > MAX_ORDER_BOXES) return MAX_ORDER_BOXES;
            return newQuantity;
        });
    };

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({...prev, [name]: value }));
    };

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) {
            alert("Please select a delivery date.");
            return;
        }

        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            deliveryDate: selectedDate,
            quantity: quantity,
            totalPrice: quantity * PRICE_PER_BOX,
            customer: customer
        };
        
        setConfirmedOrder(newOrder);
        setOrderHistory(prev => [newOrder, ...prev]);
        setView(AppView.CONFIRMATION);
    };
    
    const resetOrder = useCallback(() => {
        setSelectedDate(null);
        setQuantity(MIN_ORDER_BOXES);
        // keep customer info for easier re-ordering
        setView(AppView.ORDERING);
    }, []);
    
    const totalPrice = quantity * PRICE_PER_BOX;

    return (
        <div className="bg-amber-50 min-h-screen">
            <Header setView={setView} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === AppView.ORDERING && (
                  <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-8">
                          <DatePicker slots={deliverySlots} selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                           <div className="bg-white p-6 rounded-2xl shadow-lg">
                              <div className="flex items-center mb-4">
                                <ShoppingBagIcon className="w-6 h-6 text-amber-600 mr-3" />
                                <h2 className="text-xl font-bold text-gray-800">2. Select quantity</h2>
                              </div>
                               <p className="text-sm text-gray-500 mb-4">Each box contains {CHAPATIS_PER_BOX} fresh chapatis. Price is £{PRICE_PER_BOX.toFixed(2)} per box.</p>
                               <div className="flex items-center justify-between bg-gray-100 rounded-full p-2">
                                   <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= MIN_ORDER_BOXES} className="p-2 rounded-full bg-white shadow hover:bg-gray-200 disabled:opacity-50 transition"><MinusIcon className="w-5 h-5"/></button>
                                   <span className="font-bold text-xl w-16 text-center">{quantity}</span>
                                   <button onClick={() => handleQuantityChange(1)} disabled={quantity >= MAX_ORDER_BOXES} className="p-2 rounded-full bg-white shadow hover:bg-gray-200 disabled:opacity-50 transition"><PlusIcon className="w-5 h-5"/></button>
                               </div>
                           </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-28">
                          <div className="flex items-center mb-4">
                            <UserIcon className="w-6 h-6 text-amber-600 mr-3" />
                            <h2 className="text-xl font-bold text-gray-800">3. Delivery Details</h2>
                          </div>
                          <form onSubmit={handleSubmitOrder} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" required value={customer.name} onChange={handleCustomerChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" required value={customer.email} onChange={handleCustomerChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" name="phone" id="phone" required value={customer.phone} onChange={handleCustomerChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
                            </div>
                             <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                                <input type="text" name="address" id="address" required value={customer.address} onChange={handleCustomerChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2"/>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Date:</span>
                                    <span className="font-medium text-gray-800">{selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Quantity:</span>
                                    <span className="font-medium text-gray-800">{quantity} boxes ({quantity*CHAPATIS_PER_BOX} chapatis)</span>
                                </div>
                                <div className="flex justify-between items-baseline mt-4">
                                    <span className="text-xl font-bold text-gray-800">Total:</span>
                                    <span className="text-2xl font-bold text-amber-700">£{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                             <button type="submit" disabled={!selectedDate} className="w-full mt-4 bg-amber-600 text-white font-bold py-3 px-4 rounded-full hover:bg-amber-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 shadow-lg">
                                 Secure Checkout
                            </button>
                          </form>
                      </div>
                  </div>
                )}
                {view === AppView.CONFIRMATION && <ConfirmationPage order={confirmedOrder} onNewOrder={resetOrder} />}
                {view === AppView.HISTORY && <HistoryPage orders={orderHistory} />}
            </main>
        </div>
    );
};

export default App;