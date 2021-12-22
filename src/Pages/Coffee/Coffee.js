import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import styled from "styled-components";
import { AppNames } from "../../common/AppNames";
import { SizeType } from "../../common/AppTypes";
import { ValueUtils } from "../../common/utils/ValueUtils";
import DbContext from "../../context/db";
import HomeContext from "../../context/home";
import TopBar from "../../layouts/components/TopBar";
import { SaveButton, SizeTypeButton } from "../../UI/Button";
import './Coffee.css';

const Container = styled.div`
  background-color: yellow;
  margin: 10px 10px;
`;

/**
 * Comi detail page component
 * Provide drink size selection function
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Coffee = props => {
  const { className, match, history } = props;
  const { dbMenuList } = useContext(DbContext);
  const { state, actions } = useContext(HomeContext);
  const { myFavouriteList } = state;
  const { setMyFavouriteList } = actions;
  const id = match.params?.id;

  const [selectMenuList, setSelectMenuList] = useState([]);

  useEffect(() => {
    if (isInvalidId(id)) {
      alert('DB에 없는 메뉴입니다.');
      history.push('/');
    }
  }, [id]);

  /**
   * Check if it is an invalid parameter ID value.
   * @param menuId
   * @returns {boolean}
   */
  const isInvalidId = (menuId) => {
    const findIndex = dbMenuList.findIndex(menu => `${menu.id}` === menuId);
    return findIndex === -1;
  }

  /**
   * menu selection function processing
   * @param sizeType
   */
  const handleSelectMenu = (sizeType) => {
    const hasMenu = selectMenuList.findIndex(selectMenu => selectMenu.sizeType === sizeType) > -1;

    let newSelectMenuList = [];
    if (hasMenu) {
      // If the menu has already been selected, modify the quantity and price
      newSelectMenuList = selectMenuList.map(menu => menu.sizeType === sizeType ? {
        ...menu,
        amount: menu.amount + 1,
        price: (menu.price + findMenu.price[sizeType])
      } : menu);
    } else {
      // New registration in case of new selection menu
      const selectMenu = {
        sizeType: sizeType,
        title: findMenu.title,
        amount: 1,
        price: ValueUtils.nvl(findMenu.price[sizeType], 0)
      }
      newSelectMenuList = selectMenuList.concat(selectMenu);
    }

    setSelectMenuList(newSelectMenuList);
  }

  /**
   * Save the selected menu list to Favorites.
   * If the menu is registered in Favorites, adjust the quantity and price
   */
  const handleSave = () => {
    let saveFavouriteList = myFavouriteList;
    selectMenuList.forEach(selectMenu => {
      const findMyFavourite = myFavouriteList.find(myFavourite => (myFavourite.sizeType === selectMenu.sizeType && myFavourite.title === selectMenu.title));
      // If the menu already exists in your favorites (increase quantity and price)
      if (findMyFavourite) {
        const amount = findMyFavourite.amount + selectMenu.amount;
        const price = findMyFavourite.price + selectMenu.price;

        // Modify Quantity/Price
        const newFavouriteList = saveFavouriteList.map(myFavourite => myFavourite.sizeType === selectMenu.sizeType && myFavourite.title === selectMenu.title ? {
          ...myFavourite,
          amount: amount,
          price: price
        } : myFavourite);

        // renewal
        saveFavouriteList = newFavouriteList;

      } else {
        // If there is no menu in favorites (create unique ID, add selected menu to favorites)
        const lastMyFavourite = saveFavouriteList[saveFavouriteList.length - 1];
        const lastMyFavouriteId = !ValueUtils.isEmpty(lastMyFavourite?.id) ? lastMyFavourite.id + 1 : 0; // undefined || number;
        const newFavourite = {
          id: lastMyFavouriteId,
          sizeType: selectMenu.sizeType,
          title: selectMenu.title,
          amount: selectMenu.amount,
          price: selectMenu.price
        }
        saveFavouriteList = saveFavouriteList.concat(newFavourite);
      }
    });

    setMyFavouriteList(saveFavouriteList);

    // Go to menu page after registration
    history.push('/menu');
  }

  const findMenu = dbMenuList.find(menu => `${menu.id}` === id); // 찾은메뉴 (DB리스트에서 id에 해당되는 메뉴를 찾습니다) undefined || object
  const totalAmount = selectMenuList.reduce((acc, selectMenu) => acc + selectMenu.amount, 0); // 총수량
  const totalPrice = selectMenuList.reduce((acc, selectMenu) => acc + selectMenu.price, 0); // 총가격
  return (
    <Container className={className}>
      <TopBar title="Coffee" />

      <div className="coffee-info-box">
        <div className="coffee-image">
          <img id='coffee-image' src={ValueUtils.nvl(findMenu.path, '/images/default.png')} />
        </div>
        <div className="coffee-size-info-box">
          <div className="coffee-size-title">
            Latte
          </div>
          <div className="coffee-size-item-box">

            <div className="coffee-size-item">
              <div className="coffee-size-item-button">
                <SizeTypeButton onClick={() => handleSelectMenu(SizeType.small)}>{AppNames.SizeTypePrefix(SizeType.small)}</SizeTypeButton>
              </div>
              <div className="coffee-size-item-price">
                ${ValueUtils.nvl(findMenu.price.small, 0)}
              </div>
            </div>

            <div className="coffee-size-item">
              <div className="coffee-size-item-button">
                <SizeTypeButton onClick={() => handleSelectMenu(SizeType.medium)}>{AppNames.SizeTypePrefix(SizeType.medium)}</SizeTypeButton>
              </div>
              <div className="coffee-size-item-price">
                ${ValueUtils.nvl(findMenu.price.medium, 0)}
              </div>
            </div>

            <div className="coffee-size-item">
              <div className="coffee-size-checkbox">
                <SizeTypeButton onClick={() => handleSelectMenu(SizeType.large)}>{AppNames.SizeTypePrefix(SizeType.large)}</SizeTypeButton>
              </div>
              <div className="coffee-size-item-price">
                ${ValueUtils.nvl(findMenu.price.large, 0)}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="coffee-select-info-box">
        <div className="coffee-select-info-title">
          Select List
        </div>
        <div className="coffee-select-list">
          <ul>
            {
              selectMenuList.map((selectMenu, selectIndex) => (
                <li className="coffee-select-list-item" key={selectIndex}>
                  <span style={{ width: '150px' }}>{AppNames.SizeType(selectMenu.sizeType)} {ValueUtils.nvl(selectMenu.title)}</span>
                  <span>{ValueUtils.nvl(selectMenu.amount, 0)}</span>
                  <span>${ValueUtils.nvl(selectMenu.price, 0)}</span>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="coffee-select-list-item-line">&nbsp;</div>
        <div className="coffee-select-list-total">
          <span>Total</span>
          <span>{totalAmount}</span>
          <span>${totalPrice}</span>
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </div>
      </div>
    </Container>
  )
}

/**
 * props type check
 * @type {{match: (shim|*), className: (shim|*), history: (shim|*)}}
 */
React.propTypes = {
  className: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object
}

export default Coffee;
