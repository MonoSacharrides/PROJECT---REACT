import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

import Textbox from "./components/textbox/textbox";
import Dropdown from "./components/dropdown/dropdown";
import CustomButton from "./components/button/button";

import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [txtName, setTxtName] = useState("");
  const [textPrice, setTextPrice] = useState("");
  const [textQuantity, setTextQuantity] = useState("");
  const [shipping, setShippingFee] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  
  const towns = ["Tubigon", "Calape"];
  const fee = {
    Tubigon: 50,
    Calape: 100,
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function onChange(e) {
    const id = e.target.id;
    const value = e.target.value;

    if (id === "txtName") setTxtName(value);
    if (id === "txtPrice") setTextPrice(value);
    if (id === "txtQuantity") setTextQuantity(value);
    if (towns.includes(value)) {
      setShippingFee(fee[value]);
    }
  }

  function addToChart() {
    if (txtName && textPrice && textQuantity) {
      const item = {
        name: txtName,
        price: parseFloat(textPrice),
        quantity: parseInt(textQuantity),
      };

      if (editingIndex !== null) {
        const updatedItems = cartItems.map((currentItem, index) =>
          index === editingIndex ? item : currentItem
        );
        setCartItems(updatedItems);
        setEditingIndex(null);
      } else {
        setCartItems([...cartItems, item]);
      }

      setTxtName("");
      setTextPrice("");
      setTextQuantity("");
    }
  }

  function clearCart() {
    setCartItems([]);
  }

  function deleteItem(itemIndex) {
    const cartNewItems = [...cartItems].filter((_, index) => index !== itemIndex);
    setCartItems(cartNewItems);
  }

  function editItem(itemIndex) {
    scrollTo(0,0);
    const item = cartItems[itemIndex];
    setTxtName(item.name);
    setTextPrice(item.price);
    setTextQuantity(item.quantity);
    setEditingIndex(itemIndex);
  }

  function formatCurrency(num) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(num);
  }

  return (
    <div>
      <div className="main-container">
        <div className="sub-container">
          <Textbox
            id="txtName"
            type="text"
            label="item name"
            value={txtName}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <Textbox
            id="txtPrice"
            type="number"
            label="item price"
            value={textPrice}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <Textbox
            id="txtQuantity"
            type="number"
            label="quantity"
            value={textQuantity}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <div className="d-flex justify-content-center py-2">
            <CustomButton
              label={editingIndex !== null ? "Update Item" : "Add to Cart"}
              onClick={addToChart}
              variant="primary"
            />
          </div>
        </div>
        {cartItems.length > 0 && (
          <div className="item-container my-5">
            <h3 className="text-center py-3">CART ITEMS</h3>
            <div className="d-flex justify-content-end">
              <CustomButton
                onClick={clearCart}
                label="Clear"
                variant="dark"
                innerClass="m-1"
              />
            </div>
            <Table striped bordered>
              <thead>
                <tr className="text-capitalize">
                  <th>item#</th>
                  <th>item name</th>
                  <th>price</th>
                  <th>quantity</th>
                  <th>total</th>
                  <td>actions</td>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => {
                  const total = item.price * item.quantity;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(total)}</td>
                      <td className="text-center" width={200}>
                        <CustomButton
                          label="Edit"
                          variant="success"
                          innerClass="m-1"
                          onClick={() => editItem(index)}
                        />
                        <CustomButton
                          label="Delete"
                          variant="danger"
                          innerClass="m-1"
                          onClick={() => deleteItem(index)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center">
              <Dropdown
                id="drpTown"
                label="town"
                options={towns}
                containerClass="p-3"
                onSelectChange={onChange}
              />
              <Dropdown
                name="drpPayment"
                label="payment method"
                options={["gcash", "creditcard"]}
                containerClass="p-3"
                onSelectChange={onChange}
              />
            </div>
            <div className="text-p-3">
              <h3>Subtotal: {formatCurrency(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</h3>
              <h3>Shipping Fee: {formatCurrency(shipping)}</h3>
              <h3>Grand Total: {formatCurrency(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shipping)}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;