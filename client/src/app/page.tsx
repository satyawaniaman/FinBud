"use client";
import { FC } from "react";
import WithAuth from "./middleware/WithAuth";
import HomePage from "./components/HomePage";
import ChatbotWidget from "./components/ChatbotWidget";

const Home: FC = () => {
  return (
    <>
      <HomePage />
      <ChatbotWidget />
    </>
  );
};

export default WithAuth(Home, true) as FC;
