import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect} from 'react-redux';
import PropTypes from 'prop-types'
import { login } from '../../actions/auth.action';

const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email:'',
        password:''
    });
    const {  email, password} = formData;
    const onChange = e => setFormData({...formData, [e.target.name]:e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
    }

    /**
     * @description :if authenticated redirect
     */
    if(isAuthenticated){
        return <Redirect to="/dashboard" />
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign In to your account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="email" value={email} onChange={(e) => onChange(e) } placeholder="Email Address" name="email" required/>
                </div>
                <div className="form-group">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => onChange(e) }
                    placeholder="Password"
                    name="password"
                    minLength="6"
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}


Login.propTypes = {
    login:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default  connect(mapStateToProps, { login })(Login);
