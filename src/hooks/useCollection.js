import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

import { db } from "../firebase.config";

export const useCollection = (coll, _q, _order, _limit) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const q = useRef(_q).current;
  const order = useRef(_order).current;
  const limitNum = _limit ?? 0;

  useEffect(() => {
    let ref = collection(db, coll);

    if (q) {
      ref = query(ref, where(...q), limit(limitNum));
    }

    if (order) {
      ref = query(ref, orderBy(...order), limit(limitNum));
    }

    setIsPending(true);
    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.empty) {
          setIsPending(false);
          setDocuments(null);
          setError("There is no comments, add the new one");
        } else {
          setIsPending(false);
          let results = [];
          snapshot.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
          });

          // update state
          setDocuments(results);

          setError(null);
          setIsPending(false);
        }
      },
      (error) => {
        setIsPending(false);

        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmout
    return () => unsub();
  }, [coll, q, order]);

  return { documents, error, isPending };
};
