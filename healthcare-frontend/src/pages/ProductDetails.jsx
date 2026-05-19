import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {

        try {

            const res = await axios.get(
                `http://localhost:5000/api/products/${id}`
            );

            setProduct(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchProduct();

    }, [id]);



    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!product) {
        return <h1>Product Not Found</h1>;
    }

    return (

        <div className="container">

            <div className="product-card">

                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />

                <div className="product-info">

                    <h1>{product.name}</h1>

                    <h2>₹ {product.price}</h2>

                    <p>{product.description}</p>

                    <button>
                        Add To Cart
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ProductDetails;