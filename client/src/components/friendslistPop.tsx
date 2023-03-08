import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
  faAddressBook,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import friendsList from "./friendslist";

//So the process would be to make a restricting field where they can scroll, etc, and then have it
//grab the data from the database for the friends(which youll have to make in the schema prob as an array)
//if the response is okay then foreach array make an account thing and append it
//overflow:scroll
//On the account field have their account, profile picture, name , online status,
//sorta like the library/todo project except with backend and for react.
//on each of these you should probably run the auth get first to make sure they are actually authed.
//you can have session checked every second, maybe even store the session expiration.

export default function FriendslistPop() {
  const navigate = useNavigate();

  return (
    <div className="logoutPop">
      <ul>
        <button className="individualBtn">
          <FontAwesomeIcon icon={faGear} />
          <p>Settings</p>
        </button>

        <button className="individualBtn">
          <FontAwesomeIcon icon={faUser} />
          <p>Profile</p>
        </button>

        <button className="individualBtn" onClick={friendsList}>
          <FontAwesomeIcon icon={faAddressBook} />
          <p>Friends</p>
        </button>
      </ul>
    </div>
  );
}
