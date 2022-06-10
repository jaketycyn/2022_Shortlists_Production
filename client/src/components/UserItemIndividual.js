import { useAppContext } from "../pages/context/appContext";
import { useState, useEffect } from "react";

import { ItemHeader, ItemIcon, ItemWrapper } from "../display/styled/UserItems";

import { FormRow, Alert } from ".";

import SendToModal from "../display/modals/SendTo";
import DeletionModal from "../display/modals/Deletion";

import { Share } from "@styled-icons/bootstrap/Share";
import { Trash } from "@styled-icons/bootstrap/Trash";

const UserItemIndividual = ({ item, itemId, itemIndex, itemName }) => {
  const {
    activeList,
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

  const handleDeleteItem = async (id) => {
    await deleteUserCreatedListItem(deleteItemId);
    await getUserCreatedListItems();
  };

  // const handleItemInput = (e) => {
  //   const name = e.target.name;
  //   const value = e.target.value;
  //   // console.log(`${name}: ${value}`)
  //   handleChange({ name, value });
  // };

  const resetDeleteId = async (id) => {
    await setDeleteItemId(id);
    await toggleDeleteModal();
  };

  const [sendIsOpen, setSendIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(false);

  const toggleSelection = async (selectedStatus) => {
    setSelectedStatus(!selectedStatus);
    console.log(selectedStatus);
  };

  // console.log("item: " + JSON.stringify(item, 0, 2));
  // console.log(
  //   "currentUserListItems: " + JSON.stringify(currentUserListItems, 0, 2)
  // );

  const findItemIndex = async () => {
    const result = await currentUserListItems.findIndex(
      (x) => x._id === item._id
    );
    console.log(result);
  };

  const findUserIndex = async (user) => {
    const result = await currentUserListItems[itemIndex].selection.findIndex(
      (x) => x.userId === user._id
    );
  };

  useEffect(
    (user) => {
      findItemIndex();
      findUserIndex(user);
    },
    [currentUserListItems]
  );

  findItemIndex();
  //old useEffect
  // useEffect(() => {
  //   new Promise(function (resolve) {
  //     //timeout can be changed
  //     setTimeout(() => resolve(1), 1000);
  //   })
  //     .then(function () {
  //       const itemIndex = currentUserListItems.findIndex(
  //         (x) => x._id === item._id
  //       );
  //       console.log("itemIndex: " + itemIndex);
  //       console.log(
  //         "currentUserListItems[itemIndex]: " +
  //           JSON.stringify(currentUserListItems[itemIndex], 0, 2)
  //       );
  //       console.log("user._id: " + user._id);
  //       console.log("user._id: " + user._id);
  //       return itemIndex;
  //     })
  //     .then(function (itemIndex) {
  //       const userIndex = currentUserListItems[itemIndex].selection.findIndex(
  //         (x) => x.userId === user._id
  //       );
  //       console.log("userIndex: " + userIndex);
  //       console.log(userIndex);
  //       return userIndex;
  //     })
  //     .then(function (itemIndex, userIndex) {
  //       console.log("itemIndex: " + itemIndex);
  //       console.log("userIndex: " + userIndex);
  //       const selection =
  //         currentUserListItems[itemIndex].selection[userIndex].picked;
  //       console.log("selection");
  //       console.log(selection);
  //       return selection;
  //     })
  //     .then(function (selection) {
  //       setSelectedStatus(selection);
  //     });
  // }, [currentUserListItems]);

  return (
    <ItemWrapper
      itemName={itemName}
      selected={selectedStatus}
      onClick={() => toggleSelection(selectedStatus)}
    >
      <ItemHeader>{itemName}</ItemHeader>

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
