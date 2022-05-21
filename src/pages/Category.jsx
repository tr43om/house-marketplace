import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { useCollection } from "../hooks/useCollection";

const Category = () => {
  const params = useParams();
  // const [listings, setListings] = useState(null);
  const {
    documents: listings,
    isPending: loading,
    loadMore,

    documentsLength,
  } = useCollection(
    "listings",
    ["type", "==", params.categoryName],
    ["timestamp", "desc"],
    1
  );

  if (listings) {
    console.log(documentsLength);
  }

  if (loading) return <Spinner />;

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
          <br />
          <br />
          {documentsLength !== listings.length && (
            <div className="loadMore" onClick={loadMore}>
              Load more...
            </div>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};
export default Category;
