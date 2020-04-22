import React from 'react';
import Axios from 'axios';
import { API_URL } from '../support/API_URL';
import { Table, Input, Button } from 'reactstrap';
import Swal from 'sweetalert2';

class Home extends React.Component {
    state = {
        data : [],
        selectedId : null
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData = () => {
        Axios.get(`${API_URL}/pekerjaan`)
        .then((res) => {
            this.setState({
                data : res.data
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }

    deleteData = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
        .then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/pekerjaan/${id}`)
                .then((res) => {
                    this.fetchData();
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    selectEdit = (id) => {
        this.setState({
            selectedId : id
        });
    }

    confirmEdit = (id) => {
        let name = this.editName.value;
        let age = this.editAge.value;
        let job = this.editJob.value;
        Axios.patch(`${API_URL}/pekerjaan/${id}`, { name, age, job })
        .then((res) => {
            this.fetchData();
            this.setState({
                selectedId : null
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }

    addData = () => {
        let name = this.name.value;
        let age = this.age.value;
        let job = this.job.value;
        let biodata = { name, age, job };
        Axios.post(`${API_URL}/pekerjaan`, biodata)
        .then((res) => {
            this.fetchData();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    renderData = () => {
        return this.state.data.map((val) => {
            if (val.id === this.state.selectedId) {
                return(
                    <tr>
                        <td></td>
                        <td>
                            <Input defaultValue={val.name} innerRef={(editName) => this.editName = editName}></Input>
                        </td>
                        <td>
                            <Input defaultValue={val.age} innerRef={(editAge) => this.editAge = editAge}></Input>
                        </td>
                        <td>
                            <Input defaultValue={val.job} innerRef={(editJob) => this.editJob = editJob}></Input>
                        </td>
                        <td>
                            <Button outline color='warning' onClick={() => this.setState({selectedId : null})}>
                                Cancel
                            </Button>
                        </td>
                        <td>
                            <Button outline color='success' onClick={() => this.confirmEdit(val.id)}>
                                Save
                            </Button>
                        </td>
                    </tr>
                )
            }
            return(
                <tr>
                    <td>{val.id}</td>
                    <td>{val.name}</td>
                    <td>{val.age}</td>
                    <td>{val.job}</td>
                    <td>
                        <Button outline color='success' onClick={() => this.selectEdit(val.id)}>
                            Edit
                        </Button>
                    </td>
                    <td>
                        <Button outline color='danger' onClick={() => this.deleteData(val.id)}>
                            Delete
                        </Button>
                    </td>
                </tr>
            )
        })
    }

    render(){
        return(
            <div>
                <h1>SOAL 1</h1>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        <select className='form-control'>
                            <option>jobs</option>
                            <option>{(job) => this.job = job.value}</option>
                        </select>
                    </div>
                </div>
                <Table className='table mb-4'>
                    <thead>
                        <tr>
                            <td>Id</td>
                            <td>Nama</td>
                            <td>Usia</td>
                            <td>Pekerjaan</td>
                            <td colSpan='2'>Act</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderData()}
                    </tbody>
                    <tfoot>
                        <td></td>
                        <td>
                            <Input placeholder='Nama' innerRef={(name) => this.name = name} />
                        </td>
                        <td>
                            <Input placeholder='Usia' innerRef={(age) => this.age = age} />
                        </td>
                        <td>
                            <Input placeholder='Pekerjaan' innerRef={(job) => this.job = job} />
                        </td>
                        <td colSpan='2'>
                            <Button outline color='primary' onClick={this.addData}>
                                Add Data
                            </Button>
                        </td>
                    </tfoot>
                </Table>
            </div>
        )
    }
}

export default Home