import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import './main-page.scss';
import images from "../../assets/images";
import {useDispatch, useSelector} from "react-redux";
import FacebookLogin from 'react-facebook-login';

function MainPage(props) {
    //const {match} = props;
    // const promotionId = (match.params && match.params.id) || null;
    // const promotionsMap = useSelector(state => state.promotions.promotionsMap || {});
    const dispatch = useDispatch();
    useEffect(() => {
        //promotionId && dispatch(readPromotion(promotionId));
    }, []);

    function facebookLoginCallback(data) {
        console.log(data);
    }

    return (
        <div className="main-container">
            <FacebookLogin
                appId="1913479075393450"
                autoLoad={false}
                disableMobileRedirect={true}
                fields="name,email,picture"
                callback={facebookLoginCallback}
                cssClass="kep-login-facebook"
                icon="fa-facebook"
            />
        </div>
    );
}

MainPage.propTypes = {
    // match: PropTypes.shape({
    //     params: PropTypes.shape({id: PropTypes.string.isRequired})
    // })
};

export default MainPage;
