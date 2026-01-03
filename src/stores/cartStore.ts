import { atom, map } from 'nanostores';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export const cartItems = map<Record<string, CartItem>>({});
export const isCartOpen = atom(false);

export function addItem(product: Omit<CartItem, 'quantity'>) {
    const existing = cartItems.get()[product.id];
    if (existing) {
        cartItems.setKey(product.id, {
            ...existing,
            quantity: existing.quantity + 1
        });
    } else {
        cartItems.setKey(product.id, {
            ...product,
            quantity: 1
        });
    }
    isCartOpen.set(true);
}

export function removeItem(id: string) {
    const newItems = { ...cartItems.get() };
    delete newItems[id];
    cartItems.set(newItems);
}

export function updateQuantity(id: string, delta: number) {
    const item = cartItems.get()[id];
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
        removeItem(id);
    } else {
        cartItems.setKey(id, {
            ...item,
            quantity: newQuantity
        });
    }
}

export function toggleCart() {
    isCartOpen.set(!isCartOpen.get());
}
