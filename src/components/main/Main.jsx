import "./main.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";

const Main = () => {
  // API url
  const API = "https://companyconnect.herokuapp.com";
  //
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  //
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [alertmsg, setAlertMsg] = useState("");
  //
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [logo, setLogo] = useState("");
  //
  const [searchInput, setSearchInput] = useState("");

  //
  const [editId, setEditId] = useState();
  const cityData = [
    {
      state: "Maharashtra",
      cities: ["Mumbai", "Navi Mumbai", "Nagpur"],
    },
    {
      state: "Delhi",
      cities: ["Delhi-1", "Delhi-2", "Delhi-3"],
    },
    {
      state: "Chennai",
      cities: ["Chennai-1", "Chennai-2", "Chennai-3"],
    },
  ];

  const [cities, setCities] = useState([]);

  //
  const handleStateChange = () => {
    const states = document.getElementsByClassName("stateOptionValue");
    let selected_state = "";
    for (let i = 0; i < states.length; i++) {
      if (states[i].selected) {
        selected_state = states[i].value;
      }
    }
    // get state's city data
    const stateCityData = cityData.find((c) => c.state === selected_state);
    setCities(stateCityData.cities);
    setState(stateCityData.state);
  };

  //
  const handleCityChange = () => {
    const cityOptions = document.getElementsByClassName("cityOptionValue");
    let selected_city = "";
    for (let i = 0; i < cityOptions.length; i++) {
      if (cityOptions[i].selected) {
        selected_city = cityOptions[i].value;
      }
    }
    setCity(selected_city);
    console.log(selected_city);
  };

  //  custom functions
  const handleToBeEdited = (item) => {
    setEditId(item._id);
    setName(item.name);
    setEmail(item.email);
    setNumber(item.number);
    setDescription(item.description);
    setLogo(item.logo);
    setState(item.state);
    setCity(item.city);

    // const states = document.getElementsByClassName("stateOptionValue");
    // let selected_state = "";
    // for (let i = 0; i < states.length; i++) {
    //   if (states[i] === item.state) {
    //     return states[i].selected;
    //   }
    // }

    // handleStateChange();
  };

  const handleEdit = async () => {
    const editedData = {
      name,
      description,
      email,
      number,
      state,
      city,
      logo,
    };

    try {
      if (
        (name && description && email && number && state && city && logo) !== ""
      ) {
        const updateData = await axios.put(
          `${API}/company/${editId}`,
          editedData
        );
        if (updateData.data.msg === "success") {
          let temp = filterData;
          let item = temp.find((i) => i._id === editId);

          let indexOfItem = filterData.indexOf(item);
          temp[indexOfItem] = updateData.data.data;
          setData(temp);
          setFilterData(temp);
          setEditOpen(false);
          setName("");
          setDescription("");
          setEmail("");
          setNumber("");
          setLogo("");
          setState("");
          setCity("");
        } else {
          alert("Failed to update data");
        }
      } else {
        alert("Fill all required data");
      }
    } catch (error) {
      console.log(error.message);
      setName("");
      setDescription("");
      setEmail("");
      setNumber("");
      setLogo("");
      setState("");
      setCity("");
    }
  };

  const handleDelete = async (item) => {
    try {
      const deleteData = await axios.delete(`${API}/company/${item._id}`);
      if (deleteData.data.msg === "success") {
        let dataAfterDelete = filterData.filter((i) => i._id !== item._id);
        setData(dataAfterDelete);
        setFilterData(dataAfterDelete);
      } else {
        alert("Failed to delete data");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addData = async () => {
    const payload = {
      name,
      description,
      email,
      number,
      state,
      city,
      logo,
    };

    try {
      if (number.length !== 10) {
        setShow(true);
        setAlertMsg("Enter valid number");
      } else if (
        (name && description && email && number && state && city && logo) !== ""
      ) {
        const addNew = await axios.post(`${API}/company`, payload);
        if (addNew.data.msg === "success") {
          setData([...data, addNew.data.data]);
          setFilterData([...data, addNew.data.data]);
          console.log("Added ! ✅");
        }
        setOpen(false);
        setShow(false);
        setName("");
        setDescription("");
        setEmail("");
        setNumber("");
        setLogo("");
        setState("");
        setCity("");
      } else {
        setAlertMsg("Fill all required fields");
        setShow(true);
      }
    } catch (error) {
      console.log(error.message);
      setOpen(false);
      setShow(false);
    }
  };

  const handleFilter = (pagenumber) => {
    let updatedData = data;

    // search input filter
    if (searchInput.length === 0 || null) {
      setFilterData(updatedData);
    } else {
      updatedData = updatedData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.description.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.number.includes(searchInput.toLowerCase()) ||
          item.email.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.state.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.city.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // pagination filter
    if (pagenumber) {
      setCurrentPage(pagenumber);
      updatedData = updatedData.slice(5 * (currentPage - 1), 5 * currentPage);
    } else {
      updatedData = updatedData.slice(5 * (currentPage - 1), 5 * currentPage);
    }
    console.log(updatedData);
    setFilterData(updatedData);
  };

  useEffect(() => {
    async function getData() {
      let { data } = await axios.get(`${API}/company`);
      console.log(data.data);
      setData(data.data);
      setFilterData(data.data);
    }
    getData();
    handleFilter();
    // eslint-disable-next-line
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(data.length / 5);
  const page = [];
  for (let i = 0; i < pages; i++) {
    page.push(i + 1);
  }

  return (
    <div className="main">
      {open && (
        <div className="main-form" id="form">
          <div className="main-form-wrapper">
            {show && <Alert variant="danger">{alertmsg}</Alert>}
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Name <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="company name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Description <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="company description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Email <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Number <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="number"
                  onChange={(e) => setNumber(e.target.value)}
                  value={number}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  State <span className="important">*</span>
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleStateChange}
                >
                  <option>--Select State--</option>
                  {cityData.map((s, index) => (
                    <option
                      className="stateOptionValue"
                      value={s.state}
                      key={index}
                    >
                      {s.state}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  City <span className="important">*</span>
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleCityChange}
                >
                  <option>--Select City--</option>
                  {cities.map((c, index) => (
                    <option className="cityOptionValue" value={c} key={index}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  Logo URL <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="enter logo url"
                  onChange={(e) => setLogo(e.target.value)}
                />
              </Form.Group>

              <Button variant="success" className="submit" onClick={addData}>
                Submit
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  setShow(false);
                }}
              >
                Cancel
              </Button>
            </Form>
          </div>
        </div>
      )}
      {editOpen && (
        <div className="main-form-edit" id="form">
          <div className="main-form-wrapper-edit">
            {show && <Alert variant="danger">{alertmsg}</Alert>}
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Name <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="company name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Description <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="company description"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Email <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  Number <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="number"
                  onChange={(e) => setNumber(e.target.value)}
                  value={number}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  State <span className="important">*</span>
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleStateChange}
                >
                  <option>--Select State--</option>
                  {cityData.map((s, index) => (
                    <option
                      className="stateOptionValue"
                      value={s.state}
                      key={index}
                    >
                      {s.state}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  City <span className="important">*</span>
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleCityChange}
                >
                  <option>--Select City--</option>
                  {cities.map((c, index) => (
                    <option className="cityOptionValue" value={c} key={index}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  Logo URL <span className="important">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="enter logo url"
                  onChange={(e) => setLogo(e.target.value)}
                  value={logo}
                />
              </Form.Group>

              <Button variant="success" className="submit" onClick={handleEdit}>
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditOpen(false);
                  setShow(false);
                  setName("");
                  setDescription("");
                  setEmail("");
                  setNumber("");
                  setLogo("");
                  setState("");
                  setCity("");
                }}
              >
                Cancel
              </Button>
            </Form>
          </div>
        </div>
      )}

      <div className="main-wrapper">
        <div className="main-top">
          <button
            className="main-add-new btn btn-primary"
            onClick={() => setOpen(true)}
          >
            Add
          </button>
          <Form className="d-flex searchbox">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleFilter();
              }}
              value={searchInput}
            />
          </Form>
        </div>

        <div className="main-table-wrapper">
          {/* <div className="results">
            Showing {currentPage}-{currentPage + 4} of {filterData.length}
          </div> */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Email</th>
                <th>Number</th>
                <th>Logo</th>
                <th>State</th>
                <th>City</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filterData.map((t) => (
                <tr key={t._id}>
                  <td>{t.name}</td>
                  <td>{t.description}</td>
                  <td>{t.email}</td>
                  <td>{t.number}</td>
                  <td>
                    <img className="logo" src={t.logo} alt="logo" />
                  </td>
                  <td>{t.state}</td>
                  <td>{t.city}</td>
                  <td>
                    <div className="options">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditOpen(true);
                          handleToBeEdited(t);
                          console.log(t);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(t)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* {data.length >= 5 && ( */}
        <div className="pagination d-flex justify-content-center">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {page.map((p) => (
                <li
                  key={p}
                  className="page-item page-link"
                  onClick={() => {
                    handleFilter(p);
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Main;
