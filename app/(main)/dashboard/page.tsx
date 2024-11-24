import { Metadata } from "next";
import Dashboard from "@components/templates/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

const CalendarPage = () => <Dashboard />;

export default CalendarPage;
