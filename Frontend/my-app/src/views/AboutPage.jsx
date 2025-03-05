import React from "react";
import Header from "../components/User/Header/Header";
import Footer from "../components/User/Footer/Footer";
function AboutPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="information" style={{ textAlign: "center" }}>
              <h3>KT Store xin chào bạn,</h3>
              <span>Cảm ơn bạn đã dành thời gian ở đây!</span>
              <br />
                <h3>Thông tin</h3>
                <span>Địa Chỉ: 180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh</span>
                <br />
                <span>Email: khanhtrung@gmail.com</span>
                <br />
                <span>Hotline: 0123456789</span>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div className="check">
              <h4>Về Chúng Tôi</h4>
              <div>
                Tại KT Store, chúng tôi đam mê và hiểu biết về bóng đá, vì vậy
                chúng tôi cam kết mang đến cho bạn những sản phẩm tốt nhất để
                nâng cao trải nghiệm chơi bóng của mình. Dù bạn là một cầu thủ
                chuyên nghiệp, một người đam mê bóng đá hay chỉ đơn giản là một
                fan hâm mộ yêu thích thể thao, chúng tôi đều có những sản phẩm
                phù hợp với nhu cầu và sở thích của bạn.
              </div>
              <h4 style={{ paddingTop: "10px" }}>Sản Phẩm Chất Lượng Cao</h4>
              <div>
                Chúng tôi cung cấp các mặt hàng quần áo thi đấu. Tất cả các sản
                phẩm đều được chọn lọc kỹ lưỡng từ các thương hiệu uy tín, đảm
                bảo độ bền, sự thoải mái và hiệu suất tốt nhất cho người sử
                dụng.
              </div>
              <h4 style={{ paddingTop: "10px" }}>Đến Với Chúng Tôi</h4>
              <div>
                Hãy đến và khám phá thế giới bóng đá tại KT Store. Chúng tôi cam
                kết sẽ giúp bạn có những trải nghiệm tuyệt vời nhất với các sản
                phẩm đồ đá banh. Chúc bạn luôn mạnh khỏe và đạt được những thành
                tích cao trong mọi trận đấu!
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;
