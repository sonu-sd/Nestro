"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { client } from "@/utils/helper";
import Swal from "sweetalert2";

export default function DeleteButton({ path }) {
  const router = useRouter();
  async function deleteHandler() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        try {
          const response = await client.delete(path);
          if (response.data.success) {
            toast.success(response.data.message);
            router.refresh();
          }
        } catch (error) {
          toast.error(error.response.data.message || "Internal server error");
        }
      }
    });
  }
  return (
    <button
      onClick={deleteHandler}
      className="flex items-center gap-2 text-red-600 hover:text-red-700"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </button>
  );
}
