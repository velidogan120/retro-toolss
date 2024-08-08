"use client";
import "../styles/css/main.css";
import "../styles/css/comment.css";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body style={{margin:0}}>{children}</body>
      </html>
    </Provider>
  );
}