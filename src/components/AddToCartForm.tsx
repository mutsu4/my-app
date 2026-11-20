"use client";
import { useState } from "react";
import { addProductToCart } from "@/app/actions/cart";

type Props = {
  merchandiseId: string;
};

export default function AddToCartForm({
  merchandiseId,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <div>
        <label htmlFor="quantity">数量</label>

        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            const cart = await addProductToCart(
              merchandiseId,
              quantity
            );
            console.log("カートに追加されました:", cart);
          } catch (error) {
            console.error("カートに追加できませんでした:", error);
          }
        }}
      >
        カートに追加
      </button>
    </div>
  );
}
