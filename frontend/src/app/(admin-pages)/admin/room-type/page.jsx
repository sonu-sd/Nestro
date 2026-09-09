
import TableHead from "@/components/admin/category/TableHead";
import StatusBadge from "@/components/admin/category/StatusBadge";
import PageHeader from "@/components/admin/category/PageHeader";
import { fetchRoom } from "@/api/api";
import DeleteButton from "@/components/admin/category/DeleteButton";
import EditButton from "@/components/admin/category/EditButton";


export default async function Page() {
    const { success, data, message } = await fetchRoom();
    console.log(success);
    console.log(data);
    console.log(message);

    if (success == false) {
        throw new Error("Internal server error")
    }

    return (
        <div className="min-h-screen space-y-6 bg-gray-50 p-4 sm:space-y-8 sm:p-6">

            <PageHeader
                title="Room Management"
                description="Manage Get, Create, Update, and Delete"
                buttonText="Add Room type"
                buttonLink="/admin/room-type/add"
            />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

                <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Room type List
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        All available room type are listed below.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">

                        <TableHead
                            columns={[
                                "Image",
                                "Name",
                                "Slug",
                                "Status",
                                "Edit",
                                "Delete",
                            ]}
                        />

                        <tbody>

                            {data.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200"
                                >

                                    {/* Image */}
                                    <td className="px-6 py-4">

                                        {item.image ? (

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm"
                                            />

                                        ) : (

                                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400 border">
                                                No Image
                                            </div>

                                        )}

                                    </td>

                                    {/* Name */}
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {item.name}
                                    </td>

                                    {/* Slug */}
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                            {item.slug}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <StatusBadge
                                            status={item.status}
                                            path={`room-type/status-update/${item._id}`}
                                        />
                                    </td>

                                    {/* Edit */}
                                    <td className="px-6 py-4">
                                        <EditButton
                                            path={`room-type/edit/${item._id}`}
                                        />
                                    </td>

                                    {/* Delete */}
                                    <td className="px-6 py-4">
                                        <DeleteButton
                                            path={`room-type/delete/${item._id}`}
                                        />
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>
                </div>

            </div>

        </div>
    );
}
