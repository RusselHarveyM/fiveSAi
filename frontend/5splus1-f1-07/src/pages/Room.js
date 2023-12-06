import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Card from "../components/UI/Card/Card";
import classes from "../components/rooms/room/Room.module.css";
import SpaceNavContent from "../components/rooms/room/SpaceNavContent";
import Accordion from "../components/UI/Accordion/Accordion";

const Room = () => {
  const [roomData, setRoomData] = useState();
  const [spaces, setSpaces] = useState([]);
  const [space, setSpace] = useState([]);
  const [spaceId, setSpaceId] = useState();
  const [overallRating, setOverallRating] = useState(0.0);
  const [spaceRating, setSpaceRating] = useState([]);
  const [remark, setRemark] = useState("NOT CALIBRATED");
  const [isRefreshSNContent, setIsRefreshSNContent] = useState(false); // for refreshing SpaceNavContent.js
  const [rate, setRate] = useState({});

  const params = useParams();

  useEffect(() => {
    setOverallRating(() => {
      let totalScore = 0;
      spaceRating?.forEach((current) => {
        totalScore += current.rating;
      });
      console.log("current spaceRating >>>.", spaceRating);
      return (totalScore / spaceRating.length).toPrecision(2);
    });
  }, [spaceRating]);

  const onScoreHandler = useCallback(
    async (raw5s) => {
      const newRate = {
        sort: 0,
        setInOrder: 0,
        shine: 0,
        standarize: 0,
        sustain: 0,
        security: 0,
        isActive: true,
        spaceId: spaceId,
      };

      const properties = ["sort", "setInOrder", "shine", "standarize"];
      const lines = raw5s.split("\n");
      const space = space.filter((s) => s.id == spaceId);
      console("fin space >>>>>", space);

      lines.forEach((line) => {
        const match = line.match(/(\w+(?: In Order)?): (\d+)/);
        if (match) {
          let property = match[1].toLowerCase();
          if (property === "order") {
            property = "setInOrder";
          }
          if (property === "standardize") {
            property = "standarize";
          }
          const score = parseInt(match[2]);
          newRate[property] = score;
        }
      });

      setRate(newRate);

      const createNewComment = (ratingId) => ({
        sort: "",
        setInOrder: "",
        shine: "",
        standarize: "",
        sustain: "",
        security: "",
        isActive: true,
        ratingId,
      });

      const extractComments = (lines, newComment) => {
        const improvementsIndex = lines.findIndex(
          (line) => line.trim() === "Improvements:"
        );
        const commentLines = lines.slice(improvementsIndex + 1);
        let i = 0;
        commentLines.forEach((line) => {
          if (line.trim().startsWith("-")) {
            const match = line.match(/- (.*)/);
            if (match) {
              const comment = match[1];
              newComment[properties[i++]] = comment;
            }
          }
        });
      };

      if (!space[0].scores && !space[0].comments) {
        try {
          const resRate = await axios.post(
            "https://localhost:7124/api/ratings",
            newRate
          );

          const newComment = createNewComment(resRate.data);
          extractComments(lines, newComment);

          const resComment = await axios.post(
            "https://localhost:7124/api/comment",
            newComment
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const resRate = await axios.put(
            `https://localhost:7124/api/ratings/${space[0].scores.id}`,
            newRate
          );

          const newComment = createNewComment(resRate.data);
          extractComments(lines, newComment);

          const resComment = await axios.put(
            `https://localhost:7124/api/comment/${space[0].scores.id}`,
            newComment
          );
        } catch (error) {
          console.error(error);
        }
      }
      setIsRefreshSNContent((prevState) => !prevState);
    },
    [space, spaceId]
  );

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7124/api/rooms/${params.roomId}/room`
        );
        setRoomData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoomData();
  }, [params.roomId]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get(`https://localhost:7124/api/space`);
        setSpaces(() => {
          return response.data.filter((space) => space.roomId === roomData?.id);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchSpaces();
  }, [roomData?.id]);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  useEffect(() => {
    const upateSpace = async () => {
      try {
        spaces.forEach(async (space) => {
          console.log("im in ");
          console.log("im in space", space);
          if (space.length === 0) {
            console.log("No space found with the given id");
            return;
          }
          const response = await axios.get(
            `https://localhost:7124/api/ratings`
          );
          const resComment = await axios.get(
            `https://localhost:7124/api/comment`
          );

          const scores = response.data.filter(
            (score) => score.spaceId == space.id
          );

          const comments = resComment.data.filter(
            (comment) =>
              comment.ratingId == (scores.length > 0 ? scores[0].id : null)
          );

          if (scores.length > 0) {
            const properties = [
              "security",
              "setInOrder",
              "shine",
              "sort",
              "standarize",
              "sustain",
            ];
            let totalScores = 0;

            properties.forEach((property) => {
              totalScores += scores[0][property];
            });

            let score = totalScores / 4;
            // let isFound = spaceRating.filter(
            //   (rating) => rating.id === parseInt(spaceId)
            // );
            // if (isFound.length === 0) {
            setSpaceRating((prevRatings) => [
              ...prevRatings,
              { id: space.id, rating: score },
            ]);
            // }
          } else {
            let isFound = spaceRating.filter(
              (rating) => rating.id === parseInt(spaceId)
            );
            // if (isFound.length === 0) {
            setSpaceRating((prevRatings) => [
              ...prevRatings,
              { id: space.id, rating: 0 },
            ]);
            // }
          }

          setSpace((prevSpace) => {
            const newSpace = prevSpace.filter((space) => space.id !== spaceId);
            return [
              ...newSpace,
              {
                id: space.id,
                space: space,
                scores: scores[0],
                comments: comments[0],
              },
            ];
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    upateSpace();
  }, [spaceId, spaces, isRefreshSNContent]);

  const onSpaceNavHandler = useCallback(async (res) => {
    setSpaceId(res.target.id);
  }, []);

  return (
    <div className={classes.roomContainer}>
      <Card className={classes.roomContainer_header}>
        <button
          onClick={handleBackButtonClick}
          className={classes.backButton}
        ></button>
        <img
          src={`data:image/png;base64,${roomData?.image}`}
          alt="room preview"
        />
        <h1>{roomData?.roomNumber}</h1>
      </Card>
      <div className={classes.roomContainer_spaces}>
        <Card className={classes.spaceNavigation}>
          <h2>Spaces</h2>
          <div className={classes.spaceNavigation_list}>
            {spaces?.map((space) => (
              <button key={space.id} id={space.id} onClick={onSpaceNavHandler}>
                {space.name}
              </button>
            ))}
          </div>
        </Card>
        <SpaceNavContent
          onData={space.filter((s) => s.id === parseInt(spaceId))}
          onScoreHandler={onScoreHandler}
          spaceRate={spaceRating.filter(
            (rating) => rating.id === parseInt(spaceId)
          )}
          // overallScore={onSetTotalScoreHandler}
        />
      </div>
      <div className={classes.roomContainer_ratings}>
        <div className={classes.roomContainer_ratings_rating}>
          <h1>{overallRating}</h1>
          <h3>{remark}</h3>
        </div>
        <h1>5S+ Rating</h1>
        <Accordion space={space.filter((s) => s.id === parseInt(spaceId))} />
      </div>
      <div className={classes.roomContainer_redTags}></div>
    </div>
  );
};

export default Room;
