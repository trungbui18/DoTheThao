import React from "react";
function ProductDescription({description}){
    return(
        <div style={{textAlign:"left", paddingTop:"20px"}}>
            <h2>MÔ TẢ SẢN PHẨM</h2>
            <div>{description}</div>
        </div>
    )
}
export default ProductDescription;