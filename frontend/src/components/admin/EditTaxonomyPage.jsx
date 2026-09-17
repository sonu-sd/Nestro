"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { client } from "@/utils/helper";
import EditForm from "@/components/admin/category/EditFrom";

export default function EditTaxonomyPage({ type }) {
  const params = useParams();
  const id = type === "category" ? params.category_id : params.room_id;
  const base = type === "category" ? "category" : "room-type";
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    client.get(`/${base}/admin/${id}`)
      .then(({ data }) => { if (active) setItem(data.data); })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Unable to load record."); });
    return () => { active = false; };
  }, [base, id]);

  if (error) return <main role="alert" className="p-8 text-red-700">{error} <Link href={`/admin/${base}`} className="underline">Back to list</Link></main>;
  if (!item) return <main className="p-8 text-slate-500">Loading…</main>;
  return <EditForm data={item} page={`/admin/${base}`} api={`${base}/edit/${item._id}`}/>;
}
