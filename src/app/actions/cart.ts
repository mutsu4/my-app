"use server";

import { cookies } from "next/headers";
import { createCart, addToCart, getCart, removeFromCart, } from "@/lib/shopify";

export async function addProductToCart(
  merchandiseId: string,
  quantity: number
) {
  // ① 入力値を検証する
  if (!merchandiseId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("商品または数量が正しくありません");
  }

  // ② Cookieを取得する
  const cookieStore = await cookies();
  let cartId = cookieStore.get("cartId")?.value;

  // ③ カートがなければ新しく作る
  if (!cartId) {
    const cart = await createCart();
    cartId = cart.id;

    // ④ カートIDをCookieに保存する
    cookieStore.set("cartId", cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  // ⑤ Shopifyのカートに商品を追加する
  const updatedCart = await addToCart(cartId, [
    {
      merchandiseId,
      quantity,
    },
  ]);

  return {
  totalQuantity: updatedCart.totalQuantity,
 };
}

export async function getCartData() {
    // ① CookieからカートIDを取得する
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;   
    // ② カートIDがなければnullを返す
    if (!cartId) {
        return null;
    }
    // ③ カートIDがあればShopifyからカート情報を取得する
    const cart = await getCart(cartId);
    // ⑤ カート情報を返す
    return cart;
}


export async function removeProductFromCart(lineId: string) {
  if (!lineId) {
    throw new Error("削除する商品が指定されていません");
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    throw new Error("カートが見つかりません");
  }

  const updatedCart = await removeFromCart(cartId, [lineId]);

  return {
    totalQuantity: updatedCart.totalQuantity,
  };
}