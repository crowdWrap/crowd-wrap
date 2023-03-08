import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
  faAddressBook,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import friendsList from "./friendslist";
import { useEffect, useState } from "react";

//So the process would be to make a restricting field where they can scroll, etc, and then have it
//grab the data from the database for the friends(which youll have to make in the schema prob as an array)
//if the response is okay then foreach array make an account thing and append it
//overflow:scroll
//On the account field have their account, profile picture, name , online status,
//sorta like the library/todo project except with backend and for react.
//on each of these you should probably run the auth get first to make sure they are actually authed.
//you can have session checked every second, maybe even store the session expiration.
//make a state list and push all of them from the get request
//now how would they add friends?
//I guess they can use the search bar and it will get the value from the search bar once enter is pressed
//or the search button is clicked and with that it will look in the database with someone with that username
//you can have it that instead of on enter it cna be on every btuton press where it searchs the database for someone with that name
// and if anything pops up it can display them.

export default function FriendslistPop() {
  const [clicked, setClicked] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const navigate = useNavigate();

  const click = () => {
    if (clicked == true) {
      setClicked(false);
    } else {
      setClicked(true);
    }
  };

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  return (
    <div className="friendslistPop">
      <div className="search">
        <button onClick={click} className="searchIconCover">
          <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} />
        </button>
        {clicked && (
          <input type="text" onChange={(e) => setSearchText(e.target.value)} />
        )}
      </div>

      <button className="friend">
        <img
          src="https://cdn.discordapp.com/attachments/463174949310562304/1075952796660146196/IMG_3462.png"
          alt=""
        />
        <p>Jake</p>
      </button>

      <button className="friend">
        <img
          src="https://cdn.discordapp.com/attachments/463174949310562304/1075952796660146196/IMG_3462.png"
          alt=""
        />
        <p>Qadeer</p>
      </button>

      <button className="friend" onClick={friendsList}>
        <img
          src="https://cdn.discordapp.com/attachments/463174949310562304/1075952796660146196/IMG_3462.png"
          alt=""
        />
        <p>Kevin</p>
      </button>
    </div>
  );
}
