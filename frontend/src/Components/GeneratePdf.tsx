import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import "jspdf-autotable";

type ProductType = {
  name: string;
  qty: number;
  rate: number;
  total: number;
};

const API_BASE_URL = "https://invoice-generator-server-rv88.onrender.com";
const userEmail = localStorage.getItem("userEmail");

const GeneratePDF = () => {
  // states
  const [products, setProducts] = useState<ProductType[]>([]);
  const [validUntilDate, setValidUntilDate] = useState("");

  const handleGeneratePDF = () => {
    const content = document.getElementById("pdf-content");

    if (content) {
      const pdfOptions = {
        margin: 10,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf(content, pdfOptions);
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
  }, []); // Run this effect only once on component mount

  // total sum of all products
  const totalSum = products.reduce((sum, product) => sum + product.total, 0);
  // Calculate GST (18% of the total sum)
  const gst = (totalSum * 18) / 100;
  // Calculate total with GST
  const totalWithGST = totalSum + gst;

  return (
    <>
      <button
        onClick={handleGeneratePDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Generate PDF
      </button>

      <div id="pdf-content">
        <div className="mt-8 mx-auto max-w-screen-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Products Summary
          </h3>
          <h2> Created by: {userEmail}</h2>
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

          <div className="mt-20 px-28 py-6 text-start bg-zinc-800 rounded-full text-gray-300">
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

export default GeneratePDF;
