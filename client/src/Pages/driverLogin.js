import React, { Component } from 'react'
import DriverPage from './driverPage'
import {  CardHeader, CardFooter, CardBody, } from 'reactstrap';
import {Input} from 'baseui/input'
import { Card} from 'baseui/card'
import { Button} from 'baseui/button'
import background from './images/driverbg.gif'
import 'react-notifications-component/dist/theme.css'
import ReactNotification, { store } from 'react-notifications-component';

import axios from 'axios'
export default class Driver extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            pass : '',
            login : false,
        }
    }
    handlename = (e) => {
        this.setState({name : e.target.value})
    }
    
    handlepass = (e) => {
        this.setState({password : e.target.value})
    }
    login = () => {
        axios({
            method : 'post',
            url : 'http://localhost:5000/logindriver',
            data : {
                name : this.state.name,
                pass : this.state.password
            }
        }).then((res) => {
                if(res.status === 200 && res.data.length !== 0){
                    const data = res.data.data[0]
                    this.setState({
                        login : true,
                        data : data
                    })
                }
                console.log(res)
        }).catch(e => {
            store.addNotification({
                title: 'Error',
                message: 'Incorrect credentials',
                type: 'danger',
                // insert: "top",
                container: 'top-center',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                  pauseOnHover: true
                }
              });
            console.log(e)
        })
    }
    render() {
        return (
            <div>
                {
                    !this.state.login ?
                        <div style={{ backgroundImage: `url(${background})`, backgroundPosition: 'center', backgroundSize: '100%', backgroundRepeat: 'no-repeat', width: '100vw', height: '110vh' }}>
                            <ReactNotification></ReactNotification>
                            <div className="text-light" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '15vh', backgroundColor: '  #360851' }}>
                                <h1 className="display-6">
                                    Hello, Driver!
                                </h1>
                            </div>
                            <div className="mt-3">
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ width: '40vw' }}>
                                        <Card>
                                            <CardHeader><h3>Login to continue</h3></CardHeader>
                                            <CardBody>
                                                <h2 className="lead">Enter name:
                                                    <Input onChange={this.handlename}></Input>
                                                </h2>
                                                <h2 className="lead">Enter password:
                                                    <Input type="password" onChange={this.handlepass}></Input><br></br>

                                                </h2>
                                            </CardBody>
                                            <CardFooter></CardFooter>
                                        </Card>
                                    </div>
                                    <Button kind="secondary" className="mt-3 mb-5" onClick={this.login}>Login</Button>
                                </div>
                            </div>
                        </div> : <DriverPage data={this.state.data} />
                }
            </div>
        )
    }
}