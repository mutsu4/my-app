
import Link from "next/link";
import { Suspense } from "react";
import { getCartData } from "@/app/actions/cart";
import RemoveFromCartButton from "@/components/RemoveFromCartButton";

export default function CartPage() {
  return (
    <main>
      <h1>ショッピングカート</h1>

      <Suspense fallback={<p>カートを読み込み中...</p>}>
        <CartContents />
      </Suspense>
    </main>
  );
}

async function CartContents() {
  const cart = await getCartData();

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <>
        <p>カートは空です。</p>
        <Link href="/">商品一覧へ戻る</Link>
      </>
    );
  }

  return (
    <>
      <p>商品点数：{cart.totalQuantity}</p>

      {cart.lines.nodes.map((line) => (
        <article key={line.id}>
          <h2>{line.merchandise.product.title}</h2>
          <p>{line.merchandise.title}</p>
          <p>数量：{line.quantity}</p>
          <p>
            価格：{line.merchandise.price.amount}
            {line.merchandise.price.currencyCode}
          </p>
          <RemoveFromCartButton lineId={line.id} />
        </article>
      ))}
      <a href={cart.checkoutUrl} target="_blank" rel="noopener noreferrer">
        チェックアウトに進む
      </a>
    </>
  );
}
