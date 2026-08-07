import { getProducts } from "@/lib/db";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const products = await getProducts();
  return <HomeClient products={products} />;
}
