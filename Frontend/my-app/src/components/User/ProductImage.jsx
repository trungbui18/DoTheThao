import React from "react";

function ProductImage({ imageUrls }) {
  return (
    <div id="demo" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {imageUrls.map((image, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#demo"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
          >
            <img
              src={`http://localhost:8080/images/${image.imageurl}`}
              alt={`Hình ảnh ${index + 1}`}
              className="d-block"
              style={{ width: "100%" }}
            />
          </button>
        ))}
      </div>

      <div className="carousel-inner">
        {imageUrls.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""} `} 
          >
            <img
              src={`http://localhost:8080/images/${image.imageurl}`}
              alt={`Hình ảnh ${index + 1}`}
              className="d-block mx-auto"
              style={{
                width: "50%",
                height: "auto", 
              }}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#demo"
        data-bs-slide="prev"
        style={{ background: "black",height:"40%",top:"25%"}}
      >
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#demo"
        data-bs-slide="next"
        style={{ background: "black",height:"40%",top:"25%"}}
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}
export default ProductImage;
