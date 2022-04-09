import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {Button} from 'baseui/button'
export default class Landing extends Component {
    constructor(props){
        super(props)
        this.state = {
            type : '',
        }
    }
    handlecust = () => {
        this.setState({type : "customer"})
    }
    
    handledriver = () => {
        this.setState({type : "driver"})
    }
    handleadmin = () => {
        this.setState({type : "admin"})
    }
    render() {
        console.log(this.state)
        if (this.state.type === "customer") {
            return <Redirect to="/customer" push></Redirect>
        }

        else if (this.state.type === "driver") {
            return <Redirect to="/driver" push></Redirect>
        }
        else if (this.state.type === "admin") {
            return <Redirect to="/admin" push></Redirect>
        }
        // {this.state.type === "driver" && <Redirect to="/driver"></Redirect>}
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '20vh', backgroundColor: '#2A547F' }} >
                    <h1 className="display-4 text-light">Welcome To SWAN</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '73vh' }} className="bg-info">
                    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: 'center' }} className="mt-6">
                        <div style={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                            <img alt="landing" src={require("./images/img_1.gif")} height="170px" width="300px" ></img>
                            <img alt="landing" src={require("./images/img_2.gif")} height="170px" width="300px" ></img>
                            <img alt="landing" src={require("./images/img_3.gif")} height="170px" width="300px" ></img>
                            <img alt="landing" src={require("./images/img_4.gif")} height="170px" width="300px" ></img>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column' }} >
                            <Button kind="primary" onClick={this.handlecust} className="lead" margin="20px">Customer</Button>
                            <hr className="my-2" />
                            <Button kind="primary" onClick={this.handledriver} className="lead">Driver</Button>
                            <hr className="my-2" />
                            <Button kind="primary" onClick={this.handleadmin} className="lead">Admin</Button>
                  
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '7vh', backgroundColor: '#2A547F' }} >
                    <p className="display-5 text-light">Contact:- Vishal Anap.(8308327256) and Muddayya Swami.(8180038078)</p>
                </div>
            </div>
            )
    }
}