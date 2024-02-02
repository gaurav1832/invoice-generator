import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "jspdf-autotable";

import { useUserContext } from "../Context/UserContext";

type ProductType = {
  name: string;
  qty: number;
  rate: number;
  total: number;
};

const API_BASE_URL = "https://invoice-generator-server-rv88.onrender.com";

const userEmail = localStorage.getItem("userEmail");

const AddProductForm: React.FC = () => {
  // states
  const [product, setProduct] = useState<ProductType>({
    name: "",
    qty: 0,
    rate: 0,
    total: 0,
  });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [validUntilDate, setValidUntilDate] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useUserContext();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: name === "name" ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prepare the URL for your API endpoint
    const apiUrl = `${API_BASE_URL}/products/add`; // Adjust the URL/port as necessary

    try {
      // Make an API call to add the product
      const response = await axios.post(apiUrl, product, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Product added successfully:", response.data);

      setProducts([...products, response.data]);

      setProduct({ name: "", qty: 0, rate: 0, total: 0 });
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Function to fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }

        const fetchedProducts = await response.json();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducts();
  }, []);

  // Effect to calculate the next day from the current date
  useEffect(() => {
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);

    // Format the date as needed (e.g., 'YYYY-MM-DD')
    const formattedDate = `${nextDay.getDate().toString().padStart(2, "0")}/${(
      nextDay.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${nextDay.getFullYear()}`;

    setValidUntilDate(formattedDate);
  }, []);

  // total sum of all products
  const totalSum = products.reduce((sum, product) => sum + product.total, 0);
  // Calculate GST (18% of the total sum)
  const gst = (totalSum * 18) / 100;
  // Calculate total with GST
  const totalWithGST = totalSum + gst;

  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <h1 id="greeting" className="text-xl p-4 font-bold">
          {userEmail && <span>Welcome, {userEmail}</span>}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Add Product</h2>
          <div>
            <label
              htmlFor="name"
              className="flex ml-1 text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="qty"
              className="flex ml-1 text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="qty"
              name="qty"
              value={product.qty}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="rate"
              className="flex ml-1 text-sm font-medium text-gray-700"
            >
              Rate
            </label>
            <input
              type="number"
              id="rate"
              name="rate"
              value={product.rate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-md shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* List of Products */}
      <div id="pdf-content">
        <div className="mt-8 mx-auto max-w-screen-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Product List
          </h3>
          <table className="min-w-full">
            <thead>
              <tr className="">
                <th className="py-4 px-8 border-b">Name</th>
                <th className="py-4 px-8 border-b">Quantity</th>
                <th className="py-4 px-8 border-b">Rate</th>
                <th className="py-4 px-8 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.name} className="py-8">
                  <td className="py-6 px-8">{product.name}</td>
                  <td className="py-6 px-8 text-blue-600 font-semibold">
                    {product.qty}
                  </td>
                  <td className="py-6 px-8">{product.rate}</td>
                  <td className="py-6 px-8 font-semibold">
                    INR {product.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 mx-auto max-w-screen-md">
          <table className="min-w-full mb-0">
            <tbody>
              <tr className="py-4">
                <td className="py-6 px-4"></td>
                <td className="py-6 px-4"></td>
                <td className="py-2 px-4 text-lg text-right font-semibold text-gray-00">
                  Total
                </td>
                <td className="py-2 px-4 text-lg text-right text-gray-800">
                  INR {totalSum.toLocaleString()}
                </td>
              </tr>
              <tr className="py-8">
                <td className="py-6 px-4"></td>
                <td className="py-6 px-4"></td>
                <td className="px-4 text-md text-right text-gray-500">GST</td>
                <td className="px-4 text-md text-right text-gray-500">18%</td>
              </tr>
              <tr className="py-8">
                <td className="py-6 px-8"></td>
                <td className="py-6 px-8"></td>
                <td className="py-6 px-3 font-bold text-md text-right text-gray-700 relative">
                  <hr className="w-full border-t mb-8 border-gray-300" />
                  Grand Total
                  <hr className="w-full border-t mt-8 border-gray-300" />
                </td>
                <td className="py-6 px-3 font-bold text-md text-right text-blue-700 relative">
                  <hr className="flex w-full border-t mb-8 border-gray-300" />
                  INR {totalWithGST.toLocaleString()}
                  <hr className="flex w-full border-t mt-8 border-gray-300" />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 p-4 text-sm text-start text-gray-700">
            <p>Valid until: {validUntilDate}</p>
          </div>

          {/* "Next" button */}
          {isLoggedIn && (
            <Link
              to="/generate-pdf"
              className="px-6 py-4 bg-blue-500 text-white text-md font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </Link>
          )}

          <div className="mt-32 px-28 py-6 mb-10 text-start bg-zinc-800 rounded-full text-gray-300">
            <p className="text-sm font-semibold">Terms and Conditions:</p>
            <p className="text-sm">
              We are happy to supply any furthur infromation you may need and
              trust that you call on us to fill your order. Which will receive
              our prompt and careful attention
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductForm;
