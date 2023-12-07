import classes from "./DashBoardContent.module.css";
import Card from "../UI/Card/Card";
import axios from "axios";
import BuildingContext from "../../context/building-context";
import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";

const DashBoardContent = () => {
  const [roomsData, setRoomsData] = useState([]);
  const buildingCtx = useContext(BuildingContext);

  const fetchRooms = async () => {
    try {
      await axios.get(`https://localhost:7124/api/rooms`).then((response) => {
        setRoomsData(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className={classes.dashboard}>
      <section className={classes.dashboardCards}>
        <Card className={classes.item1}>
          <h1>{roomsData.length}</h1>
          <h2>Rooms</h2>
        </Card>
        <Card className={classes.item2} />
        <Card className={classes.item3} />
        <Card className={classes.item4} />
      </section>
      <div className={classes.buildingListContainer}>
        <div className={classes.buildingImageContainer_header}>
          <h2 className={classes.containerTitle}>
            BUILDINGS{" "}
            <sup className={classes.buildingLength}>
              {buildingCtx.buildingData.length}
            </sup>
          </h2>
        </div>
        <div className={classes.buildingList}>
          {buildingCtx.buildingData.map((building) => (
            <NavLink key={building.id} to={`/${building.id}/rooms`}>
              <Card className={classes.buildingCards} key={building.id}>
                <div className={classes.buildingImageContainer}>
                  <img
                    src={`data:image/png;base64,${building.image}`}
                    alt="Building preview"
                  ></img>
                </div>
                <div className={classes.buildingTitle}>
                  <h3>{building.buildingName}</h3>
                </div>
              </Card>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoardContent;
