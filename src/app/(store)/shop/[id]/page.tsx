import { notFound } from "next/navigation";
import { getProductById as getProductByIdFromDb } from "@/lib/db";
import { getProductById as getProductByIdFallback } from "@/lib/products";
import { ProductDetailClient } from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  
  // Try database first, then fall back to hardcoded
  let product = await getProductByIdFromDb(id);
  if (!product) {
    product = getProductByIdFallback(id);
  }

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
