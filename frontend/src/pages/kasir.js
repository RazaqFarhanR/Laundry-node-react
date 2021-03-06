import React from "react";
import axios from "axios";
import {Modal, Button, Form} from "react-bootstrap"
import Navbar from "../components/navbar"
import Test from "../components/test"
import Sidebar from "../components/sidebar";

export default class Kasir extends React.Component{
    constructor(){
        super()
        this.state = {
            kasir: [],
            id_user: "",
            nama: "",
            alamat: "",
            gender: "",
            phone: "",
            id_outlet: "",
            username: "",
            password: "",
            isModalOpen: false,
            fillPassword: true,
            fillOutlet: true,
            token: "",
            action: "",
            keyword: ""
        }
        if(localStorage.getItem('token')){
            this.state.token = localStorage.getItem('token')
        }
        else{
            window.location = '/login'
        }
    }
    headerConfig=() =>{
        let header = {
            headers: {Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }
    handleAdd = () =>{
        this.setState({
            nama: "",
            alamat: "",
            gender: "",
            phone: "",
            username: "",
            role: "kasir",
            id_outlet: localStorage.getItem("id_outlet"),
            action: "insert",
            isModalOpen: true,
        })
    }
    handleEdit = (SelectedItem) =>{
        this.setState({
            id_user: SelectedItem.id_user,
            nama: SelectedItem.nama,
            alamat: SelectedItem.alamat,
            gender: SelectedItem.gender,
            phone: SelectedItem.phone,
            username: SelectedItem.username,
            password: SelectedItem.password,
            role: "kasir",
            id_outlet: SelectedItem.id_outlet,
            fillPassword: false,
            fillOutlet: false,
            action: "update",
            isModalOpen: true
        })
    }
    handleClose = () =>{
        this.setState({
            isModalOpen: false
        })
    }
    handleChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSave = (e) =>{
        e.preventDefault()
        let form = {
            id_user: this.state.id_user,
            nama: this.state.nama,
            alamat: this.state.alamat,
            gender: this.state.gender,
            phone: this.state.phone,
            username: this.state.username,
            role: this.state.role,
            id_outlet: this.state.id_outlet
        }
        if (this.state.fillPassword){
            form.password = this.state.password
        }
        let url = ""

        if (this.state.action === "insert"){
            
            url = "http://localhost:1305/api/user"

            axios.post(url, form, this.headerConfig())
            .then(res =>{
                this.getKasir()
                this.handleClose()
                console.log(this.state.id_outlet)
            })
            .catch(err => {
                console.log(err.message)
            })
        }else if (this.state.action === "update"){
            url = "http://localhost:1305/api/user/" + this.state.id_user

            axios.put(url, form, this.headerConfig())
            .then(res =>{
                this.getKasir()
                this.handleClose()
            })
            .catch(err => {
                console.log(err.message)
            })
        }
    }
    handleDelete = (id_user) =>{
        let url = "http://localhost:1305/api/user/" + id_user

        if (window.confirm('Anda yakin ingin menghapus data ini?')){
            axios.delete(url, this.headerConfig())
            .then(res =>{
                console.log(res.data.message)
                this.getKasir()
            })
            .catch(err =>{
                console.log(err.message)
            })
        }
    }
    handleSearch = (e) =>{
        let url = "http://localhost:1305/api/user/cari"
            this.setState({
                [e.target.name]: e.target.value
            })
            // console.log("search")
            let data ={
                keyword: this.state.keyword,
                role: "kasir",
                id_outlet : localStorage.getItem("id_outlet")
            }
            axios.post(url, data, this.headerConfig())
            .then(res =>{
                this.setState({
                    kasir : res.data.user
                })
            })
            .catch(err =>{
                console.log(err.message)
            })
        
    }
    getKasir = () => {
        let url  = "http://localhost:1305/api/user/by"
        let data ={
            role : "kasir",
            id_outlet : localStorage.getItem("id_outlet")
        }
        axios.post(url, data, this.headerConfig())
        .then(res =>{
            this.setState({
                kasir : res.data.user
            })
        })
        .catch(err =>{
            console.log(err.message)
        })
    }
    componentDidMount = () =>{
        this.getKasir()
    }
    render(){
        return(
            <div>
                <Navbar/>
                <div className='container-fluid'>
                    <div className='row'>
                        <Sidebar/>
                        <div className='col-md-9 ms-sm-auto col-lg-10 px-md-4 ' style={{maxHeight: "92vh", overflowY: "auto", overflowX: "hidden"}}>
                            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                                <div className="col-lg-12 col-sm-12 p-2 scroll">
                                    <div className="card rounded-4">
                                        <div className="card-header" style={{backgroundColor: "#a6051a", border: "none"}}>
                                            <h2 className="text-light text-center">Kasir</h2>
                                        </div>
                                        <button className="col-2 btn ms-3 my-2" onClick={() => this.handleAdd()} style={{backgroundColor: "black", color: "rgb(0, 222, 222)"}}>
                                            Tambah Kasir
                                        </button>
                                        <div className="mx-3">
                                        <input type="text" name="keyword" className="form-control mt-3" placeholder="Cari nama "
                                                value={this.state.keyword} onChange={e => this.handleSearch(e)} onKeyUp={e => this.handleSearch(e)}/>
                                        </div>
                                        <br/>
                                        <div class="table-responsive mx-3">
                                        <table className="table table-responsive">
                                            <thead>
                                                <tr>
                                                    <th scope="col" width="3%">#</th>
                                                    <th scope="col" width="15%">Nama</th>
                                                    <th scope="col" width="10%">Alamat</th>
                                                    <th scope="col" width="10%">Jenis Kelamin</th>
                                                    <th scope="col" width="10%">Telp</th>
                                                    {/* <th>Outlet</th> */}
                                                    <th scope="col" width="10%" className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.kasir.map((item, index) =>(
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>{item.nama}</td>
                                                        <td>{item.alamat}</td>
                                                        <td>{item.gender}</td>
                                                        <td>{item.phone}</td>
                                                        {/* <td>{item.outlet.nama_outlet}</td> */}
                                                        <td className="text-center">
                                                            <button className="btn btn-light btn-sm mx-1 text-success" onClick={() => this.handleEdit(item)}>Edit</button> 
                                                            <button className="btn btn-light btn-sm mx-1 text-danger" onClick={() => this.handleDelete(item.id_user)}>Delete</button> 
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>

                                        {/* modal member */}
                                        <Modal show={this.state.isModalOpen} onHide={this.handleClose}
                                        size="xl"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered>
                                        <Modal.Header closeButton className="">
                                            <Modal.Title>form kasir</Modal.Title>
                                        </Modal.Header>
                                        <Form onSubmit={e => this.handleSave(e)}>
                                            <Modal.Body>
                                                <Form.Group className="mb-3" controlId="nama">
                                                    <Form.Label>Nama</Form.Label>
                                                    <Form.Control type="text" name="nama" placeholder="Masukkan Nama" value={this.state.nama}
                                                        onChange={e => this.setState({ nama: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="alamat">
                                                    <Form.Label>Alamat</Form.Label>
                                                    <Form.Control type="text" name="alamat" placeholder="Masukkan alamat" value={this.state.alamat}
                                                        onChange={e => this.setState({ alamat: e.target.value })}
                                                        required
                                                    />                                
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="jenisKelamin">
                                                    <Form.Label>Jenis Kelamin</Form.Label>
                                                        <select name="gender" value={this.state.gender} onChange={this.handleChange} className="form-select form-select-sm" aria-label=".form-select-sm example">
                                                            <option selected>---Masukan Jenis Kelamin---</option>
                                                            <option value={"Laki-laki"} onChange={e => this.handleChange({ gender: e.target.value })}>Laki-laki</option>
                                                            <option value={"Perempuan"} onChange={e => this.handleChange({ gender: e.target.value })}>Perempuan</option>
                                                        </select>
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="telepon">
                                                    <Form.Label>Telepon</Form.Label>
                                                    <Form.Control type="text" name="phone" placeholder="Masukkan Telepon" value={this.state.phone}
                                                        onChange={e => this.setState({ phone: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type="text" name="username" placeholder="Masukkan Username" value={this.state.username}
                                                        onChange={e => this.setState({ username: e.target.value })}
                                                        required
                                                    />
                                                </Form.Group>
                                                {this.state.action === "update" && this.state.fillPassword === false ? (
                                                    <Button className="btn btn-dark mb-1 btn-block text-warning" style={{backgroundColor:"black"}}
                                                        onClick={() => this.setState({ fillPassword: true })}>
                                                        Change Password
                                                    </Button>

                                                ) : (

                                                    <Form.Group className="mb-3" controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="password" name="password" placeholder="Masukkan Password"
                                                            onChange={e => this.setState({ password: e.target.value })}
                                                        />
                                                    </Form.Group>
                                                )}
                                            </Modal.Body>
                                            <Modal.Footer>

                                                <Button className="btn btn-danger mx-1" onClick={this.handleClose}>
                                                    Close
                                                </Button>
                                                <Button className="btn btn-success mx-1" type="submit" onClick={this.handleClose}>
                                                    Save
                                                </Button>

                                            </Modal.Footer>
                                        </Form>
                                    </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}