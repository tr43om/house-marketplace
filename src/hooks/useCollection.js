import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

import { db } from "../firebase.config";

export const useCollection = (coll, _q, _order, _limit) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [limitNum, setLimitNum] = useState(_limit);
  const [documentsLength, setDocumentsLength] = useState(null);

  const q = useRef(_q).current;
  const order = useRef(_order).current;

  limitNum ?? setLimitNum(999);

  const loadMore = () => {
    setLimitNum((prevState) => prevState + _limit);
  };

  const getDocumentsLength = async () => {
    let ref = collection(db, coll);

    if (q) ref = query(collection(db, coll), where(...q));

    const docs = await getDocs(ref);
    setDocumentsLength(docs.size);
  };
  getDocumentsLength();

  useEffect(() => {
    let ref = collection(db, coll);
    let newRef;

    if (q) newRef = query(ref, where(...q), limit(limitNum));

    if (order) newRef = query(ref, orderBy(...order), limit(limitNum));

    if (order && q)
      newRef = query(ref, where(...q), orderBy(...order), limit(limitNum));

    setIsPending(true);

    const unsub = onSnapshot(
      newRef,
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
            console.log(doc.data().type);
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
  }, [coll, q, order, limitNum]);

  return { documents, error, isPending, loadMore, documentsLength };
};
