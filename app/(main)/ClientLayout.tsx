"use client";

import type React from "react";

import { AudioPlayer } from "@/components/audio-player";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-14  px-4 md:px-8">
        <div className="lg:col-span-2 2xl:col-span-3"></div>
        <div className="lg:col-span-10 2xl:col-span-8 bg-white px-5">
          {/* <img src="https://cdn.prod.website-files.com/66015f733bbb59672132aee2/66016301256cc8095aeca1f5_644a04d84d0a0b0c0989993c_P_EFt0Y7fve8ARoGGiq2A7Nb-64Ky5Y3zgeIuAliQgiOScwSrCTXCRJVhatRylzPFjXQmhaJVoSj1rXeOGC0lZcPTD1Ok-qguKEiRisFVj_G24y-L372WWPB4ZOUye5nh97spOofwKLHcTEtlg.gif" className="w-full h-14  my-5"/> */}
          {children}
        </div>
        <div className="lg:col-span-2 2xl:col-span-3"></div>
        <AudioPlayer />
      </div>
      <Footer />
    </>
  );
}
