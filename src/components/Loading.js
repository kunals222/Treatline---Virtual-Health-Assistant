import React from 'react';
import { useSelector } from 'react-redux';
import loadingGif from '../assets/loading.gif';
import '../styles/Loading.css';

const Loading = () => {
    const { loading } = useSelector((state) => state.auth);

    if (!loading) return null;

    return (
        <div className="loading">
            <img src={loadingGif} alt="Loading..." />
            <p>Loading, please wait...</p>
        </div>
    );
};

export default Loading;
