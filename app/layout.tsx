import { FiltersProvider } from "@context/FilterContext";
import { TransactionsProvider } from "@context/TransactionsContext";
import "@/styles/globals.css";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard",
  description: "Sales dashboard for Bold",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={montserrat.className}>
        <FiltersProvider>
          <TransactionsProvider>{children}</TransactionsProvider>
        </FiltersProvider>
      </body>
    </html>
  );
}
