import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ReactComponent as Facebook } from "../../assets/icons/contacts/facebook.svg";
import { ReactComponent as Linkedin } from "../../assets/icons/contacts/linkedin.svg";
import avatar from "../../assets/icons/default-avatar.jpg";
import { ReactComponent as Logout } from "../../assets/icons/logout.svg";
import { ReactComponent as Settings } from "../../assets/icons/settings.svg";
import { mainApi } from "../../components/utils/main-api";
import { getGridsAction } from "../../redux/grids-reducer";
import { allData } from "../full-library/data";
import "./profile.css";

import LibraryCard from "../../components/library-card/library-card";
import SharePage from "../../components/share-page/share-page";
import TutorialPagination from "../../components/tutorial-pagination/tutorial-pagination";

function Profile() {
  const userData = useSelector((state) => state.user);
  React.useEffect(() => {
    document.title = `Profile ${userData.name} | Matchmove machine`;
  }, []);
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  const navigate = useNavigate();

  const gridsData = useSelector((state) => state.grids);
  const filteredData = gridsData.filter(
    (item) => item.user._id === userData._id
  );
  const dispatch = useDispatch();
  const [data, setData] = useState(filteredData || []);
  const [currentPage, setCurrentPage] = useState(0);

  const getGrids = () => {
    mainApi.getGridsApi().then((grids) => {
      dispatch(getGridsAction(grids));
      setData(grids.filter((item) => item.user._id === userData._id));
    });
  };
  useEffect(() => {
    getGrids();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div className="profile_page_header">
        <div className="profile_page_header_content container">
          <div className="profile_page_header_content_top_actions">
            <div className="profile_page_header_content_top_actions_left">
              <NavLink to="/edit-profile">
                <button className="edit_profile_btn">
                  <Settings />
                </button>
              </NavLink>
              <div className="profile_username">
                <p>
                  <span>{userData.name}</span>
                </p>
              </div>
            </div>
            <button className="logout_btn" onClick={logout}>
              <Logout />
            </button>
          </div>
          <div className="profile_page_infs">
            <div className="profile_page_infs_left">
              <div className="profile_page_infs_avatar">
                <img
                  src={
                    userData.avatarUrl
                      ? `http://localhost:3001${userData.avatarUrl}`
                      : avatar
                  }
                  alt=""
                />
              </div>
              <div className="profile_page_infs_left_desc">
                <div>
                  <h4>Email:</h4>
                  <a href={`mailto:${userData.email}`}>
                    <p>{userData.email}</p>
                  </a>
                </div>
                <div>
                  <h4>Website:</h4>
                  <a href={userData.website}>
                    <p>{userData.website}</p>
                  </a>
                </div>
                <div>
                  <h4>Portfolio:</h4>
                  <NavLink to={userData.portfolio}>
                    <p>{userData.portfolio}</p>
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="profile_page_infs_right">
              <p>Contacts: </p>
              <div className="profile_page_infs_right_socials">
                <a href={userData.facebook || ""} target="blank">
                  <div className="profile_page_infs_right_social_item">
                    <Facebook />
                  </div>
                </a>
                <a href={userData.linkedin || ""} target="blank">
                  <div className="profile_page_infs_right_social_item">
                    <Linkedin />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile_assets container">
        <Tabs>
          <TabList>
            <Tab>Assets</Tab>
          </TabList>

          <TabPanel>
            <div className="profile_assets_wrapper">
              {data && data.length > 24 ? (
                <div className="library_items_tops_filter">
                  <TutorialPagination
                    items={allData}
                    setData={setData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={24}
                  />{" "}
                </div>
              ) : (
                ""
              )}
              {data && data.length ? (
                <div className="profile_assets_list">
                  {data.map((item, index) => (
                    <LibraryCard key={index} item={item} />
                  ))}
                </div>
              ) : (
                <div className="empty_assets">
                  <p>Empty</p>
                </div>
              )}
              {data && data.length > 24 ? (
                <div className="library_items_bottom_filter">
                  <TutorialPagination
                    items={allData}
                    setData={setData}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={15}
                  />{" "}
                </div>
              ) : (
                ""
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <SharePage userData={userData} />
    </>
  );
}

export default Profile;
