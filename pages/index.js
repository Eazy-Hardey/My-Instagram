// import { NextPage } from 'next'
import Head from "next/head";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Modal from "../components/Modal";

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Instagram Clone by Eazy-Hardey</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header Section */}
      <Header />

      {/* Main Feed Section */}
      <Feed />

      {/* Modal Component, can be toggled based on isVisible prop */}
      {/* <Modal isVisible={true} /> */}
    </div>
  );
};

export default HomePage;
