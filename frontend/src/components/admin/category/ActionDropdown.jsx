"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Pencil,
  Trash2,
  ToggleLeft,
  ImagePlus,
  Images,
  Eye,
} from "lucide-react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ActionDropdown({ id, module, actions = [] }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const actionConfig = {
    BestSeller: {
      label: "BestSeller",
      icon: Pencil,
      className: "text-gray-700",
      onClick: async () => {
        try {
          const response = await client.patch(`${module}/update-flag/${id}`, {
            field: "bestSeller",
          });

          if (response.data.success) {
            toast.success(response.data.message);
            router.refresh();
          }
        } catch (error) {
          console.log(error);
          toast.error(
            error?.response?.data?.message || "Internal server error",
          );
        }
      },
    },

    stock: {
      label: "Stock",
      icon: ToggleLeft,
      className: "text-blue-600",
      onClick: async () => {
        try {
          const response = await client.patch(`${module}/update-flag/${id}`, {
            field: "stock",
          });
          if (response.data.success) {
            toast.success(response.data.message);
            router.refresh();
          }
        } catch (error) {
          console.log(error);
          toast.error(
            error?.response?.data?.message || "Internal server error",
          );
        }
      },
    },

    // delete: {
    //     label: 'Delete',
    //     icon: Trash2,
    //     className: 'text-red-600',
    //     onClick: () => {
    //         console.log(`Delete ${module}`, id);
    //     },
    // },

    images: {
      label: "Images",
      icon: ImagePlus,
      className: "text-green-600",
      onClick: () => {
        router.push(`/admin/products/add-images/${id}`);
      },
    },

    // gallery: {
    //     label: 'Gallery',
    //     icon: Images,
    //     className: 'text-purple-600',
    //     onClick: () => {
    //         console.log(`Gallery ${module}`, id);
    //     },
    // },

    view: {
      label: "View",
      icon: Eye,
      className: "text-orange-600",
      onClick: () => {
        router.push(`/admin/products/${id}`);
      },
    },
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPosition({
            top: rect.bottom + 6,
            left: Math.max(8, rect.right - 192),
          });
          setOpen(!open);
        }}
        aria-label="Product actions"
        aria-expanded={open}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={position}
            className="fixed w-48 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-[100]"
          >
            {actions.map((action) => {
              const item = actionConfig[action];

              if (!item) return null;

              const Icon = item.icon;

              return (
                <button
                  key={action}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                >
                  <Icon className={`w-4 h-4 ${item.className}`} />

                  <span className={item.className}>{item.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
