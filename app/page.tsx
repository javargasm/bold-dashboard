import Login from "@components/templates/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bold Home",
  description: "Bold home page",
};

const Home = () => <Login />;

export default Home;
