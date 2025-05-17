/** @format */
import React, { useState, useEffect } from "react";

function Userform({ is_update_form }) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    price: 0,
    description: "",
    image: "",
    category: "",
  });
  const [queryAllData, setQueryAllData] = useState([]);

  const category = [
    { id: 1, catName: "electronic" },
    { id: 2, catName: "fashion" },
    { id: 3, catName: "accessory" },
    { id: 4, catName: "others" },
  ];

  //ประกาศ base url ไว้ตรงนี้เพื่อง่ายต่อการแก้ไขในทีเดียว
  const baseUrl = "https://fakestoreapi.com";

  //ประกาศ api endpoint ของหน้านี้ไว้ตรงนี้เพื่อง่ายต่อการแก้ไขในทีเดียว
  const endPoint = "/products/";

  //ใช้ useEffect เพือดึง api ครั้งเเรกที่เข้าเว็ป
  useEffect(() => {
    if (is_update_form) {
      getAllData();
      getDataByID(1);
    }
  }, []);

  const hdlChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //ตัวอย่าง function submit API แบบ method POST อย่างเดียว
  const hdlSubmit = (e) => {
    e.preventDefault();
    const body = { ...formData };
    body.image = `${baseUrl}/img/${formData.image.name}`;
    console.log(body);

    fetch("https://fakestoreapi.com/products", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  };

  //ตัวอย่าง function submit API แบบ dynamic method POST,PUT, DELETE
  const hdlSubmitDynamic = (e, { method }) => {
    e.preventDefault();
    console.log("method =>>", method);

    //เช็คว่าเป็น method PUT หรือ DELETE หรือไม่ และมี id หรือไม่
    if ((method === "PUT" || method === "DELETE") && !formData.id) {
      return alert("Missing ID for update or delete");
    }

    //สร้าง body สำหรับส่ง api ดึงค่าจาก form
    const body = { ...formData };
    //เช็คค่า ตัวแปล image
    body.image = formData.image.name
      ? `${baseUrl}/img/${formData.image.name}`
      : formData.image;

    //สร้าง apiEndPoint สำหรับส่ง api แยกเต่ละ method
    let apiEndPoint = "";
    switch (method) {
      case "POST":
        apiEndPoint = `${baseUrl}${endPoint}`; //ใช้ baseUrl และ endPoint ที่ประกาศไว้จาก บรรทัดที่ 21 กับ 23 มาต่อกัน
        break;
      case "PUT":
      case "DELETE":
        apiEndPoint = `${baseUrl}${endPoint}${formData.id}`; //ใช้ baseUrl และ endPoint ที่ประกาศไว้จาก บรรทัดที่ 21 กับ 23 มาต่อกัน และตามด้วย id ที่จาก ตัวแปล formData
        break;
      default:
        return alert("Unsupported method");
    }
    console.log("apiEndPoint =>>", apiEndPoint);

    const fetchOptions = {
      method: method,
    };
    //ถ้าไม่ใช่ Method DELETE ค่อยแนบ body ไปใน fetchOptions เพื่อส่ง api
    if (method !== "DELETE") {
      fetchOptions.body = JSON.stringify(body);
    }
    console.log("fetchOptions =>>", fetchOptions);

    fetch(apiEndPoint, fetchOptions)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        alert(`${method} success!`);
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong.");
      });
  };

  // ตัวอย่าง function fetch all data
  const getAllData = () => {
    fetch(`${baseUrl}${endPoint}`) //ใช้ baseUrl และ endPoint ที่ประกาศไว้จาก บรรทัดที่ 21 กับ 23 มาต่อกัน
      .then((response) => response.json())
      .then((data) => {
        console.log("getAllData ===>", data);
        setQueryAllData(data);
      });
  };

  //ตัวอย่าง function fetch data by id
  const getDataByID = (id) => {
    fetch(`${baseUrl}${endPoint}${id}`) //ใช้ baseUrl และ endPoint ที่ประกาศไว้จาก บรรทัดที่ 21 กับ 23 มาต่อกัน และตามด้วย id ที่ส่งเข้ามาใน function
      .then((response) => response.json())
      .then((data) => {
        console.log("getDataByID ===>", data);
        setFormData({
          id: data.id,
          title: data.title,
          price: data.price,
          description: data.description,
          image: data.image,
          category: data.category,
        });
      });
  };

  return is_update_form ? (
    <div className="bg-indigo-50 p-4">
      <h2 className="mb-4 font-bold text-xl">Edit product Form</h2>
      <form className="flex justify-center items-center text-lg">
        <div className="w-80 mr-4">
          <label>
            Title:
            <input
              type="text"
              name="title"
              className="input"
              value={formData?.title}
              onChange={hdlChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              className="input"
              value={formData?.price}
              onChange={hdlChange}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              className="input"
              value={formData?.description}
              onChange={hdlChange}
            />
          </label>
          <label>
            Image:
            <input
              type="file"
              name="image"
              className="input p-2"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, image: file });
              }}
            />
          </label>

          <label>
            Category:
            <select
              name="category"
              value={formData?.category}
              className="select"
              onChange={hdlChange}>
              <option value="" disabled>
                Select type
              </option>
              {category.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.catName}
                </option>
              ))}
            </select>
          </label>
        </div>
        {formData.image && (
          <img
            src={
              typeof formData.image === "string"
                ? formData.image // จาก API
                : URL.createObjectURL(formData.image)
            }
            alt="preview"
            className="w-xs rounded-2xl shadow-xl"
          />
        )}
      </form>
      <div className="flex justify-center mt-4">
        {/* การใช้งานแบบ function dynamic method */}
        <button
          className="btn btn-outline btn-primary text-purple-900 mr-2"
          onClick={(e) => hdlSubmitDynamic(e, { method: "DELETE" })}>
          DELETE
        </button>
        <button
          className="btn btn-outline btn-primary text-purple-900"
          onClick={(e) => hdlSubmitDynamic(e, { method: "PUT" })}>
          UPDATE
        </button>
      </div>
    </div>
  ) : (
    <div className="p-4">
      <h2 className="mb-4 font-bold text-xl">Add new product Form</h2>

      <form className="flex justify-center items-center text-lg">
        <div className="w-80 mr-4">
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData?.title}
              className="input"
              onChange={hdlChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              className="input"
              value={formData?.price}
              onChange={hdlChange}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              className="input"
              value={formData?.description}
              onChange={hdlChange}
            />
          </label>
          <label>
            Image:
            <input
              type="file"
              name="image"
              className="input p-2"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, image: file });
              }}
            />
          </label>
          <label>
            Category:
            <select
              name="category"
              className="select"
              value={formData?.category}
              onChange={hdlChange}>
              <option value="" disabled>
                Select type
              </option>
              {category.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.catName}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 flex justify-center">
            {/* การใช้งานแบบ function fix method */}
            <button
              className="btn btn-outline btn-primary px-10 text-purple-900"
              onClick={(e) => hdlSubmit(e)}>
              SUBMIT
            </button>
            {/* การใช้งานแบบ function dynamic method */}
            {/* <button onClick={(e) => hdlSubmitDynamic(e, { method: "POST" })}>
          Submit
        </button> */}
          </div>
        </div>

        {formData.image && (
          <img
            src={
              typeof formData.image === "string"
                ? formData.image // จาก API
                : URL.createObjectURL(formData.image)
            }
            alt="preview"
            className="w-xs rounded-2xl shadow-xl"
          />
        )}
      </form>
    </div>
  );
}

export default Userform;
