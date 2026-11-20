import { createCart, addToCart } from "@/lib/shopify";
import { Suspense } from "react";

async function CartContent() {
  const cart = await createCart();
  const updateCart = await addToCart(cart.id, [
    {
    merchandiseId: "gid://shopify/ProductVariant/67877143445564",
    quantity: 1,
  },
  ]);

  return (
    <main className="p-8">
      <h1>カート作成テスト</h1>
      <p>カートID：{updateCart.id}</p>
      <p>チェックアウトURL：{updateCart.totalQuantity}</p>
    </main>
  );
}

export default function TestCartPage() {
  return (
  <Suspense fallback={<p>Loading...</p>}>
    {CartContent()}
  </Suspense>
  );

}
