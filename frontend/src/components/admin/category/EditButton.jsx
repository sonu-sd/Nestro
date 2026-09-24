import { Pencil } from "lucide-react";
import Link from "next/link";

export default function EditButton({ path }) {
  return (
    <Link href={path}>
      <button className="flex items-center  px-2.5 py-1 rounded-full text-xs font-semibold border gap-2 bg-emerald-100 text-[white] ">
        <Pencil className="w-4 h-4" />
        Edit
      </button>
    </Link>
  );
}
