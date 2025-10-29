// App.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [searchId, setSearchId] = useState("");
  const [editingId, setEditingId] = useState(null);

  const generateId = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const randomItem = res.data[Math.floor(Math.random() * res.data.length)];
    return randomItem.id;
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim() || !price.trim()) {
      alert("Name and Price are required!");
      return;
    }

    if (editingId) {
      setProducts(
        products.map((p) => (p.id === editingId ? { ...p, name, price } : p))
      );
      setEditingId(null);
    } else {
      const id = await generateId();
      setProducts([...products, { id, name, price }]);
    }

    setName("");
    setPrice("");
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditingId(product.id);
  };

  const filteredProducts = searchId
    ? products.filter((p) => p.id.toString().includes(searchId))
    : products;

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Product Management</h2>

      <div className="card p-3 mb-4 shadow-sm">
        <div className="mb-2">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Product Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddOrUpdate}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
