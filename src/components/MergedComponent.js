import React, { useState, useEffect } from "react";
import axios from "axios"; //npm install axios
import { toast, ToastContainer } from "react-toastify";   //npm i react-toastify
import "react-toastify/dist/ReactToastify.css";
import "./DynamicList.css";

const MergedComponent = () => {
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [middleList, setMiddleList] = useState([]);
  const [isList1Checked, setIsList1Checked] = useState(false);
  const [isList2Checked, setIsList2Checked] = useState(false);
  const [showMiddleContainer, setShowMiddleContainer] = useState(false);
  const [originalList1, setOriginalList1] = useState([]);
  const [originalList2, setOriginalList2] = useState([]);

  useEffect(() => {
    axios
      .get("https://apis.ccbp.in/list-creation/lists")
      .then((response) => {
        const data = response.data.lists;
        const filteredList1 = data.filter((item) => item.list_number === 1);
        const filteredList2 = data.filter((item) => item.list_number === 2);
        setList1(filteredList1);
        setList2(filteredList2);
        setOriginalList1(filteredList1);
        setOriginalList2(filteredList2);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const isButtonEnabled = isList1Checked && isList2Checked;

  const moveToMiddleList = (item, source) => {
    if (source === "list1") {
      setList1(list1.filter((i) => i.id !== item.id));
    } else {
      setList2(list2.filter((i) => i.id !== item.id));
    }
    setMiddleList([...middleList, item]);
  };

  const moveBackToList = (item, target) => {
    setMiddleList(middleList.filter((i) => i.id !== item.id));
    if (target === "list1") {
      setList1([...list1, item]);
    } else {
      setList2([...list2, item]);
    }
  };

  const handleCancel = () => {
    const list1ItemsInMiddle = middleList.filter((item) => item.list_number === 1);
    const list2ItemsInMiddle = middleList.filter((item) => item.list_number === 2);

    // Move items back to list1 and list2 based  list_number
    setList1([...originalList1, ...list1ItemsInMiddle]);
    setList2([...originalList2, ...list2ItemsInMiddle]);

    // Clear middleList and hide the container
    setMiddleList([]);
    setShowMiddleContainer(false);

    toast.info("Reverted");
  };

  const handleUpdate = () => {
    setOriginalList1(list1);
    setOriginalList2(list2);
    setShowMiddleContainer(false);

    // Show toast message
    toast.success("Lists have been updated!");
  };

  return (
    <div>
      <div className="container">
        <h2 className="header">List Creation</h2>
        <button
          className="button"
          disabled={!isButtonEnabled}
          onClick={() => setShowMiddleContainer(true)}
        >
          Create a New List
        </button>
      </div>

      <div
        style={{
          ...styles.container,
          justifyContent: showMiddleContainer ? "space-between" : "left",
        }}
      >
        <div style={styles.listContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              onChange={(e) => setIsList1Checked(e.target.checked)}
            />
            <h2>List 1</h2>
          </label>
          <ul>
            {list1.map((item) => (
              <li key={item.id} style={styles.card}>
                <div style={styles.cardContent}>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                {showMiddleContainer && (
                  <span
                    style={styles.arrow}
                    onClick={() => moveToMiddleList(item, "list1")}
                  >
                    ➡️
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {showMiddleContainer && (
          <div style={styles.middleContainer}>
            <h2>Modify Lists</h2>
            <ul>
              {middleList.map((item) => (
                <li key={item.id} style={styles.card}>
                  <span
                    style={styles.arrow}
                    onClick={() => moveBackToList(item, "list1")}
                  >
                    ⬅️
                  </span>
                  <div style={styles.cardContent}>
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                  <span
                    style={styles.arrow}
                    onClick={() => moveBackToList(item, "list2")}
                  >
                    ➡️
                  </span>
                </li>
              ))}
            </ul>
            <div style={styles.buttonContainer}>
              <button className="button update-btn" onClick={handleUpdate}>
                Update
              </button>
              <button className="button cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={styles.listContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              onChange={(e) => setIsList2Checked(e.target.checked)}
            />
            <h2>List 2</h2>
          </label>
          <ul>
            {list2.map((item) => (
              <li key={item.id} style={styles.card}>
                {showMiddleContainer && (
                  <span
                    style={styles.arrow}
                    onClick={() => moveToMiddleList(item, "list2")}
                  >
                    ⬅️
                  </span>
                )}
                <div style={styles.cardContent}>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    padding: "20px",
    gap: "0px",
  },
  listContainer: {
    width: "30%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#f9f9f9",
    maxHeight: "480px",
    overflowY: "auto",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  middleContainer: {
    width: "20%",
    padding: "10px",
    border: "2px solid #007bff",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  cardContent: {
    textAlign: "center",
  },
  arrow: {
    marginLeft: "10px",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default MergedComponent;
