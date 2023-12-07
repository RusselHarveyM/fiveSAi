import React, { useCallback, useState } from "react";
import classes from "./ViewImageOverlay.module.css";
import evaluate from "../../rooms/room/evaluate";
import addImage from "../../../static/images/addImage.png";

const ViewImageOverlay = ({ spaceData, scoreHandler, spaceDataHandler }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [data, setData] = useState(spaceData);
  const [tempData] = useState(data);
  const [deletedData, setDeletedData] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const onEvaluateHandler = useCallback(async () => {
    const images = data
      .map((space) => "data:image/png;base64," + space.image)
      .join("");
    const result = await evaluate(images);
    scoreHandler(result);
  }, [data, scoreHandler]);

  const onEditHandler = () => {
    setDeletedData([]);
    setSelectedImages([]);
    setIsEdit(!isEdit);
    setIsDelete(false);
  };

  const onConfirmHandler = () => {
    spaceDataHandler(
      deletedData ? deletedData : [],
      selectedImages ? selectedImages : [],
      isDelete
    );
    setIsEdit(!isEdit);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const onDeleteImageHandler = (event) => {
    const delData = data.filter(
      (image) => image.id === parseInt(event.target.id)
    );
    setDeletedData((prevData) => [...prevData, ...delData]);
    setData(() =>
      data.filter((image) => image.id !== parseInt(event.target.id))
    );
    setIsDelete(true);
  };

  const onCancelButtonHandler = () => {
    setData(tempData);
    setDeletedData([]);
    setIsDelete(false);
    setIsEdit(!isEdit);
  };

  return (
    <div className={classes.container}>
      <div className={classes.container_header}>
        <h2>Images</h2>
      </div>

      <div className={classes.imageContainer}>
        {data?.map((image) => (
          <div>
            <img
              className={classes.image}
              src={`data:image/png;base64,${image.image}`}
              alt={image.name}
              key={image.id}
            />
            {isEdit ? (
              <button
                id={image.id}
                className={classes.deleteImageBtn}
                onClick={onDeleteImageHandler}
              >
                X
              </button>
            ) : (
              ""
            )}
          </div>
        ))}
        {selectedImages.map((url, index) => (
          <img
            key={index}
            src={URL.createObjectURL(url)}
            alt="Selected"
            className={`${classes.image} ${isEdit ? classes.newImage : ""}`}
          />
        ))}
        {isEdit ? (
          <label htmlFor="imageUpload" className={classes.uploadImage}>
            <img src={addImage} alt="upload" />
            <input
              type="file"
              name="file"
              id="imageUpload"
              accept="image/png, image/jpeg"
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
            />
          </label>
        ) : (
          ""
        )}
      </div>
      <div className={classes.buttonsContainer}>
        <button className={classes.evaluateBtn} onClick={onEvaluateHandler}>
          Evaluate
        </button>
        {isEdit ? (
          <div className={classes.editBtnContainer}>
            <button
              className={classes.cancelBtn}
              onClick={onCancelButtonHandler}
            >
              Cancel
            </button>
            <button className={classes.confirmBtn} onClick={onConfirmHandler}>
              Confirm
            </button>
          </div>
        ) : (
          <button className={classes.editBtn} onClick={onEditHandler}>
            Edit Images
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewImageOverlay;
