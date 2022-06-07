import { useAppContext } from "../pages/context/appContext";
import { useState, useEffect } from "react";

import { ItemHeader, ItemIcon, ItemWrapper } from "../display/styled/UserItems";

import { FormRow, Alert } from ".";

import SendToModal from "../display/modals/SendTo";
import DeletionModal from "../display/modals/Deletion";

import { Share } from "@styled-icons/bootstrap/Share";
import { Trash } from "@styled-icons/bootstrap/Trash";

const UserItemIndividual = ({ itemId, itemName, selection }) => {
  const {
    activeList,
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

  const parentListId = activeList[0]._id;

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

  //Toggle Selection
  // const toggleSelection = async (item, itemIndex) => {
  //   console.log("item");
  //   console.log(item);
  //   console.log("itemIndex");
  //   console.log(itemIndex);
  //   const status = !item.selection[itemIndex].picked;
  // };

  const [sendIsOpen, setSendIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [selected, setSelected] = useState(false);

  console.log("selection");
  console.log(selection);
  const userSelectedIndex = selection.findIndex((x) => x.userId === user._id);

  useEffect(() => {
    setSelected(selection[userSelectedIndex].picked);
  }, []);

  const toggleSelection = async (selected) => {
    setSelected(!selected);
  };

  return (
    <ItemWrapper itemName={itemName} selected={selected}>
      <ItemHeader onClick={() => toggleSelection(selected)}>
        {itemName}
      </ItemHeader>

      <div className="delete" onClick={() => toggleDeleteModal(itemId)}>
        <ItemIcon className="big">
          <Trash />
        </ItemIcon>

        <DeletionModal
          isOpen={deleteIsOpen}
          afterOpen={afterOpen}
          beforeClose={beforeClose}
          onBackgroundClick={toggleDeleteModal}
          onEscapeKeydown={toggleDeleteModal}
          opacity={opacity}
          backgroundProps={{ opacity }}
          id={itemId}
        >
          <h4>Delete this Item?</h4>
          <button className="delete" onClick={() => handleDeleteItem(itemId)}>
            Yes
          </button>
          <button className="close" onClick={() => resetDeleteId("")}>
            No
          </button>
        </DeletionModal>
      </div>
    </ItemWrapper>
  );
};

export default UserItemIndividual;
