import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { toast } from "react-toastify";
import { useDocument } from "../hooks/useDocument";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const { document: landlord, error } = useDocument("users", params.landlordId);

  if (error) {
    toast.error("Could not get landlord data");
  }

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <div className="messageLabel">
                <label htmlFor="message" className="">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  className="textarea"
                  value={message}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>
            <a
              href={`mailto:${landlord?.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};
export default Contact;
