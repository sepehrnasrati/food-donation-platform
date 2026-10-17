import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages for Visitors
import LandingPage from "./Pages/Visitor/LandingPage/LandingPage";
import Login from "./Pages/Visitor/Login/Login";
import Signup from "./Pages/Visitor/Signup/Signup";

// Pages for both types of users
import CommunityForum from "./Pages/AllUsers/CommunityForum/CommunityForum";
import Leaderboard from "./Pages/AllUsers/Leaderboard/Leaderboard";

// Pages for Donors
import ExpiryDates from "./Pages/Donor/ExpiryDates/ExpiryDates";
import GenerateRecipes from "./Pages/Donor/GenerateRecipes/GenerateRecipes";
import DonorHome from "./Pages/Donor/DonorHome/DonorHome";
import DiscoverFoodBanks from "./Pages/Donor/DiscoverFoodBanks/DiscoverFoodBanks";
import FoodBankHome from "./Pages/FoodBank/FoodBankHome/FoodBankHome";
import IncomingDonations from "./Pages/FoodBank/IncomingDonations/IncomingDonations";
import FoodDonation from "./Pages/FoodDonation/FoodDonation";

// Layout Pages (for React Router)
import HomeLayout from "./Layouts/HomeLayout";
import MainLayout from "./Layouts/MainLayout";

import { useEffect, useState } from "react";
import axios from "axios";
import ExpandedPost from "./Pages/AllUsers/CommunityForum/ExpandedPost";
import UserProfile from "./Pages/AllUsers/UserProfile/UserProfile";
import Chat from "./Pages/AllUsers/Chat/ChatLayout";

function App() {
  const [layout, setLayout] = useState(<HomeLayout />);

  // Using this user for testing
  const [testUser, setTestUser] = useState(null);
  const [token, setToken] = useState("");

  const [backendConnectionError, setbackendConnectionError] = useState(false);

  // select appropriate layout based on if the user is logged in or not
  useEffect(() => {
    if (testUser) {
      setLayout(
        <MainLayout
          user={testUser}
          setTestUser={setTestUser}
          setToken={setToken}
        />
      );
    } else {
      setLayout(<HomeLayout />);
    }
  }, [testUser]);

  const pingBackend = async () => {
    try {
      const response = await axios.get("http://localhost:8080/hello");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setbackendConnectionError(true); // set to true if connection refused
      } else {
        console.error("Error:", error.code); // other type of errors
      }
    }
  };

  // ping backend to check that it is running
  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <>
      <BrowserRouter>
        {/* Display error message if backend is not running */}
        {backendConnectionError && (
          <div
            style={{
              color: "red",
              padding: "10px",
              backgroundColor: "#f8d7da",
              fontSize: "20px",
              fontFamily: "arial",
              margin: "10px",
              borderRadius: "10px",
            }}
          >
            <h2>Backend Error:</h2> <br />
            Please make sure the backend application is running
            <br />
            <br />
            <h3>On VSCode:</h3>
            Right-click on <b>ApiApplication.java</b>, then click{" "}
            <b>Run Java</b>
          </div>
        )}

        <Routes>
          {
            /* Landing page Routes */

            <Route
              path="/"
              element={layout}
            >
              <Route
                path="food-banks"
                element={<DiscoverFoodBanks token={token} />}
              />
              <Route
                path="food-donation"
                element={<FoodDonation 
                  token={token} 
                  currentUserID={testUser ? testUser.userID : null} 
                />}
              />

              <Route
                path="/community"
                element={
                  <CommunityForum
                    token={token}
                    currentUserID={testUser ? testUser.userID : null}
                  />
                }
              />
              {/* Route for a specific post */}
              <Route
                path="/community/post/:postID"
                element={
                  <ExpandedPost
                    token={token}
                    currentUserID={testUser ? testUser.userID : null}
                  />
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <UserProfile
                    token={token}
                    currentUserID={testUser ? testUser.userID : null}
                  />
                }
              />
              {/* Updated to pass token to Leaderboard component */}
              <Route
                path="leaderboard"
                element={
                  <Leaderboard
                    currentUserID={testUser ? testUser.userID : null}
                    token={token}
                  />
                }
              />

              {
                /* These routes can only be accessed when user is null and will render in the Outlet component of HomeLayout */
                testUser === null && (
                  <>
                    <Route
                      index
                      element={<LandingPage />}
                    />
                    <Route
                      path="login"
                      element={
                        <Login
                          setTestUser={setTestUser}
                          setToken={setToken}
                        />
                      }
                    />
                    <Route
                      path="signup"
                      element={<Signup />}
                    />
                    )
                  </>
                )
              }

              {/* These are child routes that will render inside the Outlet component of MainLayout */}
              {
                /* Routes for donors */
                testUser &&
                  (testUser.accountType === "INDIVIDUAL" ||
                    testUser.accountType === "BUSINESS") && (
                    <>
                      <Route
                        index
                        element={<DonorHome currentUserID={testUser ? testUser.userID : null} token={token} />}
                      />
                      <Route
                        path="food-banks"
                        element={<DiscoverFoodBanks token={token} />}
                      />
                      <Route
                        path="expiries"
                        element={<ExpiryDates />}
                      />
                      <Route
                        path="recipes"
                        element={
                          <GenerateRecipes
                            token={token}
                            currentUserID={testUser ? testUser.userID : null}
                          />
                        }
                      />
                      <Route
                        path="food-donation"
                        element={
                          <FoodDonation 
                            token={token} 
                            currentUserID={testUser ? testUser.userID : null}
                          />}
                      />
                      <Route
                        path="chat"
                        element={
                          <Chat
                            token={token}
                            currentUserID={testUser ? testUser.userID : null}
                          />
                        }
                      />
                    </>
                  )
              }

              {
                /* Routes for Food banks */
                testUser && testUser.accountType === "FOOD_BANK" && (
                  <>
                    <Route
                      index
                      element={<FoodBankHome currentUserID={testUser.userID} token={token} />} />
                    /
                    <Route
                      path="incoming-donations"
                      element={
                      <IncomingDonations 
                        token={token}
                        currentUserID={testUser ? testUser.userID : null}
                      />}
                    />
                    <Route
                      path="chat"
                      element={
                        <Chat
                          token={token}
                          currentUserID={testUser ? testUser.userID : null}
                        />
                      }
                    />
                  </>
                )
              }

              {/* Page not found */}
              <Route
                path="*"
                element={
                  <main>
                    <h1>404 Page not found</h1>
                  </main>
                }
              />
            </Route>
          }
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;