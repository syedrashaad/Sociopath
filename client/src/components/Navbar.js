import react, { useContext, useRef, useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import M from 'materialize-css';
import { UserContext, ChatContext } from '../App';
import Avatar from '@material-ui/core/Avatar';
import { NavLink } from 'react-router-dom';

import ChatScreen, { GlobalSocket } from './screens/ChatScreen';

// code for tool tip
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import "../components/screens/Navbar.css"
const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}));

function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();

    return <Tooltip arrow classes={classes} {...props} />;
}
// <BootstrapTooltip placement="right" title="Visit Profile" arrow>
// code for tool tip

const Navbar = () => {
    const searchModal = useRef(null);
    const chatsModal = useRef(null);
    const emailInputRef = useRef(null);
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])

    // using context in navbar
    const { state, dispatch } = useContext(UserContext);
    const { chatDispatch } = useContext(ChatContext);
    const history = useHistory();


    useEffect(() => {
        M.Modal.init(searchModal.current);
        M.Modal.init(chatsModal.current);
    }, [])

    const logOutFunction = () => {
        try {
            GlobalSocket.disconnect();
            GlobalSocket = null;
        } catch (err) { }
        sessionStorage.clear();
        localStorage.clear();
        dispatch({ type: "CLEAR" });
        chatDispatch({ type: "CLEAR" });

        history.push('/signin');
        window.location.reload();
    }

    const renderList = () => { // render list in NAVBAR using state login or not
        let signedInNavbar = [
            <BootstrapTooltip placement="bottom" title="Search Users" arrow>
                <i
                    data-target="modal1"
                    className="material-icons modal-trigger"
                    onClick={() => setTimeout(() => document.getElementById("search-text-box").focus(), 100)} // focus for input tag
                    style={{ color: "grey", paddingRight: "30px" }} >search
                </i>
            </BootstrapTooltip>,
            <BootstrapTooltip placement="bottom" title="Chat" arrow>
            <i data-target="chats-modal" className="material-icons modal-trigger" style={{ color: "grey", paddingRight: "30px" }}>chat</i></BootstrapTooltip>,
            <BootstrapTooltip placement="bottom" title="My Feed" arrow>
            <NavLink id="navlink"  to="/myfeed" activeClassName="active-nav">
                <div  style={{color:"white"}}>< i className="material-icons" style={{ color: "grey" }}>explore</i></div>
                
            </NavLink></BootstrapTooltip>,
            <BootstrapTooltip placement="bottom" title="Add Post" arrow>
            <NavLink id="navlink" to="/create" activeClassName="active-nav">
                <i className="material-icons" style={{ color: "grey" }}>post_add</i>
            </NavLink></BootstrapTooltip>,
             <BootstrapTooltip placement="bottom" title="User Profile" arrow>
            <NavLink id="navlink" to="/profile" activeClassName="active-nav">
                <i className="material-icons" style={{ color: "grey" }}>person</i>
            </NavLink></BootstrapTooltip>,
            <BootstrapTooltip placement="bottom" title="Logout" arrow>
                <i className="material-icons logoutbtn left" onClick={() => {
                    logOutFunction();
                }}>power_settings_new
                </i>
            </BootstrapTooltip>
        ]

        let signedOutNavbar = [
            // <BootstrapTooltip placement="bottom" title="Developers" arrow>
            //     <a href="https://github.com/syedrashaad/FinalProject" target="_blank">
            //         <i className="fas fa-code" aria-hidden="true"></i>
            //     </a>
            // </BootstrapTooltip>
            ,
        ]

        if (state) {
            signedInNavbar = signedInNavbar.map((item, index) => <li key={index}>{item}</li>);
            return signedInNavbar;
        }
        else {
            signedOutNavbar = signedOutNavbar.map((item, index) => <li key={index}>{item}</li>);
            return signedOutNavbar;
        }
    }

    // fetching user on search
    const fetchUsers = (query) => {
        setSearch(query)
        if (query !== "") {
            fetch('/search-users', {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query
                })
            }).then(res => res.json())
                .then(results => {
                    setUserDetails(results.user)
                })
        }
    }
    // fetching user on search

    // const logoStyles = {
    //     background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #8a0a86, #5a0a92, #2c0692, #0c2461)',
    //     backgroundSize: '10000% 10000%',
    //     animation: 'gradientAnimation 1s ease infinite',
    //     fontSize: '2.5rem',
    //     paddingTop: '3px',
    //     fontWeight: 'bold',
    //     fontFamily: 'sans-serif',
    //     WebkitBackgroundClip: 'text',
    //     backgroundClip: 'text',
    //     color: 'transparent',
    // };

    return (
        <>
            <nav id='navbar-length'>
                <div className="nav-wrapper white darken-4">
                    <BootstrapTooltip placement="bottom" title="Home" arrow>

                        <Link to={state ? "/" : "/signin"} className="brand-logo left">
                            <div id="h1h1" className="gradient-text">
                                Sociopath
                            </div>
                        </Link>
                    </BootstrapTooltip>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
                </div>

                <div
                    id="modal1"
                    className="modal"
                    ref={searchModal}
                    style={{ color: "black" }}
                >

                    <span id='' className="modal-close material-icons modelbtn"
                        onClick={() => {
                            setSearch('');
                            setUserDetails([]);
                        }}
                    >
                        cancel
                    </span>

                    <div className="modal-content">

                        <input
                            id="search-text-box"
                            type="text"
                            placeholder="Search Users.."

                            value={search}
                            onChange={(e) => fetchUsers(e.target.value)}
                        />
                        <ul className="collection">
                            {userDetails.map((item, index) => {
                                return (
                                    <div className="collection-item" key={index}>
                                        <h5 className="post-header" style={{ display: "flex" }}
                                            onClick={() => {
                                                M.Modal.getInstance(searchModal.current).close()
                                                setSearch('');
                                                setUserDetails([]);
                                            }}
                                        > {/* for navigating to profile of user */}
                                            <BootstrapTooltip placement="right" title="Visit Profile" arrow>
                                                <Link
                                                    style={{ display: "flex" }}
                                                    className="username"
                                                    key={item._id}
                                                    to={"/profile/" + (item._id !== state._id ? item._id : "")}
                                                >
                                                    <Avatar alt={item.name} className="useravatar" src={item.pic} />
                                                    <span className="username" style={{ color: "black" }}>{item.name}</span>

                                                </Link>
                                            </BootstrapTooltip>
                                        </h5>


                                        {
                                            /* 
                                                <Link 
                                                    key = {item._id}
                                                    to = { "/profile/" + (item._id !== state._id ? item._id : "")}
                                                    >
                                                    <h5
                                                        
                                                        onClick={()=>{
                                                            M.Modal.getInstance(searchModal.current).close()
                                                            setSearch('');
                                                            setUserDetails([]);
                                                        }}
                                                    >
                                                        {item.name}
                                                    </h5>
                                                </Link>  
                                                */
                                        }
                                        {/* <p>{item.email}</p> */}
                                    </div>
                                )
                            })}
                        </ul>
                    </div>


                </div>

                {/* Search model  */}


                {/* CHATS MODEL */}
                <div
                    id="chats-modal"
                    className="modal"
                    ref={chatsModal}
                    style={{
                        color: "black",
                        width: "100vw",
                        minHeight: "100vh",
                        marginTop: "0px"
                    }}
                >
                    <span id="chatclose" className="modal-close material-icons chatclose"
                        onClick={() => {
                            // setSearch('');
                            // setUserDetails([]);
                        }}
                    >
                        cancel
                    </span>


                    <div className="modal-content chatmodalcontent">

                        <ChatScreen />
                    </div>
                    {/* <div className="modal-footer">
                    <button
                        className="modal-close waves-effect waves-light btn"
                        onClick={()=>{}}
                    >
                        close
                    </button>
                </div> */}
                </div>
            </nav>

        </>
    )

}

export default Navbar;