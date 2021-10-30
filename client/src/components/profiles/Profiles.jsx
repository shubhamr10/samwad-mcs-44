import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile.action';
import ProfileItem from './ProfileItem';

const Profiles = ({ getProfiles, profile: { loading, profiles } }) => {
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);


    return (
        <Fragment>
            {loading ? <Spinner /> :
                <Fragment>
                    <h1 className="large text-primary">Developers</h1>
                    <p className="lead">
                        <i className="fab fa-connectdevelop"></i> Browse and connect with developers
                    </p>
                    <div className="profiles">
                        {
                            profiles.length > 0 ? (profiles.map(prf => (<ProfileItem key={prf._id} profile={prf} />))) : (<h4>No profiles found....</h4>)
                        }
                    </div>
                </Fragment>}
        </Fragment>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles)
