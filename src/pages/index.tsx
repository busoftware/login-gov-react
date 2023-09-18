import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import GovLoginProvider from "../index";

export default function Home() {
  return (
    <GovLoginProvider
      authorizationParams={{
        acr_value: "",
        client_id: "sldkjsldf",
      }}
    >
      <div>Some text that needs protecting</div>
    </GovLoginProvider>
  );
}
