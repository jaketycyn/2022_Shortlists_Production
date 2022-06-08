import { useAppContext } from "../pages/context/appContext";
import { useState, useEffect } from "react";

import { ItemHeader, ItemIcon, ItemWrapper } from "../display/styled/UserItems";

import { FormRow, Alert } from ".";

import SendToModal from "../display/modals/SendTo";
import DeletionModal from "../display/modals/Deletion";

import { Share } from "@styled-icons/bootstrap/Share";
import { Trash } from "@styled-icons/bootstrap/Trash";

const UserItemIndividual = ({ itemId, itemIndex, itemName }) => {
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

  const title = activeList[0].listTitle;
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

  // const itemIndex = currentUserListItems.findIndex((x) => x._id === itemId);

  console.log("itemIndex");
  console.log(itemIndex);

  // const findingIndex = () => {
  //   const userSelectedIndex = currentUserListItems[
  //     itemIndex
  //   ].selection.findIndex((x) => x.userId === user._id);
  // };

  // useEffect(() => {
  //   setSelected(currentUserListItems[itemIndex].selection[userSelectedIndex].picked);
  // }, []);

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
