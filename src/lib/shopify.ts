import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2026-10",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});


const PRODUCTS_QUERY = `#graphql
  query GetProducts {
    products(first: 10, sortKey: TITLE) {
      nodes {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variants(first: 10) {
          nodes {
            id
            title
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `#graphql
  mutation CreateCart {
    cartCreate(input: {}) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;
const CART_LINES_ADD_MUTATION = `#graphql
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      totalQuantity
    }
    userErrors {
      field
      message
    }
    warnings {
      code
      message
    }
  }
}
`;

const CART_QUERY = `#graphql
  query GetCart($cartId: ID!) {
  cart(id: $cartId) {
    id
    checkoutUrl
    totalQuantity
    lines(first: 10) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            title
            product {
              title
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
}
`;

const CART_LINES_REMOVE_MUTATION = `#graphql
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function getProducts() {
  const { data, errors } = await shopifyClient.request(PRODUCTS_QUERY);
  if (errors) {
    console.error("Shopify GraphQL errors:", errors);
    throw new Error("Shopifyから商品を取得できませんでした");
  }
  return data.products.nodes;
};

export async function createCart() {
  const { data, errors } = await shopifyClient.request(CART_CREATE_MUTATION);
  if (errors) {
    console.error("Shopify GraphQL errors:", errors);
    throw new Error("カートの作成に失敗しました");
  }
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
) {
  // ① 入力値をチェック
  if (!cartId || !lines || lines.length === 0) {
    throw new Error("カートIDと商品情報が必要です");
  }

  try {
    // ② Shopifyに商品追加をリクエスト
    const response = await shopifyClient.request(
      CART_LINES_ADD_MUTATION,
      {
        variables: {
          cartId,
          lines,
        },
      }
    );
    
    // ③ レスポンス全体をターミナルに表示（確認用）
    console.dir(response, { depth: null });

    const { data, errors } = response;

    // ④ GraphQL自体のエラーを確認
    if (errors && Object.keys(errors).length > 0) {
      console.error("GraphQL errors:", errors);
      throw new Error("カートへの商品追加に失敗しました");
    }

    // ⑤ dataが取得できているか確認
    if (!data) {
      throw new Error("Shopifyからデータを取得できませんでした");
    }

    const result = data.cartLinesAdd;

    // ⑥ 商品追加処理に関するエラーを確認
    if (result.userErrors.length > 0) {
      throw new Error(
        result.userErrors.map((error) => error.message).join(", ")
      );
    }

    // ⑦ 成功した場合、更新後のカートを返す
    return result.cart;

  } catch (error) {
    console.error("addToCart error:", error);
    throw error;
  }
}



export async function getCart(cartId: string) {
  const { data, errors } = await shopifyClient.request(
    CART_QUERY,
    {
      variables: {
        cartId,
      },
    }
  );

  if (errors && Object.keys(errors).length > 0) {
    console.error("GraphQL errors:", errors);
    throw new Error("カート情報の取得に失敗しました");
  }

  if (!data || !data.cart) {
    throw new Error("カートが見つかりませんでした");
  }
  return data.cart;
}


export async function removeFromCart(
  cartId: string,
  lineIds: string[]
) {
  const { data, errors } = await shopifyClient.request(
    CART_LINES_REMOVE_MUTATION,
    {
      variables: {
        cartId,
        lineIds,
      },
    }
  );

  if (errors && Object.keys(errors).length > 0) {
    console.error("GraphQL errors:", errors);
    throw new Error("カート商品の削除に失敗しました");
  }

  const result = data?.cartLinesRemove;

  if (!result) {
    throw new Error("カート情報を取得できませんでした");
  }

  if (result.userErrors.length > 0) {
    throw new Error(result.userErrors[0].message);
  }

  return result.cart;
}