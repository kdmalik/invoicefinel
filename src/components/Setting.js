import React, { useRef, useState } from "react";
import { storage, db, auth } from "../firebase"; // import auth to get the current user
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export const Setting = () => {
  const inputlogo = useRef(null);
  const [displayName, setDisplayName] = useState(localStorage.getItem('cName'));
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState(localStorage.getItem('email'))
  const [imagUrl, setImageUrl] = useState(localStorage.getItem("photoURL"));

  const updateCompanyName = () => {
    const user = auth.currentUser; // Get the current user object

    if (user) {
      // Update the displayName in Firebase Authentication
      updateProfile(user, {
        displayName: displayName
      })
      .then(() => {
        localStorage.setItem('cName', displayName);

        // Update the displayName in Firestore using user's UID
        updateDoc(doc(db, 'users', user.uid), {
          displayName: displayName
        })
        .then(() => {
          window.location.reload();
        })
        .catch(error => {
          console.error("Error updating Firestore document: ", error);
        });
      })
      .catch(error => {
        console.error("Error updating user profile: ", error);
      });
    } else {
      console.error("No user is signed in.");
    }
  };

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const updateLogo = () => {
    if (!file) return;

    // Create a consistent file path using the user ID
    const fileName = `${localStorage.getItem("cName")}/profilePicture.jpg`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress, if needed
      },
      (error) => {
        console.error("Upload failed", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadedURL) => {
          const user = auth.currentUser; // Get the current user object

          if (user) {
            // Update the user's profile with the new photoURL
            updateProfile(user, {
              displayName: displayName,
              photoURL: downloadedURL,
            })
            .then(() => {
              // Update the photoURL in Firestore
              const userDocRef = doc(db, "users", user.uid);
              return updateDoc(userDocRef, { photoURL: downloadedURL });
            })
            .then(() => {
              // Update localStorage and image URL in state
              localStorage.setItem("photoURL", downloadedURL);
              setImageUrl(downloadedURL);
              window.location.reload();
            })
            .catch((error) => {
              console.error("Failed to update profile or Firestore", error);
            });
          } else {
            console.error("No user is signed in.");
          }
        });
      }
    );
  };

  return (
    <div>
      <div className="setting-wrapper">
        <div className="profile-info update-cName">
          <img
            onClick={() => inputlogo.current.click()}
            className="pro"
            alt="profile-pic"
            src={imagUrl}
          />
          <input
            onChange={(e) => onSelectFile(e)}
            style={{ display: "none" }}
            type="file"
            ref={inputlogo}
          />
          {file && <button onClick={updateLogo} style={{ width: '30%', padding: '10px', backgroundColor: 'red' }}>Update Profile Pic</button>}
        </div>

        <div className="update-cName">
          <input onChange={e => setDisplayName(e.target.value)} type='text' placeholder="Company Name" value={displayName} />
          <button onClick={updateCompanyName}>Update Company Name</button>
        </div>
      </div>
    </div>
  );
};
