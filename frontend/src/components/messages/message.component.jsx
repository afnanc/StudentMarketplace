import React, { useEffect, useState } from "react";
import "./message.component.css";
import { useParams } from "react-router-dom";
import { db } from "../../utils/firebase.utils";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const Message = () => {
  // state to store the fetched user details
  const [userDetails, setUserDetails] = useState({
    email: "",
    name: "",
    uid: "",
  });
  // Iniitalize the userId and the states variables
  const { userId } = useParams();
  const [directMsgs, setDirectMsgs] = useState([]);
  const [contactId, setContactId] = useState("");
  const [contactName, setContactName] = useState({});
  const [selDirectMsg, setSelDirectMsg] = useState(null);
  const [inputMsg, setInputMsg] = useState("");

  // Fetch user details and direct messages on component mount or userId changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        const userDocRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserDetails({
            email: userData.email,
            name: userData.displayName || userData.name,
            uid: userSnapshot.id,
          });
          console.log("this is user data", userData);
          get_direct_msgs(userId);
        } else {
          console.log("No user details found.");
        }
      }
    };
    fetchUserDetails();
  }, [userId]);

  // Fetch and resolve contact names for each direct message
  useEffect(() => {
    const rev_contact_names = async () => {
      const contactsInfo = {};
      try {
        await Promise.all(
          directMsgs.map(async (doc) => {
            const contactID = doc.members.find((docId) => docId !== userId);
            if (!contactsInfo[contactID] && contactID) {
              contactsInfo[contactID] = await get_contact_name(contactID);
            }
          })
        );
        setContactName(contactsInfo);
      } catch (error) {
        console.log(error);
      }
    };
    rev_contact_names();
  }, [directMsgs, userId]);

  // Fetch the display name for a contact by the userId
  const get_contact_name = async (contactId) => {
    try {
      const ctRec = await getDoc(doc(db, "users", contactId));
      if (ctRec.exists()) {
        const contactData = ctRec.data();
        return contactData.displayName || contactData.name;
      } else {
        return "";
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  // Fetch all direct message conversations involving the current user
  const get_direct_msgs = async (userId) => {
    try {
      const data = await getDocs(
        query(
          collection(db, "conversations"),
          where("members", "array-contains", userId)
        )
      );
      const contactsData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDirectMsgs(contactsData);
    } catch (error) {
      console.log(error);
    }
  };

  // Select a direct message conversation and fetches its messages
  const sel_direct_msg = async (directMsg) => {
    setSelDirectMsg(directMsg);
    try {
      const data = await getDocs(
        query(
          collection(db, "conversations", directMsg.id, "messages"),
          orderBy("createdAt", "asc")
        )
      );
      const messagesData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSelDirectMsg((prevMsgs) => ({ ...prevMsgs, messages: messagesData }));
    } catch (error) {
      console.log(error);
    }
  };

  // Send a new message in the currently selected conversation conversation
  const send_msg = async () => {
    if (inputMsg.trim() || selDirectMsg) {
      const message = {
        senderId: userId,
        createdAt: serverTimestamp(),
        body: inputMsg,
      };
      try {
        await addDoc(
          collection(db, "conversations", selDirectMsg.id, "messages"),
          message
        );
        setInputMsg("");
        sel_direct_msg(selDirectMsg);
      } catch (error) {
        setInputMsg("");
        console.log(error);
      }
    }
  };

  // Create a new direct message conversation with a specified contact
  const create_dm = async () => {
    if (contactId.trim()) {
      const contactDoc = await getDocs(
        query(collection(db, "users"), where("displayName", "==", contactId))
      );
      if (!contactDoc.empty) {
        const contact_id = contactDoc.docs.map((doc) => doc.id);
        const contact_acc = directMsgs.find((dm) =>
          dm.members.includes(contact_id[0])
        );
        if (contact_acc) {
          sel_direct_msg(contact_acc);
          setContactId("");
        } else {
          const newDM = { members: [userId, contact_id[0]] };
          try {
            const docRef = await addDoc(collection(db, "conversations"), newDM);
            const newConversationData = { id: docRef.id, ...newDM };
            setDirectMsgs([...directMsgs, newConversationData]);
            setContactId("");
          } catch (error) {
            console.log(error);
            setContactId("");
          }
        }
      } else {
        alert("User doesn't exist");
      }
    }
  };

  // Render the message component
  return (
    <div id="chat">
      <div id="chat_sub">
        <div id="dms_list">
          <h2 id="chat_hd">Chats</h2>
          <input
            type="text"
            value={contactId}
            onChange={(event) => setContactId(event.target.value)}
            placeholder="Display Name"
          />
          <button id="create_dm" onClick={create_dm}>
            Create DM
          </button>
          <ul>
            {directMsgs.map((dm) => (
              <li id="cts_list" key={dm.id} onClick={() => sel_direct_msg(dm)}>
                {contactName[
                  dm.members.find((memberId) => memberId !== userDetails.uid)
                ] ||
                  dm.members.find((memberId) => memberId !== userDetails.uid)}
              </li>
            ))}
          </ul>
        </div>
        {selDirectMsg && (
          <div id="contact_msgs">
            <h2 id="ct_msgs_hd">Messages</h2>
            <ul id="msgs_list">
              {selDirectMsg.messages &&
                selDirectMsg.messages.map((message, index) => (
                  <li
                    key={index}
                    className={
                      message.senderId === userId ? "sent" : "received"
                    }
                  >
                    {message.body}
                  </li>
                ))}
            </ul>
            <div id="new_msg">
              <input
                id="inp_msg"
                type="text"
                value={inputMsg}
                onChange={(event) => setInputMsg(event.target.value)}
                placeholder="Message"
              />
              <button id="send_msg" onClick={send_msg}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
