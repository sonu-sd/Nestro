import { redirect } from "next/navigation";

// Colors are currently a product field, not a standalone catalog entity.
export default function ColorsPage() {
  redirect("/admin/products");
}
