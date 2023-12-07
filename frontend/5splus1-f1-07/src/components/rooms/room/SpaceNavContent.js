import React, { useState, useEffect, useCallback } from "react";
import ReactDom from "react-dom";
import classes from "./SpaceNavContent.module.css";
import Card from "../../UI/Card/Card";
import axios from "axios";

import Backdrop from "../../UI/Modal/BackdropModal.js";
import ViewImageOverlay from "../../UI/Modal/ViewImageOverlay.js";
import ScoreCard from "./ScoreCard.js";

const apiBaseUrl = "https://localhost:7124/api/spaceimage";

const SpaceNavContent = (props) => {
  const [spaceTotalScore, setSpaceTotalScore] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [spaceData, setSpaceData] = useState();

  const fetchSpaceData = useCallback(async (id) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/get/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }, []);

  const deleteSpaceData = async (data) => {
    try {
      await axios.delete(`${apiBaseUrl}/delete/${data.id}`);
      setIsRefresh(!isRefresh);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadSpaceData = async (id, image) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      await axios.post(`${apiBaseUrl}/upload/${id}`, formData);
      console.log("uploading");
      setIsRefresh(!isRefresh);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSpaceData(props.onData[0]?.space?.id);
      console.log(data, "data");
      setSpaceData(data);
    };
    fetchData();
  }, [isRefresh, props.onData[0]?.space?.id]);

  const onSetNewSpaceDataHandler = async (data, selectedImages, isDelete) => {
    if (isDelete) {
      data?.map(deleteSpaceData);
    }
    selectedImages.map((image) =>
      uploadSpaceData(props.onData[0]?.space?.id, image)
    );
  };

  const onViewImageHandler = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <Card className={classes.spaceNavigation_content}>
      {isModalOpen && (
        <>
          {ReactDom.createPortal(
            <Backdrop onConfirm={closeModal} />,
            document.getElementById("backdrop-root")
          )}
          {ReactDom.createPortal(
            <ViewImageOverlay
              scoreHandler={props.onScoreHandler}
              spaceData={spaceData}
              spaceDataHandler={onSetNewSpaceDataHandler}
            />,
            document.getElementById("overlay-root")
          )}
        </>
      )}
      <header className={classes.spaceTitle}>
        <h2>
          {props.onData[0]?.space?.name}
          <sup className={classes.spaceScore}>
            {props.spaceRate[0]?.rating}/10
          </sup>
        </h2>
        <div className={classes.spaceTitle_buttons}>
          <button onClick={onViewImageHandler}>View Images</button>
        </div>
      </header>
      <div className={classes.spaceBody}>
        {["sort", "setInOrder", "shine", "standarize", "sustain"].map(
          (title) => (
            <ScoreCard
              key={title}
              score={props.onData[0]?.scores?.[title]}
              totalScore={spaceTotalScore}
              title={title.toUpperCase()}
            />
          )
        )}
      </div>
    </Card>
  );
};

export default SpaceNavContent;
