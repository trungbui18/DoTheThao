import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import KTlogo from "../../../assets/image/KTlogo.png";
function Footer() {
  return (
    <footer
      className="container-fluid mt-5"
      style={{
        backgroundColor: "#f8f9fa",
        padding: "40px 40px",
        marginTop: "auto",
        borderTop: "1px solid #ddd",
      }}
    >
      <div className="row">
        <div className="col-sm-4 d-flex align-items-center justify-content-center">
          <img src={KTlogo} alt="Logo" style={{ height: "100px" }} />
        </div>
        <div className="col-sm-4">
          <h5>Thông Tin Sinh Viên</h5>
          <div>Họ và Tên: Bùi Ngọc Quốc Trung</div>
          <div>MSSV: DH52111957</div>
          <div>Lớp: D21-TH10</div>
        </div>
        <div className="col-sm-4 ">
          <h5>Thông Tin Sinh Viên</h5>
          <div>Họ và Tên: Mai Lâm Quang Khánh</div>
          <div>MSSV: DH52111115</div>
          <div>Lớp: D21-TH10</div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
