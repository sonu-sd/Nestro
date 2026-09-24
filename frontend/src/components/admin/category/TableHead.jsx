export default function TableHead({ columns }) {
  return (
    <thead>
      <tr className="border-b border-gray-100">
        {columns.map((column) => (
          <th
            key={column}
            className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
