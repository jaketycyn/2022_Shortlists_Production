import { useAppContext } from "../pages/context/appContext";
import { useState, useEffect } from "react";
import styled from "styled-components";

import UserItemIndividual from "./UserItemIndividual";

import {
  Wrapper,
  CardWrapper,
  CardHeader,
  CardHeading,
  CardBody,
  CardIcon,
  CardFieldset,
  CardInput,
  CardOptionsItem,
  CardOptions,
  CardOptionsNote,
  CardButton,
  CardLink,
  ShareIcon,
} from "../display/styled/UserListIndividual";
import { ItemHeader, ItemIcon, ItemWrapper } from "../display/styled/UserItems";
import { FormRow, Alert } from ".";

import SendToModal from "../display/modals/SendTo";
import DeletionModal from "../display/modals/Deletion";

import { Share } from "@styled-icons/bootstrap/Share";
import { Trash } from "@styled-icons/bootstrap/Trash";

const UserListIndividual = ({ _id }) => {
  const {
    activeList,
    setCurrentUserListItems,
    currentUserListItems,
    allUserItems,
    isLoading,
    clearAlert,
    clearValues,
    displayAlert,
    showAlert,
    itemTitle,
    friendTitle,
    handleChange,
    createUserListItem,
    getUserCreatedListItems,
    deleteUserCreatedListItem,
    userOwnedItems,
    sendListToFriend,
    deleteItemId,
    setDeleteItemId,
    user,
  } = useAppContext();

  const [sendIsOpen, setSendIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [selected, setSelected] = useState(false);

  const parentListId = activeList[0]._id;
  const filteredListByParentId = allUserItems.filter(
    (item) => item.parentListId === parentListId
  );

  //updating context with Current List/items

  // console.log("filteredListByParentId");
  // console.log(filteredListByParentId);

  function toggleSendModal(e) {
    setOpacity(0);
    setSendIsOpen(!sendIsOpen);
  }

  const toggleDeleteModal = async (id) => {
    setDeleteItemId(id);
    setOpacity(0);
    setDeleteIsOpen(!deleteIsOpen);
  };

  function afterOpen() {
    setTimeout(() => {
      setOpacity(1);
    }, 100);
  }

  function beforeClose() {
    return new Promise((resolve) => {
      setOpacity(0);
      setTimeout(resolve, 300);
    });
  }

  const title = activeList[0].listTitle;

  //test setup use tutorial setup for final version.
  const handleSubmit = (e) => {
    //doing both friend title submit + item list submit in 1 submit button. Could be better to separate, but i believe by setting up explicit "if" statements with variables I'll be able to control for each use case.
    e.preventDefault();
    if (!itemTitle && !friendTitle) {
      displayAlert();
      return;
    }

    if (itemTitle && !friendTitle) {
      createUserListItem();
      //might put clear alert else where. This is for a nice popup notification to give user feedback. Could move this to within the reducer itself later.
      clearAlert();
      getUserCreatedListItems();
    }
    if (friendTitle && !itemTitle) {
      console.log("friend submit fired");

      sendListToFriend();
      //might put clear alert else where. This is for a nice popup notification to give user feedback. Could move this to within the reducer itself later.
      // clearAlert();
      // getUserCreatedListItems();
    }
  };

  const handleDeleteItem = async (id) => {
    await deleteUserCreatedListItem(deleteItemId);
    await getUserCreatedListItems();
  };

  const handleItemInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // console.log(`${name}: ${value}`)
    handleChange({ name, value });
  };

  const resetDeleteId = async (id) => {
    await setDeleteItemId(id);
    await toggleDeleteModal();
  };

  const ListSubmit = () => {};

  useEffect(() => {
    //taking items that belong to this list and setting them as an array known as currentUserListItems
    //we'll use this list to denote selection modifications, and rankings in future at a frontend level before 'submitting' and updating our servers with user selections.
    new Promise(function (resolve) {
      //timeout can be changed
      setTimeout(() => resolve(1), 1000);
    }).then(function (itemIndex) {
      setCurrentUserListItems(filteredListByParentId);
      // console.log(
      //   "currentUserListItems: " + JSON.stringify(currentUserListItems, 0, 2)
      // );
    });
  }, []);

  return (
    <Wrapper className="Origin">
      <form className="form" onSubmit={handleSubmit}>
        <CardHeader>
          <CardHeading>{title}</CardHeading>
          {showAlert && <Alert />}

          <ShareIcon onClick={() => clearValues()}>
            <Share onClick={() => toggleSendModal(_id)} />
          </ShareIcon>
          <SendToModal
            isOpen={sendIsOpen}
            afterOpen={afterOpen}
            beforeClose={beforeClose}
            onBackgroundClick={toggleSendModal}
            onEscapeKeydown={toggleSendModal}
            opacity={opacity}
            backgroundProps={{ opacity }}
          >
            <h4>Enter Friend's contact info below:</h4>
            <FormRow
              className="center-align"
              type="text"
              labelText="Email:"
              name="friendTitle"
              value={friendTitle}
              handleChange={handleItemInput}
            ></FormRow>
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Send List to Friend
            </button>
            <button className="close" onClick={() => toggleSendModal()}>
              Close
            </button>
          </SendToModal>

          <CardFieldset>
            <CardInput
              type="text"
              placeholder="Add Items to list"
              name="itemTitle"
              value={itemTitle}
              onChange={handleItemInput}
            />
          </CardFieldset>

          <CardFieldset>
            <CardButton
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Add Item
            </CardButton>
          </CardFieldset>
        </CardHeader>
        {/* Items */}
        {filteredListByParentId.length > 0 ? null : (
          <CardHeading>No items in list. Add one above</CardHeading>
        )}
        <div>
          {/* need to add key in the future*/}
          {filteredListByParentId.map((item, key) => {
            //   const itemIndex = currentUserListItems.findIndex(
            //     (x) => x._id === item._id
            //   );
            //console.log("itemIndex: " + itemIndex);

            return (
              <UserItemIndividual
                // for passing everything down the line/testing
                item={item}
                filteredListByParentId={filteredListByParentId}
                itemId={item._id}
                //itemIndex={itemIndex}
                //selected={selectedStatus}
                itemName={item.itemTitle}
              />
            );
          })}
        </div>
        <div>
          <button onClick={() => ListSubmit()}>Submit</button>
        </div>
      </form>
    </Wrapper>
  );
};

export default UserListIndividual;
