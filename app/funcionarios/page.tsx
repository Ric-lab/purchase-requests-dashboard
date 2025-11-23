import { getEmployees } from "@/actions/employees";
import EmployeesPage from "./client-page";
import { redirect } from "next/navigation";

export default async function EmployeesPageWrapper() {
    const { employees, error } = await getEmployees();

    if (error) {
        redirect("/dashboard");
    }

    return <EmployeesPage employees={employees || []} />;
}
