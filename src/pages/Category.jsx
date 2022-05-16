import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { useCollection } from "../hooks/useCollection";

const Category = () => {
  const params = useParams();
  const {
    documents: listings,
    error,
    isPending: loading,
  } = useCollection(
    "listings",
    ["type", "==", params.categoryName],
    ["timestamp", "desc"],
    10
  );

  if (loading) return <Spinner />;
  if (error) return toast.error("Could not fetch listings");

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};
export default Category;
