import Link from "next/link";
import { Plus } from "lucide-react";

export default function PageHeader({
  title,
  description,
  buttonText,
  buttonLink,
  icon: Icon = Plus,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {buttonText && (
        <Link
          href={buttonLink}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-200 transition hover:bg-teal-700 sm:w-auto sm:shrink-0"
        >
          <Icon className="w-4 h-4" />
          {buttonText}
        </Link>
      )}
    </div>
  );
}
