import React from "react";
import Header from "../components/User/Header/Header";
import ProductList from "../components/User/Product/ProductList";
import Footer from "../components/User/Footer/Footer";
import "../assets/style/Bootstrap";

function HomePage() {
  return (
    <div>
      <Header />
      <ProductList />
      <Footer />
    </div>
  );
}

export default HomePage;
