import React, { useState, useEffect } from "react";
import axios from "axios";
import { uploadFile } from "../upload";  
import { Crop, Inventory, Image, VideoLibrary, Description, LocationOn } from "@mui/icons-material";
import { FaPhoneAlt } from "react-icons/fa";

const AgroMarkets = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    images: "",
    video: "",
  });


  const closeMediatorDialog = () => {
    setMediatorDialog({ visible: false, phoneNumbers: [] });
  };

  const [posts, setPosts] = useState([]);
  const [mediatorDialog, setMediatorDialog] = useState({
    visible: false,
    phoneNumbers: [],
  });
  const toggleForm = () => setShowForm(!showForm);
  const handleMediatorClick = (mediators) => {
    setMediatorDialog({
      visible: !mediatorDialog.visible,
      phoneNumbers: mediators,
    });
  };

  const CropCard = ({ posts }) => {
  const [mediatorDialog, setMediatorDialog] = useState({
    visible: false,
    phoneNumbers: [],
  });
}

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const uploadedPhoto = await uploadFile(file);
    setFormData((prevData) => ({ ...prevData, images: uploadedPhoto.url }));
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validVideoTypes.includes(file.type)) {
        alert("Please select a valid video file (MP4, WebM, or OGG).");
        return;
      }

      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxFileSize) {
        alert("Video file size should not exceed 10MB.");
        return;
      }

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/postCrop/${localStorage.getItem("token")}`,
        formData
      );
      setPosts((prevPosts) => [...prevPosts, response.data.cropsForSale]);
      setFormData({ title: "", description: "", quantity: "", images: "", video: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error uploading crop details:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchCropData = async () => {
      console.log("fetching");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/v1/getCropDetails/${token}`
        );
        console.log("res",response)
         
        setPosts(response.data.cropsForSale || []); 
      } catch (error) {
        console.error("Error fetching crop details:", error.response?.data || error.message);
      }
    };

    fetchCropData();
  }, []);

  return (
    <div className="agro-market-container">
      <h1>Agro Market</h1>
      <p>
        A farmer can list crop details such as type, quantity, and price.
        <br/>
        Interested retailers can view listings and directly contact the farmer
        to discuss purchasing options.
      </p>
      <button onClick={toggleForm} className="new-post-btn">
        New Post
      </button>

      {showForm && (
        <div className="modal-overlay" onClick={toggleForm}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="post-form"
          >
            <h2 className="p-2">Crop Details Form</h2>

            <div className="form-group">
              <label htmlFor="title">
                <Crop fontSize="small" style={{ marginRight: "5px" }} />
                Crop Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter crop title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                <Inventory fontSize="small" style={{ marginRight: "5px" }} />
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="Price">
                <Inventory fontSize="small" style={{ marginRight: "5px" }} />
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                placeholder="Enter Price of Crop"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="images">
                <Image fontSize="small" style={{ marginRight: "5px" }} />
                Upload Images
              </label>
              <input
                type="file"
                id="images"
                onChange={handleImageChange}
                required
              />
            </div>
 

            <div className="form-group">
              <label htmlFor="description">
                <Description fontSize="small" style={{ marginRight: "5px" }} />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Add a brief description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      )}

      <div className="posts-container">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <div className="cropDetails">
               
              <div className="media-upload">
                <img src={post.images} alt="Crop" className="crop-image_" />
                {post.video && (
                  <video
                    src={post.video} 
                    controls
                    className="video-player"
                  />
                )}
              </div>

              <div className="crop-description">
                <p>Description</p>
                <div className="Description">{post.description}</div>
              </div>
            </div>
            <div className="crop-info">
                <div className="crop-detail">
                  <p> Crop Title: {post.title}</p>
                </div>
                <div className="crop-quantity">
                  <p>Quantity: {post.quantity}</p>
                </div>
                <div className="crop-price">
                  <p>Price: {post.price}</p>
                </div>
            
            </div>
   
          <div className="mediator-section"  >
            <button
              className="mediators-btn"
              onClick={() => handleMediatorClick(post.mediators || [])}
            >
              <FaPhoneAlt style={{ marginRight: "8px" }} />
              Know Interested Mediators
            </button>
          </div>

          </div>
        ))}
      </div>
 
          {mediatorDialog.visible && (
        <div className="dialog-overlay" onClick={closeMediatorDialog}>
          <div
            className="dialog-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Mediator Phone Numbers</h2>
            {mediatorDialog.phoneNumbers.length > 0 ? (
              <ul>
                {mediatorDialog.phoneNumbers.map((phone, idx) => (
                  <li key={idx}>
                    <a href={`tel:${phone}`} className="phone-link">
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No mediators available.</p>
            )}
            <button onClick={closeMediatorDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgroMarkets; 





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./AgroMarkets.css";
// import { uploadFile } from "../upload";

// const AgroMarkets = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     crop: "",
//     quantity: "",
//     images: "",
//   });
//   const [posts, setPosts] = useState([]);

//   const toggleForm = () => setShowForm(!showForm);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     const uploadphoto = await uploadFile(file);
//     console.log("Uploaded Image:", uploadphoto);
//     setFormData({ ...formData, images: uploadphoto.secure_url });
//   };

//   // const handleVideoChange = async (e) => {
//   //   const file = e.target.files[0];
//   //   const uploadphoto = await uploadFile(file);
//   //   console.log("Uploaded Video:", uploadphoto);
//   //   setFormData({ ...formData, video: uploadphoto.playback_url });
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/v1/postCrop/${localStorage.getItem(
//           "token"
//         )}`,
//         formData
//       );
//       setPosts([...posts, response.data.cropDetails]);
//       setFormData({ crop: "", quantity: "", images: "" });
//       setShowForm(false);
//     } catch (error) {
//       console.error("Error uploading crop details:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchCropData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           alert("User not authenticated!");
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:3000/api/v1/getCropDetails/${token}`
//         );
//         setPosts(response.data.cropDetails ? [response.data.cropDetails] : []);
//       } catch (error) {
//         console.error("Error fetching crop details:", error);
//       }
//     };

//     fetchCropData();
//   }, []);

//   return (
//     <div className="agro-market-container">
//       <h1>Agro Market</h1>
//       <p>
//         A farmer can list crop details such as type, quantity, and price.
//         Interested retailers can view listings and directly contact the farmer
//         to discuss purchasing options.
//       </p>
//       <button onClick={toggleForm} className="new-post-btn">
//         New Post
//       </button>

//       {showForm && (
//         <div className="modal-overlay" onClick={toggleForm}>
//           <form
//             onClick={(e) => e.stopPropagation()}
//             onSubmit={handleSubmit}
//             className="post-form"
//           >
//             <input
//               type="text"
//               name="crop"
//               placeholder="Crop Type"
//               value={formData.crop}
//               onChange={handleInputChange}
//               required
//             />
//             <input
//               type="text"
//               name="quantity"
//               placeholder="Quantity"
//               value={formData.quantity}
//               onChange={handleInputChange}
//               required
//             />
//             <label>Upload Image</label>
//             <input type="file" onChange={handleImageChange} required />
//             <label>Upload Video</label>
//             {/* <input type="file" onChange={handleVideoChange} accept="video/*" /> */}
//             <button type="submit" className="submit-btn">
//               Submit
//             </button>
//           </form>
//         </div>
//       )}

//       <div className="posts-container">
//         {posts.map((post, index) => (
//           <div key={index} className="post-card">
//             <img src={post.cropImage} alt="Crop" className="crop-image" />
//             <div className="post-details">
//               <h3>{post.crop}</h3>
//               <p>Quantity: {post.cropQuantityForSale}</p>
//               {/* {post.cropVideo && (
//                 <video src={post.cropVideo} controls className="video-player" />
//               )} */}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AgroMarkets;
