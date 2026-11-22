import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Malabar Craving Box | A Box Full of Malabar Cravings", description: "Homemade Malabar savoury snack boxes, lovingly prepared in Kerala. Choose your Veg or Chicken box and pre-order." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
