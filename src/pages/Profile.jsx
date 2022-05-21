import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";

import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { useFirestore } from "../hooks/useFirestore";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

const Profile = () => {
  const auth = getAuth();
  const storage = getStorage();
  const { deleteDocument: deleteListing } = useFirestore("listings");
  const [changeDetails, setChangeDetails] = useState(false);

  const {
    documents: listings,
    error,
    isPending: loading,
  } = useCollection(
    "listings",
    ["userRef", "==", auth.currentUser.uid],
    ["timestamp", "desc"]
  );

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listing) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const deleteImages = () => {
        // Delete images from storage
        listing.imgUrls.forEach((image) => {
          const pathName = image
            .split("/")
            .pop()
            .split("#")[0]
            .split("?")[0]
            .replace("%2F", "/");

          const imageRef = ref(storage, pathName);

          deleteObject(imageRef);
        });

        toast.success("Images deleted");
      };

      deleteImages();

      // Delete listing from firestore
      await deleteListing(listing.id);
      toast.success("Successfully deleted listing");
    }
  };

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);
  if (loading) return <Spinner />;

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails "
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            {!error && (
              <ul className="listingsList">
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing}
                    id={listing.id}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
};
export default Profile;
