
"use client";

import { useTransition } from "react";
import { removeProductFromCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";

type Props = {
  lineId: string;
};

export default function RemoveFromCartButton({ lineId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  function handleRemove() {
    startTransition(async () => {
      await removeProductFromCart(lineId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}