import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { adddata, deldata, updatedata } from './context/ContextProvider';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import ExportCSV from './ExportCSV';
import Navbar from './Navbaar';


const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordPerPage, setRecordPerPage] = useState(4);
    const [userData, setUserData] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [gender, setGender] = useState("All");
    const [sortOption, setSortOption] = useState("");
    const [openDropdown, setOpenDropdown] = useState([]);

    const { udata} = useContext(adddata);
    const { updata} = useContext(updatedata);
    const { dltdata, setDLTdata } = useContext(deldata);

    useEffect(() => {
        getdata();
    }, []);

    const getdata = async () => {
        try {
            const res = await fetch("/getusers");
            if (!res.ok) {
                throw new Error("Failed to fetch");
            }
            const data = await res.json();
            setUserData(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const deleteuser = async (id) => {
        try {
            const res = await fetch(`/deleteuser/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                throw new Error("Failed to delete user");
            }
            const deletedData = await res.json();
            setDLTdata(deletedData);
            getdata();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    const toggleDropdown = (index) => {
        const newOpenDropdown = [...openDropdown];
        newOpenDropdown[index] = !newOpenDropdown[index];
        setOpenDropdown(newOpenDropdown);
    }

    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const nextPage = () => {
        const npage = Math.ceil(filteredUsers.length / recordPerPage);
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handleChangePage = (page) => {
        setCurrentPage(page);
    }

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filtered = userData.filter(user => user.name.toLowerCase().includes(searchTerm));
        setFilteredUsers(filtered);
    };

    const filterByGender = (user) => {
        if (gender === "All") return true;
        return user.gender === gender;
    }

    const sortByAge = (a, b) => {
        if (sortOption === "asc") {
            return a.age - b.age;
        } else if (sortOption === "desc") {
            return b.age - a.age;
        }
        return 0;
    }

    const handleSortChange = (option) => {
        setSortOption(option);
    }

  
    const startIndex = (currentPage - 1) * recordPerPage;
    const endIndex = Math.min(startIndex + recordPerPage, filteredUsers.length);


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
      setIsLoggedIn(true);
    };
  
    const handleLogout = () => {
      setIsLoggedIn(false);
    };
  

    return (
        <>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            {udata &&
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>{udata.name}</strong>Added Successfully!
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }
            {updata &&
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>{updata.name}</strong>  Updated Successfully!
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }
            {dltdata &&
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>{dltdata.name}</strong>  Deleted Successfully!
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }

            <div className="mt-5">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', justifyItems: 'center' }}>
                        <div className="export_csv" style={{ backgroundColor: 'white' ,width:'155px', height:'42px'}}>

                            <ExportCSV/>
                        </div>
                        <div className="filter_gender" >
                            <div className="filter">
                                <h5>Filter By Gender</h5>
                                <div className="gender d-flex justify-content-between">
                                    <select
                                        className="form-select"
                                        style={{ cursor: 'pointer', width: 'auto' }}
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                         <div className="sort_dropdown" >
                            <h5>Sort By Age</h5>
                            <select
                                className="form-select"
                                style={{ cursor: 'pointer', width: 'auto' }}
                                value={sortOption}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="asc">Asending</option>
                                <option value="desc">Decending</option>
                            </select>
                        </div>

                        <div className="record-per-page-dropdown">
                            <h5>Record per Page</h5>
                            <select className="form-select" style={{ cursor: 'pointer', width: 'auto' }} value={recordPerPage} onChange={(e) => setRecordPerPage(parseInt(e.target.value))}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>

                        <input
                            type='text'
                            placeholder='Search by name'
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{
                                borderRadius: '45px',
                                fontSize: '16px',
                                borderColor: 'blue',
                                paddingLeft: '5px',
                                paddingRight: '5px',
                                width: '155px',
                                height:'42px',
                                "::placeholder": {
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '8px',
                                    Height: '10px'
                                }
                            }}
                        />
                                                                

                                                                <div className="add_btn mt-2 mb-2">
    <NavLink to="/register" className="btn btn-primary" style={{ display: 'block', borderRadius: '45px', width: '155px', height: '42px' }}>
        <i className="fa-solid fa-plus"></i>&nbsp; Add User
    </NavLink>
</div>

                    </div>

                    <table className="table">
                        <thead>
                            <tr className="table-dark">
                                <th scope="col">Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Email</th>
                                <th scope="col">Age</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Mobile</th>
                                <th scope="col">State</th>
                                <th scope="col">District</th>
                                <th scope="col">Address</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.filter(filterByGender).sort(sortByAge).slice(startIndex, endIndex).map((user, index) => (
                                <tr key={index}>
                                    <th scope="row">{startIndex + index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{user.date}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.state}</td>
                                    <td>{user.district}</td>
                                    <td>{user.add}</td>
                                    <td className="d-flex justify-content-between">
                                        <IconButton
                                            size="small"
                                            aria-label="more"
                                            id={`dropdown-basic-button-${index}`}
                                            aria-controls={`dropdown-menu-${index}`}
                                            aria-haspopup="true"
                                            variant="contained"
                                            onClick={() => toggleDropdown(index)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id={`dropdown-menu-${index}`}
                                            anchorEl={document.getElementById(`dropdown-basic-button-${index}`)}
                                            keepMounted
                                            open={openDropdown[index] || false}
                                            onClose={() => toggleDropdown(index)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <MenuItem
                                                component={NavLink}
                                                to={`view/${user.id}`}
                                                style={{ backgroundColor: 'blue', color: 'white', marginBottom: '3px' }}
                                            >
                                                View
                                            </MenuItem>
                                            <MenuItem
                                                component={NavLink}
                                                to={`edit/${user.id}`}
                                                style={{ backgroundColor: 'green', color: 'white', margin: '3px' }}
                                            >
                                                Edit
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => deleteuser(user.id)}
                                                style={{ backgroundColor: 'red', color: 'white', marginTop: '3px' }}
                                            >
                                                Delete
                                            </MenuItem>
                                        </Menu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <nav>
                        <ul className='pagination'>
                            <li className='page-item'>
                                <button className='page-link' onClick={prePage}>prev</button>
                            </li>
                            {[...Array(Math.ceil(filteredUsers.filter(filterByGender).length / recordPerPage)).keys()].map((num, index) => (
                                <li key={index} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handleChangePage(num + 1)}>{num + 1}</button>
                                </li>
                            ))}
                            <li className='page-item'>
                                <button className="page-link" onClick={nextPage}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Home;
