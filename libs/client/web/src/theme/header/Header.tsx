import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';

import {
  useSidebarActions,
  useAuthDialogStore,
  useSidebarState,
  useCartState,
  useNotificationState,
  useInboxState,
  useNotificationActions,
} from '@your-props/client/utils';

import {
  SvgCart,
  ProfileIcon,
  MessagesIcon,
  BellIcon,
  DashboardIcon,
  LogoutIcon,
  ProfileFilledIcon,
  GridIcon,
} from '@your-props/client/icons';

import menus from '../menu';
import DarkMode from './DarkMode';
import { SignIn } from '../../auth/SignIn';
import logoheader from '../assets/images/logo/logo.svg';
import profileImage from '../assets/images/avatar/user-img.png';
import { MessagesPage } from '../../dashboard/messages/Messages';
import { CartContent } from '../../dashboard/checkout/side-panel/CartContent';
import { Dropdown } from 'react-bootstrap';

import { NotificationDropDown } from './NotificationDropDown';
import { HeaderLocationFilter } from './HeaderLocationFilter';

export const Header = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();

  const { unreadChatsCount } = useInboxState();
  const { notifications, unreadNotificationsCount, isInitialized } =
    useNotificationState();
  const { fetchNotifications } = useNotificationActions();

  const user = JSON.parse(localStorage.getItem('user') as string);
  const userId = user?.id;

  const { cartCount } = useCartState();
  const sidebarState = useSidebarState();
  const { openSidebar, closeSidebar } = useSidebarActions();
  const { toggleDialogVisibility, toggleMessageDialogVisibility } =
    useAuthDialogStore();

  const dialogClassName =
    'w-auto m-[20px] md:my-[30px] md:mx-auto md:max-w-[1000px]';

  const token = Cookies.get('token');
  const isLoggedIn = !isEmpty(token);

  useEffect(() => {
    if (isLoggedIn && !isInitialized) {
      // fetchNotifications();
    }
  }, [isLoggedIn]);

  const headerRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  });

  const isSticky = () => {
    const header = document.querySelector('.js-header');
    const scrollTop = window.scrollY;
    scrollTop >= 300
      ? header?.classList.add('is-fixed')
      : header?.classList.remove('is-fixed');
    scrollTop >= 400
      ? header?.classList.add('is-small')
      : header?.classList.remove('is-small');
  };

  const menuLeft = useRef(null);
  const btnToggle = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [animateNotification, setAnimateNotification] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [animateChat, setAnimateChat] = useState(false);

  const matchWidth = window.matchMedia('(max-width: 992px)');

  useEffect(() => {
    if (unreadNotificationsCount > 0) {
      setAnimateNotification(true);

      setTimeout(() => {
        setAnimateNotification(false);
      }, 1500);
    }
  }, [unreadNotificationsCount]);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);

      setTimeout(() => {
        setAnimateCart(false);
      }, 1500);
    }
  }, [cartCount]);

  useEffect(() => {
    if (unreadChatsCount > 0) {
      setAnimateChat(true);

      setTimeout(() => {
        setAnimateChat(false);
      }, 1500);
    }
  }, [unreadChatsCount]);

  const menuToggle = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    menuLeft?.current.classList.toggle('active');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    btnToggle?.current.classList.toggle('active');

    setIsNavOpen(!isNavOpen);
  };

  const [isActive, setActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleOnClick = (index: number) => {
    setActiveIndex(index);
    setActive(!isActive);
  };

  useEffect(() => {
    if (isActive) setActive(!isActive);
  }, [isActive]);

  const logoutUser = () => {
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('token');
    navigate('/');
    if (location.pathname === '/') window.location.reload();
  };

  return (
    <header
      ref={headerRef}
      id="header_main"
      className="header_1 style2 js-header"
      style={{ backgroundColor: 'rgba(57,57,57,0.9)' }}
    >
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div id="site-header-inner">
              <div className="wrap-box !flex items-center justify-between h-[80px] gap-20">
                <Link to="/" rel="home" className="focus:text-white">
                  <div className="flex flex-row items-center">
                    <img
                      src={logoheader}
                      alt="YourNHS"
                      className="w-[29px] h-[29px]"
                    />
                    <h1 className="font-[700] text-[32px] leading-[56px] capitalize ml-[6px]">
                      YourNHS
                    </h1>
                  </div>
                </Link>

                {/* Sidebar menu button */}
                <div
                  className="mobile-button"
                  onClick={menuToggle}
                  ref={btnToggle}
                >
                  <span></span>
                </div>

                {/* Location filter (replaces legacy search) */}
                <HeaderLocationFilter />
                {/*<div className="w-[513px] h-full items-center relative hidden xl:flex">
                  <input
                    required
                    type="text"
                    value={searchValue}
                    onKeyUp={handleKeyDown}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Find appointments or services"
                    className="search w-[513px] !text-[14px] !h-[48px] !rounded-2xl !pl-20 !bg-[#222222] !text-white !border-0"
                  />
                  <div className="absolute left-0 ml-[14px]">
                    <SvgSearchIcon />
                  </div>
                  {searchValue && (
                    <div
                      onClick={handleClearSearch}
                      className="absolute right-[12px] cursor-pointer text-white"
                    >
                      ✖
                    </div>
                  )}
                </div>*/}

                <nav id="main-nav" className="main-nav" ref={menuLeft}>
                  {isNavOpen && matchWidth.matches && (
                    <div className="header-menus-left">
                      <div className="flex flex-row justify-between align-items-center m-10">
                        {isLoggedIn ? (
                          <>
                            <Link to={`/dashboard`} onClick={menuToggle}>
                              <div className="w-[40px] h-[40px] rounded-[10px] flex justify-center items-center bg-[#222222] ml-[12px] cursor-pointer">
                                <img
                                  alt="user"
                                  className="w-[40px] h-[40px] rounded-[10px] object-cover default_image"
                                  src={user?.avatar || profileImage}
                                />
                              </div>
                            </Link>

                            <Link
                              to={`/dashboard/notification`}
                              onClick={menuToggle}
                            >
                              <div className="w-[40px] h-[40px] rounded-[10px] relative flex justify-center items-center bg-[#222222] ml-[12px] cursor-pointer">
                                <div className="w-8 h-8 bg-[#ef6a3b] text-white absolute top-[-10px] right-[-10px] rounded-[100px] flex justify-center items-center text-[12px] font-bold">
                                  <div
                                    className={`cart-count ${
                                      animateNotification ? 'animate-count' : ''
                                    }`}
                                  >
                                    {isLoggedIn ? unreadNotificationsCount : 0}
                                  </div>
                                </div>
                                <div
                                  className={`cart-icon ${
                                    animateNotification ? 'animate-cart' : ''
                                  }`}
                                >
                                  <BellIcon />
                                </div>
                              </div>
                            </Link>

                            <div className="w-[40px] h-[40px] rounded-[10px] relative flex justify-center items-center bg-[#222222] ml-[12px] cursor-pointer">
                              <span
                                onClick={() =>
                                  toggleMessageDialogVisibility(
                                    true,
                                    <MessagesPage />,
                                    dialogClassName
                                  )
                                }
                              >
                                <div className="w-8 h-8 bg-[#ef6a3b] text-white absolute top-[-10px] right-[-10px] rounded-[100px] flex justify-center items-center text-[12px] font-bold">
                                  <div
                                    className={`cart-count ${
                                      animateChat ? 'animate-count' : ''
                                    }`}
                                  >
                                    {isLoggedIn ? unreadChatsCount : 0}
                                  </div>
                                </div>
                                <div
                                  className={`cart-icon ${
                                    animateChat ? 'animate-cart' : ''
                                  }`}
                                >
                                  <MessagesIcon fill="white" />
                                </div>
                              </span>
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              toggleDialogVisibility(true, <SignIn />)
                            }
                            className="border-none hover:border-none active:border-none h-[40px] rounded-[10px] flex flex-row justify-center items-center bg-[#34353A] px-[15px] cursor-pointer"
                          >
                            <ProfileIcon fill="white" />
                            <p className="ml-[10px]">Login</p>
                          </button>
                        )}

                        {/*<div
                          onClick={() =>
                            !isLoggedIn
                              ? toggleDialogVisibility(true, <SignIn />)
                              : sidebarState?.visible
                              ? closeSidebar()
                              : openSidebar({
                                  label: 'Cart',
                                  visible: true,
                                  content: <CartContent />,
                                })
                          }
                          className={`w-[40px] h-[40px] rounded-[10px] flex justify-center items-center cursor-pointer ${
                            sidebarState?.visible
                              ? 'bg-[#EF6A3B]'
                              : isLoggedIn
                              ? 'bg-[#222222]'
                              : 'bg-[#34353A]'
                          } ml-[12px] cursor-pointer`}
                        >
                          <div className="w-8 h-8 bg-[#ef6a3b] text-white absolute top-[15px] right-[15px] rounded-[100px] flex justify-center items-center text-[12px] font-bold">
                            <div
                              className={`cart-count ${
                                animateCart ? 'animate-count' : ''
                              }`}
                            >
                              {isLoggedIn ? cartCount : 0}
                            </div>
                          </div>
                          <div
                            className={`cart-icon ${
                              animateCart ? 'animate-cart' : ''
                            }`}
                          >
                            <SvgCart />
                          </div>
                        </div>*/}
                      </div>
                    </div>
                  )}

                  <ul id="menu-primary-menu" className="menu">
                    {menus.map((data: any, index: number) => (
                      <li
                        key={index}
                        onClick={() => handleOnClick(index)}
                        className={`menu-item ${
                          data.namesub ? 'menu-item-has-children' : ''
                        } ${activeIndex === index ? 'active' : ''} `}
                      >
                        {data.name !== 'Discover' ? (
                          <Link
                            className="flex justify-center"
                            to={data.links}
                            onClick={
                              isNavOpen && matchWidth.matches
                                ? menuToggle
                                : undefined
                            }
                          >
                            {data.name}
                          </Link>
                        ) : (
                          <Link className="flex justify-center" to={'#'}>
                            {data.name}
                          </Link>
                        )}
                        {data.namesub && (
                          <ul
                            className={`sub-menu ${
                              isActive ? 'hidden' : 'visible'
                            }`}
                          >
                            {data.namesub.map((submenu: any) => (
                              <li
                                key={submenu.id}
                                className={
                                  pathname === submenu.links
                                    ? 'menu-item current-item'
                                    : 'menu-item'
                                }
                              >
                                <Link to={submenu.links} onClick={menuToggle}>
                                  {submenu.sub}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="header-menus">
                  <div className="flat-search-btn flex h-[80px]">
                    <div className="flex flex-row">
                      {isLoggedIn ? (
                        <>
                          <Dropdown>
                            <Dropdown.Toggle
                              id="dropdown-autoclose-inside"
                              className="dropdown notify p-0 ml-[12px]"
                            >
                              <div
                                className={`w-[40px] h-[40px] rounded-[10px] flex justify-center items-center  ml-[12px] cursor-pointer ${
                                  user?.avatar ? 'bg-[#222222]' : 'bg-[#303030]'
                                }`}
                              >
                                <img
                                  alt="user"
                                  className={`w-[40px] h-[40px] rounded-[10px] ${
                                    user?.avatar
                                      ? 'object-cover'
                                      : 'object-contain p-[3px]'
                                  }`}
                                  src={user?.avatar || profileImage}
                                />
                              </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                              className="px-4 py-8 bg-[#393939] rounded-[10px]"
                              style={{ margin: 0 }}
                            >
                              <Dropdown.Item className="mb-4 p-0 whitespace-normal hover:bg-transparent focus:bg-transparent">
                                <button
                                  onClick={() => navigate('/dashboard')}
                                  className="btn-icon flex gap-6 w-full h-[38px] rounded-[10px] bg-transparent border-transparent px-[12px] py-[6px] mr-3"
                                >
                                  <DashboardIcon />
                                  <p className="font-semibold text-[18px]">
                                    Dashboard
                                  </p>
                                </button>
                              </Dropdown.Item>
                              <Dropdown.Item className="mb-4 p-0 whitespace-normal hover:bg-transparent focus:bg-transparent">
                                <button
                                  type="button"
                                  onClick={() => navigate('/dashboard/data-insights')}
                                  className="btn-icon flex gap-6 w-full h-[38px] rounded-[10px] bg-transparent border-transparent px-[12px] py-[6px] mr-3"
                                >
                                  <GridIcon />
                                  <p className="font-semibold text-[18px]">
                                    Analytics
                                  </p>
                                </button>
                              </Dropdown.Item>
                              <Dropdown.Item className="mb-4 p-0 whitespace-normal hover:bg-transparent focus:bg-transparent">
                                <button
                                  onClick={() =>
                                    navigate(`/user/${userId}/details`)
                                  }
                                  className="btn-icon flex gap-6 w-full h-[38px] rounded-[10px] bg-transparent border-transparent px-[12px] py-[6px] mr-3"
                                >
                                  <ProfileFilledIcon />
                                  <p className="font-semibold text-[18px]">
                                    Profile
                                  </p>
                                </button>
                              </Dropdown.Item>
                              <Dropdown.Item className="mb-0 p-0 whitespace-normal hover:bg-transparent focus:bg-transparent">
                                <button
                                  onClick={() => logoutUser()}
                                  className="btn-icon flex gap-6 w-full h-[38px] rounded-[10px] bg-transparent border-transparent px-[12px] py-[6px] mr-3"
                                >
                                  <LogoutIcon />
                                  <p className="font-semibold text-[18px]">
                                    Logout
                                  </p>
                                </button>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>

                          {/* Dropdown for notification */}
                          <NotificationDropDown
                            isLoggedIn={isLoggedIn}
                            animateIcon={animateNotification}
                            notifications={notifications?.slice(0, 5)}
                            unreadNotificationsCount={unreadNotificationsCount}
                          />

                          <div className="relative w-[40px] h-[40px] rounded-[10px] flex justify-center items-center bg-[#222222] ml-[12px] cursor-pointer">
                            <div
                              onClick={() =>
                                toggleMessageDialogVisibility(
                                  true,
                                  <MessagesPage />,
                                  dialogClassName
                                )
                              }
                              className="cursor-pointer"
                            >
                              {isLoggedIn && unreadChatsCount > 0 && (
                                <div
                                  className={`w-8 h-8 bg-[#ef6a3b] text-white absolute top-[-8px] right-[-8px] rounded-[100px] flex justify-center items-center text-[12px] font-bold z-50 ${
                                    animateChat ? 'animate-count' : ''
                                  }`}
                                >
                                  <div>{unreadChatsCount}</div>
                                </div>
                              )}
                              <div>
                                <MessagesIcon fill="white" />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            toggleDialogVisibility(true, <SignIn />)
                          }
                          className="border-none hover:border-none focus:border-none h-[40px] rounded-[10px] flex flex-row justify-center items-center bg-[#34353A] px-[15px] cursor-pointer"
                        >
                          <ProfileIcon fill="white" />
                          <p className="ml-[10px] font-semibold">Login</p>
                        </button>
                      )}

                      {/*<div
                        onClick={() =>
                          !isLoggedIn
                            ? toggleDialogVisibility(true, <SignIn />)
                            : sidebarState?.visible
                            ? closeSidebar()
                            : openSidebar({
                                label: 'Cart',
                                visible: true,
                                content: <CartContent />,
                              })
                        }
                        className={`w-[40px] h-[40px] rounded-[10px] flex justify-center items-center cursor-pointer ${
                          sidebarState?.visible
                            ? 'bg-[#EF6A3B]'
                            : isLoggedIn
                            ? 'bg-[#222222]'
                            : 'bg-[#34353A]'
                        } ml-[12px] cursor-pointer`}
                      >
                        <div
                          className={`w-8 h-8 bg-[#ef6a3b] text-white absolute top-[12px] right-[5px] rounded-[100px] flex justify-center items-center text-[12px] font-bold z-50 ${
                            animateCart ? 'animate-count' : ''
                          }`}
                        >
                          <div>{isLoggedIn ? cartCount : 0}</div>
                        </div>
                        <div>
                          <SvgCart />
                        </div>
                      </div>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DarkMode />
    </header>
  );
};
